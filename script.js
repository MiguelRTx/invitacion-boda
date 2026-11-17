"use strict";

const wedding = window.WEDDING_CONFIG;
const byId = (id) => document.getElementById(id);
const dateStart = new Date(`${wedding.date}T00:00:00${wedding.timezoneOffset}`);
const dateLabel = new Intl.DateTimeFormat("es-BO", {
  day: "numeric", month: "long", year: "numeric", timeZone: "America/La_Paz"
}).format(dateStart);
document.querySelectorAll("[data-wedding-date]").forEach((element) => element.textContent = dateLabel);
document.querySelector(".date-heading").textContent = dateLabel;
const weekday = new Intl.DateTimeFormat("es-BO", { weekday: "long", timeZone: "America/La_Paz" }).format(dateStart);
document.querySelector(".date-weekday").textContent = `${weekday.toLocaleUpperCase("es")} · NUESTRO GRAN DÍA`;
byId("location-name").textContent = wedding.locationName;
byId("maps-link").href = wedding.mapsUrl;
byId("video-link").href = wedding.videoUrl;
document.querySelectorAll("[data-event]").forEach((element) => element.textContent = wedding[element.dataset.event]);

9
function updateCountdown() {
  const remaining = Math.max(0, Math.floor((dateStart.getTime() - Date.now()) / 1000));
  const values = { days: Math.floor(remaining / 86400), hours: Math.floor(remaining / 3600) % 24, minutes: Math.floor(remaining / 60) % 60, seconds: remaining % 60 };
  Object.entries(values).forEach(([unit, value]) => byId(`count-${unit}`).textContent = String(value).padStart(2, "0"));
  if (remaining === 0) {
    const endOfDay = dateStart.getTime() + 86400000;
    byId("countdown-note").textContent = Date.now() < endOfDay ? "¡Hoy es nuestro gran día!" : "Gracias por ser parte de nuestra historia.";
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

const menuButton = document.querySelector(".menu-toggle");
const navigation = byId("navigation");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  navigation.classList.remove("is-open");
}
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  navigation.classList.toggle("is-open", !isOpen);
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
document.addEventListener("click", (event) => { if (!event.target.closest(".header")) closeMenu(); });

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((element) => { element.classList.add("will-reveal"); observer.observe(element); });
}


byId("calendar-button").addEventListener("click", () => {
  const nextDay = new Date(`${wedding.date}T12:00:00Z`);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const compactDate = (value) => value.replaceAll("-", "");
  const escapeICS = (value) => value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
  const foldLine = (line) => {
    const encoder = new TextEncoder();
    let result = "", bytes = 0;
    for (const character of line) {
      const length = encoder.encode(character).length;
      if (bytes + length > 75) { result += "\r\n "; bytes = 1; }
      result += character; bytes += length;
    }
    return result;
  };
  const calendar = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Miguel y Mariana//Nuestra boda//ES", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", `UID:boda-${compactDate(wedding.date)}-miguel-mariana@invitacion.local`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, `DTSTART;VALUE=DATE:${compactDate(wedding.date)}`, `DTEND;VALUE=DATE:${compactDate(nextDay.toISOString().slice(0, 10))}`, `SUMMARY:${escapeICS(`Boda de ${wedding.names}`)}`, `DESCRIPTION:${escapeICS(`¡Nos casamos! Horarios por confirmar. Ubicación: ${wedding.mapsUrl}`)}`, `URL:${wedding.mapsUrl}`, "END:VEVENT", "END:VCALENDAR", ""].map(foldLine).join("\r\n");
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url; link.download = "boda-miguel-y-mariana.ics";
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
});

const form = byId("rsvp-form");
const dialog = byId("confirmation-dialog");
let confirmationMessage = "";
form.querySelectorAll('[name="attendance"]').forEach((radio) => radio.addEventListener("change", () => {
  const attending = form.elements.attendance.value === "yes";
  byId("guests-field").hidden = !attending;
  byId("guest-count").disabled = !attending;
  byId("guest-count").required = attending;
}));
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = byId("guest-name");
  name.value = name.value.trim();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const attending = data.get("attendance") === "yes";
  const count = Number(data.get("guests"));
  const lines = [`¡Hola, ${wedding.names}!`, `Soy ${data.get("name")}.`, `Sobre su boda del ${dateLabel}:`, "", attending ? "Sí, ¡voy a acompañarlos! 💚" : "Con mucho cariño, les aviso que no podré asistir."];
  if (attending) lines.push(`Cantidad de personas (incluyéndome): ${count}.`);
  if (data.get("email").trim()) lines.push(`Correo: ${data.get("email").trim()}`);
  if (data.get("message").trim()) lines.push("", `Mensaje / alimentación: ${data.get("message").trim()}`);
  lines.push("", "¡Gracias por hacernos parte de su historia!");
  confirmationMessage = lines.join("\n");
  byId("confirmation-preview").textContent = confirmationMessage;
  byId("whatsapp-link").href = `https://wa.me/${wedding.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(confirmationMessage)}`;
  byId("copy-status").textContent = "";
  dialog.showModal();
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
byId("copy-confirmation").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(confirmationMessage);
    byId("copy-status").textContent = "Respuesta copiada. Podés pegarla en WhatsApp.";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(byId("confirmation-preview"));
    selection.removeAllRanges(); selection.addRange(range);
    byId("copy-status").textContent = "Seleccionamos el texto: mantené presionado o usá Ctrl+C para copiarlo.";
  }
});
