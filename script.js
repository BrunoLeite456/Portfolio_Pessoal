/* ==========================================================================
   BRUNO RICARDO LEITE — PORTFÓLIO
   Interações: nav mobile, link ativo, reveal on scroll, fundo de circuito
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  markActiveNavLink();
  initReveal();
  initHeroRole();
  initCircuitBackground();
});

/* ---------- Nav mobile ---------- */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

/* ---------- Marca o link ativo pelo path atual ---------- */
function markActiveNavLink() {
  const current = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Efeito de digitação no papel (hero) ---------- */
function initHeroRole() {
  const el = document.querySelector("[data-typewriter]");
  if (!el) return;

  const roles = JSON.parse(el.getAttribute("data-typewriter"));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !roles || !roles.length) {
    el.textContent = roles ? roles[0] : el.textContent;
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 35 : 55);
  };

  type();
}

/* ---------- Fundo de circuito (canvas) ---------- */
function initCircuitBackground() {
  const canvas = document.getElementById("circuit-canvas");
  if (!canvas) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  let width, height, nodes;
  const NODE_COUNT_BASE = 55;
  const LINK_DIST = 150;
  const ACCENT = "232, 98, 44";
  const NEUTRAL = "154, 165, 186";

  function resize() {
    width = canvas.width = canvas.offsetWidth * devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function makeNodes() {
    const area = (canvas.offsetWidth * canvas.offsetHeight) / 900000;
    const count = Math.max(18, Math.round(NODE_COUNT_BASE * area));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.18 * devicePixelRatio,
      accent: Math.random() < 0.12,
      r: Math.random() < 0.12 ? 2.2 : 1.2,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = LINK_DIST * devicePixelRatio;
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.18;
          const color = a.accent || b.accent ? ACCENT : NEUTRAL;
          ctx.strokeStyle = `rgba(${color}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = n.accent ? `rgba(${ACCENT}, 0.55)` : `rgba(${NEUTRAL}, 0.35)`;
      ctx.fill();
    });

    if (!prefersReduced) requestAnimationFrame(step);
  }

  resize();
  makeNodes();
  step();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      makeNodes();
      if (prefersReduced) step();
    }, 200);
  });
}
