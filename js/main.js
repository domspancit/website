/**
 * DOM'S Pancit — Main JavaScript
 * ============================================================
 * Sections:
 *  1. Sticky Navbar (scroll shadow)
 *  2. Hamburger Menu (toggle)
 *  3. Menu Tabs (show/hide panels)
 *  4. Smooth Scroll Fallback
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

  /* =========================================================
     1. STICKY NAVBAR
     Add/remove .scrolled class on the navbar based on
     the window scroll position. CSS handles the shadow.
  ========================================================= */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Run on load in case user refreshes mid-page
  handleNavbarScroll();

  // Listen for scroll events
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });


  /* =========================================================
     2. HAMBURGER MENU
     Toggle .open on both the nav links container and the
     hamburger button when the burger is clicked.
     Close the menu when any nav link is clicked.
  ========================================================= */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks     = document.getElementById('navLinks');

  if (hamburgerBtn && navLinks) {

    hamburgerBtn.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', isOpen);
      // Update ARIA attribute for screen readers
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a nav link is clicked (for single-page anchors)
    const allNavLinks = navLinks.querySelectorAll('.navbar__link');
    allNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* =========================================================
     3. MENU TABS
     Clicking a tab button:
       - Adds .active to the clicked tab button
       - Removes .active from all other tab buttons
       - Shows the corresponding panel (.active)
       - Hides all other panels
     Panel IDs are stored in each button's data-target attribute.
  ========================================================= */
  const menuTabs   = document.querySelectorAll('.menu__tab');
  const menuPanels = document.querySelectorAll('.menu__panel');

  if (menuTabs.length > 0) {

    menuTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const targetPanelId = tab.getAttribute('data-target');

        // ---- Update Tab Buttons ----
        menuTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // ---- Update Panels ----
        menuPanels.forEach(function (panel) {
          if (panel.id === targetPanelId) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }


  /* =========================================================
     4. SMOOTH SCROLL FALLBACK
     CSS `scroll-behavior: smooth` handles modern browsers.
     This JS fallback handles anchor links for any browsers
     that don't support the CSS property natively.
  ========================================================= */
  if (!('scrollBehavior' in document.documentElement.style)) {

    // Only attach if CSS smooth scroll isn't supported
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetTop    = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top:      targetTop,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  /* =========================================================
     5. HERO SLIDER
     Auto-playing image slider with navigation controls
  ========================================================= */
  const slides = document.querySelectorAll('.hero__slider .slide');
  const dots = document.querySelectorAll('.slider-indicators .dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
      
      currentSlide = (index + slides.length) % slides.length;
      
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startSlider() {
      slideInterval = setInterval(nextSlide, 5000); // Change image every 5 seconds
    }

    function stopSlider() {
      clearInterval(slideInterval);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlider();
        startSlider(); // reset timer
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlider();
        startSlider();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        stopSlider();
        startSlider();
      });
    });

    // Pause slideshow on hover
    const heroSliderWrap = document.querySelector('.hero__slider-wrap');
    if (heroSliderWrap) {
      heroSliderWrap.addEventListener('mouseenter', stopSlider);
      heroSliderWrap.addEventListener('mouseleave', startSlider);
    }

    // Start auto-play
    startSlider();
  }

}); // end DOMContentLoaded
