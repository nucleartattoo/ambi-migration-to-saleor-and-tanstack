#!/usr/bin/env python3
import json
import os
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

def generate_catalog():
    print("Generating storefront catalog from extracted Magento data...")

    categories_file = "artifacts/extracted/categories.json"
    products_file = "artifacts/extracted/products.json"
    attributes_file = "artifacts/extracted/attributes.json"

    if not os.path.exists(categories_file) or not os.path.exists(products_file) or not os.path.exists(attributes_file):
        print("❌ Error: Missing extracted files in artifacts/extracted/. Run extraction first!")
        return

    with open(categories_file, "r", encoding="utf-8") as f:
        cat_tree = json.load(f)

    with open(products_file, "r", encoding="utf-8") as f:
        products_raw = json.load(f)

    with open(attributes_file, "r", encoding="utf-8") as f:
        attrs_raw = json.load(f)

    # 1. Attribute options dictionary: (attribute_id, value_index) -> label
    attr_opts = {}
    for a in attrs_raw.get("attributes", []):
        aid = str(a.get("attribute_id"))
        for opt in a.get("options", []):
            if opt.get("value"):
                attr_opts[(aid, str(opt.get("value")))] = opt.get("label")

    # 2. Process Categories
    TOP_CATEGORY_SLUG_MAP = {
        "51": "tattoo-machines",
        "118": "tattoo-needles",
        "55": "tattoo-power-supplies",
        "142": "tattoo-kits",
        "54": "tattoo-grips",
        "56": "needles",
        "57": "cartridges",
        "58": "tattoo-accessories"
    }

    categories = {}
    cat_descendants = {}

    def walk_categories(node, parent_id=None):
        cid = str(node.get("id"))
        name = node.get("name")
        slug = TOP_CATEGORY_SLUG_MAP.get(cid) or slugify(name)

        children_data = node.get("children_data", [])
        child_ids = [str(c.get("id")) for c in children_data]

        categories[cid] = {
            "id": cid,
            "name": name,
            "slug": slug,
            "parent_id": str(parent_id) if parent_id else None,
            "product_count": node.get("product_count", 0),
            "is_active": node.get("is_active", True),
            "children_ids": child_ids
        }

        desc = {cid}
        for child in children_data:
            child_desc = walk_categories(child, parent_id=cid)
            desc.update(child_desc)

        cat_descendants[cid] = desc
        return desc

    walk_categories(cat_tree)

    # Clean slugs collision for categories
    slug_to_cat = {}
    for cid, cat in categories.items():
        if cat["id"] in ("1", "2"):
            continue
        s = cat["slug"]
        if s in slug_to_cat and slug_to_cat[s]["id"] != cid:
            cat["slug"] = f"{s}-{cid}"
        slug_to_cat[cat["slug"]] = cat

    # 3. Process Products
    IMAGE_BASE = "https://www.ambitiontattoosupply.com/media/catalog/product"
    products = []
    slug_seen = {}

    for p in products_raw:
        pid = str(p.get("id"))
        sku = p.get("sku", "")
        name = p.get("name", "")
        type_id = p.get("type_id", "simple")
        visibility = p.get("visibility", 4)

        attrs = {a.get("attribute_code"): a.get("value") for a in p.get("custom_attributes", []) if "attribute_code" in a}

        url_key = attrs.get("url_key")
        if not url_key:
            url_key = slugify(name) or slugify(sku)

        if url_key in slug_seen:
            slug_seen[url_key] += 1
            final_slug = f"{url_key}-{sku.lower()}"
        else:
            slug_seen[url_key] = 1
            final_slug = url_key

        price = float(p.get("price") or 0.0)
        special_price = float(attrs.get("special_price") or 0.0)

        raw_img = attrs.get("image") or attrs.get("small_image") or attrs.get("thumbnail")
        main_img = f"{IMAGE_BASE}{raw_img}" if raw_img and raw_img != "no_selection" else ""

        gallery = []
        for entry in p.get("media_gallery_entries", []):
            fpath = entry.get("file")
            if fpath and fpath != "no_selection":
                gallery.append(f"{IMAGE_BASE}{fpath}")

        if not gallery and main_img:
            gallery = [main_img]
        if not main_img and gallery:
            main_img = gallery[0]

        raw_cids = attrs.get("category_ids") or []
        cat_ids = [str(c) for c in raw_cids if str(c) in categories]

        conf_options = []
        for opt in p.get("_configurable_options", []):
            aid = str(opt.get("attribute_id"))
            label = opt.get("label") or "Option"
            values = []
            for v in opt.get("values", []):
                v_idx = str(v.get("value_index"))
                val_label = attr_opts.get((aid, v_idx)) or v_idx
                values.append({
                    "index": v_idx,
                    "label": val_label
                })
            conf_options.append({
                "id": str(opt.get("id")),
                "code": opt.get("attribute_code") or f"attr_{aid}",
                "label": label,
                "values": values
            })

        conf_children = []
        for child in p.get("_configurable_children", []):
            c_attrs = {a.get("attribute_code"): a.get("value") for a in child.get("custom_attributes", []) if "attribute_code" in a}
            c_img = c_attrs.get("image")
            conf_children.append({
                "id": str(child.get("id")),
                "sku": child.get("sku"),
                "name": child.get("name"),
                "price": float(child.get("price") or price),
                "image": f"{IMAGE_BASE}{c_img}" if c_img and c_img != "no_selection" else main_img,
                "attributes": {
                    opt["code"]: c_attrs.get(opt["code"]) for opt in conf_options if opt["code"] in c_attrs
                }
            })

        products.append({
            "id": pid,
            "sku": sku,
            "name": name,
            "slug": final_slug,
            "type_id": type_id,
            "price": price,
            "special_price": special_price if special_price > 0 else None,
            "image": main_img,
            "gallery": gallery,
            "category_ids": cat_ids,
            "description": attrs.get("description", ""),
            "short_description": attrs.get("short_description", ""),
            "is_visible_individually": visibility != 1,
            "options": conf_options,
            "variants": conf_children
        })

    out = {
        "categories": {cid: c for cid, c in categories.items() if cid not in ("1", "2")},
        "category_descendants": {cid: list(desc) for cid, desc in cat_descendants.items() if cid not in ("1", "2")},
        "products": products
    }

    os.makedirs("src/data", exist_ok=True)
    with open("src/data/catalog.json", "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    print(f"✅ Generated catalog.json with {len(out['categories'])} categories and {len(products)} products.")

if __name__ == "__main__":
    generate_catalog()
