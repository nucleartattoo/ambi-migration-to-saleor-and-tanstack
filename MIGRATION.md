# Ambition Tattoo Supply (Ambi) 到 Saleor 迁移工程与容器部署规划指南

本工程包含完整的 ETL 自动化迁移流水线，将原 Magento 2 电商站点（`https://www.ambitiontattoosupply.com`）全量迁移至 Saleor Headless 电商后台，并配套 TanStack Start 全栈前台与 Apple Container 容器化部署方案。

---

## 一、项目架构与环境全景

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Ambition Tattoo Supply (Source API)                  │
│   • 基础端点: https://www.ambitiontattoosupply.com/rest/V1/            │
│   • 认证协议: OAuth 1.0a (HMAC-SHA256)                                 │
│   • 数据规模: 80 个类目节点, 8 大属性集, 747 件商品及变体矩阵           │
│   • 凭证路径: ~/.ssh/.env.ambi                                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                        [ETL Migration Pipeline]
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Apple Container 基础设施 (Samsung 980 Pro 外置盘)         │
│   • 容器存储根路径: /Volumes/samsung2tb980pro/DeveloperData/apple-container│
│   • 容器管理 CLI:   /opt/homebrew/bin/container                        │
│   • 基础服务编排:                                                      │
│     - PostgreSQL 16 (端口 5434:5432)                                   │
│     - Redis 7 (端口 6381:6379)                                         │
│     - Saleor Dashboard (端口 9002:80 或 9003:80)                       │
│     - Saleor Core API (端口 8003 或 8004)                              │
│     - Ambi Storefront (端口 3003:3003, TanStack Start SSR)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             TanStack Start 全栈现代化前台 (Storefront)                 │
│   • 技术栈: React 19 + TanStack Router + TanStack Query + Tailwind CSS │
│   • 模式: 服务端渲染 (SSR) + 渐进式注水 + GraphQL Tada 强类型查询      │
│   • 生产部署: Containerfile 多阶段构建极简 Node.js 22 alpine 镜像      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 二、数据迁移流水线阶段设计

```
┌────────────────────────────────────────────────────────┐
│             Stage 0: Init Saleor Environment           │
│   • 确保默认销售渠道 (Channel: default-channel, USD)   │
│   • 创建/验证主发货仓库 (Warehouse: ambi-main-warehouse)│
│   • 配置发货区域与运输方式 (Fulfillment Triangle 闭环) │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             Stage 1: Extract Catalog                   │
│   • 导出 Categories 分类树 (80 个节点)                 │
│   • 导出 Attribute Sets (8套) 与属性字典               │
│   • 导出 747 件全量商品及其 Configurable 变体子品与媒体│
│   => 落地缓存至 artifacts/extracted/*.json             │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             Stage 2: Migrate Categories                │
│   • 按 Level 拓扑排序 (Parent 优先创建)               │
│   • 递归建立 Saleor Category 树                        │
│   • 记录 magento_category_id <-> saleor_category_id    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             Stage 3: Migrate Attributes & Types        │
│   • 创建 纹身专用变体属性 (Color, Stroke, Needle Size) │
│   • 8 套 Attribute Sets 转为 Saleor ProductTypes       │
│   • 绑定变体决定属性 (hasVariants = True)              │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             Stage 4: Migrate Products & Variants       │
│   • Configurable: 主商品 -> Saleor Product             │
│     关联子单品 -> ProductVariants (多规格变体矩阵)     │
│   • Simple: 独立单品 -> Product + 单一 Variant         │
│   • 挂载 Ambi CDN 媒体图片、渠道定价与仓库初始库存     │
└────────────────────────────────────────────────────────┘
```

---

## 三、状态管理与断点续传机制 (`artifacts/migration_state.json`)

迁移脚本内置 `StateManager`，对以下映射关系进行持久化：
- `categories`: `{ magento_id: saleor_category_id }`
- `product_types`: `{ magento_set_id: saleor_product_type_id }`
- `attributes`: `{ attr_code: saleor_attribute_id }`
- `products`: `{ magento_product_id: saleor_product_id }`
- `variants`: `{ magento_variant_id: saleor_variant_id }`

**优势**：
- **幂等性**：重复执行脚本时，已迁移的类目与商品自动跳过，无需担心数据重复。
- **容错恢复**：若遭遇网络抖动或 API 限流，直接重新执行即可从断点无缝继续。

---

## 四、Apple Container 本地外置磁盘编排

Apple Container 存储已通过 APFS 稀疏文件与符号链接无缝指向高速 NVMe 外置盘：
`/Volumes/samsung2tb980pro/DeveloperData/apple-container`

管理命令：
```bash
# 1. 检查 Apple Container 运行状态
./manage-containers.sh status

# 2. 构建前台容器镜像
./manage-containers.sh build

# 3. 启动/停止容器
./manage-containers.sh start
./manage-containers.sh stop
```

---

## 五、CLI 执行命令参考

```bash
# 1. 源站体检与连通性全面探测 (只读)
python3 scripts/probe_magento.py

# 2. 抽取源站数据并缓存至本地 artifacts/extracted/
python3 scripts/migration/run_migration.py --extract

# 3. 模拟运行 (Dry-Run: 打印 GraphQL 变更，不实际写入 Saleor)
python3 scripts/migration/run_migration.py --all --dry-run

# 4. 分阶段执行写入
python3 scripts/migration/run_migration.py --init-env
python3 scripts/migration/run_migration.py --migrate-categories
python3 scripts/migration/run_migration.py --migrate-attributes
python3 scripts/migration/run_migration.py --migrate-products --limit 10

# 5. 一键全量流水线执行
python3 scripts/migration/run_migration.py --all
```
