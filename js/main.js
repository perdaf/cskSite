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

  // Add scroll animation to elements when they come into view
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.classList.add("animated");
      }
    });
  };

  // Listen for scroll events
  window.addEventListener("scroll", animateOnScroll);

  // Initialize animations for elements already in view
  animateOnScroll();
});

// Form validation for contact page (will be implemented when we create the contact page)
function validateContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Simple validation
    if (name === "" || email === "" || message === "") {
      alert("Veuillez remplir tous les champs.");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Veuillez entrer une adresse email valide.");
      return false;
    }

    // If validation passes, you would normally send the form data to a server here
    alert("Merci pour votre message ! Nous vous répondrons bientôt.");
    form.reset();
    return true;
  });
}

// Product filtering for articles page (will be implemented when we create the articles page)
function filterProducts(category) {
  const products = document.querySelectorAll(".product-item");

  products.forEach((product) => {
    if (category === "all" || product.dataset.category === category) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// Initialize any functions that need to run after page load
window.addEventListener("load", function () {
  validateContactForm();
});
