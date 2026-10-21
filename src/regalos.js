const PAYMENT_URL = "https://fintoc.me/aaossa";

const gifts = [
  { name: "La verdadera pizza en Nápoles", note: "Masa madre, albahaca fresca y una cerveza bien fría en el corazón de Italia.", category: "Aventuras", amount: 80000, icon: "pizza" },
  { name: "Ramen y sake en Tokio", note: "Perdernos entre los neones de Shinjuku para probar el mejor ramen de la ciudad.", category: "Aventuras", amount: 110000, icon: "ramen" },
  { name: "Buceo en San Andrés", note: "Sumergirnos en las aguas cristalinas del Mar de los 7 Colores para explorar sus arrecifes.", category: "Aventuras", amount: 140000, icon: "scuba" },
  { name: "Brindis al atardecer en Santorini", note: "Cocteles y vino griego contemplando la famosa puesta de sol sobre las cúpulas azules de Oia.", category: "Momentos", amount: 160000, icon: "sunset" },
  { name: "Sesión de fotos en Nueva York", note: "Un fotógrafo local capturando nuestros mejores ángulos entre Central Park y Brooklyn.", category: "Momentos", amount: 180000, icon: "camera" },
  { name: "Cena romántica en la Torre Eiffel", note: "Un brindis con champaña y la mejor vista nocturna de las luces de París.", category: "Momentos", amount: 220000, icon: "champagne" },
];

const icons = {
  pizza: '<path d="M12 22c18-10 38-10 56 0L40 70z"/><path d="M16 30c16-8 32-8 48 0"/><circle cx="32" cy="38" r="3"/><circle cx="46" cy="42" r="3"/><circle cx="40" cy="54" r="3"/>',
  ramen: '<path d="M10 40h60c0 15-13 26-30 26S10 55 10 40ZM28 66v4h24v-4"/><path d="M20 40c0-6 4-10 9-10s9 4 9 10M38 40c0-5 4-8 8-8s8 3 8 8"/><path d="m30 32 40-22M36 34l36-16"/><path d="M18 22c-3 3 3 6 0 9M26 18c-3 3 3 6 0 9"/>',
  scuba: '<path d="M10 28h50v16c0 6-4 10-10 10h-6l-6-6h-4l-6 6h-8c-6 0-10-4-10-10z"/><path d="M35 28v20"/><path d="M68 20v30c0 10-8 16-18 16h-6"/><circle cx="58" cy="12" r="3"/><circle cx="50" cy="8" r="2"/>',
  sunset: '<path d="M50 40a12 12 0 0 1 24 0M62 18v6M48 24l4 4M76 24l-4 4"/><path d="M8 68V44h26v24M8 44a13 13 0 0 1 26 0M21 31v-8M17 26h8"/><path d="M38 68V52h22v16M45 68v-7h8v7M4 68h72"/>',
  camera: '<path d="M10 28h14l6-8h20l6 8h14v38H10z"/><circle cx="40" cy="46" r="12"/><circle cx="40" cy="46" r="5"/><path d="M60 36h4"/>',
  champagne: '<path d="M14 18h14l-2 22c-1 6-9 6-10 0zM21 46v18M14 66h14"/><path d="M52 18h14l-2 22c-1 6-9 6-10 0zM59 46v18M52 66h14"/><path d="M15 28h12M53 28h12"/><path d="M40 8v8M32 12l3 4M48 12l-3 4"/>',
};

const currency = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

const grid = document.querySelector("#gift-grid");
const toolbar = document.querySelector(".registry__toolbar");
const filters = toolbar.querySelector(".registry__filters");
const status = document.querySelector("#gift-status");

grid.innerHTML = gifts.map((gift, index) => `
  <li class="ticket reveal" data-category="${gift.category}">
    <div class="ticket__main">
      <div class="ticket__meta">
        <span>Regalo ${String(index + 1).padStart(2, "0")}</span>
        <span>${gift.category}</span>
      </div>
      <svg class="ticket__icon" viewBox="0 0 80 80" aria-hidden="true">${icons[gift.icon]}</svg>
      <h3>${gift.name}</h3>
      <p>${gift.note}</p>
    </div>
    <div class="ticket__stub">
      <div class="ticket__amount">
        <small>Aporte</small>
        <strong>${currency.format(gift.amount)}</strong>
      </div>
      <a class="ticket__button" href="${PAYMENT_URL}/${gift.amount}" target="_blank" rel="noopener" aria-label="Regalar ${gift.name} por ${currency.format(gift.amount)}">Regalar <span>↗</span></a>
    </div>
  </li>
`).join("");

filters.querySelectorAll(".chip").forEach((chip) => {
  const filter = chip.dataset.filter;
  const count = filter === "todos" ? gifts.length : gifts.filter((gift) => gift.category === filter).length;
  chip.insertAdjacentHTML("beforeend", ` <span class="chip__count" aria-hidden="true">${count}</span>`);
});

function keepChipInView(chip, behavior) {
  const bar = filters.getBoundingClientRect();
  const rect = chip.getBoundingClientRect();
  const offset = rect.left - bar.left - (bar.width - rect.width) / 2;
  filters.scrollBy({ left: offset, behavior });
}

function applyFilter(filter, { fromUser = true } = {}) {
  let activeChip = null;
  filters.querySelectorAll(".chip").forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    if (active) activeChip = button;
  });

  let shown = 0;
  grid.querySelectorAll(".ticket").forEach((ticket) => {
    const visible = filter === "todos" || ticket.dataset.category === filter;
    ticket.hidden = !visible;
    if (!visible) return;
    shown += 1;
    if (!fromUser) return;
    ticket.style.animationDelay = `${Math.min(shown - 1, 6) * 45}ms`;
    ticket.classList.remove("is-entering");
    void ticket.offsetWidth;
    ticket.classList.add("is-entering");
  });

  if (activeChip) keepChipInView(activeChip, fromUser ? "smooth" : "instant");
  if (!fromUser) return;

  status.textContent = `${shown} ${shown === 1 ? "regalo" : "regalos"}${filter === "todos" ? "" : ` en ${filter}`}`;

  const sticky = getComputedStyle(toolbar).position === "sticky";
  const anchorTop = sticky ? grid.getBoundingClientRect().top - toolbar.offsetHeight : toolbar.getBoundingClientRect().top;
  if (anchorTop < 0) {
    window.scrollBy({ top: anchorTop - 16, behavior: "smooth" });
  }
}

toolbar.hidden = false;
filters.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (chip) applyFilter(chip.dataset.filter);
});

grid.addEventListener("animationend", (event) => {
  event.target.classList?.remove("is-entering");
});

const touchLayout = window.matchMedia("(max-width: 640px) and (pointer: coarse)");
grid.addEventListener("click", (event) => {
  if (!touchLayout.matches || event.target.closest("a")) return;
  event.target.closest(".ticket")?.querySelector(".ticket__button").click();
});
// iOS Safari only applies :active styles when a touch listener exists.
grid.addEventListener("touchstart", () => {}, { passive: true });

new IntersectionObserver(
  ([entry]) => toolbar.classList.toggle("is-stuck", entry.intersectionRatio < 1 && entry.boundingClientRect.top < 1),
  { threshold: [1] }
).observe(toolbar);

const categoryFromUrl = new URLSearchParams(location.search).get("categoria");
const initialFilter = gifts.find((gift) => gift.category.toLowerCase() === categoryFromUrl?.toLowerCase())?.category;
if (initialFilter) applyFilter(initialFilter, { fromUser: false });
