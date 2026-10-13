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

    document.querySelectorAll("#mobileThemeSystem,.mobile-theme-system").forEach((el) => el.remove());

    let themeButton = document.querySelector("#mobileThemeDark");
    if (!themeButton) {
      themeButton = document.createElement("button");
      themeButton.type = "button";
      themeButton.id = "mobileThemeDark";
      themeButton.className = "mobile-theme-quick mobile-theme-dark";

      const anchor = document.querySelector(".mobile-menu-toggle", nav) || document.querySelector(".nav-apply", nav);
      nav.insertBefore(themeButton, anchor || null);
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

    function setButtonIcon(isDark) {
      themeButton.innerHTML = isDark
        ? `<svg viewBox="0 0 24 24" aria-hidden="true">
             <path d="M20 15.2A8.15 8.15 0 0 1 8.8 4a8.45 8.45 0 1 0 11.2 11.2Z"></path>
           </svg>`
        : `<svg viewBox="0 0 24 24" aria-hidden="true">
             <circle cx="12" cy="12" r="4"></circle>
             <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path>
           </svg>`;
    }

    function syncButton() {
      const actual = root.dataset.theme || resolveTheme(getStoredPreference());
      const isDark = actual === "dark";
      setButtonIcon(isDark);
      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      themeButton.setAttribute("title", isDark ? "Dark mode · switch to light" : "Light mode · switch to dark");
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

    function toggleTheme(event) {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      const current = root.dataset.theme || resolveTheme(getStoredPreference());
      applyExplicitTheme(current === "dark" ? "light" : "dark");
    }

    const cleanButton = themeButton.cloneNode(true);
    themeButton.replaceWith(cleanButton);
    themeButton = cleanButton;
    themeButton.addEventListener("click", toggleTheme, { passive: false });

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
