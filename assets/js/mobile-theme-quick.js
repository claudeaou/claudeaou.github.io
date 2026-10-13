(() => {
  const ready = (fn) => document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", fn, { once: true })
    : fn();

  ready(() => {
    const nav = document.querySelector(".nav-links");
    if (!nav) return;

    const THEME_KEY = "cbc-theme";
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const desktopToggle = document.querySelector("#themeToggle");

    // Remove the old phone/system shortcut from earlier releases, even if an
    // older cached script inserted it before this module loaded.
    document.querySelectorAll("#mobileThemeSystem,.mobile-theme-system").forEach((el) => el.remove());

    let darkButton = document.querySelector("#mobileThemeDark");
    if (!darkButton) {
      darkButton = document.createElement("button");
      darkButton.type = "button";
      darkButton.id = "mobileThemeDark";
      darkButton.className = "mobile-theme-quick mobile-theme-dark";
      darkButton.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 15.2A8.15 8.15 0 0 1 8.8 4a8.45 8.45 0 1 0 11.2 11.2Z"></path>
        </svg>`;

      const anchor = document.querySelector(".mobile-menu-toggle", nav) || document.querySelector(".nav-apply", nav);
      nav.insertBefore(darkButton, anchor || null);
    }

    function getStoredPreference() {
      try { return localStorage.getItem(THEME_KEY) || root.dataset.themePreference || "system"; }
      catch (_) { return root.dataset.themePreference || "system"; }
    }

    function resolveTheme(pref) {
      if (pref === "dark" || pref === "light") return pref;
      return media.matches ? "dark" : "light";
    }

    function updateThemeColor(actual) {
      const value = actual === "dark" ? "#141413" : "#faf9f5";
      let meta = document.querySelector('meta[name="theme-color"][data-cbc-runtime-theme]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.dataset.cbcRuntimeTheme = "true";
        document.head.appendChild(meta);
      }
      meta.content = value;
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
      const actual = root.dataset.theme || resolveTheme(getStoredPreference());
      const isDark = actual === "dark";
      darkButton.setAttribute("aria-pressed", String(isDark));
      darkButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      darkButton.setAttribute("title", isDark ? "Light mode" : "Dark mode");
    }

    function applyExplicitTheme(actual) {
      const pref = actual === "dark" ? "dark" : "light";
      try { localStorage.setItem(THEME_KEY, pref); } catch (_) {}
      root.dataset.themePreference = pref;
      root.dataset.theme = pref;
      root.style.colorScheme = pref;
      updateThemeColor(pref);
      syncDesktopToggle(pref, pref);
      syncButton();
      window.dispatchEvent(new CustomEvent("cbc:themechange", { detail: { theme: pref } }));
    }

    function toggleDarkMode(event) {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      const current = root.dataset.theme || resolveTheme(getStoredPreference());
      applyExplicitTheme(current === "dark" ? "light" : "dark");
    }

    // Replace any handler that may have been attached by an older cached copy.
    const cleanButton = darkButton.cloneNode(true);
    darkButton.replaceWith(cleanButton);
    darkButton = cleanButton;
    darkButton.addEventListener("click", toggleDarkMode, { passive: false });

    media.addEventListener?.("change", () => {
      if (getStoredPreference() === "system") {
        root.dataset.theme = media.matches ? "dark" : "light";
        updateThemeColor(root.dataset.theme);
        syncButton();
      }
    });

    if ("MutationObserver" in window) {
      new MutationObserver(() => {
        document.querySelectorAll("#mobileThemeSystem,.mobile-theme-system").forEach((el) => el.remove());
        syncButton();
      }).observe(root, {
        attributes: true,
        attributeFilter: ["data-theme", "data-theme-preference"]
      });
    }

    syncButton();
  });
})();
