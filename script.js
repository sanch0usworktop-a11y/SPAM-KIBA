function formatRuNumber(n) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(n));
}

function setupMobileMenu() {
  const burger = document.querySelector(".burger");
  const mobile = document.querySelector("[data-mobile]");
  if (!burger || !mobile) return;

  const setOpen = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    mobile.hidden = !open;
    document.documentElement.style.overflow = open ? "hidden" : "";
  };

  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    setOpen(open);
  });

  mobile.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) setOpen(false);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function setupMarquee() {
  const track = document.querySelector("[data-marquee]");
  const clone = document.querySelector(".marquee__track--clone");
  const wrap = document.querySelector("[data-marquee-wrap]");
  if (!track || !clone || !wrap) return;

  clone.innerHTML = track.innerHTML;
  const width = track.scrollWidth;
  track.style.minWidth = `${width}px`;
  clone.style.minWidth = `${width}px`;
  wrap.style.display = "flex";
}

function setupReveal() {
  const nodes = Array.from(document.querySelectorAll(".reveal"));
  if (!nodes.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in-view");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
  );

  nodes.forEach((n) => io.observe(n));
}

function animateCounters() {
  const spans = Array.from(document.querySelectorAll("[data-count]"));
  if (!spans.length) return;

  const startCounter = (el) => {
    const target = Number(el.getAttribute("data-count"));
    if (!Number.isFinite(target)) return;

    const isIntish = Math.abs(target - Math.round(target)) < 0.001;
    const duration = 950;
    const start = performance.now();

    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;

      if (isIntish) {
        el.textContent = formatRuNumber(value);
      } else {
        el.textContent = (Math.round(value * 10) / 10).toLocaleString("ru-RU");
      }

      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        startCounter(e.target);
        io.unobserve(e.target);
      }
    },
    { threshold: 0.35 },
  );

  spans.forEach((s) => io.observe(s));
}

function setupBillingToggle() {
  const btn = document.querySelector("[data-billing]");
  const priceEls = Array.from(document.querySelectorAll("[data-price]"));
  if (!btn || !priceEls.length) return;

  const apply = (yearly) => {
    btn.setAttribute("aria-pressed", String(yearly));
    for (const el of priceEls) {
      const base = Number(el.getAttribute("data-price"));
      const monthly = base;
      const yearlyPrice = Math.round(base * 12 * 0.8);
      const value = yearly ? yearlyPrice : monthly;
      el.textContent = formatRuNumber(value);

      const per = el.closest(".price__value")?.querySelector(".price__per");
      if (per) per.textContent = yearly ? "/год" : "/мес";
    }
  };

  btn.addEventListener("click", () => {
    const yearly = btn.getAttribute("aria-pressed") !== "true";
    apply(yearly);
  });
}

function setupCtaForm() {
  const form = document.querySelector(".final__form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type='email']");
    if (!input) return;
    if (!input.reportValidity()) return;

    const prev = form.querySelector("[data-toast]");
    if (prev) prev.remove();

    const toast = document.createElement("div");
    toast.setAttribute("data-toast", "1");
    toast.style.marginTop = "2px";
    toast.style.padding = "10px 12px";
    toast.style.borderRadius = "16px";
    toast.style.border = "1px solid rgba(255,255,255,.22)";
    toast.style.background = "rgba(255,255,255,.14)";
    toast.style.color = "rgba(255,255,255,.92)";
    toast.style.lineHeight = "1.4";
    toast.textContent = "Спасибо! Мы отправили письмо с деталями аудита (демо-режим).";
    form.appendChild(toast);

    input.value = "";
  });
}

function setupYear() {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}

function setupFaqHeights() {
  // Smooth height animation: set max-height to measured content when opened.
  const items = Array.from(document.querySelectorAll(".faq__item"));
  if (!items.length) return;

  const refresh = (item) => {
    const content = item.querySelector(".faq__content");
    if (!content) return;
    if (item.open) content.style.maxHeight = `${content.scrollHeight}px`;
    else content.style.maxHeight = "0px";
  };

  items.forEach((item) => {
    refresh(item);
    item.addEventListener("toggle", () => refresh(item));
  });

  window.addEventListener("resize", () => items.forEach(refresh), { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  setupYear();
  setupMobileMenu();
  setupMarquee();
  setupReveal();
  animateCounters();
  setupBillingToggle();
  setupFaqHeights();
  setupCtaForm();
});

