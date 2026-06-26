
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".hero-copy, .hero-photo, .page-hero, .image-hero, .feature-card, .price-card, .team-card, .partner-grid article, .steps article, .quote-section, .gallery img, .reveal, .timeline-item").forEach((el, i) => {
      gsap.from(el, {
        y: 42,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        delay: Math.min(i * 0.03, 0.18),
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        }
      });
    });

    gsap.utils.toArray(".wide-img, .image-hero img, .hero-photo img").forEach((img) => {
      gsap.to(img, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  // Animated counters
  const counters = document.querySelectorAll(".counter");
  const runCounter = (counter) => {
    const target = Number(counter.dataset.target || "0");
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (counters.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach(counter => observer.observe(counter));
  }

  // Interactive journey timeline
  const buttons = document.querySelectorAll(".timeline-btn");
  const items = document.querySelectorAll(".timeline-item");

  const selectStep = (step, shouldScroll = true) => {
    buttons.forEach(btn => btn.classList.toggle("active", btn.dataset.step === step));
    items.forEach(item => {
      const active = item.dataset.step === step;
      item.classList.toggle("active", active);

      if (active && shouldScroll) {
        const y = item.getBoundingClientRect().top + window.pageYOffset - 170;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  };

  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      selectStep(btn.dataset.step, true);
    });
  });

  items.forEach(item => {
    item.addEventListener("click", () => selectStep(item.dataset.step, false));
  });

  // Dark mode with ripple animation
  const toggle = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem("biaBoxTheme");

  if (savedTheme === "dark") document.body.classList.add("dark-mode");

  if (toggle) {
    toggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";

    toggle.addEventListener("click", () => {
      const rect = toggle.getBoundingClientRect();
      document.documentElement.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
      document.documentElement.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);
      document.documentElement.classList.add("theme-changing");

      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("biaBoxTheme", isDark ? "dark" : "light");
      toggle.textContent = isDark ? "☀️" : "🌙";

      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-changing");
      }, 700);
    });
  }
});
