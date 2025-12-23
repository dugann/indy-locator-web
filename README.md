# Indy Space Locator

**Indy Space Locator** is a specialized progressive web application (PWA) designed to streamline field operations for Indianapolis asset verification. It provides a mobile-first interface for locating metered parking assets, utilizing a secure architecture to ensure data integrity and system security.

[**Launch Live Application**](https://your-username.github.io/indy-locator-web/)

---

## 🎯 The Challenge

Field teams required a lightweight, reliable method to verify GIS asset data (Layer 14) on mobile devices without direct access to heavy desktop mapping software. The solution needed to be fast, secure, and capable of functioning in variable network conditions.

## 🛡️ Technical Architecture

To ensure security and scalability, this project implements a **Secure Proxy Pattern** (The "Handshake" Protocol):

* **Client-Side:** A high-performance, vanilla JavaScript frontend hosted on GitHub Pages. It features a responsive, glassmorphic UI optimized for touch interaction and high-contrast outdoor visibility.

* **Server-Side:** A private Node.js middleware server that acts as an intermediary. This layer sanitizes inputs, manages API rate limiting, and isolates the upstream GIS infrastructure from direct public access.

**Key Engineering Highlights:**

* **Security by Design:** Direct API endpoints are never exposed to the client browser. All traffic is routed through the secure handshake server.

* **Data Optimization:** The backend filters and transforms raw GIS data into a lightweight JSON format specific to the app's needs, significantly reducing mobile data usage.

* **Leaky Abstraction Prevention:** Internal server logic and upstream authentication details remain completely opaque to the end-user.

## 🚀 Core Capabilities

### 1. Precision Search

* **Meter ID Range:** Allows teams to query specific blocks of assets (e.g., Spaces 100-150) with instant input validation.

* **Smart Street Lookup:** Features a dynamic datalist that populates valid street names in real-time based on active datasets.

### 2. Intelligent Grouping

Raw data often returns disparate points. The application automatically aggregates individual meters by physical address, providing a cleaner, more logical view for field reporting.

### 3. Deep System Integration

* **One-Tap Navigation:** Auto-generates deep links to Google Maps for turn-by-turn navigation.

* **Visual Verification:** Provides instant access to Google Street View for remote visual confirmation of asset placement.

### 4. PWA Standards

* **Installable:** Fully compliant manifest allows the app to be installed to the home screen on iOS and Android.

* **Offline Awareness:** The UI gracefully handles connectivity drops, caching essential metadata to keep the interface responsive.

## 🔒 Data Privacy & Attribution

This tool interacts with the Indianapolis Open Data portal (Transportation Layer 14). All data processing occurs in real-time, using a secure handshake to verify requests. No user location data or specific search history is persistently stored.

* **Principal Developer:** William Dugann

* **License:** MIT
