---
title: "数据库基础入门指南 Part 3"
category: 计算机学习与实验
tags:
  - "数据库"
slug: my_sql_part3
translationKey: "my_sql_part3"
series: mysql-study-note
seriesOrder: 3
published: 2025-11-19
---

## 前提环境准备说明

本文所有题目基于以下两张核心表（就是我在 [Part 2](/posts/my_sql_part2/) 里须要copy的那张表）

## 表格内容回顾

- `product_series`（产品系列表）：存储产品分类（如 iPhone Standard、iPad Pro），核心字段`series_id`（主键）、`series_name`（系列名称）、`product_type`（产品类型：iPhone/iPad）
- `products`（产品详情表）：存储具体型号参数，核心字段`product_id`（主键）、`model_name`（型号名称）、`release_year`（发布年份）、`series_id`（外键，关联系列表）、`screen_size_inch`（屏幕尺寸）等
- 模拟扩展表`sales`（产品销量表）：用于多表关联练习，字段含`sale_id`（主键）、`product_id`（关联产品表）、`sale_num`（销量）、`sale_year`（销售年份）

### 题目 1：使用 USING 语法查询产品型号 + 系列信息

## 题目要求：

用 USING 语法查询所有产品的型号名称（中文别名 “产品型号”）、系列名称（中文别名 “所属系列”）、产品类型（中文别名 “产品类型”）

### **思路参考：**

```sql
--语法格式
SELECT 
  表1别名.字段1 AS 中文别名1,
  表2别名.字段2 AS 中文别名2,
  表2别名.字段3 AS 中文别名3
FROM 表1 表1别名
INNER JOIN 表2 表2别名
USING(关联字段);  -- 仅当两张表的关联字段名称完全一致时可用USING
```

### **答案如下：**

```sql
SELECT 
  p.model_name AS 产品型号,
  ps.series_name AS 所属系列,
  ps.product_type AS 产品类型
FROM products p
INNER JOIN product_series ps
USING(series_id);  -- USING语法：关联字段在两张表中名称相同（均为series_id），可简化写法
```

## 含义解释

- `USING(series_id)`是内连接的简化写法，当两张表的关联字段名称完全相同时（此处均为`series_id`），可替代`ON p.series_id = ps.series_id`，让代码更简洁
- 例如查询结果会同时显示 “iPhone 15” 对应的 “Standard” 系列和 “iPhone” 类型，“iPad Pro M5” 对应的 “Pro” 系列和 “iPad” 类型
- 作用：在关联字段同名时简化连接条件，同时保留内连接 “只匹配关联字段相等的数据” 的核心逻辑

## 核心知识点

1. USING 语法的适用场景（关联字段名称相同）
2. 表别名与字段别名的使用（简化代码 + 优化结果可读性）

### 题目 2：查询屏幕尺寸≥10 英寸的 iPad Pro 产品

## 题目要求

查询屏幕尺寸≥10 英寸的 iPad Pro 系列产品，显示型号名称（“产品型号”）、屏幕尺寸（“屏幕尺寸 (英寸)”）、存储选项（“存储版本”），按屏幕尺寸升序排序

### **思路参考：**

```sql
--语法格式如下
SELECT 
  表1别名.字段1 AS 中文别名1,
  表1别名.字段2 AS 中文别名2,
  表1别名.字段3 AS 中文别名3
FROM 表1 表1别名
INNER JOIN 表2 表2别名
ON 表1别名.关联字段 = 表2别名.关联字段
WHERE 表2别名.筛选字段1 = '条件值1'
AND 表2别名.筛选字段2 = '条件值2'
AND 表1别名.筛选字段3 >= 数值条件
ORDER BY 表1别名.排序字段 ASC;
```

### **答案如下：**

