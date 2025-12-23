# Indy Space Locator

**Indy Space Locator** is a specialized progressive web application (PWA) designed to streamline field operations for Indianapolis metered parking verification. It provides a streamlined and accessible mobile interface that can be easily accessed by field operators to identify the location of metered parking spaces in Indianapolis. The application utilizes an enterprise-grade architecture to ensure data integrity, maintainability, and system robustness.

[**Launch Live Application**](https://dugann.github.io/indy-locator-web/)

## 🎯 The Challenge

Field teams required a lightweight, reliable method to verify GIS metered parking data (Layer 14) on mobile devices without direct access to heavy desktop mapping software. The solution needed to be fast, scalable, and capable of functioning in variable network conditions.

## 🛡️ Technical Architecture

While the underlying Indianapolis Open Data API is publicly accessible, this project implements a **Middleware Proxy Architecture** as a proof of concept. This design mimics a production environment where upstream APIs must be protected, rate-limited, or transformed before reaching the client, rather than exposing direct connections in the browser.

* **Client-Side:** A high-performance, vanilla JavaScript frontend hosted on GitHub Pages. It features a responsive, glassmorphic UI optimized for touch interaction and high-contrast outdoor visibility.

* **Server-Side:** A private Node.js middleware server acting as a "Backend for Frontend" (BFF). This layer manages API orchestration and simulates the isolation of upstream infrastructure from direct public access.

**Key Engineering Highlights:**

* **Architectural Proof of Concept:** Demonstrates the "Backend for Frontend" pattern. Even though the data is public, the architecture treats it as a protected resource to illustrate how to secure proprietary APIs (such as employee records or financial data) in a production environment.

* **Abstraction & Decoupling:** By routing requests through the middleware, the frontend is decoupled from the specific upstream provider (ESRI/ArcGIS). This ensures that changes to the city's API structure only require server-side updates, creating a significantly more maintainable codebase.

* **Data Optimization:** The backend filters and transforms raw GIS data into a lightweight JSON format specific to the app's needs, significantly reducing mobile data usage compared to direct API calls.

## 🚀 Core Capabilities

### 1. Precision Search

* **Meter ID Search:** Allows users to look up parking spaces individually or as a dash-separated range and return all addresses within that range, grouping meters by street if there is more than one address.

* **Smart Street Lookup:** Features a dynamic datalist that populates valid street names in real-time based on active datasets.

### 2. Intelligent Grouping

Raw data often returns disparate points. The application automatically aggregates individual meters by physical address, providing a cleaner, more logical view for field reporting.

### 3. Deep System Integration

* **One-Tap Navigation:** Auto-generates deep links to Google Maps for turn-by-turn navigation.

* **Visual Verification:** Provides instant access to Google Street View for remote visual confirmation of meter placement.

### 4. PWA Standards

* **Installable:** Fully compliant manifest allows the app to be installed to the home screen on iOS and Android.

* **Offline Awareness:** The UI gracefully handles connectivity drops, caching essential metadata to keep the interface responsive.

## 🔒 Data Privacy & Attribution

This tool interacts with the Indianapolis Open Data portal (Transportation Layer 14). All data processing occurs in real-time. No user location data or specific search history is persistently stored.

* **Principal Developer:** William Dugann

* **License:** MIT
