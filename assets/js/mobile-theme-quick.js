(() => {
  const ready = (fn) => document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", fn, { once: true })
    : fn();

  ready(() => {
    const nav = document.querySelector(".nav-links");
    if (!nav || document.querySelector("#mobileThemeSystem")) return;

    const THEME_KEY = "cbc-theme";
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const desktopToggle = document.querySelector("#themeToggle");

    const systemButton = document.createElement("button");
    systemButton.type = "button";
    systemButton.id = "mobileThemeSystem";
    systemButton.className = "mobile-theme-quick mobile-theme-system";
    systemButton.setAttribute("aria-label", "Follow phone theme");
    systemButton.setAttribute("title", "Follow phone theme");
    systemButton.setAttribute("aria-pressed", "false");
    systemButton.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6.4" y="2.8" width="11.2" height="18.4" rx="2.4"></rect>
        <path d="M10 5.4h4"></path>
        <path d="M11.25 18.45h1.5"></path>
      </svg>`;

    const darkButton = document.createElement("button");
    darkButton.type = "button";
    darkButton.id = "mobileThemeDark";
    darkButton.className = "mobile-theme-quick mobile-theme-dark";
    darkButton.setAttribute("aria-label", "Dark mode");
    darkButton.setAttribute("title", "Dark mode");
    darkButton.setAttribute("aria-pressed", "false");
    darkButton.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 15.2A8.15 8.15 0 0 1 8.8 4a8.45 8.45 0 1 0 11.2 11.2Z"></path>
      </svg>`;

    const anchor = document.querySelector(".mobile-menu-toggle", nav) || document.querySelector(".nav-apply", nav);
    nav.insertBefore(systemButton, anchor || null);
    nav.insertBefore(darkButton, anchor || null);

    function currentPreference() {
      try { return localStorage.getItem(THEME_KEY) || document.documentElement.dataset.themePreference || "system"; }
      catch (_) { return document.documentElement.dataset.themePreference || "system"; }
    }

    function resolvedTheme(pref) {
      if (pref === "dark" || pref === "light") return pref;
      return media.matches ? "dark" : "light";
    }

    function syncButtons() {
      const pref = document.documentElement.dataset.themePreference || currentPreference();
      systemButton.setAttribute("aria-pressed", String(pref === "system"));
      darkButton.setAttribute("aria-pressed", String(pref === "dark"));
    }

    function syncDesktopToggle(pref, actual) {
      if (!desktopToggle) return;
      const label = desktopToggle.querySelector(".theme-label");
      const icon = desktopToggle.querySelector(".theme-icon");
      const text = pref === "system" ? "System" : (pref === "dark" ? "Dark" : "Light");
      if (label) label.textContent = text;
      if (icon) icon.textContent = pref === "system" ? "◐" : (actual === "dark" ? "☾" : "☀");
      desktopToggle.title = "Theme: " + text + " · tap to change";
      desktopToggle.setAttribute("aria-label", "Theme: " + text + ". Tap to change.");
    }

    function applyPreference(pref) {
      const actual = resolvedTheme(pref);
      try { localStorage.setItem(THEME_KEY, pref); } catch (_) {}
      document.documentElement.dataset.themePreference = pref;
      document.documentElement.dataset.theme = actual;
      syncDesktopToggle(pref, actual);
      syncButtons();
    }

    systemButton.addEventListener("click", () => applyPreference("system"));
    darkButton.addEventListener("click", () => applyPreference("dark"));

    media.addEventListener?.("change", () => {
      if (currentPreference() === "system") applyPreference("system");
    });

    if ("MutationObserver" in window) {
      new MutationObserver(syncButtons).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "data-theme-preference"]
      });
    }

    syncButtons();
  });
})();
