const header = document.getElementById("siteHeader");
const progress = document.getElementById("scrollProgress");
const cursorGlow = document.getElementById("cursorGlow");
const menuButton = document.getElementById("menuButton");
const navPanel = document.getElementById("navPanel");
const quoteForm = document.getElementById("quoteForm");
const formMessage = document.getElementById("formMessage");
const dropletLayer = document.getElementById("dropletLayer");

document.getElementById("year").textContent = new Date().getFullYear();

/* Header and scroll progress */
function updateScrollUI() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  header.classList.toggle("scrolled", scrollTop > 30);
  progress.style.width = `${percentage}%`;
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

/* Mobile menu */
menuButton.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  menuButton.classList.toggle("active", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navPanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("open");
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

/* Mouse-follow water glow */
window.addEventListener("pointermove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

/* Scroll reveals */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  revealObserver.observe(element);
});

/* All before-and-after sliders */
document.querySelectorAll("[data-comparison]").forEach((comparison) => {
  const range = comparison.querySelector(".comparison-range");
  const before = comparison.querySelector(".comparison-before");
  const effect = comparison.querySelector(".before-effect");
  const line = comparison.querySelector(".comparison-line");

  function update(value) {
    const safeValue = Math.min(100, Math.max(0, Number(value)));
    before.style.width = `${safeValue}%`;
    effect.style.width = `${safeValue}%`;
    line.style.left = `${safeValue}%`;
  }

  range.addEventListener("input", (event) => update(event.target.value));
  update(range.value);
});

/* Counters */
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.target);
      const duration = 1400;
      const start = performance.now();

      function animate(now) {
        const progressValue = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        counter.textContent = Math.floor(target * eased);

        if (progressValue < 1) {
          requestAnimationFrame(animate);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(animate);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

/* Gentle 3D card motion */
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    const rotateX = ((y / rect.height) - 0.5) * -6;

    card.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

/* Falling water droplets */
function createDroplet() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const drop = document.createElement("span");
  drop.className = "water-drop";

  const size = 6 + Math.random() * 12;
  const duration = 5 + Math.random() * 7;
  const left = Math.random() * 100;
  const drift = `${-40 + Math.random() * 80}px`;

  drop.style.left = `${left}%`;
  drop.style.width = `${size}px`;
  drop.style.height = `${size * 1.45}px`;
  drop.style.animationDuration = `${duration}s`;
  drop.style.setProperty("--drift", drift);

  dropletLayer.appendChild(drop);
  setTimeout(() => drop.remove(), duration * 1000 + 300);
}

setInterval(createDroplet, 650);

for (let i = 0; i < 8; i += 1) {
  setTimeout(createDroplet, i * 280);
}

/* Demo form */
quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(quoteForm);
  const name = String(data.get("name") || "").trim();

  formMessage.textContent =
    `Thank you${name ? `, ${name}` : ""}! Your request is ready. The form can be connected to email in the next step.`;

  quoteForm.reset();
});
/* Spray-and-wipe website opening animation */
const cleaningIntro = document.getElementById("cleaningIntro");

if (cleaningIntro) {
  document.body.style.overflow = "hidden";

  window.addEventListener("load", () => {
    setTimeout(() => {
      cleaningIntro.classList.add("intro-finished");
      document.body.style.overflow = "";

      setTimeout(() => {
        cleaningIntro.remove();
      }, 900);
    }, 4100);
  });
}