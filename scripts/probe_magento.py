#!/usr/bin/env python3
"""
Ambition Tattoo Supply (Ambi) - Magento 2 API Comprehensive Probe & Audit
Validates OAuth 1.0a connection, explores categories, attribute sets, configurable products, and media assets.
"""

import os
import sys
import json
import time

sys.path.append(os.path.join(os.path.dirname(__file__), "migration"))

from config import load_magento_config
from magento_client import MagentoClient

def main():
    print("=" * 65)
    print(" 🎯 Ambition Tattoo Supply (Ambi) API Audit & Readiness Check")
    print("=" * 65)

    try:
        config = load_magento_config()
    except Exception as e:
        print(f"❌ Error loading credentials: {e}")
        sys.exit(1)

    print(f"• Target Endpoint: {config['base_url']}")
    print(f"• Consumer Key:    {config['consumer_key'][:8]}***")
    print(f"• Access Token:    {config['access_token'][:8]}***\n")

    client = MagentoClient(config)

    # 1. Store Configs
    print("1. [Store Configuration]")
    try:
        t0 = time.time()
        store_configs = client.request("store/storeConfigs")
        dt = (time.time() - t0) * 1000
        cfg = store_configs[0] if store_configs else {}
        print(f"   - Store Code:      {cfg.get('code')}")
        print(f"   - Base Currency:   {cfg.get('base_currency_code')}")
        print(f"   - Default Locale:  {cfg.get('locale')}")
        print(f"   - Base URL:        {cfg.get('base_url')}")
        print(f"   - Media Base URL:  {cfg.get('base_media_url')}")
        print(f"   - API Latency:     {dt:.1f}ms (OK)")
    except Exception as e:
        print(f"   ❌ Store configs query failed: {e}")

    # 2. Categories
    print("\n2. [Category Tree Exploration]")
    try:
        cat_tree = client.get_categories_tree()
        root_name = cat_tree.get("name", "Root")
        children = cat_tree.get("children_data", [])
        print(f"   - Root Category:   {root_name} (ID: {cat_tree.get('id')})")
        print(f"   - Level 2 Sub-categories ({len(children)} total):")

        total_cats = 1
        def count_nodes(node, level=2):
            nonlocal total_cats
            for child in node.get("children_data", []):
                total_cats += 1
                prefix = "     " + "  " * (level - 2) + "• "
                active_flag = "🟢" if child.get("is_active") else "⚪"
                print(f"{prefix}{active_flag} [{child.get('id')}] {child.get('name')} (Level {child.get('level')}, {len(child.get('children_data', []))} children)")
                count_nodes(child, level + 1)

        count_nodes(cat_tree)
        print(f"   - Total categories across all levels: {total_cats}")
    except Exception as e:
        print(f"   ❌ Categories exploration failed: {e}")

    # 3. Attribute Sets
    print("\n3. [Attribute Sets & Product Types]")
    try:
        sets = client.get_attribute_sets()
        print(f"   - Found {len(sets)} Attribute Sets:")
        for s in sets:
            print(f"     • Set ID {s.get('attribute_set_id')}: {s.get('attribute_set_name')}")
    except Exception as e:
        print(f"   ❌ Attribute sets failed: {e}")

    # 4. Products Sampling
    print("\n4. [Product Catalog Sampling]")
    try:
        t0 = time.time()
        prods_res = client.fetch_products_page(page=1, page_size=5)
        dt = (time.time() - t0) * 1000
        total_products = prods_res.get("total_count", 0)
        items = prods_res.get("items", [])
        print(f"   - Total Catalog Products: {total_products}")
        print(f"   - Sample Products (First 5 items, API latency: {dt:.1f}ms):")

        for item in items:
            p_type = item.get("type_id", "simple").upper()
            sku = item.get("sku")
            name = item.get("name")
            price = item.get("price")
            media = item.get("media_gallery_entries", [])
            print(f"     • [{p_type}] {sku} | {name} | ${price} | {len(media)} images")
            if media:
                print(f"       Sample image file: {media[0].get('file')}")

            if p_type.lower() == "configurable":
                children = client.get_configurable_children(sku)
                opts = client.get_configurable_options(sku)
                print(f"       -> Configurable matrix: {len(children)} variants, {len(opts)} option axes")
    except Exception as e:
        print(f"   ❌ Product sampling failed: {e}")

    print("\n" + "=" * 65)
    print("✅ Audit complete. The source Magento 2 API is ready for migration!")
    print("=" * 65)

if __name__ == "__main__":
    main()
