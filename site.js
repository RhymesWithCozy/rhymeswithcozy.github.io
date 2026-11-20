const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const siteHeader = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");
const heroMotion = matchMedia("(min-width: 741px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

let mastheadFrame;
let directionAnchor = Math.max(0, window.scrollY);
let scrollingUp = false;

function updateMasthead() {
  if (mastheadFrame !== undefined) return;
  mastheadFrame = requestAnimationFrame(() => {
    const distance = Math.max(0, window.scrollY);
    const { bottom, height } = hero.getBoundingClientRect();
    siteHeader.classList.toggle("over-hero", bottom > 0);
    const midpointDistance = 2 * bottom / Math.max(1, height) - 1;
    const compact = midpointDistance <= 0;
    const delta = distance - directionAnchor;
    if (Math.abs(delta) >= 4) {
      scrollingUp = delta < 0;
      directionAnchor = distance;
    }
    if (!compact) scrollingUp = false;
    const showCompact = compact && scrollingUp;
    const openingOpacity = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, midpointDistance));
    const opacity = compact ? Number(showCompact) : openingOpacity;
    siteHeader.classList.toggle("is-compact-visible", showCompact && !reducedMotion.matches);
    siteHeader.style.setProperty("--header-opacity", opacity);
    siteHeader.classList.toggle("is-hidden", opacity === 0);
    siteHeader.style.setProperty("--shrink", Number(compact));
    if (heroMotion.matches) {
      heroImage.style.setProperty("--hero-drift", `${Math.min(distance, hero.offsetHeight) * .06}px`);
    }
    mastheadFrame = undefined;
  });
}

window.addEventListener("scroll", updateMasthead, { passive: true });
window.addEventListener("pageshow", updateMasthead);
window.addEventListener("resize", updateMasthead);
reducedMotion.addEventListener("change", updateMasthead);
heroMotion.addEventListener("change", updateMasthead);
updateMasthead();

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      const row = entry.target;
      const repeats = row.matches(".process li, .pricing-options li");

      if (!entry.isIntersecting) {
        if (repeats) row.classList.remove("has-entered");
        continue;
      }
      if (entry.intersectionRatio < 0.12) continue;

      row.classList.add("has-entered");
      if (!repeats) observer.unobserve(row);
    }
  }, { threshold: [0, 0.12] });

  document.querySelectorAll(".interview-video-grid, .about-portrait, .process li, .pricing-options li").forEach((element) => {
    element.classList.add("will-reveal");
    revealObserver.observe(element);
  });
}

const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const mobileNav = matchMedia("(max-width: 740px)");

function closeMenu(returnFocus = false) {
  siteHeader.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  if (returnFocus) menuButton.focus();
}

menuButton.hidden = false;
siteHeader.classList.add("has-mobile-menu");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  siteHeader.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteHeader.classList.contains("menu-open")) closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!siteHeader.contains(event.target)) closeMenu();
});
mobileNav.addEventListener("change", () => closeMenu());
