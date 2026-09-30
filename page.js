const pageHeader = document.getElementById("siteHeader");
const pageProgress = document.getElementById("scrollProgress");
const pageGlow = document.getElementById("cursorGlow");
const pageMenuButton = document.getElementById("menuButton");
const pageNavPanel = document.getElementById("navPanel");
const pageDropletLayer = document.getElementById("dropletLayer");
const pageYear = document.getElementById("year");

if (pageYear) pageYear.textContent = new Date().getFullYear();

function updatePageScrollUI() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  if (pageHeader) pageHeader.classList.toggle("scrolled", scrollTop > 30);
  if (pageProgress) pageProgress.style.width = `${percentage}%`;
}

window.addEventListener("scroll", updatePageScrollUI, { passive: true });
updatePageScrollUI();

if (pageMenuButton && pageNavPanel) {
  pageMenuButton.addEventListener("click", () => {
    const isOpen = pageNavPanel.classList.toggle("open");
    pageMenuButton.classList.toggle("active", isOpen);
    pageMenuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  pageNavPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      pageNavPanel.classList.remove("open");
      pageMenuButton.classList.remove("active");
      pageMenuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

if (pageGlow) {
  window.addEventListener("pointermove", (event) => {
    pageGlow.style.left = `${event.clientX}px`;
    pageGlow.style.top = `${event.clientY}px`;
  });
}

if ("IntersectionObserver" in window) {
  const pageRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        pageRevealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    pageRevealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
}

function createPageDroplet() {
  if (!pageDropletLayer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const drop = document.createElement("span");
  drop.className = "water-drop";
  const size = 6 + Math.random() * 12;
  const duration = 5 + Math.random() * 7;
  drop.style.left = `${Math.random() * 100}%`;
  drop.style.width = `${size}px`;
  drop.style.height = `${size * 1.45}px`;
  drop.style.animationDuration = `${duration}s`;
  drop.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
  pageDropletLayer.appendChild(drop);
  window.setTimeout(() => drop.remove(), duration * 1000 + 300);
}

if (pageDropletLayer) {
  window.setInterval(createPageDroplet, 900);
  for (let index = 0; index < 5; index += 1) {
    window.setTimeout(createPageDroplet, index * 320);
  }
}
