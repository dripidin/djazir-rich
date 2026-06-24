/* ==========================================================================
   DJAZAIR RICH — SULTAN DARO
   Main JavaScript Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. STICKY HEADER
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('site-header');

  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  const navToggle   = document.getElementById('nav-toggle');
  const navMobile   = document.getElementById('nav-mobile');
  const navBackdrop = document.getElementById('nav-backdrop');
  const mobileLinks = navMobile.querySelectorAll('.mobile-nav-link, .btn');

  function openNav() {
    navMobile.classList.add('open');
    navBackdrop.classList.add('visible');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'إغلاق القائمة');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navMobile.classList.remove('open');
    navBackdrop.classList.remove('visible');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'فتح القائمة');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    navToggle.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
  });

  navBackdrop.addEventListener('click', closeNav);

  mobileLinks.forEach(link => link.addEventListener('click', closeNav));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMobile.classList.contains('open')) closeNav();
  });


  /* --------------------------------------------------------------------------
     3. GALLERY — DESKTOP / MOBILE RESPONSIVE SWITCH
     -------------------------------------------------------------------------- */
  const galleryDesktop = document.getElementById('gallery-desktop');
  const galleryMobile  = document.getElementById('gallery-mobile');
  const gallerySlider  = document.getElementById('gallery-slider');
  const galleryDots    = document.querySelectorAll('.gallery-dot');

  let currentSlide     = 0;
  let galleryInterval  = null;
  let isDesktop        = window.innerWidth >= 768;

  function applyGalleryMode() {
    isDesktop = window.innerWidth >= 768;
    if (isDesktop) {
      galleryDesktop.style.display = 'grid';
      galleryMobile.style.display  = 'none';
      clearInterval(galleryInterval);
    } else {
      galleryDesktop.style.display = 'none';
      galleryMobile.style.display  = 'block';
      startSliderAutoplay();
    }
  }

  function goToSlide(index) {
    const slides = gallerySlider.children;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlide = index;

    // RTL-aware: slides go right-to-left visually, so translate is positive
    gallerySlider.style.transform = `translateX(${currentSlide * 100}%)`;

    galleryDots.forEach((dot, i) => {
      const isActive = i === currentSlide;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive.toString());
    });
  }

  function startSliderAutoplay() {
    clearInterval(galleryInterval);
    galleryInterval = setInterval(() => goToSlide(currentSlide + 1), 3800);
  }

  // Dot click
  galleryDots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide, 10));
      // Reset autoplay timer on manual interaction
      if (!isDesktop) startSliderAutoplay();
    });
  });

  // Touch/swipe support for slider
  let touchStartX = 0;
  let touchEndX   = 0;

  gallerySlider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  gallerySlider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    // In RTL, swipe right = next, swipe left = prev (reversed)
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      if (!isDesktop) startSliderAutoplay();
    }
  }, { passive: true });

  // Initial setup + resize listener
  applyGalleryMode();
  window.addEventListener('resize', applyGalleryMode, { passive: true });


  /* --------------------------------------------------------------------------
     4. SCROLL REVEAL ANIMATION (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }


  /* --------------------------------------------------------------------------
     5. ORDER FORM — VALIDATION & SUBMISSION
     -------------------------------------------------------------------------- */
  const orderForm    = document.getElementById('order-form');
  const submitBtn    = document.getElementById('order-submit');
  const successModal = document.getElementById('success-modal');
  const modalClose   = document.getElementById('modal-close');

  if (orderForm) {
    orderForm.addEventListener('submit', handleFormSubmit);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const nameInput   = document.getElementById('fname');
    const phoneInput  = document.getElementById('fphone');
    const wilayaInput = document.getElementById('fwilaya');

    let isValid = true;

    // — Name validation
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      setFieldError(nameInput, true);
      isValid = false;
    } else {
      setFieldError(nameInput, false);
    }

    // — Phone validation (Algerian pattern: 0X XX XX XX XX)
    const phoneClean = phoneInput.value.replace(/\s+/g, '');
    const phoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
    if (!phoneRegex.test(phoneClean)) {
      setFieldError(phoneInput, true);
      isValid = false;
    } else {
      setFieldError(phoneInput, false);
    }

    // — Wilaya validation
    if (!wilayaInput.value) {
      setFieldError(wilayaInput, true);
      isValid = false;
    } else {
      setFieldError(wilayaInput, false);
    }

    if (!isValid) {
      // Scroll to first error
      const firstError = orderForm.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // — Collect values
    const name   = nameInput.value.trim();
    const phone  = phoneInput.value.trim();
    const wilaya = wilayaInput.options[wilayaInput.selectedIndex].text;

    // — Loading state
    submitBtn.textContent = 'جاري الإرسال...';
    submitBtn.disabled    = true;

    try {
      // POST to the Node.js server → Resend API
      const response = await fetch('/api/order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          full_name: name,
          phone:     phone,
          wilaya:    wilaya
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ Success
        openSuccessModal();
        orderForm.reset();
      } else {
        // Server responded but with an error — fall back to WhatsApp
        console.warn('[Order] Server error, falling back to WhatsApp:', data.message);
        openWhatsAppFallback(name, phone, wilaya);
        openSuccessModal();
        orderForm.reset();
      }
    } catch (networkErr) {
      // Network failure — fall back to WhatsApp so no order is ever lost
      console.warn('[Order] Network error, falling back to WhatsApp:', networkErr);
      openWhatsAppFallback(name, phone, wilaya);
      openSuccessModal();
      orderForm.reset();
    } finally {
      submitBtn.textContent = '✅ تأكيد الطلب';
      submitBtn.disabled    = false;
    }
  }

  function setFieldError(field, hasError) {
    field.classList.toggle('error', hasError);
    field.setAttribute('aria-invalid', hasError.toString());
    if (hasError) {
      field.setAttribute('aria-describedby', field.id + '-error');
    } else {
      field.removeAttribute('aria-describedby');
    }
  }

  // WhatsApp fallback — opens a pre-filled message if the server is unreachable
  function openWhatsAppFallback(name, phone, wilaya) {
    const message = encodeURIComponent(
      `مرحباً، أريد طلب طاولة سلطان دارو 🪑\n\n` +
      `الاسم: ${name}\n` +
      `الهاتف: ${phone}\n` +
      `الولاية: ${wilaya}\n\n` +
      `شكراً 🙏`
    );
    window.open(`https://wa.me/213558102711?text=${message}`, '_blank');
  }

  // Live validation — remove error on user input
  [
    document.getElementById('fname'),
    document.getElementById('fphone'),
    document.getElementById('fwilaya')
  ].forEach(field => {
    if (!field) return;
    field.addEventListener('input', () => setFieldError(field, false));
    field.addEventListener('change', () => setFieldError(field, false));
  });


  /* --------------------------------------------------------------------------
     6. SUCCESS MODAL
     -------------------------------------------------------------------------- */
  function openSuccessModal() {
    successModal.classList.add('open');
    successModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Focus the close button for accessibility
    setTimeout(() => modalClose && modalClose.focus(), 100);
  }

  function closeSuccessModal() {
    successModal.classList.remove('open');
    successModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeSuccessModal);
  }

  // Close on backdrop click
  successModal && successModal.addEventListener('click', e => {
    if (e.target === successModal) closeSuccessModal();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && successModal.classList.contains('open')) {
      closeSuccessModal();
    }
  });


  /* --------------------------------------------------------------------------
     7. SMOOTH SCROLL for anchor links (enhances default scroll-behavior)
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const headerHeight = siteHeader.offsetHeight + 8;
      const targetTop    = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

});
