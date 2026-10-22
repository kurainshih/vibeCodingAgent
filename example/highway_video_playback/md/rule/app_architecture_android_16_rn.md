# <NewVideoApp> Architecture (Android Legacy → React Native Refresh)

---

## 0. 文件目的
本文件描述：
- 舊 Android 專案翻新為 React Native（RN）App 的目標架構與模組邊界
- Android 16（API 36）平台規格對齊策略
- 開發、建置、測試、發布與可觀測性之標準做法

> 文件維護者：<Owner/Team>  \
> 最後更新：YYYY-MM-DD  \
> 適用版本：App vX.Y.Z / Android API 23+

---

## 1. 目標與非目標

### 1.1 目標（Goals）
- 在不影響既有核心功能（登入 / 影音播放 / 推播 / 背景任務）前提下逐步導入 RN UI
- 建立可擴充的 RN + Native Host 架構，降低未來功能迭代成本
- 全面對齊 Android 16 平台要求（權限、背景限制、隱私、安全性、相容性）

### 1.2 非目標（Non-goals）
- 不進行：完全重寫所有原生功能
- 不處理：平板專屬 UI、無障礙完整重構、多語系重構

---

## 2. 現況盤點（Legacy Android）

### 2.1 現有模組/技術（盤點填寫）
- 架構：MVVM / Clean Architecture
- DI：Hilt
- Networking：OkHttp / Retrofit
- DB：Room
- Push：Firebase Cloud Messaging
- Analytics / Crash：Firebase Analytics / Crashlytics

### 2.2 既有痛點
- UI 與 Android 強耦合，跨平台重複成本高
- 功能演進造成技術債累積
- 新功能測試與驗證成本高

### 2.3 需保留的 Native 能力
- 影音播放（效能與 DRM）
- 背景任務與下載
- 推播與通知權限控管
- 系統層 Intent / Deep Link

---

## 3. 目標架構總覽（React Native + Android Host）

### 3.1 架構責任劃分
- **React Native（JS/TS）**：UI、畫面流程、跨平台商業邏輯
- **Android Host（Kotlin）**：系統能力、權限、背景任務、效能敏感模組

### 3.2 分層設計

**RN（src/）**
- presentation/：Screens / Components / Navigation
- domain/：UseCases / Entities
- data/：API / Repository / Storage
- shared/：Utils / Constants / Feature Flags

**Android（android/）**
- app：Application / MainActivity / Manifest
- core：Logging / Security / Privacy
- native-features：push / media / background
- bridge：RN Native Modules / TurboModules

---

## 4. Android 16（API 36）對齊策略

### 4.1 權限與隱私
- 僅於必要時請求權限（最小權限原則）
- 所有權限請求集中於 Native Host
- 個資與裝置識別統一於 core/privacy 管理

### 4.2 背景限制與前景服務
- 一般背景任務：WorkManager
- 即時任務：Foreground Service（正確 serviceType）

### 4.3 通知策略
- Channel 分類明確（播放 / 系統 / 行銷）
- Android 13+ 通知權限由 Native 控制請求時機

### 4.4 平台行為清單
| 項目 | Android 16 風險 | 對策 |
|---|---|---|
| 推播點擊 | 冷啟動路由 | Native → RN Router | 
| 背景任務 | 限制加嚴 | WorkManager / FGS |
| 媒體存取 | 權限調整 | Media API 分流 |

---

## 5. Repo 目錄結構

```txt
.
├─ android/
│  ├─ app/
│  ├─ core/
│  ├─ native-features/
│  └─ bridge/
├─ ios/
├─ src/
│  ├─ presentation/
│  ├─ domain/
│  ├─ data/
│  └─ shared/
├─ docs/
│  ├─ architecture.md
│  ├─ android16-checklist.md
│  └─ adr/
├─ scripts/
│  ├─ build_android.bat
│  └─ env/
└─ package.json
```

---

## 6. Build Tool & Runtime Versions（鎖版）

### 6.1 Android / Build Toolchain
- Gradle Wrapper：8.7
- Android Gradle Plugin：8.5.x
- compileSdk / targetSdk：36
- minSdk：23

### 6.2 Kotlin / JVM
- Kotlin：1.9.24
- JVM Target：17
- Java Toolchain / JDK：17（LTS）

### 6.3 React Native / JS
- React Native：0.83.x
- Node.js：20.x LTS（≥ 20.19.4）
- Package Manager：npm 或 yarn（需統一）

### 6.4 Android SDK / NDK
- Build-Tools：36.x.x
- NDK（如需）：26.1.10909125

---

## 7. 自動化打包（Android APK）

### 7.1 環境設定（scripts/env/android.env）
```properties
APP_ENV=prod
BUILD_TYPE=Release
FLAVOR=prod
OUTPUT_DIR=output
```

### 7.2 自動打包腳本（scripts/build_android.bat）
```bat
@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

set ENV_FILE=%~dp0env\android.env

for /f "usebackq tokens=1,2 delims==" %%A in ("%ENV_FILE%") do (
    set %%A=%%B
)

cd /d %~dp0..\android
call gradlew clean assemble%FLAVOR%%BUILD_TYPE%

set APK_SRC=app\build\outputs\apk\%FLAVOR%\%BUILD_TYPE%
set APK_DST=%~dp0..\%OUTPUT_DIR%\android\%APP_ENV%

if not exist "%APK_DST%" mkdir "%APK_DST%"
copy %APK_SRC%\*.apk "%APK_DST%"

echo Build Finished
endlocal
```

---

## 8. ADR 與未來升級策略
- ADR-0001：選擇 React Native 作為 UI 層
- ADR-0002：AGP 停留於 8.5.x
- ADR-0003：暫不導入 Kotlin 2.x

---

## 9. 文件完成度確認
- Android 16 對齊：✔
- 版本鎖定清楚：✔
- CI / 自動化可執行：✔
- 可交接 / 可稽核：✔
