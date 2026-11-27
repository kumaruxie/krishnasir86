/**
 * Webinar & GoHighLevel (GHL) Configuration
 * -----------------------------------------
 * Krishna Gaur Personality School — 2-Day Spoken English Live Webinar
 */
window.WEBINAR_CONFIG = {
  // 1. Academy & Trainer Identity
  academyName: "Krishna Gaur Personality School",
  trainerName: "Krishna Gaur",
  legalFounderName: "Bankey Bihari",
  tagline: "Building Communication Skills. Transforming Personalities. Creating Confidence.",

  // 2. Hero Headline Split-Test ("A" = launch default; test "B" or "C" via ?v=B or ?v=C)
  headlineVariant: "A",
  headlines: {
    A: "Stop Freezing in English. Discover the Speaking Grammar Nobody Taught You in This 2-Day Live Webinar.",
    B: "You Already Know English. Join This 2-Day Live Webinar to Speak in Meetings and Interviews Without Going Blank.",
    C: "Understand English, But Can't Speak It? Fix the Real Reason in This Free 2-Day Live Webinar."
  },

  // 3. GoHighLevel (GHL) Lead Capture
  // Paste your GHL Workflow Inbound Webhook URL here:
  ghlWebhookUrl: "https://services.leadconnectorhq.com/hooks/E1ggOev0cMHylNbUTKSn/webhook-trigger/pfYveKAirXwTWd2lr32P",

  // Optional: GHL Form POST endpoint if submitting directly to a GHL Form
  ghlFormUrl: "",

  // 4. WhatsApp Group Invite Link (shown in the Thank-You pop-up Step 1)
  whatsappGroupUrl: "https://chat.whatsapp.com/REPLACE_WITH_YOUR_GROUP_INVITE",

  // 5. Meta Pixel ID (leave blank until ready for live Meta Ads tracking)
  metaPixelId: "",

  // 6. Contact & Grievance Details (auto-injected into Privacy Policy & Footer)
  supportEmail: "info@krishnagaurpersonalityschool.com",
  supportPhone: "+91 98XXXXXXXX",
  websiteUrl: "https://krishnagaurpersonalityschool.com",
  officeAddress: "Krishna Gaur Personality School, India",

  // 7. Seat limit line toggle (set false if no real live seat cap applies)
  seatLimitNoticeEnabled: true
};
