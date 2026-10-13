(() => {
  [
    ["./assets/js/ui-polish.js?v=20261013selectstable2", "cbc-ui-polish"],
    ["./assets/js/form-quality.js?v=20261013quality1", "cbc-form-quality"],
    ["./assets/js/select-enhancer.js?v=20261013selectstable2", "cbc-select-enhancer"],
    ["./assets/js/mobile-theme-quick.js?v=20261013theme5", "cbc-mobile-theme-quick"]
  ].forEach(([src, marker]) => {
    if (document.querySelector(`script[data-module="${marker}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.module = marker;
    document.head.appendChild(script);
  });
})();