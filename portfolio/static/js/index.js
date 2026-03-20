// ── About accordion ──────────────────────────────
  function toggleAbout(btn) {
    const extra = document.getElementById('aboutExtra');
    const arrow = document.getElementById('aboutArrow');
    const label = btn.querySelector('.about-btn-label');
    const isOpen = extra.style.maxHeight !== '0px' && extra.style.maxHeight !== '';

    if (isOpen) {
      extra.style.maxHeight = '0';
      extra.style.opacity = '0';
      arrow.style.transform = 'rotate(0deg)';
      label.textContent = 'Read more';
    } else {
      extra.style.maxHeight = extra.scrollHeight + 'px';
      extra.style.opacity = '1';
      arrow.style.transform = 'rotate(180deg)';
      label.textContent = 'Read less';
    }
  }

  // ── Navbar scroll effect ─────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── Mobile menu ──────────────────────────────────
  function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
  }
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
  });

  // ── Cursor glow ───────────────────────────────────
  const glow = document.getElementById('cursorGlow');
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

  // ── Typing effect ─────────────────────────────────
  let pi = 0, ci = 0, deleting = false;
  const el = document.getElementById('typingText');
  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  type();

  // ── Intersection Observer — reveal & skill bars ───
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars inside this element
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(() => {
            bar.style.transition = 'transform .8s ease';
            bar.style.width = w;
          });
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Skill chip observer for bar animation ─────────
  const chipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        chipObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-chip').forEach(c => chipObserver.observe(c));

  // ── Contact form submit ────────────────────────────
  function sendMessage() {
    const name    = document.getElementById('nameField').value.trim();
    const email   = document.getElementById('emailField').value.trim();
    const subject = document.getElementById('subjectField').value.trim();
    const message = document.getElementById('messageField').value.trim();
    const msgBox  = document.getElementById('formMessage');

    msgBox.className = 'form-message';
    msgBox.style.display = 'none';

    if (!name || !email || !message) {
      msgBox.textContent = 'Please fill in your name, email, and message.';
      msgBox.className = 'form-message error';
      return;
    }

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const formData  = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('csrfmiddlewaretoken', csrfToken);

    fetch('/', { method: 'POST', body: formData })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          msgBox.textContent = '✓ Message sent! I\'ll get back to you soon.';
          msgBox.className = 'form-message success';
          document.getElementById('nameField').value = '';
          document.getElementById('emailField').value = '';
          document.getElementById('subjectField').value = '';
          document.getElementById('messageField').value = '';
        } else {
          msgBox.textContent = '✗ Something went wrong. Please try again.';
          msgBox.className = 'form-message error';
        }
      })
      .catch(() => {
        msgBox.textContent = '✗ Network error. Please try again.';
        msgBox.className = 'form-message error';
      });
  }