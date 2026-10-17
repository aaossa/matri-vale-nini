const PAYMENT_URL = "https://fintoc.me/aaossa";

const gifts = [
  { name: "Un viaje a la luna", note: "Ida y vuelta, con escala en las estrellas.", category: "Imposibles", amount: 150000, icon: "moon" },
  { name: "Un desayuno con vista al mar", note: "Café, marraqueta y el sonido de las olas.", category: "Momentos", amount: 30000, icon: "sunrise" },
  { name: "Un paseo en globo sobre Capadocia", note: "Despegue al amanecer.", category: "Aventuras", amount: 100000, icon: "balloon" },
  { name: "Café para un año de mañanas juntos", note: "Para empezar cada día con energía.", category: "Hogar", amount: 25000, icon: "coffee" },
  { name: "Una noche bajo las estrellas de Atacama", note: "El cielo más limpio del mundo.", category: "Aventuras", amount: 80000, icon: "tent" },
  { name: "Una cena a la luz de las velas", note: "Mesa para dos, sin apuro.", category: "Momentos", amount: 50000, icon: "candle" },
  { name: "Ver auroras boreales desde una cabaña", note: "Chocolate caliente incluido.", category: "Imposibles", amount: 120000, icon: "aurora" },
  { name: "Una planta que prometemos no matar", note: "Esta vez sí la vamos a regar.", category: "Hogar", amount: 15000, icon: "plant" },
  { name: "Una ruta en auto con parada en cada mirador", note: "Playlist del matrimonio de fondo.", category: "Aventuras", amount: 60000, icon: "car" },
  { name: "Una tarde de vinos en el valle", note: "Un brindis por los próximos años.", category: "Momentos", amount: 40000, icon: "wine" },
  { name: "Clases de baile para no pisarnos en la fiesta", note: "Por el bien de nuestros pies.", category: "Imposibles", amount: 35000, icon: "dance" },
  { name: "Un picnic de domingo", note: "Mantel, sol y nada de prisa.", category: "Momentos", amount: 20000, icon: "picnic" },
  { name: "Pizza y película para un viernes", note: "Nosotros elegimos la película.", category: "Hogar", amount: 15000, icon: "pizza" },
];

const icons = {
  moon: '<path d="M50 12a28 28 0 1 0 18 46A24 24 0 0 1 50 12Z"/><path d="m22 20 2 5 5 2-5 2-2 5-2-5-5-2 5-2zM62 30l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>',
  sunrise: '<path d="M22 50a18 18 0 0 1 36 0M40 18v8M18 28l6 6M62 28l-6 6M10 50h60"/><path d="M12 60c6-5 10-5 16 0s10 5 16 0 10-5 16 0 6 4 8 2M18 70c5-4 9-4 14 0s9 4 14 0 9-4 14 0"/>',
  balloon: '<path d="M40 10c-14 0-24 10-24 23 0 13 14 22 20 30h8c6-8 20-17 20-30 0-13-10-23-24-23Z"/><path d="M40 10c-6 6-9 15-9 23s4 20 5 30M40 10c6 6 9 15 9 23s-4 20-5 30M34 63h12v9H34z"/>',
  coffee: '<path d="M16 34h40v14c0 11-9 18-20 18s-20-7-20-18zM56 38h4c6 0 8 4 8 8s-3 8-9 8h-5M12 70h48"/><path d="M28 14c-4 4 4 8 0 12M38 12c-4 4 4 8 0 12M48 14c-4 4 4 8 0 12"/>',
  tent: '<path d="M10 66 40 22l30 44zM40 22v44M32 66l8-14 8 14M6 66h68"/><path d="m18 14 1 3 3 1-3 1-1 3-1-3-3-1 3-1zM58 10l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM66 26h.1M48 12h.1"/>',
  candle: '<path d="M32 36h16v32H32zM24 68h32"/><path d="M40 12c-5 6-6 10-6 13a6 6 0 0 0 12 0c0-3-1-7-6-13ZM40 30v6"/><path d="M18 30l-6-3M62 30l6-3M20 18l-4-5M60 18l4-5"/>',
  aurora: '<path d="M8 66l18-24 10 12 12-18 24 30z"/><path d="M8 26c10-10 20 4 32-6s22-4 32-12M8 36c12-8 22 4 34-4s20-2 30-8"/><path d="M30 66v-8h8v8"/>',
  plant: '<path d="M26 50h28l-4 20H30zM22 50h36"/><path d="M40 50V24M40 34c-4-12-16-14-20-12 2 10 10 14 20 12ZM40 28c4-12 16-14 20-12-2 10-10 14-20 12Z"/>',
  car: '<path d="M10 52V40l8-14h34l10 14h8v12zM18 26l-2 14h46"/><circle cx="24" cy="54" r="6"/><circle cx="56" cy="54" r="6"/><path d="M6 68h68"/>',
  wine: '<path d="M18 12h18l-2 18c-1 8-13 8-14 0zM27 38v24M18 66h18"/><path d="M50 30h12v36H50zM52 30v-8h8v8M53 18h6M50 44h12"/>',
  dance: '<path d="M18 50c6-2 14-2 18 4l-2 8H14c-2-4 0-10 4-12ZM14 62h20"/><path d="M44 46c6 0 16 2 20 10l-2 6H42zM42 62h22M60 56l2 12"/><path d="M30 14v18a5 5 0 1 1-4-5M30 14l14-4v18a5 5 0 1 1-4-5"/>',
  picnic: '<path d="M14 40h52l-6 28H20zM22 40c0-14 8-22 18-22s18 8 18 22"/><path d="M17 52h46M26 40l4 28M40 40v28M54 40l-4 28"/>',
  pizza: '<path d="M12 22c18-10 38-10 56 0L40 70z"/><path d="M16 30c16-8 32-8 48 0"/><circle cx="32" cy="38" r="3"/><circle cx="46" cy="42" r="3"/><circle cx="40" cy="54" r="3"/>',
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
