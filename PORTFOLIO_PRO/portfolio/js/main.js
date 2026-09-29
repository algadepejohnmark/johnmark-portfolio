
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) {  }

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

const navToggle = document.getElementById("nav-toggle");
const navList = document.getElementById("nav-list");
navToggle.addEventListener("click", () => {
  const open = navList.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});

const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-list a").forEach(link => {
  if (link.getAttribute("href") === currentPage) link.classList.add("active");
});

const topBtn = document.getElementById("to-top");
window.addEventListener("scroll", () => {
  topBtn.classList.toggle("show", window.scrollY > 300);
});
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const typingEl = document.getElementById("typing-text");
if (typingEl) {
  const words = ["student", "web developer", "problem solver"];
  let w = 0, c = 0, deleting = false;
  function type() {
    const word = words[w];
    typingEl.textContent = word.slice(0, c);
    if (!deleting && c < word.length) c++;
    else if (!deleting) { deleting = true; setTimeout(type, 1200); return; }
    else if (c > 0) c--;
    else { deleting = false; w = (w + 1) % words.length; }
    setTimeout(type, deleting ? 60 : 110);
  }
  type();
}

const rings = document.querySelectorAll(".ring");
if (rings.length) {
  function animateRing(ring) {
    const target = Number(ring.dataset.level);
    const label = ring.querySelector("span");
    const start = performance.now();
    const duration = 1000;
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * progress);
      ring.style.setProperty("--p", value);
      label.textContent = value + "%";
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const ringObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateRing(entry.target);
        ringObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  rings.forEach(r => ringObserver.observe(r));

  const tabBtns = document.querySelectorAll(".tab-btn");
  const skillCards = document.querySelectorAll(".skill-card");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      skillCards.forEach(card => {
        const show = btn.dataset.tab === "all" || card.dataset.cat === btn.dataset.tab;
        card.classList.toggle("hide", !show);
        if (show) animateRing(card.querySelector(".ring"));
      });
    });
  });
}

const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project");
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !show);
    });
  });
});

const modal = document.getElementById("modal");
if (modal) {
  const modalImg = document.getElementById("modal-img");
  document.querySelectorAll(".project-img").forEach(img => {
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.hidden = false;
    });
  });
  const closeModal = () => { modal.hidden = true; };
  document.getElementById("modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}

document.querySelectorAll(".acc-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const panel = btn.nextElementSibling;
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", !isOpen);
    panel.style.maxHeight = isOpen ? "0" : panel.scrollHeight + "px";
  });
});

const form = document.getElementById("contact-form");
if (form) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showError(id, message) {
    document.getElementById(id + "-error").textContent = message;
    document.getElementById(id).classList.toggle("invalid", message !== "");
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    if (name.length < 2) { showError("name", "Please enter your name."); valid = false; }
    else showError("name", "");

    if (!emailPattern.test(email)) { showError("email", "Please enter a valid email address."); valid = false; }
    else showError("email", "");

    if (message.length < 10) { showError("message", "Message must be at least 10 characters."); valid = false; }
    else showError("message", "");

    const success = document.getElementById("form-success");
    success.hidden = !valid;
    if (valid) form.reset();
  });
}
