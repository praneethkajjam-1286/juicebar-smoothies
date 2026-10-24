/* Independent appearance controller. Executes before CSS and does not depend on page modules. */
(() => {
  "use strict";
  if (window.CafePreferences) return;
  const root = document.documentElement;
  const media = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : { matches: false };
  const read = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const write = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  };
  let savedTheme = read("juice-theme");
  let manual = savedTheme === "light" || savedTheme === "dark";
  let theme = manual ? savedTheme : media.matches ? "dark" : "light";
  let direction = read("juice-direction") === "rtl" ? "rtl" : "ltr";
  const icons = {
    light:
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>',
    dark: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/></svg>',
  };
  function controls() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const label = "Switch to " + (theme === "dark" ? "light" : "dark") + " theme";
      button.type = "button";
      button.setAttribute("aria-label", label);
      button.title = label;
      button.setAttribute("aria-pressed", String(theme === "dark"));
      const icon = button.querySelector("[data-theme-icon]");
      if (icon) icon.innerHTML = icons[theme === "dark" ? "light" : "dark"];
    });
    document.querySelectorAll("[data-direction]").forEach((button) => {
      const label =
        "Switch to " +
        (direction === "rtl" ? "left-to-right" : "right-to-left") +
        " layout";
      button.type = "button";
      button.setAttribute("aria-label", label);
      button.title = label;
      button.setAttribute("aria-pressed", String(direction === "rtl"));
    });
  }
  function apply() {
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-bs-theme", theme);
    root.setAttribute("dir", direction);
    controls();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && document.readyState !== "loading")
      meta.content = getComputedStyle(root).getPropertyValue("--bg").trim();
  }
  function restore() {
    const saved = read("juice-theme");
    manual = saved === "light" || saved === "dark";
    theme = manual ? saved : media.matches ? "dark" : "light";
    direction = read("juice-direction") === "rtl" ? "rtl" : "ltr";
    apply();
  }
  function reset() {
    manual = false;
    theme = media.matches ? "dark" : "light";
    direction = "ltr";
    apply();
  }
  // Delegation keeps controls functional even when a page module fails or loads late.
  document.addEventListener("click", (event) => {
    const target =
      event.target instanceof Element
        ? event.target.closest("[data-theme-toggle],[data-direction]")
        : null;
    if (!target || target.disabled) return;
    event.preventDefault();
    if (target.hasAttribute("data-theme-toggle")) {
      theme = theme === "dark" ? "light" : "dark";
      manual = true;
      write("juice-theme", theme);
    } else {
      direction = direction === "rtl" ? "ltr" : "rtl";
      write("juice-direction", direction);
    }
    apply();
  });
  window.addEventListener("storage", (event) => {
    if (
      event.key === null ||
      event.key === "juice-theme" ||
      event.key === "juice-direction"
    )
      restore();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) restore();
    else apply();
  });
  const followSystem = (event) => {
    if (!manual) {
      theme = event.matches ? "dark" : "light";
      apply();
    }
  };
  if (media.addEventListener) media.addEventListener("change", followSystem);
  else if (media.addListener) media.addListener(followSystem);
  window.CafePreferences = { restore, reset };
  apply();
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", apply, { once: true });
})();
