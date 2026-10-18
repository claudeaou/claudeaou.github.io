/*
  GITHUB PAGES LAUNCH CONFIGURATION

  Runtime configuration stays here. Small presentation/data-quality helpers are
  loaded as isolated modules so the main recruitment transport stays untouched.
*/
window.CLUB_CONFIG = {
  /*
    Recruitment switch:
    - false = applications are closed
    - true  = applications are open

    This is intentionally kept in the front-end config so reopening/closing
    recruitment only requires changing this single value.
  */
  REGISTRATION_OPEN: false,

  // Keep the public site live even while recruitment is closed.
  IS_LIVE: true,

  // Public Google Apps Script Web App endpoint used by the application form.
  SUBMISSION_ENDPOINT: "https://script.google.com/macros/s/AKfycbzH7s_5RU_h40YDqd57pbPo1jMJ-FOMXtFRvHTFHhLJXQrbvoqf3N3gq1L-VmwTK2i83Q/exec",

  // The existing front-end checks this timestamp before showing/accepting applications.
  // REGISTRATION_OPEN=false gives it a past close time; true removes the deadline.
  get APPLICATIONS_CLOSE_AT() {
    return this.REGISTRATION_OPEN ? "" : "2000-01-01T00:00:00+02:00";
  },

  // Official club contact email.
  CONTACT_EMAIL: "claudebuilder.aou@gmail.com"
};

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
