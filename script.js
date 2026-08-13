/* =========================================================
   Ooramana Heritage Tours — Shared Site Script
   ========================================================= */

/* ---------- Config ---------- */
/* Replace with the real WhatsApp business number in international
   format, digits only, no + or leading zeros (e.g. 919876543210) */
const WHATSAPP_NUMBER = "919999999999";

const PACKAGE_PRICES = {
  half: { label: "Half-Day Trail", price: 1200 },
  full: { label: "Full-Day Immersion", price: 2500 },
};

/* ---------- Mobile nav toggle ---------- */
(function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
    });
  });
})();

/* ---------- Scroll reveal animation ---------- */
(function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* ---------- FAQ Accordion ---------- */
(function initAccordion() {
  const triggers = document.querySelectorAll(".acc-trigger");
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".acc-item");
      const panel = item.querySelector(".acc-panel");
      const isOpen = item.classList.contains("open");

      // Close all other panels (single-open accordion)
      document.querySelectorAll(".acc-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".acc-panel").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        panel.style.maxHeight = null;
      } else {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
})();

/* ---------- Testimonial carousel (simple auto-rotate on mobile dots, if present) ---------- */
(function initTestimonialDots() {
  const dots = document.querySelectorAll(".testi-dot");
  const cards = document.querySelectorAll(".testi-card[data-slide]");
  if (!dots.length || !cards.length) return;

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const slide = dot.dataset.slide;
      cards.forEach((c) => c.classList.toggle("active", c.dataset.slide === slide));
      dots.forEach((d) => d.classList.toggle("active", d === dot));
    });
  });
})();

/* ---------- Booking price calculator + WhatsApp submission ---------- */
(function initBooking() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const guestsEl = document.getElementById("guests");
  const packageEl = document.getElementById("package");
  const nameEl = document.getElementById("full-name");
  const dateEl = document.getElementById("pref-date");
  const notesEl = document.getElementById("special-requests");

  const lineGuests = document.getElementById("line-guests");
  const linePackage = document.getElementById("line-package");
  const linePerPerson = document.getElementById("line-per-person");
  const totalAmount = document.getElementById("total-amount");

  function currency(n) {
    return "₹" + n.toLocaleString("en-IN");
  }

  function calculate() {
    const guests = parseInt(guestsEl.value, 10) || 1;
    const pkgKey = packageEl.value;
    const pkg = PACKAGE_PRICES[pkgKey] || PACKAGE_PRICES.half;
    const total = pkg.price * guests;

    lineGuests.textContent = guests;
    linePackage.textContent = pkg.label;
    linePerPerson.textContent = currency(pkg.price);
    totalAmount.textContent = currency(total);

    return { guests, pkg, total };
  }

  guestsEl.addEventListener("change", calculate);
  packageEl.addEventListener("change", calculate);
  calculate();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!nameEl.value.trim() || !dateEl.value) {
      alert("Please fill in your name and preferred date so we can confirm availability.");
      return;
    }

    const { guests, pkg, total } = calculate();
    const name = nameEl.value.trim();
    const date = dateEl.value;
    const notes = notesEl.value.trim() || "None";

    const message =
      `Namaste! I'd like to book an Ooramana Heritage Tour.\n\n` +
      `👤 Name: ${name}\n` +
      `📅 Preferred Date: ${date}\n` +
      `🧍 Guests: ${guests}\n` +
      `🌿 Package: ${pkg.label}\n` +
      `💰 Estimated Total: ${currency(total)} (${currency(pkg.price)} x ${guests})\n` +
      `📝 Special Requests: ${notes}\n\n` +
      `Please confirm availability. Thank you!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });
})();

/* ---------- Active nav link highlighting ---------- */
(function initActiveLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
})();

/* ---------- Set minimum bookable date to today ---------- */
(function initDateMin() {
  const dateEl = document.getElementById("pref-date");
  if (!dateEl) return;
  const today = new Date().toISOString().split("T")[0];
  dateEl.setAttribute("min", today);
})();
