<div align="left">

# 🅿️ Open Curb
### Indianapolis Parking Asset & Citation Utility

[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge&logo=activity)](https://dugann.github.io/indy-locator-web/)
[![Platform](https://img.shields.io/badge/Platform-PWA%20%7C%20Mobile-blue?style=for-the-badge&logo=pwa)](https://dugann.github.io/indy-locator-web/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge&logo=law)](https://dugann.github.io/indy-locator-web/)

<br />

[**🚀 Launch Application**](https://dugann.github.io/indy-locator-web/)

</div>

---

## 📋 Summary

**Open Curb** is a web app that connects Indianapolis public data with mobile tools. It combines a parking meter map and a ticket payment shortcut into one interface designed for outdoor use.

Instead of a generic map, this tool focuses on two specific tasks: finding parking meter ID numbers and scanning citations for faster payment.

---

## 🛠 Engineering

This project uses a full-stack approach to improve performance and security on mobile devices.

### Frontend (React 18 + Tailwind)
* **No Build Step:** Uses Babel-standalone for quick updates and easy code inspection without complex bundler configurations.
* **Client Validation:** Checks citation numbers in the browser (Luhn algorithm) to catch typos before submission.
* **Camera Support:** Uses standard web APIs to scan license plates and citation barcodes.
* **Responsive Design:** Adjusts the layout smoothly for any screen size, from small phones to desktops.

### Backend (Node.js + Express)
* **Security:** A Node.js proxy hides third-party API keys so they are never exposed in the browser.
* **Data Cleanup:** Converts heavy GIS map data into lightweight JSON to save mobile data and speed up loading.
* **Reliability:** Automatically retries failed API calls if the network drops.

### PWA Features
* **Offline Mode:** Caches fonts and core logic so the "Space Locator" works even with poor signal.
* **Installable:** Can be added to the home screen to hide browser bars and maximize screen space.

---

## 🔍 Features

### 1. Meter Locator
*Connects to the Indianapolis Open Data MapServer.*

* **Range Search:** Find meter banks by ID (e.g., "100-105").
* **Street Search:** Find spots by street name.
* **Visual Check:** One-tap link to Google Maps and Street View to verify the location.

### 2. Citation Portal
*Helper tool for the City’s payment site.*

* **OCR:** Scans license plates so users don't have to type them.
* **Barcode Scanner:** Captures citation numbers from printed tickets.
* **Smart Links:** Generates a payment URL with the data pre-filled to prevent errors.

---

## ⚙️ Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18 | UI logic |
| **Styling** | Tailwind CSS | Design and layout |
| **Backend** | Node.js / Express | API Proxy and security |
| **Data Sources** | ArcGIS REST / Plate Recognizer | Map data and OCR |
| **Hosting** | GitHub Pages / Render | Static (Front) and Dynamic (Back) |

---

## 🔒 Privacy & Data

* **Pass-Through:** This app does not save user searches, location data, or camera images.
* **Source Data:** All parking data comes directly from public government servers.

> **Note:** This tool is an independent utility and is not affiliated with the City of Indianapolis.

---

## 📝 Project Info

* **Developer:** William Dugann
* **License:** Proprietary
* **Repository:** [GitHub](https://github.com/dugann/indy-locator-web)
