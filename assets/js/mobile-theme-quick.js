(() => {
  const ready = (fn) => document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", fn, { once: true })
    : fn();

  ready(() => {
    const nav = document.querySelector(".nav-links");
    if (!nav || document.querySelector("#mobileThemeDark")) return;

    const THEME_KEY = "cbc-theme";
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const desktopToggle = document.querySelector("#themeToggle");

    const darkButton = document.createElement("button");
    darkButton.type = "button";
    darkButton.id = "mobileThemeDark";
    darkButton.className = "mobile-theme-quick mobile-theme-dark";
    darkButton.setAttribute("aria-pressed", "false");
    darkButton.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 15.2A8.15 8.15 0 0 1 8.8 4a8.45 8.45 0 1 0 11.2 11.2Z"></path>
      </svg>`;

    const anchor = document.querySelector(".mobile-menu-toggle", nav) || document.querySelector(".nav-apply", nav);
    nav.insertBefore(darkButton, anchor || null);

    function currentPreference() {
      try { return localStorage.getItem(THEME_KEY) || document.documentElement.dataset.themePreference || "system"; }
      catch (_) { return document.documentElement.dataset.themePreference || "system"; }
    }

    function resolvedTheme(pref) {
      if (pref === "dark" || pref === "light") return pref;
      return media.matches ? "dark" : "light";
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

    function syncButton() {
      const pref = document.documentElement.dataset.themePreference || currentPreference();
      const actual = document.documentElement.dataset.theme || resolvedTheme(pref);
      const isDark = actual === "dark";
      darkButton.setAttribute("aria-pressed", String(isDark));
      darkButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      darkButton.setAttribute("title", isDark ? "Light mode" : "Dark mode");
    }

    function applyPreference(pref) {
      const actual = resolvedTheme(pref);
      try { localStorage.setItem(THEME_KEY, pref); } catch (_) {}
      document.documentElement.dataset.themePreference = pref;
      document.documentElement.dataset.theme = actual;
      syncDesktopToggle(pref, actual);
      syncButton();
    }

    darkButton.addEventListener("click", () => {
      const currentActual = document.documentElement.dataset.theme || resolvedTheme(currentPreference());
      applyPreference(currentActual === "dark" ? "light" : "dark");
    });

    media.addEventListener?.("change", () => {
      if (currentPreference() === "system") {
        document.documentElement.dataset.theme = media.matches ? "dark" : "light";
        syncButton();
      }
    });

    if ("MutationObserver" in window) {
      new MutationObserver(syncButton).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "data-theme-preference"]
      });
    }

    syncButton();
  });
})();
