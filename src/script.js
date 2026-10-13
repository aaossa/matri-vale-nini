document.documentElement.classList.add("js");

const weddingDate = new Date("2027-01-22T18:30:00-03:00");

function updateCountdown() {
  const distance = Math.max(0, weddingDate.getTime() - Date.now());
  const units = {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };

  Object.entries(units).forEach(([unit, value]) => {
    const element = document.querySelector(`[data-unit="${unit}"]`);
    if (element) {
      element.textContent = String(value).padStart(unit === "days" ? 3 : 2, "0");
    }
  });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
);

document.querySelectorAll(".reveal, .reveal-photo").forEach((element) => {
  revealObserver.observe(element);
});

const musicSection = document.querySelector(".music");
if (musicSection) {
  const musicObserver = new IntersectionObserver(
    ([entry]) => musicSection.classList.toggle("is-playing", entry.isIntersecting),
    { threshold: 0.3 }
  );
  musicObserver.observe(musicSection);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

const nav = document.querySelector(".nav");
const navToggle = nav?.querySelector(".nav__toggle");
const navMenu = nav?.querySelector(".nav__links");
const navMedia = window.matchMedia("(max-width: 640px)");

function setNavOpen(open) {
  if (!nav || !navToggle || !navMenu) return;
  const isOpen = navMedia.matches && open;
  nav.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  navMenu.inert = navMedia.matches && !isOpen;
}

navToggle?.addEventListener("click", () => {
  setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

document.addEventListener("click", (event) => {
  if (!nav?.classList.contains("is-open") || nav.contains(event.target)) return;
  setNavOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav?.classList.contains("is-open")) setNavOpen(false);
});

navMedia.addEventListener("change", () => setNavOpen(false));
setNavOpen(false);

const polaroidViewer = document.querySelector(".polaroid-viewer");
const polaroidCard = polaroidViewer?.querySelector(".polaroid-viewer__card");
const polaroidImage = polaroidCard?.querySelector(".journey-photo__image");
const polaroidCaption = polaroidCard?.querySelector(".journey-photo__caption");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let liftedPhoto = null;
let polaroidBusy = false;
let openTransform = "";

function photoRotation(photo) {
  const transform = getComputedStyle(photo).transform;
  if (!transform || transform === "none") return 0;
  const matrix = new DOMMatrix(transform);
  return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
}

function preparePolaroidCard(photo) {
  const sourceImage = photo.querySelector(".journey-photo__image");
  const sourceCaption = photo.querySelector(".journey-photo__caption");
  const imageElement = sourceImage.querySelector("img");
  const imageUrl = imageElement?.currentSrc || imageElement?.src;
  polaroidImage.style.backgroundImage = imageUrl
    ? `url("${imageUrl}")`
    : getComputedStyle(sourceImage).backgroundImage;
  polaroidCaption.innerHTML = sourceCaption.innerHTML;
  polaroidCard.setAttribute("aria-label", sourceCaption.textContent.replace(/\s+/g, " ").trim());
}

function placePolaroid(photo) {
  const width = photo.offsetWidth;
  polaroidCard.style.width = `${width}px`;
  const cardWidth = polaroidCard.offsetWidth;
  const cardHeight = polaroidCard.offsetHeight;
  const left = (window.innerWidth - cardWidth) / 2;
  const top = (window.innerHeight - cardHeight) / 2;
  polaroidCard.style.left = `${left}px`;
  polaroidCard.style.top = `${top}px`;

  const rect = photo.getBoundingClientRect();
  const scale = Math.min(2.45, (window.innerWidth - 48) / cardWidth, (window.innerHeight - 56) / cardHeight);
  return {
    dx: rect.left + rect.width / 2 - (left + cardWidth / 2),
    dy: rect.top + rect.height / 2 - (top + cardHeight / 2),
    rotation: photoRotation(photo),
    scale,
  };
}

function polaroidTransform(dx, dy, rotation, scale) {
  return `translate(${dx}px, ${dy}px) rotate(${rotation}deg) scale(${scale})`;
}

function playPolaroid(frames, duration) {
  polaroidCard.style.transform = frames[0].transform;
  polaroidCard.getAnimations().forEach((animation) => animation.cancel());
  if (prefersReducedMotion.matches) {
    polaroidCard.style.transform = frames[frames.length - 1].transform;
    return Promise.resolve();
  }
  const animation = polaroidCard.animate(frames, {
    duration,
    easing: "cubic-bezier(.2, .8, .2, 1)",
    fill: "both",
  });
  return animation.finished.catch(() => {});
}

function openPolaroid(photo) {
  if (!polaroidViewer || polaroidBusy || liftedPhoto) return;
  polaroidBusy = true;
  liftedPhoto = photo;
  preparePolaroidCard(photo);
  photo.setAttribute("aria-expanded", "true");

  polaroidViewer.hidden = false;
  const motion = placePolaroid(photo);
  const tilt = Math.sign(motion.rotation || 1) * 5;
  const resting = polaroidTransform(motion.dx, motion.dy, motion.rotation, 1);
  const lifted = polaroidTransform(motion.dx, motion.dy - 34, motion.rotation + tilt, 1.07);
  openTransform = polaroidTransform(0, 0, 0, motion.scale);
  polaroidCard.style.transform = resting;
  polaroidViewer.classList.add("is-active", "is-open");
  photo.classList.add("is-lifted");
  document.documentElement.style.overflow = "hidden";
  polaroidCard.focus();

  playPolaroid([
    { transform: resting },
    { transform: lifted, offset: 0.34 },
    { transform: openTransform },
  ], 760).then(() => {
    polaroidBusy = false;
  });
}

function closePolaroid() {
  if (!liftedPhoto || polaroidBusy) return;
  polaroidBusy = true;
  const photo = liftedPhoto;
  const motion = placePolaroid(photo);
  polaroidViewer.classList.remove("is-open");

  playPolaroid([
    { transform: openTransform },
    { transform: polaroidTransform(motion.dx, motion.dy - 22, motion.rotation, 1.04), offset: 0.68 },
    { transform: polaroidTransform(motion.dx, motion.dy, motion.rotation, 1) },
  ], 640).then(() => {
    photo.classList.remove("is-lifted");
    photo.setAttribute("aria-expanded", "false");
    polaroidViewer.classList.remove("is-active");
    polaroidViewer.hidden = true;
    polaroidCard.style.transform = "";
    document.documentElement.style.overflow = "";
    liftedPhoto = null;
    polaroidBusy = false;
    photo.focus();
  });
}

document.querySelectorAll(".journey-gallery .journey-photo").forEach((photo) => {
  photo.addEventListener("click", () => openPolaroid(photo));
});

polaroidViewer?.querySelector(".polaroid-viewer__backdrop")?.addEventListener("click", closePolaroid);
polaroidCard?.addEventListener("click", closePolaroid);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePolaroid();
  if (event.key === "Tab" && liftedPhoto) event.preventDefault();
});

updateCountdown();
setInterval(updateCountdown, 1000);
