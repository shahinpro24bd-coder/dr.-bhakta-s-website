/* Site-wide motion layer: scroll reveals, progress bar, nav state, counters. */
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    /* ---------- mark elements for reveal ---------- */
    var selectors = [
      ".row > [class*='col-']",
      ".service-item", ".team-item", ".testimonial-item", ".testimonial-card",
      ".blog-item", ".chamber-card", ".gallery-item", ".feature-item",
      ".qual-card", ".membership-card", ".card",
      "h1", "h2", "h3", "p.section-title",
      ".container > p", ".container > .text-center",
      "form", "iframe", "table"
    ];

    var seen = new Set();
    selectors.forEach(function (sel) {
      var nodes;
      try { nodes = document.querySelectorAll(sel); } catch (e) { return; }
      nodes.forEach(function (el) {
        if (seen.has(el)) return;
        if (el.classList.contains("wow")) return;           // WOW.js owns these
        if (el.closest("[data-ex-reveal], .wow")) return;
        if (el.closest(".navbar, .modal, .lightbox, .owl-carousel, .header-carousel, #exTop, footer .footer-bottom")) return;
        if (el.getBoundingClientRect().height === 0) return;
        seen.add(el);
        el.setAttribute("data-ex-reveal", "");
      });
    });


    /* stagger siblings a bit */
    document.querySelectorAll(".row").forEach(function (row) {
      var kids = row.querySelectorAll(":scope > [data-ex-reveal]");
      kids.forEach(function (kid, i) {
        kid.style.setProperty("--ex-delay", Math.min(i, 5) * 90 + "ms");
      });
    });

    /* heading underline accent */
    document.querySelectorAll("section h2, .container-xxl h2, .container-xxl h1.display-6").forEach(function (h) {
      h.classList.add("ex-heading-line");
    });

    var items = document.querySelectorAll("[data-ex-reveal]");

    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("ex-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("ex-in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      items.forEach(function (el) { io.observe(el); });
      document.querySelectorAll(".ex-heading-line").forEach(function (el) { io.observe(el); });
    }

    /* ---------- scroll progress ---------- */
    var bar = document.createElement("div");
    bar.id = "exProgress";
    document.body.appendChild(bar);

    /* ---------- back to top ---------- */
    var top = document.createElement("button");
    top.id = "exTop";
    top.type = "button";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(top);
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });

    var nav = document.querySelector(".navbar");

    function onScroll() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var y = window.scrollY || window.pageYOffset;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      top.classList.toggle("ex-show", y > 400);
      if (nav) nav.classList.toggle("ex-nav-scrolled", y > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- animated counters ---------- */
    var counters = document.querySelectorAll("[data-toggle='counter-up'], .counter-value, [data-ex-count]");
    if (counters.length && !reduced && "IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          cio.unobserve(el);
          var raw = (el.textContent || "").trim();
          var target = parseFloat(raw.replace(/[^\d.]/g, ""));
          if (!isFinite(target) || target === 0) return;
          var suffix = raw.replace(/[\d.,\s]/g, "");
          var start = performance.now();
          var dur = 1400;
          (function step(now) {
            var p = Math.min((now - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
          })(start);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }

    /* ---------- gentle float for hero art & pulse for call buttons ---------- */
    var heroImg = document.querySelector(".hero20 img, .hero-header img, .header-carousel img");
    if (heroImg && !reduced) heroImg.classList.add("ex-float");

    document.querySelectorAll('a[href^="tel:"].btn').forEach(function (el) {
      el.classList.add("ex-pulse");
    });
  });
})();
