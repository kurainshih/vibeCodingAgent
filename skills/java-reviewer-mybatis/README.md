# Java Reviewer（MyBatis 專用版）使用說明 / README

---

## 📌 簡介 / Introduction

本檔案為 **Spring Boot + MyBatis 專案專用的程式碼審查規則（Agent）**，  
用於輔助 Claude Code / AI 工具進行高品質程式碼檢查。  

This document is a **code review agent for Spring Boot + MyBatis projects**,  
designed to assist Claude Code / AI tools in performing high-quality code reviews.

---

## 🎯 使用目的 / Purpose

此 Reviewer 主要用來檢查：  

- Java 程式碼品質  
- Spring Boot 分層設計  
- MyBatis SQL 安全性  
- Transaction 正確性  
- 效能與 N+1 問題  

This reviewer focuses on:  

- Java code quality  
- Spring Boot layered architecture  
- MyBatis SQL safety  
- Transaction correctness  
- Performance and N+1 issues  

---

## 🧠 適用專案類型 / Applicable Projects

適用：  

- Spring Boot + MyBatis（XML Mapper）  
- 三層式架構（Controller / Service / DAO）  
- 中大型企業系統  

Applicable for:  

- Spring Boot + MyBatis (XML Mapper)  
- Layered architecture (Controller / Service / DAO)  
- Enterprise-scale systems  

---

## ⚙️ 工具權限說明 / Tool Permissions

| 工具 | 功能 | Tool | Description |
|------|------|------|------------|
| Read | 讀取檔案 | Read | File reading |
| Grep | 搜尋內容 | Grep | Content search |
| Glob | 搜尋檔案 | Glob | File discovery |
| Bash | 執行指令⚠️ | Bash | Execute commands ⚠️ |

👉 建議 / Recommendation:  
- 僅做 code review 建議關閉 Bash  
- Disable Bash for safer static analysis  

---

## 🔥 重點檢查項目 / Key Review Areas

### 1️⃣ SQL 安全 / SQL Security

- 禁止 `${}`（除非白名單）  
- 禁止 SQL 字串拼接  
- ORDER BY 必須白名單  

- Avoid `${}` unless strictly whitelisted  
- Avoid string-concatenated SQL  
- Whitelist ORDER BY inputs  

---

### 2️⃣ MyBatis 常見問題 / MyBatis Risks

- IN 使用 `<foreach>`  
- 避免動態 SQL 錯誤  
- 避免 N+1  

- Use `<foreach>` for IN clauses  
- Ensure dynamic SQL correctness  
- Avoid N+1 queries  

---

### 3️⃣ 架構設計 / Architecture

- Controller 不寫 business logic  
- Service 控制 transaction  
- DAO 專注資料存取  

- Controllers should be thin  
- Transactions belong in service layer  
- DAO handles persistence only  

---

### 4️⃣ Transaction / 交易控制

- Service 層管理  
- 避免包 API / IO  

- Managed in service layer  
- Avoid long-running operations inside transactions  

---

### 5️⃣ 效能 / Performance

- 禁止 `SELECT *`  
- 必須有 index 思維  
- 分頁需穩定排序  

- Avoid `SELECT *`  
- Be index-aware  
- Ensure deterministic pagination  

---

### 6️⃣ 錯誤處理 / Error Handling

- 禁止吞 Exception  
- API 不可錯誤回 200  

- Do not swallow exceptions  
- Do not return 200 for failures  

---

## 🧩 MyBatis 檢查清單 / Checklist

1. 是否使用 `${}`？  
2. SQL 是否可能壞掉？  
3. 是否有 N+1？  
4. Mapper 與 XML 是否一致？  

1. Is `${}` used?  
2. Could SQL break?  
3. Is there N+1?  
4. Mapper/XML consistent?  

---

## 🚀 最佳實踐 / Best Practices

- Service 方法 ≤ 50 行  
- SQL 僅在 Mapper XML  
- 所有查詢需可 explain  

- Service methods ≤ 50 lines  
- SQL only in Mapper XML  
- Queries must be explainable  

---

## ⚠️ 注意事項 / Notes

- 不會自動修改程式  
- Bash 有風險  

- Does not modify code automatically  
- Bash execution carries risk  

---

## 📎 結論 / Conclusion

👉 這是一份企業級 MyBatis Code Review 標準  

👉 This is an enterprise-grade MyBatis code review standard  

---

如需客製版本（OPBIZ / PostgreSQL / 高併發），可再擴充。  
Custom versions (OPBIZ / PostgreSQL / high concurrency) can be added.
