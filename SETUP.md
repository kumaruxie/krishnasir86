# Krishna Gaur Personality School — Single-Page Webinar Funnel Setup

## Files Overview
- `index.html` — Single-page webinar registration landing page with 3 inline GHL registration forms, a quick registration pop-up (`#modal-register`), a post-registration confirmation pop-up (`#modal-thank-you`), and pop-up modals for Privacy Policy & Cookie Policy, Terms & Conditions, Educational Disclaimer, and Refund Policy.
- `css/styles.css` — Clean direct-response styling (`Montserrat` + `Lato`, royal blue `#102a6b`, conversion red `#e04322`, responsive mobile layout + sticky CTA bar).
- `js/config.js` — Central configuration file for GHL Webhook/Form URL, WhatsApp Group URL, Meta Pixel ID, contact/grievance details, and Headline A/B/C split-testing.
- `js/main.js` — Form validation, GHL lead capture (`name`, `phone`, `email`), pop-up modal controller, interactive 10-second CLT demo, Meta Pixel `Lead` + `CompleteRegistration` tracking, and sticky mobile CTA.
- `assets/` — Real photos of Krishna Gaur (`trainer-stage.jpg`, `trainer-portrait.jpg`, `trainer-award.jpg`, `trainer-walk.jpg`).

## Before Publishing Live (`js/config.js`)
1. **GoHighLevel (GHL) Lead Capture:** Paste your GHL Workflow Inbound Webhook URL into `ghlWebhookUrl` (or GHL Form POST URL into `ghlFormUrl`).
2. **WhatsApp Group Link:** Paste your invite URL into `whatsappGroupUrl` (shown inside the Thank-You confirmation pop-up).
3. **Contact & Grievance Details:** Fill in `supportEmail`, `supportPhone`, `websiteUrl`, and `officeAddress` — they automatically populate Section 12 of the Privacy Policy pop-up.
4. **Meta Pixel:** Paste your Pixel ID into `metaPixelId` to track `PageView`, `Lead`, and `CompleteRegistration`.
5. **Headline Split-Testing:** Defaults to `"A"`. Test `"B"` or `"C"` via `?v=B` / `?v=C` in the URL or by editing `headlineVariant`.
