/* Shared, dependency-free motion for every page. Content is visible by default. */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches || !("IntersectionObserver" in window)) return;
  const targets =
    "main>section>.wrap,main>section>.hero-inner,.section-head,h2,.product-card,.category-card,.article-card,.number-card,.ingredient,.metric-card,.admin-panel,.form-panel,.cta-panel,.split>img,.vision-list li,.history-list li,.auth-card,.order-story,.order-card";
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        const siblings = Array.from(element.parentElement.children).filter((child) =>
          child.matches(targets),
        );
        element.style.setProperty(
          "--fresh-delay",
          `${Math.max(0, Math.min(siblings.indexOf(element), 3)) * 60}ms`,
        );
        element.classList.add("fresh-enter");
        observer.unobserve(element);
      }
    },
    { threshold: 0, rootMargin: "0px 0px -24px 0px" },
  );
  document.querySelectorAll(targets).forEach((element) => observer.observe(element));
  reduced.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    document
      .querySelectorAll(".fresh-enter")
      .forEach((element) => element.classList.remove("fresh-enter"));
  });
})();
