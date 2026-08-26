/**
 * FACTUTEC - Lógica Global de la Aplicación
 * Scroll Reveal Dinámico, Menú móvil, FAQs, contadores y validaciones.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Scroll Progress Bar
  let progressBar = document.querySelector(".scroll-progress-bar");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.className = "scroll-progress-bar";
    document.body.prepend(progressBar);
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = scrollPercent + "%";
    }
  }

  // 2. Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function openMobileMenu() {
    if (!mobileDrawer || !mobileOverlay) return;
    mobileDrawer.classList.add("open");
    mobileOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!mobileDrawer || !mobileOverlay) return;
    mobileDrawer.classList.remove("open");
    mobileOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener("click", closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // 3. Sticky Navbar on Scroll
  const headerNav = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    updateScrollProgress();

    if (!headerNav) return;
    if (window.scrollY > 20) {
      headerNav.classList.add("scrolled");
    } else {
      headerNav.classList.remove("scrolled");
    }
  }, { passive: true });

  // 4. Scroll Reveal Intersection Observer System
  // Automatically tag elements for fluid scroll animations
  const sectionHeaders = document.querySelectorAll(".section-header");
  sectionHeaders.forEach((sh) => sh.classList.add("reveal"));

  const bentoGrids = document.querySelectorAll(".bento-grid");
  bentoGrids.forEach((bg) => bg.classList.add("reveal-stagger"));

  const statsGrid = document.querySelector(".stats-grid");
  if (statsGrid) statsGrid.classList.add("reveal-stagger");

  const posSimWrapper = document.querySelector(".pos-sim-wrapper");
  if (posSimWrapper) posSimWrapper.classList.add("reveal-scale");

  const clientsGrid = document.getElementById("clients-grid");
  if (clientsGrid) clientsGrid.classList.add("reveal-stagger");

  const calcWrapper = document.querySelector(".calculator-wrapper");
  if (calcWrapper) calcWrapper.classList.add("reveal");

  const compareWrapper = document.querySelector(".compare-table-wrapper");
  if (compareWrapper) compareWrapper.classList.add("reveal");

  const aboutGrid = document.querySelector(".about-grid");
  if (aboutGrid) aboutGrid.classList.add("reveal-stagger");

  const faqContainer = document.querySelector(".faq-container");
  if (faqContainer) faqContainer.classList.add("reveal-stagger");

  const contactGrid = document.querySelector(".contact-grid");
  if (contactGrid) contactGrid.classList.add("reveal-stagger");

  // Observer
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger");
  
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Optionally unobserve to keep visible
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // 5. FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all other FAQs
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
          const ans = other.querySelector(".faq-answer");
          if (ans) ans.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add("open");
        const answer = item.querySelector(".faq-answer");
        if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        item.classList.remove("open");
        const answer = item.querySelector(".faq-answer");
        if (answer) answer.style.maxHeight = null;
      }
    });
  });

  // 6. Stat Counter Animation on Scroll Observer
  const statsElements = document.querySelectorAll(".counter-number");
  let animated = false;

  function animateCounters() {
    statsElements.forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 1800; // ms
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString("es-AR");
      }, stepTime);
    });
  }

  if (statsElements.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.2 }
    );

    const statsSection = document.querySelector(".stats-section");
    if (statsSection) statsObserver.observe(statsSection);
  }

  // 7. Contact Form Submission Handling
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("contact-name")?.value.trim() || "";
      const phone = document.getElementById("contact-phone")?.value.trim() || "";
      const business = document.getElementById("contact-business")?.value.trim() || "";
      const message = document.getElementById("contact-message")?.value.trim() || "";

      if (!name || !phone) {
        if (formFeedback) {
          formFeedback.innerHTML = `<div class="alert alert-error">Por favor completá tu nombre y teléfono.</div>`;
        }
        return;
      }

      // Format WhatsApp Message
      const waText = `Hola FactuTec! Mi nombre es *${name}* (${phone}).\nTengo un negocio llamado *${business}*.\nConsulta: ${message}`;
      const waUrl = `https://wa.me/5492634588805?text=${encodeURIComponent(waText)}`;

      if (formFeedback) {
        formFeedback.innerHTML = `
          <div class="alert alert-success">
            <strong>¡Gracias ${name}!</strong> Tu consulta ha sido preparada.
            <br>
            <a href="${waUrl}" target="_blank" class="btn btn-primary btn-sm mt-2">Continuar por WhatsApp con Joel Guevara</a>
          </div>
        `;
      }

      contactForm.reset();
      window.open(waUrl, "_blank");
    });
  }

  // 8. 3D Tilt Microinteraction for Bento & Collage Cards (Desktop)
  if (window.matchMedia("(min-width: 1024px)").matches) {
    const tiltCards = document.querySelectorAll(".tilt-card");
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  // Trigger initial progress check
  updateScrollProgress();
});