```sql
SELECT 
  p.model_name AS 产品型号,
  p.screen_size_inch AS 屏幕尺寸(英寸),
  p.storage_options AS 存储版本
FROM products p
INNER JOIN product_series ps
ON p.series_id = ps.series_id
WHERE ps.product_type = 'iPad'  -- 筛选“iPad”类型
AND ps.series_name = 'Pro'    -- 筛选“Pro”系列
AND p.screen_size_inch >= 10  -- 筛选屏幕尺寸≥10英寸
ORDER BY p.screen_size_inch ASC;  -- 按屏幕尺寸升序（ASC可省略，默认升序）
```

## 含义解释

- 先通过`ON p.series_id = ps.series_id`关联两张表，确保每个产品都能匹配到对应的系列信息
- 再通过`WHERE`子句的三个条件精准筛选：只保留 “iPad 类型”“Pro 系列” 且 “屏幕≥10 英寸” 的数据，例如 “iPad Pro 11-inch (2018)”“iPad Pro 12.9-inch (3rd gen, 2018)” 等型号
- 最后用`ORDER BY p.screen_size_inch ASC`按屏幕尺寸从小到大排序，方便对比不同型号的屏幕差异
- 作用：实现 “多条件精准筛选 + 有序展示”，满足 “找特定规格产品” 的业务需求

## 核心知识点

1. 多条件筛选（AND 连接多个过滤条件）
2. 数值比较条件（≥等运算符的使用）
3. 排序方向（ASC 升序的应用）

### 题目 3：查询 2020 年后发布的产品（含型号、系列、初始系统、类型）

## 题目要求

查询 2020 年及以后发布的所有产品，显示型号名称（“产品型号”）、系列名称（“所属系列”）、初始系统（“初始操作系统”）、产品类型（“产品类型”），按发布年份降序排列

**思路参考：**

```sql
--语法格式如下
SELECT 
  表1别名.字段1 AS 中文别名1,
  表2别名.字段2 AS 中文别名2,
  表1别名.字段3 AS 中文别名3,
  表2别名.字段4 AS 中文别名4
FROM 表1 表1别名
INNER JOIN 表2 表2别名
ON 表1别名.关联字段 = 表2别名.关联字段
WHERE 表1别名.时间字段 >= 年份条件
ORDER BY 表1别名.时间字段 DESC;
```

### **答案如下：**

```sql
SELECT 
  p.model_name AS 产品型号,
  ps.series_name AS 所属系列,
  p.initial_os AS 初始操作系统,
  ps.product_type AS 产品类型
FROM products p
INNER JOIN product_series ps
ON p.series_id = ps.series_id
WHERE p.release_year >= 2020  -- 筛选2020年后发布的产品
ORDER BY p.release_year DESC;  -- 按发布年份倒序（最新产品在前）
```

## 含义解释

- 关联表后，通过`WHERE p.release_year >= 2020`筛选出 2020 年及之后发布的产品，例如 “iPhone 12”“iPad Air 4” 等
- 查询结果包含型号、系列、初始系统和产品类型，相当于 “一站式获取产品的基础信息 + 分类信息”
- `ORDER BY p.release_year DESC`让最新发布的产品（如 2025 年的 “iPhone 17”）排在最前面，符合 “关注新品” 的常规需求
- 作用：按时间范围筛选数据，并整合多维度信息，便于快速了解产品迭代情况

## 核心知识点

1. 时间条件筛选（年份字段的比较）
2. 多字段提取（整合不同表的关键信息）
3. 降序排序（DESC 在时间类数据中的应用）

### 题目 4：多表内连接（模拟销量表查询 2022 年高销量产品）

## 题目要求

新增 “产品销量表（sales）”，字段：sale\_id (主键自增)、product\_id (关联产品表)、sale\_num (销量)、sale\_year (销售年份)；查询 2022 年销量≥1000 的产品，显示型号名称（“产品型号”）、系列名称（“所属系列”）、产品类型（“产品类型”）、销量（“2022 年销量”）

### **数据补充：**

```sql
-- 先模拟创建销量表并插入测试数据（实际使用时执行）
CREATE TABLE IF NOT EXISTS sales (
  sale_id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  sale_num INT NOT NULL,
  sale_year YEAR NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);
INSERT INTO sales (product_id, sale_num, sale_year) VALUES
(1, 1200, 2022), (5, 1500, 2022), (10, 900, 2022), (15, 2000, 2022);
```

