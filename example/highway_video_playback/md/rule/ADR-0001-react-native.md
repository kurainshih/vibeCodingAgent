# ADR-0001：選擇 React Native 作為 UI 技術

## 狀態
Accepted

## 決策
使用 React Native 作為跨平台 UI 層，Android 保留 Native Host。

## 原因
- 降低多平台 UI 重複開發成本
- 保留 Android 系統能力與效能
- 團隊具備 JS/TS 能力

## 後果
- 需維護 RN 與 Native Bridge
- Native 能力仍由 Kotlin 管理
