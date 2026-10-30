/* AI Tools Hub — premium interaction layer
   Safe enhancement: does not replace search, filters, modals, theme or saved-tools logic. */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Add a small progressive reveal to selected content only.
  // If IntersectionObserver is unavailable, content stays visible.
  const revealTargets = [
    ".x-head",
    ".x-card",
    ".x-how__step",
    ".x-totd__card"
  ].join(",");

  const prepareReveal = (scope = document) => {
    if (reduceMotion) return;
    scope.querySelectorAll(revealTargets).forEach((element) => {
      if (element.dataset.premiumReveal === "1") return;
      // Existing reveal system owns elements already marked with x-rv.
      if (element.classList.contains("x-rv")) return;
      element.dataset.premiumReveal = "1";
      element.classList.add("premium-reveal");
      if (observer) observer.observe(element);
    });
  };

  let observer = null;
  if ("IntersectionObserver" in window && !reduceMotion) {
    observer = new IntersectionObserver((entries, io) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("premium-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });
    root.classList.add("premium-ready");
  }

  const init = () => {
    prepareReveal();

    // Tool/category lists are populated dynamically by the existing app.
    ["picks", "bento", "results", "guides"].forEach((id) => {
      const node = document.getElementById(id);
      if (!node || !("MutationObserver" in window)) return;
      const mo = new MutationObserver((records) => {
        records.forEach((record) => {
          record.addedNodes.forEach((added) => {
            if (added.nodeType !== 1) return;
            if (added.matches && added.matches(revealTargets)) {
              prepareReveal(added.parentElement || document);
            } else {
              prepareReveal(added);
            }
          });
        });
      });
      mo.observe(node, { childList: true, subtree: true });
    });

    // Keep anchor navigation predictable with the fixed header.
    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", `#${id}`);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
