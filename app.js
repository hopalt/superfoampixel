(() => {
  const supported = ["ko", "en", "ja", "zh-Hant", "vi", "id"];
  const storeLabels = {
    ko: "Google Play에서 만나보세요",
    en: "Get it on Google Play",
    ja: "Google Playで配信中",
    "zh-Hant": "立即前往 Google Play",
    vi: "Tải xuống trên Google Play",
    id: "Dapatkan di Google Play",
  };
  const params = new URLSearchParams(location.search);
  const requested = params.get("lang");
  const saved = localStorage.getItem("sfp-lang");
  const browserLocale = navigator.language;
  const normalizedChinese = /^zh(?:-(?:Hant|TW|HK|MO))\b/i.test(browserLocale) ? "zh-Hant" : null;
  const system = normalizedChinese || browserLocale.slice(0, 2).toLowerCase();
  let language = supported.includes(requested) ? requested : supported.includes(saved) ? saved : supported.includes(system) ? system : "en";

  function render(next) {
    language = next;
    localStorage.setItem("sfp-lang", language);
    document.documentElement.lang = language;
    const copy = window.SFP_TRANSLATIONS[language];
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = copy[element.dataset.i18n];
      if (value) element.textContent = value;
    });
    document.querySelectorAll("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === language));
    document.querySelectorAll("[data-store-link]").forEach((link) => link.textContent = storeLabels[language]);
    document.querySelectorAll(".privacy-link").forEach((link) => link.href = `privacy/?lang=${language}`);
    document.querySelectorAll(".home-link").forEach((link) => link.href = `../?lang=${language}`);
    const phonePreview = document.querySelector("#phone-preview");
    const tabletPreview = document.querySelector("#tablet-preview");
    if (phonePreview) phonePreview.src = `assets/app-home-phone-${language}.png`;
    if (tabletPreview) tabletPreview.src = `assets/app-home-tablet-${["ko", "en", "ja"].includes(language) ? language : "en"}.png`;
    const sections = document.querySelector("#policy-sections");
    if (sections) {
      sections.replaceChildren(...copy.policySections.map(([title, body, policyLink]) => {
        const section = document.createElement("section");
        const heading = document.createElement("h2");
        const paragraph = document.createElement("p");
        heading.textContent = title;
        paragraph.textContent = body;
        section.append(heading, paragraph);
        if (policyLink) {
          const link = document.createElement("a");
          link.href = policyLink.url;
          link.textContent = policyLink.label;
          section.append(link);
        }
        return section;
      }));
    }
  }

  document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => render(button.dataset.lang)));
  render(language);
})();
