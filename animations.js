/* Earlier motion targets are now handled by refinements.js. */

(() => {
  "use strict";
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches || !("IntersectionObserver" in window)) return;
  document.querySelectorAll(".hero-copy").forEach((copy) => {
    Array.from(copy.children).forEach((element, index) =>
      element.style.setProperty("--cafe-delay", `${Math.min(index, 5) * 100}ms`),
    );
  });
  const selector =
    ".section-head,.product-card,.category-card,.article-card,.number-card,.cta-panel,.order-story,.order-card";
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const siblings = Array.from(element.parentElement.children).filter((child) =>
          child.matches(selector),
        );
        element.style.setProperty(
          "--cafe-delay",
          `${Math.min(siblings.indexOf(element), 3) * 90}ms`,
        );
        element.classList.add("cafe-enter");
        observer.unobserve(element);
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll(selector).forEach((element) => observer.observe(element));
  preference.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    document
      .querySelectorAll(".cafe-enter")
      .forEach((element) => element.classList.remove("cafe-enter"));
  });
})();

(() => {
  const button = document.querySelector(".motion-toggle");
  if (!button) return;
  button.addEventListener("click", () => {
    const paused = document.documentElement.dataset.motion !== "paused";
    document.documentElement.dataset.motion = paused ? "paused" : "playing";
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused ? "Resume animation" : "Pause animation";
  });
})();
