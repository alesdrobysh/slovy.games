export const COOKIE_CONSENT_KEY = "pobach_cookie_consent";

export const ConsentRepository = {
  hasConsented(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(COOKIE_CONSENT_KEY) === "1";
  },

  saveConsent(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(COOKIE_CONSENT_KEY, "1");
  },
};
