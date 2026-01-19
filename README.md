# Open Curb

**[Launch Application](https://dugann.github.io/indy-locator-web/)**

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](https://github.com/dugann/indy-locator-web)
[![Stack: React](https://img.shields.io/badge/Stack-React_18-blue)](https://react.dev/)
[![Hosting: Render](https://img.shields.io/badge/Hosting-Render-darkgreen)](https://render.com/)
[![Status: Private effort](https://img.shields.io/badge/Status-Independent_Project-orange)](#important)

**Open Curb** is a welcoming, mobile-first Progressive Web App designed to simplify how you navigate parking and citations in Indianapolis. Whether you are looking for a specific meter or checking a citation, the goal is to eliminate friction and provide a professional, transparent interface.

The application works directly in any browser or can be installed as an app on a mobile device straight from the website, with no app store or account creation required.

> **Important:** Open Curb is a private, independent effort. It is not sponsored by, supported by, or affiliated with the City of Indianapolis.

---

## Your Privacy is the Priority

Entering license plate numbers or ticket information can feel sensitive. **Open Curb is built on a "Zero-Retention" philosophy**.

* **No Data Logging:** The application does not save, retain, or log any information entered.
* **No Server-Side Storage:** Meter searches, ticket numbers, and license plates are processed to complete the request and are never stored on a server.
* **No Tracking:** The application does not use cookies for user tracking or usage profiling.
* **Session Security:** All searches are discarded the moment the page is closed.

---

## API & Architecture: Transparent Traffic Flow

The diagram below illustrates the flow of API traffic. To ensure security, sensitive API keys are never exposed on the frontend. Instead, traffic is routed through a secure Node.js middleware that communicates with official data sources.

```mermaid
sequenceDiagram
    participant U as User / Browser
    participant F as React Frontend (GitHub Pages)
    participant B as Node.js Middleware (Render)
    participant E as External APIs (IndyGIS/Plate Recognizer)
    participant P as Official City Portal

    U->>F: Enter Search / Scan Plate
    F->>B: HTTPS POST (Request Data)
    B->>E: Authenticated API Call (API Keys Protected)
    E-->>B: JSON Response
    B-->>F: Sanitized Data Payload
    F-->>U: Display Results
    
    Note over U,P: For Citations
    U->>F: Submit Validated Ticket
    F->>P: Secure Redirect (Client-Side)
    U->>P: Official Payment Process
```

---

## Citation Lookup: Safe and Redirect-Only

The citation lookup feature is a "redirect-only" service to the **official Indianapolis citation payment portal**. Open Curb never handles payments or sits between the user and the official financial system.

### How It Works
1. **Format Validation:** The application checks the ticket number using the Luhn algorithm locally.
2. **Secure Redirect:** The user is sent directly to the city’s official site.
3. **Official Processing:** All balances, citation details, and payments happen exclusively on the official portal.

---

## Technical Details

**Open Curb** utilizes a modern, decoupled architecture to ensure both performance and security.

* **Frontend:** Built with **React 18**, **Tailwind CSS**, and **Lucide React**.
* **Backend:** A **Node.js/Express** middleware that proxies requests to IndyGIS and Plate Recognizer APIs to keep API keys secure.
* **Hosting:** GitHub Pages for the static frontend and Render for the Node.js middleware services.
* **Algorithms:** Client-side citation validation using the **Luhn algorithm**.

---

## Author

Built by **William Dugann**

* [GitHub Repository](https://github.com/dugann/indy-locator-web)
* [Report Issues](https://github.com/dugann/indy-locator-web/issues)
