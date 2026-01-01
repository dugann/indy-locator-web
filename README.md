# Open Curb

![Screenshot placeholder – Home / Search View](docs/screenshot-1.png)
![Screenshot placeholder – Results / Citation View](docs/screenshot-2.png)

**Open Curb** is a mobile-first Progressive Web App that can be used directly in a web browser **or installed as an app on your phone straight from the website**. There is no app store, no account creation, and no setup friction. Once installed, it launches from the home screen, runs full-screen, and behaves like a purpose-built parking utility rather than a traditional website.

The app is designed for real-world use on the street, by the public and by people who work with the public. It prioritizes speed, clarity, and physical usability over feature bloat or administrative complexity.

---

## Privacy-First by Design

Open Curb does **not** save, retain, or log any information entered into either search mode.

- Meter searches, street searches, ticket numbers, and license plates are processed only to complete the immediate action
- No user-entered data is stored server-side
- No searches are retained after the page is closed or refreshed
- Open Curb does not track users or build usage profiles

Any saved favorites or recent locations are stored **only on the user’s own device** using browser storage and are never transmitted elsewhere.

---

## Ticket Lookup Is Safe, Validated, and Redirect-Only

The citation lookup feature is intentionally designed to be **safe, temporary, and verifiable**.

### No Data Retention
When a ticket number or license plate is entered:
- Open Curb does **not** save or retain the information
- The data is not logged or stored
- The app simply launches a new page pointing to the **official Indianapolis citation payment site**

Open Curb never acts as a payment processor and never sits between the user and the official system.

### Official Payment Site Only
All citation lookups ultimately redirect to the **external, official payment portal used by the City of Indianapolis**. Payments occur entirely outside of Open Curb.

This ensures:
- Accuracy of balances and citation status
- Compliance with official payment workflows
- No handling of financial or sensitive data by Open Curb

---

## Built-In Ticket Number Validation

A key feature of the ticket lookup form is **real-time validation** that prevents invalid or mistyped ticket numbers from being submitted.

- Indianapolis parking citation numbers follow a defined format
- Ticket numbers include a checksum that can be validated mathematically
- The form blocks submission of numbers that do not pass validation
- Users receive immediate feedback before being redirected

This significantly reduces common errors that cause failed lookups on payment portals.

---

## Barcode Scanning Support

Every official Indianapolis parking citation includes a barcode representing the ticket number. Open Curb supports this directly.

Users can:
- Scan the barcode on a physical ticket using their phone camera
- Automatically populate the ticket number field
- Avoid manual typing errors entirely

Barcode scanning works alongside manual entry and validation to provide a faster, more reliable experience.

---

## Why Open Curb Exists

Parking and citation systems already exist, but they are often fragmented across vendor portals, PDFs, and mobile-unfriendly pages. The result is unnecessary friction for people who simply want to find a meter or pay a citation.

Open Curb acts as a **single, fast entry point**. It connects users to existing systems without attempting to replace them. The goal is to reduce time-on-task, eliminate guesswork, and make common actions obvious and reliable.

---

## Use It Online or Install It as an App

Open Curb works immediately in any modern browser. Because it is a Progressive Web App, it can also be installed directly from the site.

- Use it instantly in the browser with no download
- Install it on **iPhone or Android** from the website
- Launch it from the home screen like a native app
- Run full-screen without browser controls
- Automatically receive updates on refresh

There is no separate “app version.” The web version and installed version are the same codebase.

---

## Core Features

### Space Locator Mode
- Search by **meter ID** or **meter ID range**
- Search by **street name**
- View meters grouped by physical address
- Copy or share meter IDs instantly
- Save frequently used locations as favorites
- Open walking directions in Google Maps
- Jump directly into Street View for visual confirmation

### Citation Portal Mode
- Look up citations by **ticket number**
- Look up citations by **license plate**
- Scan ticket barcodes using the phone camera
- Capture license plates using an image instead of manual entry
- Share or copy official payment links
- Validate ticket numbers before redirecting

---

## What Open Curb Is Not

- It does not issue citations
- It does not store or retain user-entered data
- It does not process payments
- It does not replace municipal or vendor systems
- It does not claim real-time enforcement authority

Open Curb is an access and navigation layer, not a regulatory system.

---

## Deployment Notes

The backend runs on free-tier hosting and may take 30 to 50 seconds to respond after periods of inactivity. This behavior is surfaced intentionally so users understand what is happening rather than assuming the app has failed.

The frontend is a single HTML file and can be hosted on any static hosting provider.

---

## Intended Audience

- Members of the public navigating parking and citations
- Public-facing staff needing fast spatial confirmation
- Civic technologists exploring pragmatic tools
- Reviewers evaluating real-world product and systems thinking

---

## License and Use

This repository is proprietary and not licensed for redistribution without permission. It is published for demonstration, review, and discussion purposes.

---

## Author

Built by **William Dugann**  
https://github.com/dugann
