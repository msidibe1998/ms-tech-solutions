// =======================
// Scroll fluide vers une section
// =======================

// =======================
// WhatsApp (config rapide)
// Remplace WA_NUMBER par ton vrai numéro (format international sans +, espaces)
// Exemple Ottawa : 1613XXXXXXX
// =======================
const WA_NUMBER = "16132001813";

function initWhatsAppLinks() {
  // Auto-configure tous les liens WhatsApp marqués data-wa
  // Optionnel : ajoute data-wa-msg="..." pour personnaliser le message
  document.querySelectorAll("a[data-wa]").forEach((a) => {
    const msg =
      a.getAttribute("data-wa-msg") ||
      "Salut MS Tech Solutions 👋 J’aimerais un audit gratuit.";
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWhatsAppLinks);
} else {
  initWhatsAppLinks();
}
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// =======================
// Menu mobile
// =======================
const burger = document.getElementById("burger");
const navLinks = document.getElementById("nav-links");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

// =======================
// Année dynamique footer
// =======================
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// =======================
// Animations reveal au scroll
// =======================
const revealElements = document.querySelectorAll(".reveal-up");

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el) => observer.observe(el));
}



// =======================
// FORMULAIRES : validation en tapant + envoi AJAX + redirection merci.html
// =======================
function setFieldError(field, message) {
  const errorEl = field.parentElement?.querySelector(".error");
  if (errorEl) errorEl.textContent = message || "";
}

function validateField(field) {
  // Ignore hidden inputs
  if (field.type === "hidden") return true;

  // Required
  if (field.required && !field.value.trim()) {
    setFieldError(field, "Ce champ est requis.");
    return false;
  }

  // Email format
  if (field.type === "email" && field.value.trim()) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    if (!ok) {
      setFieldError(field, "Email invalide.");
      return false;
    }
  }

  // Min length
  const min = field.getAttribute("minlength");
  if (min && field.value.trim().length > 0 && field.value.trim().length < Number(min)) {
    setFieldError(field, `Minimum ${min} caractères.`);
    return false;
  }

  // Select (invalid if value empty)
  if (field.tagName === "SELECT" && field.required && !field.value) {
    setFieldError(field, "Veuillez choisir une option.");
    return false;
  }

  setFieldError(field, "");
  return true;
}

function initForms() {
  document.querySelectorAll("form").forEach((form) => {
    const fields = form.querySelectorAll("input, textarea, select");

    // validation live
    fields.forEach((f) => {
      const evt = (f.tagName === "SELECT") ? "change" : "input";
      f.addEventListener(evt, () => validateField(f));
      f.addEventListener("blur", () => validateField(f));
    });

    // submit
    form.addEventListener("submit", async (event) => {
      event.preventDefault();


      form.classList.add("submitted");
      let ok = true;
      fields.forEach((f) => { if (!validateField(f)) ok = false; });

      if (!ok) {
        const firstInvalid = Array.from(fields).find((f) => !validateField(f));
        firstInvalid?.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      let originalText = "";
      if (submitBtn && submitBtn.tagName === "BUTTON") {
        originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Envoi en cours...";
      }

      try {
        const formData = new FormData(form);

        // Si action vide, redirige quand même
        if (!form.action) {
          window.location.href = "merci.html";
          return;
        }

        await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        window.location.href = "merci.html";
      } catch (e) {
        alert("Une erreur est survenue. Merci de réessayer.");
        if (submitBtn && submitBtn.tagName === "BUTTON") {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText || "Envoyer";
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initForms);
