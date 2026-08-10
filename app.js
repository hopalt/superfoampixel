(() => {
  const supported = ["ko", "en", "ja"];
  const params = new URLSearchParams(location.search);
  const requested = params.get("lang");
  const saved = localStorage.getItem("sfp-lang");
  const system = navigator.language.slice(0, 2);
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
    document.querySelectorAll(".privacy-link").forEach((link) => link.href = `privacy/?lang=${language}`);
    document.querySelectorAll(".home-link").forEach((link) => link.href = `../?lang=${language}`);
    const sections = document.querySelector("#policy-sections");
    if (sections) {
      sections.replaceChildren(...copy.policySections.map(([title, body]) => {
        const section = document.createElement("section");
        const heading = document.createElement("h2");
        const paragraph = document.createElement("p");
        heading.textContent = title;
        paragraph.textContent = body;
        section.append(heading, paragraph);
        return section;
      }));
    }
  }

  document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => render(button.dataset.lang)));
  render(language);
})();
