# Claude 對話匯出工具 (Chrome 擴充功能)

一個能夠將 Claude.ai 對話內容轉換成 Markdown 格式的 Chrome 擴充功能。

## 功能特色

- 將 Claude.ai 對話匯出成 Markdown 格式
- 直接在 claude.ai 網站上使用
- 一鍵匯出功能

## 安裝方式

1. 複製專案：
```bash
git clone [your-repository-url]
cd claude-export-chrome
```

2. 安裝依賴：
```bash
yarn install
```

3. 建置專案：
```bash
yarn build
```

4. 在 Chrome 中載入擴充功能：
   - 開啟 Chrome 瀏覽器，前往 `chrome://extensions/`
   - 開啟右上角的「開發人員模式」
   - 點擊「載入未封裝項目」
   - 選擇本專案的 `dist` 資料夾

## 開發說明

- 執行開發模式（自動重新編譯）：
```bash
yarn watch
```

## 使用方式

1. 前往 https://claude.ai
2. 點擊 Chrome 工具列上的擴充功能圖示
3. 對話內容將自動轉換成 Markdown 格式

## 技術架構

- TypeScript
- Webpack
- Chrome Extension Manifest V3

## 授權條款

[Your chosen license] 