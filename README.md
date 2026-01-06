# Open Curb

**[Launch Application](https://dugann.github.io/indy-locator-web/)**

![Screenshot placeholder: Home / Search View](docs/screenshot-1.png)
![Screenshot placeholder: Results / Citation View](docs/screenshot-2.png)

**Open Curb** is a mobile-first Progressive Web App for finding parking meters and looking up citations in Indianapolis. Use it directly in any browser or install it as an app on your phone: straight from the website, no app store required.

Once installed, it launches from your home screen, runs full-screen, and works like a native app. No account creation, no setup friction.

> **Important:** Open Curb is a private, independent effort. It is not sponsored by, supported by, or affiliated with the City of Indianapolis.

---

## Privacy-First

**Open Curb does not save, retain, or log anything you enter.**

- Meter searches, ticket numbers, and license plates are processed only to complete your request
- Nothing is stored server-side
- No searches are retained after you close the page
- No user tracking or usage profiling

Favorites and recent locations are stored **only on your device** using browser storage and are never transmitted elsewhere.

---

## Citation Lookup: Safe and Redirect-Only

The citation lookup feature redirects you to the **official Indianapolis citation payment portal**. Open Curb never handles payments or sits between you and the official system.

### How It Works
When you enter a ticket number or license plate:
- Open Curb validates the format (for ticket numbers)
- You're redirected to the city's official payment site
- All balances, citation details, and payments happen there
- Open Curb doesn't save or log your entry

This ensures accuracy, compliance with official workflows, and zero handling of financial data.

---

## Built-In Ticket Number Validation

Indianapolis parking citations follow a specific format with a built-in checksum. Open Curb validates ticket numbers **before** redirecting you.

Why this matters: The official payment portal allows payment for tickets not yet registered in the system. This feature was designed to handle delays between citation issuance and database entry. While well-intentioned, it means **you can accidentally pay for invalid or mistyped ticket numbers.**

Because all Indianapolis parking tickets can be mathematically validated, this workaround isn't necessary. Open Curb prevents payment errors by:
- Validating ticket numbers in real-time as you type
- Blocking submission of invalid or malformed numbers
- Providing immediate feedback before you're redirected

This protects you from paying for citations that don't exist due to typos or entry errors.

---

## Automatic Data Capture

Open Curb eliminates typing by scanning information directly from your citation or vehicle.

**Ticket barcodes:** Point your camera at the barcode on a physical citation and the ticket number populates automatically.

**License plates:** Take a photo of your license plate and Open Curb reads both the plate number and state instantly.

Both features work alongside manual entry for fast, error-free lookups.

---

## Why Open Curb Exists

Parking systems work, but they're often fragmented across vendor portals, PDFs, and mobile-unfriendly interfaces. Finding a meter or paying a citation shouldn't require multiple steps or guesswork.

Open Curb is a **single, fast entry point** that connects you to existing systems without replacing them. The goal: reduce friction, eliminate confusion, and make common tasks obvious.

---

## Installation

Open Curb works immediately in any modern browser. To install it as an app:

- **Desktop:** Click the install icon in the browser address bar
- **iPhone:** Tap Share → Add to Home Screen
- **Android:** Use the browser menu → Install App

The web version and installed version are identical. Updates happen automatically when you refresh.

---

## Core Features

Open Curb has two modes that you can switch between instantly:

| Mode | What It Does |
|------|--------------|
| **Space Locator** | Search by meter ID, meter ID range, or street name. View meters grouped by address, save favorites, get walking directions in Google Maps, or jump into Street View for visual confirmation. |
| **Citation Portal** | Look up citations by ticket number or license plate. Scan ticket barcodes with your camera, capture license plates from images, and get redirected to the official payment portal with validated information. |

---

## Who Uses This

- **Public users** navigating parking and citations
- **Parking operators** assisting customers with meter identification
- **Contractors and inspectors** identifying assets in work zones
- **Public-facing staff** needing quick spatial confirmation

---

## What Open Curb Is Not

- Not a citation issuing system
- Not a payment processor
- Not a replacement for municipal or vendor systems
- Not a real-time enforcement tool

It's an access layer, not a regulatory system.

---

## Technical Notes

### Deployment
The backend runs on free-tier hosting and may take 30-50 seconds to respond after periods of inactivity. This behavior is surfaced to users so they understand what's happening rather than assuming the app has failed.

The frontend is a single HTML file and can be hosted on any static provider.

### Data Retention
No user-entered data is stored or logged. The app processes requests and discards them immediately. Any saved preferences (favorites, recent locations) exist only in browser storage on the user's device.

---

## License

This repository is proprietary and not licensed for redistribution without permission. Published for demonstration, review, and discussion.

---

## Author

Built by **William Dugann**

- [GitHub Repository](https://github.com/dugann/indy-locator-web)
- [Report Issues](https://github.com/dugann/indy-locator-web/issues)
