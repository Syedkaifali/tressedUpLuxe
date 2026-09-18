// TressedUp Luxe - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', function() {
    setTimeout(function() {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'visible';
    }, 2000);
  });
  document.body.style.overflow = 'hidden';

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
    updateActiveNavLink();
  });

  // ===== MOBILE NAV TOGGLE =====
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', function() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when link clicked
  document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ===== ACTIVE NAV LINK =====
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');

      if (navLink) {
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
          navLink.classList.add('active');
        }
      }
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ===== BACK TO TOP =====
  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== SCROLL ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Add fade-in class to elements
  const animateElements = document.querySelectorAll(
    '.service-card, .testimonial-card, .gallery-item, .about-feature, .contact-item'
  );
  animateElements.forEach(function(el, index) {
    el.classList.add('fade-in');
    el.style.transitionDelay = (index % 3) * 0.1 + 's';
    observer.observe(el);
  });

  // ===== MOBILE GALLERY CAROUSEL =====
  const galleryGrid = document.querySelector('.gallery-grid');
  const galleryItems = galleryGrid ? Array.from(galleryGrid.querySelectorAll('.gallery-item')) : [];
  const galleryPrev = document.querySelector('.gallery-prev');
  const galleryNext = document.querySelector('.gallery-next');
  const galleryCurrent = document.querySelector('.gallery-current');
  const galleryTotal = document.querySelector('.gallery-total');

  if (galleryGrid && galleryItems.length && galleryPrev && galleryNext) {
    const formatSlideNumber = function(number) {
      return String(number).padStart(2, '0');
    };

    if (galleryTotal) galleryTotal.textContent = formatSlideNumber(galleryItems.length);

    const getCurrentGalleryIndex = function() {
      const gridCenter = galleryGrid.scrollLeft + galleryGrid.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      galleryItems.forEach(function(item, index) {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(gridCenter - itemCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    };

    const updateGalleryCounter = function() {
      if (galleryCurrent) galleryCurrent.textContent = formatSlideNumber(getCurrentGalleryIndex() + 1);
    };

    const goToGallerySlide = function(index) {
      const wrappedIndex = (index + galleryItems.length) % galleryItems.length;
      galleryItems[wrappedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    galleryPrev.addEventListener('click', function() {
      goToGallerySlide(getCurrentGalleryIndex() - 1);
    });

    galleryNext.addEventListener('click', function() {
      goToGallerySlide(getCurrentGalleryIndex() + 1);
    });

    let galleryScrollTimer;
    galleryGrid.addEventListener('scroll', function() {
      window.clearTimeout(galleryScrollTimer);
      galleryScrollTimer = window.setTimeout(updateGalleryCounter, 80);
    }, { passive: true });

    window.addEventListener('resize', updateGalleryCounter);
    updateGalleryCounter();
  }

  // ===== SET MIN DATE FOR BOOKING =====
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);

    // Set max date (3 months ahead)
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
  }

  // ===== BOOKING FORM =====
  const bookingForm = document.getElementById('booking-form');
  const bookingSuccess = document.getElementById('booking-success');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validate form
      if (!validateForm()) return;

      // Show loading state
      const btnText = bookingForm.querySelector('.btn-text');
      const btnLoading = bookingForm.querySelector('.btn-loading');
      const submitBtn = bookingForm.querySelector('button[type="submit"]');

      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-flex';
      submitBtn.disabled = true;

      // Collect form data
      const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        message: document.getElementById('message').value
      };

      // Simulate form submission (replace with actual backend/email service)
      setTimeout(function() {
        // Build WhatsApp message
        const serviceName = document.getElementById('service').options[document.getElementById('service').selectedIndex].text;
        const dateFormatted = new Date(formData.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeFormatted = formatTime(formData.time);

        const whatsappMsg = encodeURIComponent(
          "Hello TressedUp Luxe! I'd like to book an appointment.\n\n" +
          "Name: " + formData.name + "\n" +
          "Phone: " + formData.phone + "\n" +
          "Service: " + serviceName + "\n" +
          "Date: " + dateFormatted + "\n" +
          "Time: " + timeFormatted + "\n" +
          (formData.message ? "Notes: " + formData.message : "")
        );

        // Open WhatsApp with pre-filled message
        window.open("https://wa.me/919316132780?text=" + whatsappMsg, "_blank");

        // Show success message
        bookingForm.style.display = 'none';
        bookingSuccess.style.display = 'block';
      }, 1500);
    });
  }

  function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return h12 + ':' + minutes + ' ' + ampm;
  }

  function validateForm() {
    let isValid = true;
    const required = bookingForm.querySelectorAll('[required]');

    required.forEach(function(field) {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        isValid = false;
      }
    });

    // Phone validation
    const phone = document.getElementById('phone');
    if (phone && phone.value) {
      const phoneRegex = /^[+]?[0-9]{10,15}$/;
      if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
        phone.style.borderColor = '#e74c3c';
        isValid = false;
        showNotification('Please enter a valid phone number', 'error');
      }
    }

    if (!isValid) {
      showNotification('Please fill in all required fields', 'error');
    }

    return isValid;
  }

  // ===== NOTIFICATION =====
  function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.style.cssText = [
      'position: fixed',
      'top: 100px',
      'right: 2rem',
      'background: ' + (type === 'error' ? '#e74c3c' : '#27ae60'),
      'color: white',
      'padding: 1rem 1.5rem',
      'font-size: 0.9rem',
      'z-index: 9999',
      'animation: slideIn 0.3s ease',
      'max-width: 300px',
      'border-left: 4px solid rgba(255,255,255,0.5)'
    ].join(';');
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(function() {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s ease';
      setTimeout(function() { notification.remove(); }, 300);
    }, 3000);
  }

  // ===== GALLERY LIGHTBOX (simple) =====
  document.querySelectorAll('.gallery-item').forEach(function(item) {
    item.addEventListener('click', function() {
      const label = this.querySelector('span');
      if (label) {
        showNotification('Follow @tressedup.luxe on Instagram to see our full portfolio!', 'success');
      }
    });
  });

  // ===== COUNTER ANIMATION =====
  function animateCounter(el, target, suffix) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(function() {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 30);
  }

  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(function(stat) {
          const text = stat.textContent;
          if (text.includes('500')) animateCounter(stat, 500, '+');
          else if (text.includes('5')) animateCounter(stat, 5, '★');
          else if (text.includes('50')) animateCounter(stat, 50, '+');
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // ===== PARALLAX EFFECT =====
  window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && scrolled < window.innerHeight) {
      heroBg.style.transform = 'translateY(' + scrolled * 0.3 + 'px)';
    }
  });

  // ===== PRICE MENU TABS =====
  const priceTabs = document.querySelectorAll('.price-tab');
  const priceContents = document.querySelectorAll('.price-tab-content');

  priceTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');

      // Remove active from all tabs and contents
      priceTabs.forEach(function(t) { t.classList.remove('active'); });
      priceContents.forEach(function(c) { c.classList.remove('active'); });

      // Activate clicked tab and its content
      this.classList.add('active');
      var targetContent = document.getElementById('tab-' + targetTab);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  console.log('TressedUp Luxe website loaded successfully!');
});

// ===== RESET FORM =====
function resetForm() {
  const bookingForm = document.getElementById('booking-form');
  const bookingSuccess = document.getElementById('booking-success');
  if (bookingForm && bookingSuccess) {
    bookingForm.reset();
    bookingForm.style.display = 'block';
    bookingSuccess.style.display = 'none';
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const btnText = bookingForm.querySelector('.btn-text');
    const btnLoading = bookingForm.querySelector('.btn-loading');
    if (submitBtn) submitBtn.disabled = false;
    if (btnText) btnText.style.display = 'inline';
    if (btnLoading) btnLoading.style.display = 'none';
  }
}
