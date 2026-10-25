#!/usr/bin/env python3
import os
import sys
import json
import re
import time

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import load_saleor_config
from saleor_client import SaleorClient
from state_manager import StateManager

def slugify(text):
    text = str(text).lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


FALLBACK_ATTR_CODE_MAP = {
    "colors": "color",
    "machine_size": "stroke",
    "bearing_size": "stroke",
    "cartridge_needle_size": "needle_size",
    "needle_type": "needle_size",
    "grip_size": "grip_diameter",
    "clip_cord_type": "connector_type",
    "cable_model": "connector_type",
    "power_supply_type": "battery_capacity",
}


def migrate_products(limit=None, dry_run=False):
    print("==================================================")
    print(" [Stage 4] Migrating Products & Variants to Saleor")
    print("==================================================")

    prod_file = os.path.join("artifacts", "extracted", "products.json")
    attr_file = os.path.join("artifacts", "extracted", "attributes.json")
    if not os.path.exists(prod_file):
        raise FileNotFoundError(f"Products file not found at {prod_file}. Run stage1_extract_catalog.py first!")

    with open(prod_file, "r", encoding="utf-8") as f:
        all_products = json.load(f)

    attr_opts = {}
    attr_codes = {}
    if os.path.exists(attr_file):
        with open(attr_file, "r", encoding="utf-8") as f:
            attrs_raw = json.load(f)
        for a in attrs_raw.get("attributes", []):
            aid = str(a.get("attribute_id"))
            acode = a.get("attribute_code")
            if aid and acode:
                attr_codes[aid] = acode
            for opt in a.get("options", []):
                if opt.get("value"):
                    attr_opts[(aid, str(opt.get("value")))] = str(opt.get("label")).strip()

    # Pre-calculate canonical storefront slugs across all products so they match catalog.json 100%
    slug_seen = {}
    canonical_slugs = {}
    for p in all_products:
        pid = p.get("id")
        p_sku = p.get("sku", "")
        p_name = p.get("name", "")
        c_attrs = {
            a.get("attribute_code"): a.get("value")
            for a in p.get("custom_attributes", [])
            if "attribute_code" in a
        }
        url_key = c_attrs.get("url_key")
        if not url_key:
            url_key = slugify(p_name) or slugify(p_sku)
        if url_key in slug_seen:
            slug_seen[url_key] += 1
            final_slug = f"{url_key}-{p_sku.lower()}"
        else:
            slug_seen[url_key] = 1
            final_slug = url_key
        canonical_slugs[pid] = final_slug[:200]

    config = load_saleor_config()
    client = SaleorClient(config, dry_run=dry_run)
    state = StateManager(dry_run=dry_run)

    total_available = len(all_products)
    products = all_products[:limit] if limit else all_products
    print(f"Processing {len(products)} products (out of {total_available} total, limit={limit})...\n")

    # Resolve global Channel ID
    channel_id = "Q2hhbm5lbDox"
    if not dry_run:
        try:
            ch_res = client.execute('query { channel(slug: "%s") { id } }' % config["channel"])
            channel_id = ch_res.get("data", {}).get("channel", {}).get("id") or channel_id
        except Exception as e:
            print(f"Notice resolving channel id: {e}")
    print(f"Target Channel ID: {channel_id}")

    # Map of child simple product IDs that belong to configurable products
    child_product_ids = set()
    for p in all_products:
        if p.get("type_id") == "configurable":
            for child in p.get("_configurable_children", []):
                child_product_ids.add(child.get("id"))

    print(f"Detected {len(child_product_ids)} child simple products belonging to configurables (will be migrated as variants).\n")

    def resolve_saleor_attr_id(attr_code):
        if not attr_code:
            return None
        s_attr = state.get_attribute(attr_code)
        if s_attr:
            return s_attr
        fallback_code = FALLBACK_ATTR_CODE_MAP.get(attr_code)
        if fallback_code:
            return state.get_attribute(fallback_code)
        return state.get_attribute("color")

    success_count = 0
    skipped_count = 0

    for idx, p in enumerate(products, 1):
        p_id = p.get("id")
        sku = p.get("sku")
        name = p.get("name", "").strip()
        type_id = p.get("type_id", "simple")
        attr_set_id = p.get("attribute_set_id")
        price = float(p.get("price") or 0.0)

        # Skip child products being processed as standalone
        if type_id == "simple" and p_id in child_product_ids:
            continue

        # Check if already migrated
        existing_s_id = state.get_product(p_id)
        if existing_s_id:
            skipped_count += 1
            continue

        # Determine Category
        category_ids = []
        for attr in p.get("custom_attributes", []):
            if attr.get("attribute_code") == "category_ids":
                category_ids = attr.get("value", [])
                break

        saleor_cat_id = None
        for cat_id in category_ids:
            s_cat = state.get_category(cat_id)
            if s_cat:
                saleor_cat_id = s_cat
                break

        # Determine ProductType
        saleor_pt_id = state.get_product_type(attr_set_id)
        if not saleor_pt_id:
            saleor_pt_id = list(state.state["product_types"].values())[0] if state.state["product_types"] else "mock-pt-default"

        # Description
        description = ""
        for attr in p.get("custom_attributes", []):
            if attr.get("attribute_code") in ("description", "short_description"):
                description = attr.get("value", "")
                if description:
                    break

        slug = canonical_slugs.get(p_id) or f"ambi-{slugify(name)}-{p_id}"[:200]

        print(f"[{idx}/{len(products)}] Migrating [{type_id.upper()}] SKU: {sku} (slug: {slug})...", end="")

        try:
            # 1. Create Product
            s_prod = client.create_product(
                name=name,
                slug=slug,
                product_type_id=saleor_pt_id,
                category_id=saleor_cat_id,
                description=description
            )
            s_prod_id = s_prod.get("id") if s_prod else f"mock-prod-{p_id}"
            state.set_product(p_id, s_prod_id)

            # 2. Publish to Channel
            client.update_product_channel_listing(s_prod_id, channel_id, is_published=True)

            # 3. Handle Variants
            warehouse_id = config.get("warehouse_id")
            children = p.get("_configurable_children", []) if type_id == "configurable" else []
            if type_id == "configurable" and children:
                conf_options = p.get("extension_attributes", {}).get("configurable_product_options", [])
                variants_input = []
                for child in children:
                    c_sku = child.get("sku")
                    c_name = child.get("name", c_sku)
                    c_price = float(child.get("price") or price)
                    child_custom_attrs = {
                        a.get("attribute_code"): a.get("value")
                        for a in child.get("custom_attributes", [])
                        if "attribute_code" in a
                    }

                    variant_attrs = []
                    used_saleor_attr_ids = set()
                    for opt in conf_options:
                        aid = str(opt.get("attribute_id"))
                        acode = attr_codes.get(aid)
                        s_attr_id = resolve_saleor_attr_id(acode)
                        raw_val = child_custom_attrs.get(acode) if acode else None
                        if s_attr_id and raw_val is not None and s_attr_id not in used_saleor_attr_ids:
                            opt_label = attr_opts.get((aid, str(raw_val)), str(raw_val))
                            if opt_label:
                                variant_attrs.append({
                                    "id": s_attr_id,
                                    "values": [opt_label]
                                })
                                used_saleor_attr_ids.add(s_attr_id)

                    v_item = {
                        "sku": c_sku,
                        "name": c_name,
                        "attributes": variant_attrs,
                        "channelListings": [{
                            "channelId": channel_id,
                            "price": c_price
                        }]
                    }
                    if warehouse_id and not warehouse_id.startswith("mock-"):
                        v_item["stocks"] = [{
                            "warehouse": warehouse_id,
                            "quantity": 100
                        }]
                    variants_input.append(v_item)
                if variants_input:
                    created_variants = client.create_variant_bulk(s_prod_id, variants_input)
                    created_by_sku = {
                        v.get("sku"): v.get("id")
                        for v in (created_variants or [])
                        if v.get("sku") and v.get("id")
                    }
                    for v_item in variants_input:
                        v_sku = v_item["sku"]
                        v_id = created_by_sku.get(v_sku) or f"mock-var-{v_sku}"
                        state.set_variant(v_sku, v_id)
            else:
                simple_v = {
                    "sku": sku,
                    "name": name,
                    "attributes": [],
                    "channelListings": [{
                        "channelId": channel_id,
                        "price": price
                    }]
                }
                if warehouse_id and not warehouse_id.startswith("mock-"):
                    simple_v["stocks"] = [{
                        "warehouse": warehouse_id,
                        "quantity": 100
                    }]
                created_variants = client.create_variant_bulk(s_prod_id, [simple_v])
                v_id = (
                    created_variants[0].get("id")
                    if created_variants and created_variants[0].get("id")
                    else f"mock-var-{sku}"
                )
                state.set_variant(sku, v_id)

            # 4. Handle Media Images (Ambi Media CDN)
            media_entries = p.get("media_gallery_entries", [])
            for m in media_entries[:3]:
                img_file = m.get("file", "")
                if img_file:
                    media_url = f"https://www.ambitiontattoosupply.com/media/catalog/product{img_file}"
                    client.create_product_media(s_prod_id, media_url, alt=name)

            print(f" ✅ Success -> {s_prod_id}")
            success_count += 1
        except Exception as e:
            print(f" ❌ Error: {e}")

    print(f"\nProduct Migration Finished: {success_count} migrated, {skipped_count} skipped.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    migrate_products(limit=args.limit, dry_run=args.dry_run)
