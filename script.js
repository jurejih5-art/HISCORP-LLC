// Website interactions: responsive navigation and contact form.
(() => {
  const year = document.querySelectorAll("[data-year]");
  year.forEach(el => el.textContent = new Date().getFullYear());

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuToggle.textContent = open ? "×" : "☰";
    });
  }

  const form = document.getElementById("contactForm");
  if (form) {
    const status = document.getElementById("formStatus");
    const button = document.getElementById("contactSubmit");
    const show = (type, message) => {
      if (!status) return;
      status.classList.remove("form-status-success", "form-status-error");
      status.classList.add(type === "ok" ? "form-status-success" : "form-status-error");
      status.textContent = message;
    };

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      if (!/^https?:$/.test(window.location.protocol)) {
        show("error", "Please open the published website to send your enquiry.");
        return;
      }

      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      show("pending", "Sending your message…");

      try {
        // FormSubmit's AJAX endpoint expects a JSON request for its documented fetch flow.
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());
        const response = await fetch("https://formsubmit.co/ajax/info@hiscorp-gov.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        const accepted = response.ok && result && String(result.success).toLowerCase() === "true";

        if (!accepted) {
          throw new Error((result && result.message) || ("The email service returned status " + response.status));
        }

        form.reset();
        show("ok", "Thanks! Your enquiry has been sent successfully. We will reply soon.");
      } catch (error) {
        console.error("Contact form error:", error);
        show("error", error && error.message
          ? "Your enquiry was not sent: " + error.message + ". Please contact info@hiscorp-gov.com if the problem continues."
          : "Your enquiry could not be sent right now. Please try again later or contact info@hiscorp-gov.com.");
      } finally {
        if (button) { button.disabled = false; button.textContent = "Send Message →"; }
      }
    });
  }
})();

  // Stagger the homepage service cards into view, and provide a tactile
  // highlight for touchscreens without leaving a sticky hover state.
  const serviceCards = Array.from(document.querySelectorAll(".cards-grid .service-card, .partner-card"));
  if (serviceCards.length) {
    serviceCards.forEach((card, index) => {
      card.classList.add("reveal-service");
      card.style.setProperty("--service-delay", `${index * 115}ms`);
      // Make the existing card keyboard reachable without changing its links/content.
      if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -35px 0px" });
      serviceCards.forEach(card => observer.observe(card));
    } else {
      serviceCards.forEach(card => card.classList.add("is-visible"));
    }

    const touchTimers = new WeakMap();
    serviceCards.forEach(card => {
      card.addEventListener("pointerdown", event => {
        if (event.pointerType === "touch" || event.pointerType === "pen") {
          card.classList.add("is-touched");
          const oldTimer = touchTimers.get(card);
          if (oldTimer) clearTimeout(oldTimer);
        }
      }, { passive: true });

      const clearTouch = () => {
        const timer = setTimeout(() => card.classList.remove("is-touched"), 650);
        touchTimers.set(card, timer);
      };
      card.addEventListener("pointerup", clearTouch, { passive: true });
      card.addEventListener("pointercancel", clearTouch, { passive: true });
      card.addEventListener("pointerleave", event => {
        if (event.pointerType === "touch" || event.pointerType === "pen") clearTouch();
      }, { passive: true });
      card.addEventListener("click", event => {
        // A tap briefly highlights the card while keeping existing links functional.
        if (event.detail === 0) return;
        card.classList.add("is-touched");
        const oldTimer = touchTimers.get(card);
        if (oldTimer) clearTimeout(oldTimer);
        touchTimers.set(card, setTimeout(() => card.classList.remove("is-touched"), 650));
      });
    });
  }


/* HISCORP title motion: reveal headings on scroll, replay on tap/click. */
(() => {
  const headings = Array.from(document.querySelectorAll(
    "main h1, main h2, main h3, .section-heading h2, .hero h1, .page-hero h1"
  )).filter(el => !el.closest(".service-card") && !el.closest(".value-item"));
  headings.forEach(el => {
    el.classList.add("title-motion");
    el.setAttribute("data-title-motion", "true");
  });
  const replay = el => {
    el.classList.remove("title-motion-tap");
    void el.offsetWidth;
    el.classList.add("title-motion-tap");
    window.setTimeout(() => el.classList.remove("title-motion-tap"), 760);
  };
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("title-motion-visible");
        } else {
          entry.target.classList.remove("title-motion-visible");
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -45px 0px" });
    headings.forEach(el => observer.observe(el));
  } else {
    headings.forEach(el => el.classList.add("title-motion-visible"));
  }
  headings.forEach(el => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => replay(el));
    el.addEventListener("pointerdown", event => {
      if (event.pointerType === "touch" || event.pointerType === "pen") replay(el);
    }, { passive: true });
    el.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") replay(el);
    });
  });
})();

/* v3: pre-fill contact form service from ?service=, back-to-top button */
(() => {
  const sel = document.getElementById("service");
  if (sel) {
    const want = new URLSearchParams(location.search).get("service");
    if (want) {
      const opt = Array.from(sel.options).find(o => o.value === want || o.text === want);
      if (opt) sel.value = opt.value;
    }
  }
  const top = document.getElementById("toTop");
  if (top) {
    const toggle = () => top.classList.toggle("show", window.scrollY > 600);
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
})();
