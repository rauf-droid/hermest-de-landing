const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.tagName !== "A") return;
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
}

/* Schwebende Kontaktelemente: erst nach dem Hero einblenden, im Kontaktbereich wieder ausblenden. */
const mobileCta = document.querySelector("[data-mobile-cta]");
const waFloat = document.querySelector("[data-wa-float]");
const heroSection = document.querySelector("#uebersicht");
const contactSection = document.querySelector("#kontakt");

if ((mobileCta || waFloat) && heroSection && "IntersectionObserver" in window) {
  let heroPassed = false;
  let atContact = false;

  const sync = () => {
    if (mobileCta) mobileCta.classList.toggle("is-visible", heroPassed && !atContact);
    // WhatsApp bleibt auch im Kontaktbereich erreichbar – dort ist es eine echte Alternative zum Formular.
    if (waFloat) waFloat.classList.toggle("is-visible", heroPassed);
  };

  new IntersectionObserver(
    ([entry]) => {
      heroPassed = !entry.isIntersecting;
      sync();
    },
    { rootMargin: "-40% 0px 0px 0px" }
  ).observe(heroSection);

  if (contactSection) {
    new IntersectionObserver(
      ([entry]) => {
        atContact = entry.isIntersecting;
        sync();
      },
      { threshold: 0.12 }
    ).observe(contactSection);
  }
}

document.querySelectorAll("[data-video-embed]").forEach((button) => {
  button.addEventListener("click", () => {
    const videoId = button.dataset.videoId;
    if (!videoId) return;

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = button.dataset.videoTitle || "Hermest Video";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    button.replaceWith(iframe);
  });
});

const sectionLinks = [...document.querySelectorAll(".section-nav a")];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => link.classList.remove("is-active"));
        const active = sectionLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
        if (active) active.classList.add("is-active");
      });
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

const analysisForm = document.querySelector("[data-analysis-form]");

if (analysisForm) {
  analysisForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = analysisForm.querySelector(".form-status");
    if (status) {
      status.textContent = "Danke für Ihre Anfrage. Wir melden uns zur gewünschten Kontaktzeit mit Rückfragen zu Ihrer Haaranalyse.";
    }
    analysisForm.reset();
  });
}

/*
  Schnellkontakt-Modal: jeder Auslöser im Text liefert per data-Attribut Titel, Kurztext und
  Betreff. Das Formular selbst bleibt überall gleich (Name, E-Mail, Telefon) – nur die Ansprache
  im Modal ändert sich je Abschnitt.
*/
const leadModal = document.querySelector("[data-lead-modal]");
const leadForm = leadModal?.querySelector("[data-lead-form]");

if (leadModal && leadForm) {
  const leadHeading = leadModal.querySelector("[data-lead-heading]");
  const leadSubtext = leadModal.querySelector("[data-lead-subtext]");
  const leadTopicLabel = leadModal.querySelector("[data-lead-topic-label]");
  const leadTopicValue = leadModal.querySelector("[data-lead-topic-value]");
  const leadStatus = leadModal.querySelector("[data-lead-status]");
  const leadSubmit = leadForm.querySelector('button[type="submit"]');
  let lastTrigger = null;

  document.querySelectorAll("[data-lead-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      lastTrigger = trigger;

      const topic = trigger.dataset.topic || "Allgemeine Anfrage";
      leadHeading.textContent = trigger.dataset.heading || "Kostenlose Haaranalyse anfordern";
      leadSubtext.textContent = trigger.dataset.subtext || "";
      leadTopicLabel.textContent = topic;
      leadTopicValue.value = topic;

      leadModal.showModal();
      leadModal.querySelector('input[name="name"]').focus();
    });
  });

  leadModal.querySelectorAll("[data-lead-close]").forEach((btn) => {
    btn.addEventListener("click", () => leadModal.close());
  });

  // Klick auf das <dialog>-Element selbst (außerhalb der Karte) = Klick auf den Backdrop.
  leadModal.addEventListener("click", (event) => {
    if (event.target === leadModal) leadModal.close();
  });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    leadStatus.textContent = "Danke für Ihre Anfrage. Wir melden uns in Kürze auf Deutsch.";
    [...leadForm.elements].forEach((field) => {
      field.disabled = true;
    });
    setTimeout(() => leadModal.close(), 1800);
  });

  leadModal.addEventListener("close", () => {
    leadForm.reset();
    [...leadForm.elements].forEach((field) => {
      field.disabled = false;
    });
    leadStatus.textContent = "";
    lastTrigger?.focus();
  });
}
