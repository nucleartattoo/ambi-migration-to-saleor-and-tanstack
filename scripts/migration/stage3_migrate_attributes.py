#!/usr/bin/env python3
import os
import sys
import json
import re

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import load_saleor_config
from saleor_client import SaleorClient
from state_manager import StateManager

def slugify(text):
    text = re.sub(r'[^\w\s-]', '', str(text).lower()).strip()
    return re.sub(r'[-\s]+', '-', text)

def migrate_attributes(dry_run=False):
    print("==================================================")
    print(" [Stage 3] Migrating Attributes & Product Types   ")
    print("==================================================")

    attr_file = os.path.join("artifacts", "extracted", "attributes.json")
    if not os.path.exists(attr_file):
        raise FileNotFoundError(f"Attributes file not found at {attr_file}. Run stage1_extract_catalog.py first!")

    with open(attr_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    config = load_saleor_config()
    client = SaleorClient(config, dry_run=dry_run)
    state = StateManager(dry_run=dry_run)

    attribute_sets = data.get("attribute_sets", [])
    attributes = data.get("attributes", [])

    print(f"Loaded {len(attribute_sets)} Attribute Sets and {len(attributes)} Attributes.\n")

    # 1. Core + Extracted Variant Selection Attributes for Tattoo Equipment
    CORE_VARIANT_ATTRS = [
        {"code": "color", "name": "Color", "values": ["Black", "Grey", "Red", "Gold", "Silver", "Purple", "Green", "Blue", "Pink"]},
        {"code": "colors", "name": "Colors", "values": ["Black", "Silver", "Gold", "Red", "Green", "Pink", "Purple", "Grey"]},
        {"code": "machine_size", "name": "Machine Size", "values": ["3.5mm", "4.0mm", "4.2mm", "4.5mm", "5.0mm", "RCA", "DC"]},
        {"code": "style", "name": "Style", "values": ["Standard", "Pro", "Kit", "Single Battery", "Dual Battery"]},
        {"code": "bearing_size", "name": "Bearing Size", "values": ["3.0mm", "3.5mm", "4.0mm", "4.2mm", "4.5mm"]},
        {"code": "type", "name": "Type", "values": ["RCA", "DC", "Wireless", "Standard"]},
        {"code": "size", "name": "Size", "values": ["S", "M", "L", "XL", "Standard"]},
        {"code": "cartridge_needle_size", "name": "Cartridge Needle Size", "values": ["0801RL", "1003RL", "1205RL", "1207RL", "1209RL", "1207M1", "1209M1", "1207RM", "1209RM"]},
        {"code": "needle_type", "name": "Needle Type", "values": ["RL", "RS", "M1", "RM"]},
        {"code": "grip_size", "name": "Grip Size", "values": ["25mm", "28mm", "30mm", "32mm", "34mm", "38mm"]},
        {"code": "clip_cord_type", "name": "Clip Cord Type", "values": ["RCA", "DC", "Hook"]},
        {"code": "power_supply_type", "name": "Power Supply Type", "values": ["US Plug", "EU Plug", "UK Plug", "AU Plug", "Wireless"]},
        {"code": "cable_model", "name": "Cable Model", "values": ["RCA Cord", "DC Cord", "USB-C Cable"]},
        {"code": "stroke", "name": "Stroke Length", "values": ["2.2mm", "2.5mm", "3.0mm", "3.5mm", "4.0mm", "4.2mm", "4.5mm", "5.0mm"]},
        {"code": "needle_size", "name": "Needle Size", "values": ["0801RL", "1003RL", "1205RS", "1207M1", "1209RM", "1211RM", "1215M1"]},
        {"code": "grip_diameter", "name": "Grip Diameter", "values": ["25mm", "28mm", "30mm", "32mm", "34mm", "38mm"]},
        {"code": "connector_type", "name": "Connector Type", "values": ["RCA", "DC", "Wireless Battery", "Dual-Port"]},
        {"code": "battery_capacity", "name": "Battery Capacity", "values": ["1800mAh", "2000mAh", "2400mAh", "Dual Battery"]},
    ]

    # Enrich option values from extracted Magento attributes.json when available
    extracted_by_code = {a.get("attribute_code"): a for a in attributes if a.get("attribute_code")}
    for item in CORE_VARIANT_ATTRS:
        ext = extracted_by_code.get(item["code"])
        if ext:
            labels = [
                str(opt.get("label")).strip()
                for opt in ext.get("options", [])
                if opt.get("value") and str(opt.get("label", "")).strip()
            ]
            if labels:
                # Keep up to 50 distinct non-empty labels so AttributeCreateInput stays compact
                seen = []
                for lbl in labels:
                    if lbl not in seen:
                        seen.append(lbl)
                item["values"] = seen[:50]

    migrated_attr_ids = []

    print("[1/2] Creating Variant Selection Attributes in Saleor...")
    for attr in CORE_VARIANT_ATTRS:
        code = attr["code"]
        existing = state.get_attribute(code)
        if existing:
            print(f"  [Skipped] Attribute {attr['name']} ({code}) already created -> {existing}")
            migrated_attr_ids.append(existing)
            continue

        print(f"  Creating Attribute: {attr['name']} ({code})...", end="")
        try:
            s_attr = client.create_attribute(
                name=attr["name"],
                slug=f"ambi-{slugify(code)}",
                values=attr["values"]
            )
            s_id = s_attr.get("id") if s_attr else f"mock-attr-{code}"
            state.set_attribute(code, s_id)
            migrated_attr_ids.append(s_id)
            print(f" ✅ Success -> {s_id}")
        except Exception as e:
            print(f" ❌ Error: {e}")

    # 2. Product Types (from 8 Attribute Sets)
    print("\n[2/2] Creating Product Types from Attribute Sets...")
    for s in attribute_sets:
        set_id = s.get("attribute_set_id")
        set_name = s.get("attribute_set_name")
        slug = f"ambi-pt-{slugify(set_name)}-{set_id}"

        existing_pt = state.get_product_type(set_id)
        if existing_pt:
            print(f"  [Skipped] ProductType {set_name} (Set {set_id}) already created -> {existing_pt}")
            continue

        print(f"  Creating ProductType: {set_name} (Set {set_id})...", end="")
        try:
            s_pt = client.create_product_type(
                name=f"Ambi {set_name}",
                slug=slug,
                has_variants=True,
                variant_attributes=migrated_attr_ids
            )
            pt_id = s_pt.get("id") if s_pt else f"mock-pt-{set_id}"
            state.set_product_type(set_id, pt_id)
            print(f" ✅ Success -> {pt_id}")
        except Exception as e:
            print(f" ❌ Error: {e}")

    print("\nAttributes & Product Types Migration Finished.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    migrate_attributes(dry_run=args.dry_run)
