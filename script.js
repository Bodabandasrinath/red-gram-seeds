// script.js - Interactive behaviors, language switcher & WhatsApp enquiry generator

(function () {
  // Current active language: default to saved preference or 'en'
  let currentLang = localStorage.getItem("rg_lang") || "en";

  // Initialize copyright year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Update DOM with translations
  function setLanguage(lang) {
    if (!translations[lang]) lang = "en";
    currentLang = lang;
    localStorage.setItem("rg_lang", lang);

    document.documentElement.lang = lang;
    if (lang === "te") {
      document.body.classList.add("lang-te");
    } else {
      document.body.classList.remove("lang-te");
    }

    // Update active class on language toggle buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const targetLang = btn.getAttribute("data-lang");
      if (targetLang === lang) {
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      }
    });

    const dict = translations[lang] || translations.en;

    // Update text / innerHTML for elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = dict[key] || translations.en[key];
      if (val !== undefined) {
        // If translation contains HTML tags (like <span>, <strong>, <br>), use innerHTML
        if (/<[a-z][\s\S]*>/i.test(val)) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update attributes like placeholder or title
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const attrSpec = el.getAttribute("data-i18n-attr"); // format: "placeholder:calc.villagePlaceholder"
      const parts = attrSpec.split(",");
      parts.forEach((part) => {
        const [attr, key] = part.split(":").map((s) => s.trim());
        const val = dict[key] || translations.en[key];
        if (attr && val) {
          el.setAttribute(attr, val);
        }
      });
    });

    // Update WhatsApp links default greetings
    updateWhatsAppLinks(lang);
  }

  // Update dynamic WhatsApp inquiry links based on language
  function updateWhatsAppLinks(lang) {
    const dict = translations[lang] || translations.en;

    // General enquiry links
    document.querySelectorAll(".wa-general-link").forEach((link) => {
      const phone = link.getAttribute("data-phone") || "919490337029";
      const text = encodeURIComponent(dict["wa.general"]);
      link.href = `https://wa.me/${phone}?text=${text}`;
    });

    // Dhanalakshmi specific links
    document.querySelectorAll(".wa-dhana-link").forEach((link) => {
      const phone = link.getAttribute("data-phone") || "919490337029";
      const text = encodeURIComponent(dict["wa.dhana"]);
      link.href = `https://wa.me/${phone}?text=${text}`;
    });

    // Lakshmi specific links
    document.querySelectorAll(".wa-lakshmi-link").forEach((link) => {
      const phone = link.getAttribute("data-phone") || "919490337029";
      const text = encodeURIComponent(dict["wa.lakshmi"]);
      link.href = `https://wa.me/${phone}?text=${text}`;
    });
  }

  // Bind language toggle buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const chosenLang = btn.getAttribute("data-lang");
      setLanguage(chosenLang);
    });
  });

  // Mobile menu toggle
  const menuBtn = document.querySelector(".menu");
  const navEl = document.querySelector(".nav nav");
  if (menuBtn && navEl) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navEl.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when clicking any nav link
    navEl.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navEl.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Lightbox functionality for seed photos
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src, captionText) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = captionText || "";
    lightboxModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }
  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  document.querySelectorAll(".zoomable-img").forEach((img) => {
    img.addEventListener("click", () => {
      const src = img.getAttribute("src");
      const caption = img.getAttribute("data-caption") || img.getAttribute("alt") || "";
      openLightbox(src, caption);
    });
  });

  // Interactive Availability Form (on availability.html)
  const calcForm = document.getElementById("avail-calc-form");
  if (calcForm) {
    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const seedRadios = document.getElementsByName("calc_seed");
      let selectedSeed = "Both Dhanalakshmi & Lakshmi";
      for (const radio of seedRadios) {
        if (radio.checked) {
          selectedSeed = radio.value;
          break;
        }
      }

      const qtySelect = document.getElementById("calc_qty");
      const qty = qtySelect ? qtySelect.value : "50 kg (1 Bag)";

      const locInput = document.getElementById("calc_village");
      const loc = locInput && locInput.value.trim() ? locInput.value.trim() : (currentLang === "te" ? "మా గ్రామం" : "Nearby Village");

      const dict = translations[currentLang] || translations.en;
      let msg = dict["wa.customTemplate"]
        .replace("{seed}", selectedSeed)
        .replace("{qty}", qty)
        .replace("{loc}", loc);

      const phone = "919490337029";
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank");
    });
  }

  // Initial language application on page load
  document.addEventListener("DOMContentLoaded", () => {
    setLanguage(currentLang);
  });
  // Execute immediately if DOM already loaded
  if (document.readyState === "interactive" || document.readyState === "complete") {
    setLanguage(currentLang);
  }

  // Expose global helper if needed
  window.changeSiteLanguage = setLanguage;
})();