**思路参考：**

```sql
SELECT 
  表1别名.字段1 AS 中文别名1,
  表2别名.字段2 AS 中文别名2,
  表2别名.字段3 AS 中文别名3,
  表3别名.字段4 AS 中文别名4
FROM 表1 表1别名
INNER JOIN 表2 表2别名 ON 表1别名.关联字段1 = 表2别名.关联字段1
INNER JOIN 表3 表3别名 ON 表1别名.关联字段2 = 表3别名.关联字段2
WHERE 表3别名.筛选字段1 = 条件值1
AND 表3别名.筛选字段2 >= 条件值2;
```

### **答案如下：**

```sql
-- 多表连接查询SQL
SELECT 
  p.model_name AS 产品型号,
  ps.series_name AS 所属系列,
  ps.product_type AS 产品类型,
  s.sale_num AS 2022年销量
FROM products p
INNER JOIN product_series ps ON p.series_id = ps.series_id  -- 先关联产品表和系列表
INNER JOIN sales s ON p.product_id = s.product_id          -- 再关联销量表
WHERE s.sale_year = 2022  -- 筛选2022年销量数据
AND s.sale_num >= 1000; -- 筛选销量≥1000的产品
```

## 含义解释

- 这是三张表的关联查询：先通过`products`与`product_series`关联获取产品分类信息，再通过`products`与`sales`关联获取销量数据，形成 “产品详情→分类→销量” 的完整链条
- 筛选条件`s.sale_year = 2022 AND s.sale_num >= 1000`确保只显示 2022 年销量超 1000 的产品，例如假设 “iPhone 14” 在 2022 年销量 1500，就会被选中
- 作用：实现跨表数据整合，解决 “哪些高销量产品属于什么系列” 这类复杂业务问题

## 核心知识点

1. 多表内连接语法（连续使用 INNER JOIN 关联多张表）
2. 多表关联条件（每张表需明确与其他表的关联字段）
3. 基于业务场景的多表数据整合

### 题目 5：统计每个 iPhone 系列的产品总数

## 题目要求

统计每个 iPhone 系列的产品数量，显示系列名称（“iPhone 系列”）、产品总数（“产品数量”），按产品数量降序排序

### 思路参考：

```sql
--语法格式如下
SELECT 
  表2别名.分组字段 AS 中文别名1,
  COUNT(表1别名.主键字段) AS 中文别名2  -- 用主键计数，避免NULL影响结果
FROM 表1 表1别名
INNER JOIN 表2 表2别名
ON 表1别名.关联字段 = 表2别名.关联字段
WHERE 表2别名.筛选字段 = '条件值'
GROUP BY 表2别名.分组字段
ORDER BY 中文别名2 DESC;
```

### 答案如下：

```sql
SELECT 
  ps.series_name AS iPhone系列,
  COUNT(p.product_id) AS 产品数量  -- COUNT统计产品ID（非NULL值），确保计数准确
FROM products p
INNER JOIN product_series ps
ON p.series_id = ps.series_id
WHERE ps.product_type = 'iPhone'  -- 仅统计iPhone产品
GROUP BY ps.series_name  -- 按系列名称分组（每个系列对应一组统计）
ORDER BY 产品数量 DESC;  -- 按产品数量倒序
```

## 含义解释

- `GROUP BY ps.series_name`将 iPhone 产品按系列分组（如 “Standard”“Pro”“Plus” 等单独成组）
- `COUNT(p.product_id)`统计每组内的产品数量（用主键`product_id`计数，确保不会漏算或多算），例如 “Standard” 系列可能有 10 款产品，“Pro” 系列有 7 款
- 排序后能直观看到哪个系列的产品型号最多，方便分析产品布局
- 作用：按类别统计数量，回答 “每个分类有多少数据” 的问题

## 核心知识点

