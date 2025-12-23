# Indy Space Locator
*A mobile-first tool for locating Indianapolis metered parking*

[**Launch Live Application**](https://dugann.github.io/indy-locator-web/)

---

## Overview

**Indy Space Locator** is a progressive web application that helps users quickly identify the location of metered parking spaces across Indianapolis. It is built for real-world field use, offering a fast, reliable, and readable mobile interface that performs well outdoors and does not rely on heavy desktop GIS software.

The application exists to remove friction in everyday interactions with public space. Police officers verifying meter locations, contractors preparing row permit applications, parking attendants assisting visitors, and city staff supporting enforcement or permitting workflows all face the same challenge: finding accurate meter location data quickly, often with minimal information. Indy Space Locator turns a meter number or street name into a clear, actionable answer in seconds.

---

## Who It’s For

Indy Space Locator was designed with frontline and field-facing roles in mind:

- Police officers and enforcement staff verifying meter locations
- Contractors identifying meters affected by permit requests
- Parking attendants and garage managers assisting the public
- City employees and support services working with public right-of-way data
- Visitors who only remember a meter number and need help finding their vehicle

The guiding principles are speed, clarity, and reliability under real working conditions.

---

## The Problem

Indianapolis meter data is available, but accessing it in the field is not easy. Existing tools are often desktop-oriented, slow on mobile devices, or require stable connectivity and complex interfaces.

Field teams needed a lightweight, dependable way to verify GIS metered parking data on mobile devices. The solution had to scale cleanly, handle unreliable networks, and avoid exposing brittle backend systems directly to the browser.

---

## Technical Design

Although the Indianapolis Open Data API is publicly accessible, this project deliberately uses a production-style architecture to demonstrate best practices.

### Client

The frontend is a high-performance vanilla JavaScript application hosted on GitHub Pages. The interface is touch-optimized, high-contrast, and designed for readability in bright outdoor environments.

### Server

A private Node.js middleware service acts as a **Backend for Frontend**. This layer manages API orchestration, filters and transforms GIS data, and prevents direct coupling between the client and the upstream ESRI and ArcGIS services.

This design offers several advantages:

- The frontend remains insulated from upstream API changes
- Data returned to the client is minimal and purpose-built
- The architecture mirrors how sensitive or proprietary APIs would be protected in a production environment
- Maintenance and future enhancements are significantly simplified

---

## Core Capabilities

### Flexible Search

Users can search for a single meter or a dash-separated range of meter IDs to retrieve all associated addresses. Results are automatically grouped by street when multiple addresses are involved. Street-based searches are supported through a dynamic list of valid street names sourced from active datasets.

### Intelligent Grouping

Raw GIS data often returns individual points. Indy Space Locator aggregates those points by physical address, producing a clean, human-readable view that aligns with how meters are managed in the field.

### Navigation and Visual Verification

Each result includes one-tap navigation links to Google Maps for turn-by-turn directions. Google Street View is also available for remote visual confirmation of meter placement and surroundings.

### Progressive Web App Features

The application can be installed directly to a mobile home screen on both iOS and Android devices. It handles connectivity issues gracefully, keeping the interface responsive even when network conditions degrade.

---

## Data Use and Privacy

Indy Space Locator uses real-time data from the Indianapolis Open Data Portal, Transportation Layer 14. All data is processed on demand. No user location data or persistent search history is stored.

---

## Project Details

**Principal Developer:** William Dugann  
**License:** MIT
