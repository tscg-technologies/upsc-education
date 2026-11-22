/**
 * UPSC EDUCATION - Master Script
 * Pure Vanilla JavaScript (ES6+) - Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initNavigation();
  initActivePageHighlight();
  initFaqAccordion();
  initTestDashboard();
  initResourceFilter();
  initRoadmapTabs();
  initFormValidation();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. Sticky Header Scroll Effect
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Header Navigation & Dropdown Functionality
   -------------------------------------------------------------------------- */
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const headerNav = document.querySelector('.header-nav');
  const dropdowns = document.querySelectorAll('.dropdown');

  // Mobile Menu Toggle
  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = headerNav.classList.toggle('mobile-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && headerNav.classList.contains('mobile-open')) {
        headerNav.classList.remove('mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Dropdown Handling (Desktop & Mobile)
  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!trigger || !menu) return;

    // Click trigger behavior (especially mobile & touch)
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Toggle mobile accordion style
        const isExpanded = dropdown.classList.toggle('mobile-expanded');
        trigger.setAttribute('aria-expanded', isExpanded);
      } else {
        // Toggle desktop click state
        const isOpen = dropdown.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen);

        // Close other desktop dropdowns
        dropdowns.forEach((other) => {
          if (other !== dropdown) {
            other.classList.remove('is-open');
            const otherTrigger = other.querySelector('.dropdown-toggle');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });

    // Keyboard Navigation
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('is-open', 'mobile-expanded');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  // Global Outside Click to Close Dropdowns & Mobile Menu
  document.addEventListener('click', (e) => {
    // Desktop dropdowns
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
        const trigger = dropdown.querySelector('.dropdown-toggle');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Mobile nav outside click
    if (headerNav && headerNav.classList.contains('mobile-open')) {
      if (!headerNav.contains(e.target) && !menuToggle.contains(e.target)) {
        headerNav.classList.remove('mobile-open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Global Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdowns.forEach((d) => d.classList.remove('is-open'));
      if (headerNav && headerNav.classList.contains('mobile-open')) {
        headerNav.classList.remove('mobile-open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   3. Active Page Highlighting
   -------------------------------------------------------------------------- */
function initActivePageHighlight() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link, .footer-links a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Clean href of hashes or query strings
    const cleanHref = href.split('#')[0].split('?')[0];

    if (cleanHref === currentPath || (currentPath === '' && cleanHref === 'index.html')) {
      link.classList.add('active');

      // If inside dropdown, also highlight parent nav item
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        parentDropdown.classList.add('is-active');
        const parentTrigger = parentDropdown.querySelector('.nav-link');
        if (parentTrigger) parentTrigger.classList.add('active');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   4. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others in this accordion
      const parentAccordion = item.closest('.faq-accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.faq-item').forEach((sibling) => {
          sibling.classList.remove('active');
          const btn = sibling.querySelector('.faq-question-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Test Dashboard (for test-series.html)
   -------------------------------------------------------------------------- */
function initTestDashboard() {
  const dashboard = document.querySelector('.test-dashboard');
  if (!dashboard) return;

  const tabBtns = dashboard.querySelectorAll('.tab-btn');
  const testItems = dashboard.querySelectorAll('.test-item-row');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter') || 'all';

      testItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterCategory === 'all' || itemCategory === filterCategory) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Current Affairs & Study Resources Filter (for resources.html)
   -------------------------------------------------------------------------- */
function initResourceFilter() {
  const searchInput = document.getElementById('resourceSearch');
  const chipBtns = document.querySelectorAll('.chip-btn');
  const resourceItems = document.querySelectorAll('.resource-item');

  if (!resourceItems.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  const filterResources = () => {
    resourceItems.forEach((item) => {
      const itemCategory = item.getAttribute('data-category') || '';
      const itemText = item.textContent.toLowerCase();

      const matchesCategory = activeCategory === 'all' || itemCategory.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = !searchTerm || itemText.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterResources();
    });
  }

  chipBtns.forEach((chip) => {
    chip.addEventListener('click', () => {
      chipBtns.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category') || 'all';
      filterResources();
    });
  });

  // Expandable description toggle
  const toggleButtons = document.querySelectorAll('.toggle-expand-btn');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.resource-item');
      const expandable = parent.querySelector('.resource-expandable');
      if (!expandable) return;

      const isExpanded = expandable.classList.toggle('expanded');
      btn.textContent = isExpanded ? 'Show Less ▴' : 'Read Topic Overview ▾';
    });
  });

  // Demo download buttons
  const downloadBtns = document.querySelectorAll('.demo-download-btn');
  downloadBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const fileName = btn.getAttribute('data-filename') || 'UPSC-Study-Material.pdf';
      showDemoModal(
        'Demonstration PDF Resource',
        `You requested to download: <strong>${fileName}</strong>.<br><br>As part of this demonstration portal, actual file downloads are simulated. Comprehensive curriculum notes and summaries are available for offline study.`
      );
    });
  });
}

/* --------------------------------------------------------------------------
   7. 8-Stage Preparation Roadmap Tabs (for preparation-strategy.html)
   -------------------------------------------------------------------------- */
function initRoadmapTabs() {
  const stepBtns = document.querySelectorAll('.roadmap-step-btn');
  const detailPanels = document.querySelectorAll('.roadmap-detail-panel');

  if (!stepBtns.length || !detailPanels.length) return;

  stepBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetStep = btn.getAttribute('data-step');

      stepBtns.forEach((b) => b.classList.remove('active'));
      detailPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.querySelector(`.roadmap-detail-panel[data-step="${targetStep}"]`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Form Validation & Demonstration Modal
   -------------------------------------------------------------------------- */
function initFormValidation() {
  const admissionForm = document.getElementById('admissionEnquiryForm');
  const contactForm = document.getElementById('contactEnquiryForm');
  const courseModalForm = document.getElementById('courseQuickForm');

  const setupForm = (form, formType) => {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach((input) => {
        input.classList.remove('is-invalid');
        const val = input.value.trim();

        if (!val) {
          input.classList.add('is-invalid');
          isValid = false;
        } else if (input.type === 'email') {
          const emailPattern = /^[^\s@]+@[^\s@]+$/;
          if (!emailPattern.test(val)) {
            input.classList.add('is-invalid');
            isValid = false;
          }
        } else if (input.type === 'tel' || input.name === 'phone') {
          const digits = val.replace(/\D/g, '');
          if (digits.length < 10) {
            input.classList.add('is-invalid');
            isValid = false;
          }
        }
      });

      if (isValid) {
        const studentName = form.querySelector('[name="studentName"]')?.value || 'Aspirant';
        const course = form.querySelector('[name="interestedCourse"]')?.value || 'UPSC Preparation';

        showDemoModal(
          'Enquiry Submitted (Demonstration)',
          `Thank you, <strong>${escapeHtml(studentName)}</strong>!<br><br>Your demonstration enquiry for <strong>${escapeHtml(course)}</strong> has been recorded in your local browser session.<br><br><span style="color:#AF8537;font-weight:600;">IMPORTANT NOTICE:</span> UPSC EDUCATION is a fictional demonstration website. No information has been sent across the network or stored in an external database.`
        );

        form.reset();
      }
    });

    // Clear validation error on input
    form.querySelectorAll('input, select, textarea').forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
      });
    });
  };

  setupForm(admissionForm, 'Admission');
  setupForm(contactForm, 'Contact');
  setupForm(courseModalForm, 'Course');

  // Setup modal close listeners
  const modalOverlay = document.getElementById('demoModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');

  if (modalOverlay) {
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDemoModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeDemoModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeDemoModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-active')) {
        closeDemoModal();
      }
    });
  }
}

function showDemoModal(title, messageHtml) {
  const modal = document.getElementById('demoModal');
  if (!modal) {
    alert(messageHtml.replace(/<[^>]*>?/gm, ''));
    return;
  }

  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');

  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.innerHTML = messageHtml;

  modal.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
  const modal = document.getElementById('demoModal');
  if (!modal) return;
  modal.classList.remove('is-active');
  document.body.style.overflow = '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* --------------------------------------------------------------------------
   9. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
