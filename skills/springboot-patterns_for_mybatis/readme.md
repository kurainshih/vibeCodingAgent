# springboot-patterns_for_mybatis（Skill 使用說明 / README）

---

## 📌 簡介 / Introduction

本 Skill 為 **Spring Boot + MyBatis 專用開發規範**，  
用於指導 AI（如 Claude Code）與開發者進行一致的後端設計與實作。

This skill provides **development patterns for Spring Boot projects using MyBatis**,  
designed for both AI assistants and developers.

---

## 🎯 使用目的 / Purpose

此 Skill 用來：

- 統一後端架構設計（Controller / Service / Mapper）
- 強化 MyBatis SQL 安全與品質
- 避免 JPA 思維誤用
- 提供 code review 標準

This skill helps to:

- Standardize backend architecture
- Improve MyBatis SQL safety and quality
- Avoid misuse of JPA patterns
- Provide consistent code review guidelines

---

## 🧠 適用條件 / When to Use

請在以下情況使用：

- 使用 MyBatis Mapper（XML 或 Interface）
- 使用 SQL 為主的資料存取設計
- 非 JPA / Hibernate 專案

Use this skill when:

- Project uses MyBatis (XML or Mapper interface)
- SQL-centric persistence design
- NOT using JPA / Hibernate

---

## ❌ 不適用 / Do NOT Use

- Spring Data JPA
- Hibernate Entity 專案
- Repository Pattern 為主的專案

Do NOT use for:

- Spring Data JPA projects
- Hibernate-based projects
- Repository-based architectures

---

## ⚙️ 與其他 Skill 搭配 / Integration

建議搭配：

- java-reviewer-mybatis.md
- springboot-mybatis-patterns.md

Recommended with:

- java-reviewer-mybatis.md
- springboot-mybatis-patterns.md

---

## 🔥 核心能力 / Core Capabilities

### 1️⃣ 分層架構 / Layered Architecture
- Controller：接收請求、驗證
- Service：商業邏輯、Transaction
- Mapper：資料存取

---

### 2️⃣ MyBatis SQL 安全 / SQL Safety
- 優先使用 `#{}`，避免 `${}`
- ORDER BY 必須白名單
- 禁止 SQL 字串拼接

---

### 3️⃣ Dynamic SQL / 動態 SQL
- 使用 `<if>`、`<choose>`、`<foreach>`
- 避免空集合產生錯誤 SQL
- 確保條件不會變全表查詢

---

### 4️⃣ Transaction 管理 / Transaction
- 僅在 Service 層
- 避免包 API / IO
- 多 mapper 必須同一 transaction

---

### 5️⃣ 效能 / Performance
- 禁止 SELECT *
- 分頁需穩定排序
- 避免 N+1 查詢

---

## 🧩 MyBatis Reviewer 重點 / Review Focus

- `${}` 是否安全
- SQL 是否可能錯誤
- 是否存在 N+1
- Mapper / XML 是否一致
- 分頁是否穩定
- Transaction 是否正確

---

## ⚠️ 注意事項 / Notes

- 本 Skill 不會自動修改程式碼
- 僅提供設計與實作建議
- 若搭配 Bash 工具，請注意安全性

This skill:

- Does NOT modify code automatically
- Provides guidance only
- May trigger commands if Bash is enabled (use with caution)

---

## 🚀 結論 / Conclusion

👉 本 Skill 為：

**企業級 Spring Boot + MyBatis 開發與審查標準**

This skill is:

**An enterprise-grade standard for Spring Boot + MyBatis development and review**

---

如需進一步客製（OPBIZ / PostgreSQL / 高併發），可再擴充。  
Custom versions (OPBIZ / PostgreSQL / high concurrency) can be extended.
