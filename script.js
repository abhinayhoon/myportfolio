/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PORTFOLIO ENGINE v3
   Boot + Dock + Cinema + Interactions + GSAP + Lenis + Themes
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════
  // 1. LENIS SMOOTH SCROLL (Premium)
  // ═══════════════════════════════════════
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium easing
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Connect Lenis to GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback RAF if GSAP isn't loaded for some reason
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ═══════════════════════════════════════
  // 2. THEME SYSTEM
  // ═══════════════════════════════════════
  const themeToggle = document.getElementById('theme-toggle');
  const themeBtns = document.querySelectorAll('.theme-btn');
  const htmlEl = document.documentElement;

  // Check local storage for saved theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'night';
  setTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const theme = btn.getAttribute('data-theme');
      setTheme(theme);
    });
  });

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    // Update button states
    themeBtns.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.theme-btn[data-theme="${theme}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Slight parallax bump to backgrounds on theme switch for premium feel
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.layer-far',
        { y: '+=5', opacity: 0.9 },
        { y: '-=5', opacity: 1, duration: 1.5, ease: "power2.out" }
      );
    }
  }

  // Show theme toggle slightly after boot
  setTimeout(() => {
    if (themeToggle) themeToggle.classList.add('visible');
  }, 4000);

  // ═══════════════════════════════════════
  // 3. MACBOOK BOOT SEQUENCE
  // ═══════════════════════════════════════
  const bootScreen = document.getElementById('boot-screen');
  const bootBar = document.getElementById('boot-progress');
  const contentLayer = document.getElementById('content-layer');
  const dockWrapper = document.getElementById('dock-wrapper');
  const cinema = document.getElementById('cinema');

  // Hide everything behind boot screen initially
  if (contentLayer) contentLayer.style.opacity = '0';
  if (dockWrapper) dockWrapper.style.opacity = '0';
  if (cinema) cinema.style.opacity = '0';

  let bootProgress = 0;
  const bootInterval = setInterval(() => {
    // Simulate realistic boot: fast start, slow middle, fast end
    if (bootProgress < 30) bootProgress += Math.random() * 8;
    else if (bootProgress < 70) bootProgress += Math.random() * 3;
    else if (bootProgress < 95) bootProgress += Math.random() * 6;
    else bootProgress += Math.random() * 2;

    if (bootProgress >= 100) {
      bootProgress = 100;
      clearInterval(bootInterval);
      if (bootBar) bootBar.style.width = '100%';

      setTimeout(() => {
        if (bootScreen) bootScreen.classList.add('fade-out');
        if (contentLayer) { contentLayer.style.transition = 'opacity 0.8s ease'; contentLayer.style.opacity = '1'; }
        if (dockWrapper) { dockWrapper.style.transition = 'opacity 0.8s ease 0.3s'; dockWrapper.style.opacity = '1'; }
        if (cinema) { cinema.style.transition = 'opacity 0.8s ease'; cinema.style.opacity = '1'; }

        // Trigger Premium Hero GSAP Entrance
        playHeroEntrance();

        setTimeout(() => {
          if (bootScreen) bootScreen.style.display = 'none';
        }, 1000);
      }, 400);
    }
    if (bootBar) bootBar.style.width = bootProgress + '%';
  }, 60);

  function playHeroEntrance() {
    if (typeof gsap === 'undefined') return;

    // Remove CSS initial hide classes so GSAP can take over
    const reveals = document.querySelectorAll('.hero-entrance .reveal');
    reveals.forEach(el => el.classList.remove('reveal', 'reveal-up'));

    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo('.hero-label',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    )
    .fromTo('.hero-name',
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.75)" },
      "-=0.7"
    )
    .fromTo('.hero-last-name',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=1"
    )
    .fromTo('.hero-typewriter',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo('.hero-tagline',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo('.hero-ctas a',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.7)" },
      "-=0.4"
    );

    // Start typewriter after animation
    setTimeout(initTypewriter, 2500);
  }

  // ═══════════════════════════════════════
  // 4. CUSTOM CURSOR
  // ═══════════════════════════════════════
  const macCursor = document.getElementById('mac-cursor');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth <= 768;

  if (!isTouchDevice && window.matchMedia("(pointer:fine)").matches && macCursor) {
    let tickingCursor = false;
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      if (!tickingCursor) {
        requestAnimationFrame(() => {
          macCursor.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
          tickingCursor = false;
        });
        tickingCursor = true;
      }
    }, { passive: true });

    // Attach hover listeners (will re-attach for dock items too)
    function attachHoverListeners() {
      document.querySelectorAll('a, button, .interactive, .skill-pill, .tech-badge, .dock-item, .theme-btn').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
      });
    }
    attachHoverListeners();

    // Re-attach periodically in case dynamic elements are added
    setInterval(attachHoverListeners, 2000);
  } else {
    if (macCursor) macCursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('a, button').forEach(el => { el.style.cursor = 'auto'; });
  }

  // ═══════════════════════════════════════
  // 5. macOS DOCK MAGNIFICATION & NAV
  // ═══════════════════════════════════════
  const dock = document.getElementById('dock');
  const dockItems = document.querySelectorAll('.dock-item');

  if (dock && dockItems.length > 0) {
    // Only enable dock magnification on desktop (not touch)
    if (!isTouchDevice) {
      dock.addEventListener('mousemove', (e) => {
        dockItems.forEach(item => {
          const rect = item.getBoundingClientRect();
          const itemCenterX = rect.left + rect.width / 2;
          const distance = Math.abs(e.clientX - itemCenterX);
          const maxDist = 150;
          const minScale = 1;
          const maxScale = 1.6;

          if (distance < maxDist) {
            const scale = maxScale - ((distance / maxDist) * (maxScale - minScale));
            const icon = item.querySelector('.dock-icon');
            if (icon) {
              icon.style.transform = `scale(${scale})`;
              icon.style.transformOrigin = 'bottom center';
            }
            item.style.marginBottom = ((scale - 1) * 20) + 'px';
          } else {
            const icon = item.querySelector('.dock-icon');
            if (icon) icon.style.transform = 'scale(1)';
            item.style.marginBottom = '0px';
          }
        });
      }, { passive: true });

      dock.addEventListener('mouseleave', () => {
        dockItems.forEach(item => {
          const icon = item.querySelector('.dock-icon');
          if (icon) {
            icon.style.transform = 'scale(1)';
            icon.style.transition = 'transform 0.3s ease';
          }
          item.style.marginBottom = '0px';
          setTimeout(() => {
            if (icon) icon.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
          }, 300);
        });
      });
    }

    // Dock section navigation click handlers using Lenis smooth scroll
    dockItems.forEach(item => {
      const href = item.getAttribute('data-href');
      if (href) {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          lenis.scrollTo(href, { offset: isTouchDevice ? -20 : -50 });
        });
        item.style.cursor = isTouchDevice ? 'auto' : 'none';
      }
    });
  }

  // Handle CTA buttons with Lenis
  document.querySelectorAll('.hero-ctas a, a[href^="#"]').forEach(anchor => {
    if (anchor.classList.contains('dock-item')) return; // handled above

    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        lenis.scrollTo(targetId, { offset: -50 });
      }
    });
  });

  // ═══════════════════════════════════════
  // 6. HERO TYPEWRITER
  // ═══════════════════════════════════════
  function initTypewriter() {
    const typewriterEl = document.getElementById('hero-typewriter');
    const phrases = [
      "turning diet-coke into code.",
      "building ai that mass reports bugs... wait.",
      "committed. literally. git push origin main.",
      "my code works. i don't know why.",
      "stack overflow is my co-founder.",
    ];

    if (typewriterEl) {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      function typeLoop() {
        const currentPhrase = phrases[phraseIndex];
        if (!deleting) {
          typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
          charIndex++;
          if (charIndex === currentPhrase.length) {
            deleting = true;
            setTimeout(typeLoop, 2000); // pause before deleting
            return;
          }
          setTimeout(typeLoop, 60 + Math.random() * 40);
        } else {
          typewriterEl.textContent = currentPhrase.substring(0, charIndex);
          charIndex--;
          if (charIndex < 0) {
            deleting = false;
            charIndex = 0;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeLoop, 400);
            return;
          }
          setTimeout(typeLoop, 30);
        }
      }
      typeLoop();
    }
  }

  // ═══════════════════════════════════════
  // 7. 3D TILT FOR GLASS CARDS
  // ═══════════════════════════════════════
  // 3D tilt only on desktop - skip on touch devices
  if (!isTouchDevice) {
    document.querySelectorAll('.glass.interactive').forEach(card => {
      // Skip dock elements
      if (card.closest('#dock') || card.closest('.social-links')) return;

      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const cx = r.width / 2;
        const cy = r.height / 2;
        const rotX = ((e.clientY - r.top - cy) / cy) * -6;
        const rotY = ((e.clientX - r.left - cx) / cx) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease';
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
      });
    });
  }

  // ═══════════════════════════════════════
  // 8. GSAP SCROLLTRIGGER REVEALS
  // ═══════════════════════════════════════
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    
    // Animate section titles
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.fromTo(title, 
        { opacity: 0, y: 30, skewY: 2 },
        {
          opacity: 1, y: 0, skewY: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Glass containers stagger
    gsap.utils.toArray('.glass-container').forEach(container => {
      gsap.fromTo(container,
        { opacity: 0, y: 60, scale: 0.98 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
          }
        }
      );
    });

    // Profile Picture Parallax & Glow
    const profilePic = document.querySelector('.profile-picture');
    if (profilePic) {
      gsap.to(profilePic, {
        y: -50,
        scrollTrigger: {
          trigger: "#quote-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
      
      gsap.fromTo(profilePic, 
        { scale: 0.8, opacity: 0, filter: "blur(10px)" },
        { 
          scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power4.out",
          scrollTrigger: {
            trigger: "#quote-section",
            start: "top 70%",
          }
        }
      );
    }

    // Projects stagger
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50, rotateX: 10 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 1, delay: i * 0.15, ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 80%",
          }
        }
      );
    });

    // Timeline stagger
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 0.8, delay: i * 0.2, ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".timeline",
            start: "top 80%",
          }
        }
      );
    });

    // Achievements scale stagger
    gsap.utils.toArray('.achieve-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1, scale: 1, duration: 0.8, delay: (i % 3) * 0.15, ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: card.parentElement,
            start: "top 85%",
          }
        }
      );
    });

    // Blog cards fan out
    gsap.utils.toArray('.blog-card').forEach((card, i) => {
      const rotations = [-5, 0, 5];
      gsap.fromTo(card,
        { opacity: 0, y: 100, rotation: 0 },
        {
          opacity: 1, y: 0, rotation: rotations[i], duration: 1, delay: i * 0.15, ease: "power4.out",
          scrollTrigger: {
            trigger: ".blog-grid",
            start: "top 80%",
          }
        }
      );
    });

    // Skill bars
    gsap.utils.toArray('.skill-category').forEach(cat => {
      ScrollTrigger.create({
        trigger: cat,
        start: "top 85%",
        onEnter: () => {
          cat.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
          });
        }
      });
    });

    // Contact giant text
    gsap.fromTo('.contact-giant',
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: "#contact",
          start: "top 80%",
        }
      }
    );

    // Generic reveals for elements not specifically handled above
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.closest('.hero-entrance') || 
          el.classList.contains('glass-container') ||
          el.classList.contains('profile-picture') ||
          el.classList.contains('project-card') ||
          el.classList.contains('timeline-item') ||
          el.classList.contains('achieve-card') ||
          el.classList.contains('blog-card') ||
          el.classList.contains('contact-giant')) return;

      let yOffset = 0;
      let xOffset = 0;
      let scaleStart = 1;

      if (el.classList.contains('reveal-up')) yOffset = 50;
      else if (el.classList.contains('reveal-left')) xOffset = -50;
      else if (el.classList.contains('reveal-right')) xOffset = 50;
      else if (el.classList.contains('reveal-scale')) scaleStart = 0.85;

      gsap.fromTo(el,
        { opacity: 0, x: xOffset, y: yOffset, scale: scaleStart },
        {
          opacity: 1, x: 0, y: 0, scale: 1,
          duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          }
        }
      );
    });

  } else {
    // Fallback IntersectionObserver if GSAP fails to load
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('active');
            const bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach(bar => {
              bar.style.width = bar.getAttribute('data-width');
            });
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ═══════════════════════════════════════
  // 9. CINEMATIC SCROLL ENGINE
  // ═══════════════════════════════════════
  const scenes = document.querySelectorAll('.scene');
  const numScenes = scenes.length;

  if (numScenes > 0) {
    let ticking = false;

    function updateCinema() {
      const scrollY = window.scrollY;
      const docHeight = Math.max(
        document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      const scrollProgress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
      const sceneRange = 1 / numScenes;

      scenes.forEach((scene, index) => {
        const sceneStart = index * sceneRange;
        const sceneEnd = sceneStart + sceneRange;
        let opacity = 0;
        const crossfadeAmount = sceneRange * 0.15;

        if (scrollProgress >= sceneStart - crossfadeAmount && scrollProgress <= sceneEnd + crossfadeAmount) {
          if (scrollProgress < sceneStart) {
            opacity = (scrollProgress - (sceneStart - crossfadeAmount)) / crossfadeAmount;
          } else if (scrollProgress > sceneEnd) {
            opacity = 1 - ((scrollProgress - sceneEnd) / crossfadeAmount);
          } else {
            opacity = 1;
          }

          const sceneLocalProgress = (scrollProgress - sceneStart) / sceneRange;
          const layers = scene.querySelectorAll('.layer');
          layers.forEach(layer => {
            let speed = 0;
            if (layer.classList.contains('layer-far')) speed = 0.08;
            else if (layer.classList.contains('layer-mid')) speed = 0.15;
            else if (layer.classList.contains('layer-close')) speed = 0.3;
            const moveY = (sceneLocalProgress - 0.5) * speed * winHeight;
            layer.style.transform = `translateY(${moveY}px)`;
          });

          // Scene 7 keyboard animation
          if (index === 6 && opacity > 0.5) {
            const keys = scene.querySelectorAll('.key');
            if (keys.length > 0 && Math.random() > 0.8) {
              const rk = keys[Math.floor(Math.random() * keys.length)];
              rk.classList.add('pressed');
              setTimeout(() => rk.classList.remove('pressed'), 150);
            }
          }

          // Scene 7 particles
          if (index === 6 && opacity > 0.8 && Math.random() > 0.7) {
            createParticle(scene.querySelector('.particles'));
          }
        }

        scene.style.opacity = opacity.toFixed(3);
        scene.style.visibility = opacity <= 0 ? 'hidden' : 'visible';
      });

      ticking = false;
    }

    // Since we're using Lenis, we can listen to Lenis scroll event
    lenis.on('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(updateCinema); ticking = true; }
    });

    // Also listen to native scroll as a fallback/initial trigger
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(updateCinema); ticking = true; }
    }, { passive: true });

    updateCinema();
  }

  function createParticle(container) {
    if (!container) return;
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = (40 + Math.random() * 20) + '%';
    container.appendChild(p);
    const duration = 1000 + Math.random() * 2000;
    const destY = -(100 + Math.random() * 300) + 'px';
    const destX = (Math.random() - 0.5) * 200 + 'px';
    p.animate([
      { transform: 'translate(0, 0)', opacity: 1 },
      { transform: `translate(${destX}, ${destY})`, opacity: 0 }
    ], { duration, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', fill: 'forwards' });
    setTimeout(() => { if (p.parentNode === container) container.removeChild(p); }, duration);
  }

});
