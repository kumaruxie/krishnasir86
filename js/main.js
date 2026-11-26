(function () {
  "use strict";

  var cfg = window.WEBINAR_CONFIG || {};

  function getUrlParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // 1. Populate Dynamic Config Slots
  function applyConfigValues() {
    var map = {
      academyName: cfg.academyName || "Krishna Gaur Personality School",
      trainerName: cfg.trainerName || "Krishna Gaur",
      legalFounderName: cfg.legalFounderName || "Bankey Bihari",
      supportEmail: cfg.supportEmail || "info@krishnagaurpersonalityschool.com",
      supportPhone: cfg.supportPhone || "+91 98XXXXXXXX",
      websiteUrl: cfg.websiteUrl || "https://krishnagaurpersonalityschool.com",
      officeAddress: cfg.officeAddress || "Krishna Gaur Personality School, India"
    };

    Object.keys(map).forEach(function (key) {
      document.querySelectorAll('[data-config="' + key + '"]').forEach(function (el) {
        el.textContent = map[key];
        if (el.tagName === "A" && key === "supportEmail") {
          el.href = "mailto:" + map[key];
        }
      });
    });

    document.querySelectorAll('[data-config="whatsappLink"]').forEach(function (el) {
      if (cfg.whatsappGroupUrl) {
        el.href = cfg.whatsappGroupUrl;
      }
    });

    if (cfg.seatLimitNoticeEnabled === false) {
      document.querySelectorAll(".form-seat-line, [data-seat-limit]").forEach(function (el) {
        el.style.display = "none";
      });
    }

    // Headline Split-Test (A / B / C)
    var variant = (getUrlParam("v") || cfg.headlineVariant || "A").toUpperCase();
    var heroHeadline = document.getElementById("hero-headline");
    if (heroHeadline && cfg.headlines && cfg.headlines[variant]) {
      if (variant === "A") {
        heroHeadline.innerHTML =
          'Stop Freezing in English. Discover the Speaking Grammar Nobody Taught You in This <span class="accent-text">2-Day Live Webinar.</span>';
      } else {
        heroHeadline.textContent = cfg.headlines[variant];
      }
    }
    window.__ACTIVE_HEADLINE_VARIANT__ = variant;
  }

  // 2. Meta Pixel Loader
  function initMetaPixel() {
    var pixelId = (cfg.metaPixelId || "").trim();
    if (!pixelId) return;

    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */

    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }

  // 3. Single-Page Pop-Up Modals
  var lastFocusedElement = null;

  function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;

    document.querySelectorAll(".modal-backdrop.is-open").forEach(function (m) {
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
    });

    lastFocusedElement = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    var firstInput = modal.querySelector("input");
    if (firstInput) {
      setTimeout(function () {
        firstInput.focus();
      }, 60);
    } else {
      var closeBtn = modal.querySelector(".modal-close");
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-backdrop.is-open").forEach(function (m) {
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
    });
    document.body.classList.remove("modal-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function initModals() {
    document.querySelectorAll("[data-open-modal]").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(trigger.getAttribute("data-open-modal"));
      });
    });

    document.querySelectorAll(".modal-close").forEach(function (btn) {
      btn.addEventListener("click", closeAllModals);
    });

    document.querySelectorAll(".modal-backdrop").forEach(function (backdrop) {
      backdrop.addEventListener("click", function (e) {
        if (e.target === backdrop) {
          closeAllModals();
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeAllModals();
      }
    });
  }

  // 4. Phone & Email Validation
  function normalizePhone(raw) {
    var cleaned = raw.replace(/[\s\-().]/g, "");
    if (/^[6-9]\d{9}$/.test(cleaned)) {
      return "+91" + cleaned;
    }
    if (/^0[6-9]\d{9}$/.test(cleaned)) {
      return "+91" + cleaned.slice(1);
    }
    if (/^91[6-9]\d{9}$/.test(cleaned)) {
      return "+" + cleaned;
    }
    return cleaned;
  }

  function isValidPhone(raw) {
    var digits = raw.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function isValidEmail(raw) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());
  }

  function showFieldError(input, message) {
    input.classList.add("is-invalid");
    var errEl = input.parentElement.querySelector(".field-error");
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.add("visible");
    }
  }

  function clearFieldError(input) {
    input.classList.remove("is-invalid");
    var errEl = input.parentElement.querySelector(".field-error");
    if (errEl) {
      errEl.textContent = "";
      errEl.classList.remove("visible");
    }
  }

  // 5. Send Lead to GoHighLevel (GHL)
  async function sendToGHL(payload) {
    var requests = [];

    if (cfg.ghlWebhookUrl && cfg.ghlWebhookUrl.trim()) {
      var webhookUrl = cfg.ghlWebhookUrl.trim();
      var jsonBody = JSON.stringify(payload);

      requests.push(
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: jsonBody,
          keepalive: true
        }).catch(function () {
          return fetch(webhookUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            body: jsonBody,
            keepalive: true
          });
        })
      );
    }

    if (cfg.ghlFormUrl && cfg.ghlFormUrl.trim()) {
      var formBody = new URLSearchParams({
        full_name: payload.name,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        phone: payload.phone
      });

      requests.push(
        fetch(cfg.ghlFormUrl.trim(), {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody.toString(),
          keepalive: true
        })
      );
    }

    if (requests.length === 0) {
      console.info(
        "[GHL Demo Mode] Set ghlWebhookUrl in js/config.js to send live leads. Captured:",
        payload
      );
      return;
    }

    await Promise.allSettled(requests);
  }

  // 6. Bind All Identical 3-Field Forms
  function initForms() {
    var forms = document.querySelectorAll(".ghl-form");
    if (!forms.length) return;

    forms.forEach(function (form) {
      form.querySelectorAll("input").forEach(function (inp) {
        inp.addEventListener("input", function () {
          clearFieldError(inp);
        });
      });

      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        var nameInput = form.querySelector('input[name="name"]');
        var phoneInput = form.querySelector('input[name="phone"]');
        var emailInput = form.querySelector('input[name="email"]');
        var submitBtn = form.querySelector('button[type="submit"]');
        var statusBox = form.parentElement.querySelector(".form-status");

        if (statusBox) {
          statusBox.className = "form-status";
          statusBox.textContent = "";
        }

        var nameVal = nameInput.value.trim();
        var phoneVal = phoneInput.value.trim();
        var emailVal = emailInput.value.trim();

        var hasError = false;
        if (nameVal.length < 2) {
          showFieldError(nameInput, "Please enter your full name.");
          hasError = true;
        }
        if (!isValidPhone(phoneVal)) {
          showFieldError(phoneInput, "Please enter a valid 10-digit WhatsApp number.");
          hasError = true;
        }
        if (!isValidEmail(emailVal)) {
          showFieldError(emailInput, "Please enter a valid email address.");
          hasError = true;
        }
        if (hasError) return;

        var parts = nameVal.split(/\s+/);
        var firstName = parts[0] || nameVal;
        var lastName = parts.slice(1).join(" ");
        var normalizedPhone = normalizePhone(phoneVal);

        var payload = {
          name: nameVal,
          first_name: firstName,
          last_name: lastName,
          phone: normalizedPhone,
          whatsapp_number: normalizedPhone,
          email: emailVal,
          academy: cfg.academyName || "Krishna Gaur Personality School",
          source: "Spoken English 2-Day Live Webinar",
          form_location: form.dataset.formLocation || "landing-page",
          headline_variant: window.__ACTIVE_HEADLINE_VARIANT__ || "A",
          utm_source: getUrlParam("utm_source") || "",
          utm_medium: getUrlParam("utm_medium") || "",
          utm_campaign: getUrlParam("utm_campaign") || "",
          page_url: window.location.href,
          submitted_at: new Date().toISOString()
        };

        var originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Booking Your Seat...";

        try {
          await sendToGHL(payload);

          if (typeof window.fbq === "function") {
            window.fbq("track", "Lead", {
              content_name: "Spoken English 2-Day Live Webinar",
              form_location: payload.form_location
            });
            window.fbq("track", "CompleteRegistration", {
              content_name: "Spoken English 2-Day Live Webinar"
            });
          }

          var tyNameEl = document.getElementById("ty-registrant-name");
          if (tyNameEl) {
            tyNameEl.textContent = ", " + firstName;
          }

          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;

          openModal("modal-thank-you");
        } catch (err) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          if (statusBox) {
            statusBox.className = "form-status is-error";
            statusBox.textContent =
              "Something went wrong while booking your seat. Please try again.";
          }
        }
      });
    });
  }

  // 7. Interactive 10-Second CLT Pattern Demo
  function initCltDemo() {
    var preview = document.getElementById("clt-live-sentence");
    var chips = document.querySelectorAll(".clt-chip");
    if (!preview || !chips.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.classList.remove("is-active");
        });
        chip.classList.add("is-active");
        preview.innerHTML = "<span>I want to</span> " + chip.dataset.ending;
      });
    });
  }

  // 8. Sticky Mobile CTA Visibility
  function initStickyMobileCta() {
    var stickyBar = document.getElementById("mobile-sticky-cta");
    var heroAnchor = document.getElementById("hero-cta-block") || document.querySelector(".hero");
    if (!stickyBar || !heroAnchor) return;

    function toggleSticky() {
      var rect = heroAnchor.getBoundingClientRect();
      if (rect.bottom < 0) {
        stickyBar.classList.add("is-visible");
      } else {
        stickyBar.classList.remove("is-visible");
      }
    }

    window.addEventListener("scroll", toggleSticky, { passive: true });
    toggleSticky();
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyConfigValues();
    initMetaPixel();
    initModals();
    initForms();
    initCltDemo();
    initStickyMobileCta();
  });
})();