1. GROUP BY 分组逻辑（按类别聚合数据）
2. COUNT 聚合函数（统计记录数量，优先使用主键）
3. 分组后排序（按统计结果排序，强化数据可读性）

### 题目 6：查询平均电池容量≥3000mAh 的 iPhone 系列

## 题目要求

查询平均电池容量≥3000mAh 的 iPhone 系列，显示系列名称（“iPhone 系列”）、平均电池容量（“平均电池容量 (mAh)”，保留 1 位小数），按平均电池容量降序排序

### 思路参考：

```sql
SELECT 
  表2别名.分组字段 AS 中文别名1,
  ROUND(AVG(表1别名.数值字段), 保留小数位数) AS 中文别名2
FROM 表1 表1别名
INNER JOIN 表2 表2别名
ON 表1别名.关联字段 = 表2别名.关联字段
WHERE 表2别名.筛选字段 = '条件值'
AND 表1别名.数值字段 IS NOT NULL  -- 排除NULL值
GROUP BY 表2别名.分组字段
HAVING 中文别名2 >= 数值条件  -- 分组后筛选用HAVING（WHERE无法筛选聚合结果）
ORDER BY 中文别名2 DESC;
```

### 答案如下：

```sql
SELECT 
ps.series_name AS iPhone系列,ROUND(AVG(p.battery_capacity_mah), 1) AS 平均电池容量(mAh) 
 -- ROUND(值,1)保留1位小数
FROM products p
INNER JOIN product_series ps
ON p.series_id = ps.series_id
WHERE ps.product_type = 'iPhone'  -- 仅统计iPhone产品
AND p.battery_capacity_mah IS NOT NULL  -- 排除电池容量为NULL的数据（避免影响平均值）
GROUP BY ps.series_name
HAVING 平均电池容量(mAh) >= 3000  -- 分组后筛选：平均容量≥3000mAh（注意用HAVING而非WHERE）
ORDER BY 平均电池容量(mAh) DESC;
```

## 含义解释

- `AVG(p.battery_capacity_mah)`计算每个 iPhone 系列的平均电池容量，例如 “Plus” 系列可能平均 4000mAh，“mini” 系列可能平均 2300mAh。
- `ROUND(..., 1)`将平均值保留 1 位小数（如 3279.0 而不是 3279），让结果更规范。
- `HAVING 平均电池容量(mAh) >= 3000`筛选出平均容量达标的系列（注意：分组后的筛选必须用 HAVING，不能用 WHERE）。
- 作用：实现 “按类别算平均值 + 筛选达标的类别”，适合分析产品性能差异。

## 核心知识点

1. AVG 聚合函数（计算数值字段的平均值）
2. ROUND 函数（格式化数值，保留指定小数位数）
3. HAVING 子句（分组后筛选聚合结果，与 WHERE 区分）

### 题目 7：查询初始系统为 iOS 16 及以上的 Pro 系列产品

## 题目要求

查询初始系统是 iOS 16、iOS 17、iOS 18 或 iOS 26 的 Pro 系列产品（含 iPhone 和 iPad），显示型号名称（“产品型号”）、系列名称（“所属系列”）、产品类型（“产品类型”）、初始系统（“初始操作系统”），按产品类型升序排序

### **思路参考：**

```sql
SELECT 
  表1别名.字段1 AS 中文别名1,
  表2别名.字段2 AS 中文别名2,
  表2别名.字段3 AS 中文别名3,
  表1别名.字段4 AS 中文别名4
FROM 表1 表1别名
INNER JOIN 表2 表2别名
ON 表1别名.关联字段 = 表2别名.关联字段
WHERE 表2别名.筛选字段1 = '条件值1'
AND 表1别名.筛选字段2 IN ('条件值2', '条件值3', '条件值4')  -- IN简化多值匹配
ORDER BY 表2别名.排序字段 ASC;
```

### **答案如下：**

