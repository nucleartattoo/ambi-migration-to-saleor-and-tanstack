#!/usr/bin/env python3
import sys
import os
import argparse

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from stage0_init_saleor_environment import init_saleor_environment
from stage1_extract_catalog import extract_catalog
from stage2_migrate_categories import migrate_categories
from stage3_migrate_attributes import migrate_attributes
from stage4_migrate_products import migrate_products

def main():
    parser = argparse.ArgumentParser(description="Ambition Tattoo Supply (Ambi) to Saleor Migration Pipeline")
    parser.add_argument("--init-env", action="store_true", help="Stage 0: Initialize Greenfield Saleor setup (Channels, Warehouses, Zones)")
    parser.add_argument("--extract", action="store_true", help="Stage 1: Extract all Magento 2 Catalog data to artifacts/extracted/")
    parser.add_argument("--migrate-categories", action="store_true", help="Stage 2: Migrate categories tree")
    parser.add_argument("--migrate-attributes", action="store_true", help="Stage 3: Migrate attributes & product types")
    parser.add_argument("--migrate-products", action="store_true", help="Stage 4: Migrate products and variants")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of products to migrate (useful for testing)")
    parser.add_argument("--dry-run", action="store_true", help="Run in mock/dry-run mode without mutating target Saleor instance")
    parser.add_argument("--all", action="store_true", help="Run full pipeline end-to-end (Stages 0 to 4)")

    args = parser.parse_args()

    if not any([args.init_env, args.extract, args.migrate_categories, args.migrate_attributes, args.migrate_products, args.all]):
        parser.print_help()
        sys.exit(1)

    print("==================================================================")
    print(" 🚀 Ambi (Magento 2) -> Saleor Headless Migration Pipeline Starting")
    print(f" Mode: {'MOCK / DRY-RUN (Safe Read-Only)' if args.dry_run else 'LIVE MUTATION (Production)'}")
    print("==================================================================\n")

    if args.init_env or args.all:
        init_saleor_environment(dry_run=args.dry_run)

    if args.extract or args.all:
        extract_catalog()

    if args.migrate_categories or args.all:
        migrate_categories(dry_run=args.dry_run)

    if args.migrate_attributes or args.all:
        migrate_attributes(dry_run=args.dry_run)

    if args.migrate_products or args.all:
        migrate_products(limit=args.limit, dry_run=args.dry_run)

    print("\n==================================================================")
    print("🎉 Requested Pipeline Stages Finished Successfully!")
    print("==================================================================")

if __name__ == "__main__":
    main()
