# 台灣高速公路「前方即時影像路況」App（DEMO 版）
## React Native + 本地 JSON + CCTV MJPEG 規格書（Vibe Coding）

---

## 文件定位與適用範圍（重要）

> 本文件為 **DEMO / PoC 功能規格書**  
> - 僅描述「功能行為與畫面呈現」  
> - **不取代**既有 ADR / Architecture / Build / Android 版本規範文件  
> - 需 **遵循 `md/rule` 目錄下所有 MD 規則文件**

---

## 0. 專案目標（Project Goal）

開發一個 **DEMO 用行車輔助 App**，  
當使用者行駛於台灣高速公路時：

- 根據 **本地 JSON 資料**
- 計算「前方即將經過的攝影機」
- 即時顯示 **CCTV 播放式影像（MJPEG）**
- UI 呈現方式需 **對齊既有設計稿**

### DEMO 限制條件

- ❌ 不使用地圖
- ❌ 不呼叫任何外部 API
- ❌ 不申請任何金鑰
- ❌ 不包含後端服務
- ✅ 僅作 DEMO / Prototype 使用

---

## 1. 專案既有資源位置（必讀）

### 1.1 JSON 資料來源

- 現行資料路徑：
```
json/N3_NS_filtered/
```

- App 實際使用檔案：
```
assets/data/N3_NS_filtered_no_nan.json
```

### 1.2 UI 設計稿來源

- 首頁設計規格：
```
style/ahead_live_traffic_main/
```

> UI 實作需 **完全對齊此設計稿結構與層級**

---

## 2. 使用資料來源（唯一）

### 2.1 本地 JSON（Static Data）

App 啟動時載入靜態 JSON，不允許動態下載。

#### 單筆資料結構（保證格式）

```json
{
  "type": "camera",
  "route": "N3",
  "dir": "N",
  "km": 12.3,
  "lat": 25.01234,
  "lon": 121.54321,
  "cameraNo": "40430",
  "href": "https://example",
  "title": "台北交流道"
}
```

#### 欄位說明

| 欄位 | 說明 |
|---|---|
| type | 固定為 `camera` |
| route | 國道代碼（例：N3） |
| dir | 行進方向（N / S） |
| km | 攝影機里程 |
| lat / lon | 攝影機座標 |
| cameraNo | 攝影機編號（純數字） |
| href | 原始來源頁（可選） |
| title | 攝影機顯示名稱 |

---

## 3. 影像來源（MJPEG）

### 3.1 CCTV 即時影像 URL 規則

```txt
https://cctvn.freeway.gov.tw/abs2mjpg/bmjpg?camera={cameraNo}
```

範例：

```txt
https://cctvn.freeway.gov.tw/abs2mjpg/bmjpg?camera=40430
```

### 使用原則

- 不解析串流
- 不轉封裝
- 不快取影像
- 僅作即時顯示

---

## 4. 前方攝影機判斷邏輯（km-based）

### 4.1 行進方向來源

- DEMO 階段可：
  - 固定方向（N / S）
  - 或使用裝置 heading（不強制）

### 4.2 前方判斷規則

假設目前里程為 `currentKm`

- 北上（dir = N）：
```ts
camera.km > currentKm
```

- 南下（dir = S）：
```ts
camera.km < currentKm
```

### 4.3 排序與顯示數量

```ts
const aheadCameras = cameras
  .filter(c => c.km > currentKm)
  .sort((a, b) => a.km - b.km)
  .slice(0, 5);
```

---

## 5. App UI 規格（必須對齊設計稿）

### 5.1 Header
- 標題：前方路況
- 右側通知 icon（可暫不實作）

### 5.2 主影像卡（LIVE）

- 顯示第一支前方攝影機
- 比例：16:9
- 左上角顯示 🔴 LIVE
- 中央播放 icon（純視覺）

### 5.3 次要影像卡

- 顯示第二支攝影機
- 點擊後切換為主影像

### 5.4 行車狀態列

| 區塊 | 說明 |
|---|---|
| 目前速度 | DEMO 假資料 |
| GPS 訊號 | 固定顯示「良好」 |
| 行進方向 | ↑ 北 / ↓ 南 |

### 5.5 即將經過的攝影機清單

- 攝影機名稱（title）
- 與目前位置距離（km）

---

## 6. React Native 元件拆分建議

```
screens/
 └─ HomeScreen.tsx

components/
 ├─ LiveVideoCard.tsx
 ├─ CameraListItem.tsx
 ├─ DrivingStatusBar.tsx
```

---

## 7. MJPEG 顯示方式（重要）

### Android（建議）

```tsx
<Image source={{ uri: mjpegUrl }} />
```

### 顯示不穩定時

```tsx
<WebView source={{ uri: mjpegUrl }} />
```

> ⚠️ 不得使用 video player（非 HLS / MP4）

---

## 8. 明確不處理項目

- 地圖 / OSM
- Overpass / Nominatim
- TDX API
- Backend Server
- Token / OAuth
- 背景服務
- 串流轉封裝

---

## 9. DEMO 驗收標準（Acceptance Criteria）

- 本地 JSON 可正常載入
- 可正確計算前方攝影機
- MJPEG 影像可即時更新
- 任一影像失效不造成 App crash
- UI 結構與設計稿一致
- 不呼叫任何外部 API

---

## 10. Vibe Coding 指示（給 AI）

> This is a **React Native DEMO app**.  
> Use **local JSON only**.  
> Do NOT use maps or APIs.  
> Use **MJPEG image stream** for CCTV.  
> Follow existing MD rules strictly.
