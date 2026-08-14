/* =========================================================
   Ooramana Heritage Tours — Cinematic Kerala Luxury (JS)
   ========================================================= */

/* ---------- Config ---------- */
/* Replace with the real WhatsApp business number in international
   format, digits only, no + or leading zeros (e.g. 919876543210) */
const WHATSAPP_NUMBER = "919999999999";

const PACKAGE_PRICES = {
  half: { label: "Half-Day Trail", price: 1200 },
  full: { label: "Full-Day Immersion", price: 2500 },
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Glass navbar on scroll ---------- */
(function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  function update() {
    if (navbar.classList.contains("solid")) {
      navbar.classList.add("scrolled");
      return;
    }
    if (window.scrollY > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
})();

/* ---------- Mobile nav toggle ---------- */
(function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
    document.body.style.overflow = links.classList.contains("open") ? "hidden" : "";
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
})();

/* ---------- Hero parallax ---------- */
(function initParallax() {
  const bg = document.querySelector(".hero-bg");
  if (!bg || prefersReducedMotion) return;

  let ticking = false;
  function update() {
    const y = window.scrollY;
    bg.style.transform = `translateY(${y * 0.28}px) scale(1.06)`;
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
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
    { threshold: 0.14, rootMargin: "0px 0px -70px 0px" }
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

/* ---------- Testimonial carousel ---------- */
(function initCarousel() {
  const track = document.querySelector(".carousel-slides");
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");
  const dotsWrap = document.querySelector(".carousel-dots");
  if (!track || !slides.length) return;

  let index = 0;

  // Build dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    if (dotsWrap) {
      dotsWrap.querySelectorAll(".carousel-dot").forEach((d, di) => {
        d.classList.toggle("active", di === index);
      });
    }
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(index + 1));

  // Auto-advance
  let autoTimer = setInterval(() => goTo(index + 1), 6000);
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => clearInterval(autoTimer));
    carousel.addEventListener("mouseleave", () => {
      autoTimer = setInterval(() => goTo(index + 1), 6000);
    });
  }
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