```sql
SELECT 
  p.model_name AS 产品型号,
  ps.series_name AS 所属系列,
  ps.product_type AS 产品类型,
  p.initial_os AS 初始操作系统
FROM products p
INNER JOIN product_series ps
ON p.series_id = ps.series_id
WHERE ps.series_name = 'Pro'  -- 筛选Pro系列
AND p.initial_os IN ('iOS 16', 'iOS 17', 'iOS 18', 'iOS 26')  -- IN匹配多个系统值
ORDER BY ps.product_type ASC;  -- 按产品类型升序（iPhone在前或iPad在前，按字母排序）
```

## 含义解释

- `IN ('iOS 16', 'iOS 17', 'iOS 18', 'iOS 26')`是多值匹配的简化写法，相当于 “初始系统 = iOS 16 OR 初始系统 = iOS 17 ...”，筛选出搭载较新系统的产品
- 结果只包含 “Pro” 系列（如 “iPhone 14 Pro”“iPad Pro 11-inch (4th gen, 2022)”），且按产品类型升序排列（通常 “iPad” 会排在 “iPhone” 前面，按字母顺序）
- 作用：高效匹配多个离散值，快速定位符合特定属性的产品

## 核心知识点

1. IN 运算符（简化多值匹配条件）
2. 字符型字段的筛选（匹配系统版本等文本信息）
3. 按分类字段排序（让同类型数据集中展示）

### 题目 8：统计 2021 年后发布的各系列产品数量

## 题目要求

统计 2021 年及以后发布的各产品系列（含 iPhone 和 iPad）的产品数量，显示产品类型（“产品类型”）、系列名称（“所属系列”）、产品数量（“产品数量”），按产品类型升序、产品数量降序排序

### 思路参考：

```sql
SELECT 
  表2别名.分组字段1 AS 中文别名1,
  表2别名.分组字段2 AS 中文别名2,
  COUNT(表1别名.主键字段) AS 中文别名3
FROM 表1 表1别名
INNER JOIN 表2 表2别名
ON 表1别名.关联字段 = 表2别名.关联字段
WHERE 表1别名.时间字段 >= 条件值
GROUP BY 表2别名.分组字段1, 表2别名.分组字段2  -- 联合分组：按多个字段分组
ORDER BY 表2别名.分组字段1 ASC, 中文别名3 DESC;  -- 多字段排序：先排字段1，再排统计结果
```

### **答案如下：**

```sql
SELECT 
  ps.product_type AS 产品类型,
  ps.series_name AS 所属系列,
  COUNT(p.product_id) AS 产品数量
FROM products p
INNER JOIN product_series ps
ON p.series_id = ps.series_id
WHERE p.release_year >= 2021  -- 筛选2021年后发布的产品
GROUP BY ps.product_type, ps.series_name  -- 按“产品类型+系列名称”联合分组（同一类型下的不同系列）
ORDER BY ps.product_type ASC, 产品数量 DESC;  -- 先按类型升序，再按数量降序
```

## 含义解释

- `GROUP BY ps.product_type, ps.series_name`是 “联合分组”，先按 “产品类型”（iPhone/iPad）分大类，再在每个大类下按 “系列名称” 分小类（如 iPad 下的 “数字版”“Air” 等）。
- 统计结果能同时看到 “iPhone 的 Pro 系列有 5 款 2021 年后的产品”“iPad 的 Air 系列有 4 款” 等信息。
- 排序规则`ps.product_type ASC, 产品数量 DESC`确保先按类型归类，同一类型内按数量从多到少排列，层次清晰。
- 作用：实现多级分类统计，适合分析不同类别下的子分类数据分布。

## 核心知识点

1. 联合分组（GROUP BY 多个字段，实现多级分类）
2. 多字段排序（按多个条件排序，先主后次）
3. 时间范围 + 分类统计的组合应用

## 总结

本文通过举例苹果产品设备库的现实场景，覆盖了内连接查询的核心考点：从基础的 **ON/USING** 语法、多条件**筛选排序**，到进阶的**多表关联**、**分组聚合（COUNT/AVG）**、**HAVING 筛选**等

## **未完待续 ing**
