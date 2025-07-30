// Import data-driven content modules
import DataRenderer from "./data-renderer.js";

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Close mobile menu when clicking on a link
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
    });
  });

  // Initialize scroll animations
  initializeScrollAnimations();
});

// Contact form validation
function validateContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    let isValid = true;

    // Clear previous errors
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document
      .querySelectorAll(".border-red-500")
      .forEach((el) => el.classList.remove("border-red-500"));

    // Validate name
    if (!name) {
      showError("name", "Veuillez entrer votre nom.");
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError("email", "Veuillez entrer votre email.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError("email", "Veuillez entrer une adresse email valide.");
      isValid = false;
    }

    // Validate message
    if (!message) {
      showError("message", "Veuillez entrer votre message.");
      isValid = false;
    }

    if (isValid) {
      // Here you would normally send the form data
      alert("Merci pour votre message ! Nous vous répondrons bientôt.");
      form.reset();
    }
  });

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message text-red-500 text-sm mt-1";
    errorDiv.textContent = message;
    field.classList.add("border-red-500");
    field.parentNode.appendChild(errorDiv);
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Initialize scroll animations and other features
function initializeScrollAnimations() {
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.classList.add("animated");
      }
    });
  };

  animateOnScroll();
  window.addEventListener("scroll", animateOnScroll);
}

// Helper functions for stars rendering (used by DataRenderer)
function renderStars(rating) {
  const stars = parseFloat(rating.split("/")[0]);
  let starsHtml = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= stars) {
      starsHtml += '<i class="fas fa-star"></i>';
    } else if (i - 0.5 <= stars) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    } else {
      starsHtml += '<i class="far fa-star"></i>';
    }
  }

  return starsHtml;
}

// Initialize any functions that need to run after page load
window.addEventListener("load", function () {
  validateContactForm();
  initializeScrollAnimations();
});
