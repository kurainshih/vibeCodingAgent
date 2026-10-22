# ADR-0002：Android Build Tool 鎖定策略

## 狀態
Accepted

## 決策
- Gradle 8.7
- AGP 8.5.x
- JDK 17

## 原因
- 穩定支援 Android 16
- 與 React Native 生態相容
- CI 與本機一致性高

## 後果
- 暫不升級 AGP 8.6+
