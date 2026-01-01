<div align="center">

# 🅿️ Open Curb
### Indianapolis Parking Asset & Citation Utility

[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge&logo=activity)](https://dugann.github.io/indy-locator-web/)
[![Platform](https://img.shields.io/badge/Platform-PWA%20%7C%20iOS%20%7C%20Android-blue?style=for-the-badge&logo=pwa)](https://dugann.github.io/indy-locator-web/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge&logo=law)](https://dugann.github.io/indy-locator-web/)

<br />

[**🚀 Launch Live Application**](https://dugann.github.io/indy-locator-web/)

<br />

**Open Curb is an integrated Progressive Web Application (PWA) designed to democratize access to Indianapolis parking operations.**

</div>

---

## 📋 Executive Summary
This application bridges the gap between municipal GIS systems and the daily driver. It unifies asset tracking and citation management into a single, mobile-first interface designed for high-glare outdoor environments.

Unlike standard map tools, this application focuses on specific utility: validating parking meter zones via ID and expediting the citation payment process through automated data capture.

> ⚠️ **Disclaimer:** *This tool is an independent utility and is not affiliated with, endorsed by, or connected to the City of Indianapolis.*

---

## 🔍 Core Functionality

The platform features a dual-mode interface toggle, allowing users to switch between tools without navigating away from the main workspace.

| Mode | Functionality |
| :--- | :--- |
| **📍 Space Locator** | **GIS-driven asset mapping.**<br>• Query single or range-based IDs (e.g., `101`–`105`).<br>• Search validated street names with autocomplete.<br>• One-tap Google Maps and Street View integration for physical verification. |
| **🎫 Citation Portal** | **Secure payment redirection.**<br>• Automated validation using the **Luhn algorithm**.<br>• Supports license plate lookups by plate and state.<br>• Pass-through routing to trusted payment processors with secured parameters. |

---

## ⚙️ Engineering Highlights

This project demonstrates a full-stack approach to solving field utility problems, focusing on performance, security, and data integrity.

### Frontend Architecture
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

* **Zero-Build Deployment:** Utilizes a Babel-standalone architecture for rapid prototyping and transparent code inspection.
* **Client-Side Validation:** Implements custom logic to validate citation numbers before submission, reducing server load.
* **Adaptive UX:** Handles layout shifts (CLS) gracefully across devices, from iPhone SE to desktop monitors.

### Backend-for-Frontend (Middleware)
![Node](https://img.shields.io/badge/Node.js-Middleware-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?style=flat-square&logo=express&logoColor=white)

* **Security & Proxying:** A custom Node.js layer isolates third-party API keys (GIS and LPR services) from the client.
* **Data Normalization:** Transforms complex Esri GIS datasets into optimized, lightweight JSON responses.
* **Resiliency:** Implements exponential backoff and timeout handling for external API calls.

---

## 📲 Installation

The system operates as a full-featured PWA across desktop and mobile environments.

* **Desktop:** Click the install icon in the browser URL bar.
* **iOS:** Select `Share` → `Add to Home Screen`.
* **Android:** Use the browser menu → `Install App`.

---

## 👥 User Base

The portal serves both public and institutional stakeholders:

1.  **Public Users:** Simplified interface for confirming parking zones and resolving citations.
2.  **Parking Operators:** Customer assistance for meter identification or ticket clarification.
3.  **Contractors & ROW Inspectors:** Identification of assets within permitted work zones.
4.  **Police:** Quick verification of meter location when handling closures.

---

## 🔒 Privacy & Compliance

* **Data Handling:** The application operates on a "pass-through" basis. No user queries, location data, or camera images are stored on Open Curb servers.
* **Source Transparency:** All parking data is fetched in real-time from public government endpoints (Indianapolis Open Data Portal).

---

## 📝 Project Metadata

* **Developer:** William Dugann
* **License:** Proprietary
* **Repository:** [GitHub](https://github.com/dugann/indy-locator-web)
* [Report Issues](https://github.com/dugann/indy-locator-web/issues)

<div align="center">
  <br>
  <sub>© 2025 William Dugann</sub>
</div>
