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

}); // end DOMContentLoaded
