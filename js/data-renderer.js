/**
 * Data Renderer Module
 * Handles dynamic content rendering from parsed markdown data
 */

import { parseMarkdownContent } from "./content-parser.js";

class DataRenderer {
  constructor() {
    this.contentData = null;
    this.init();
  }

  async init() {
    try {
      await this.loadContentData();
      this.renderPageContent();
    } catch (error) {
      console.error("Error initializing data renderer:", error);
    }
  }

  async loadContentData() {
    try {
      const response = await fetch("/data/content.md");
      const content = await response.text();
      this.contentData = parseMarkdownContent(content);
      //console.log("Content data loaded:", this.contentData);
    } catch (error) {
      console.error("Error loading content data:", error);
      // Fallback to basic structure if content.md fails to load
      this.contentData = this.getFallbackData();
    }
  }

  getFallbackData() {
    return {
      hero: {
        headline: "CS-Kréyasion",
        subheadline: "Créations artisanales made in Martinique",
        primaryCTAText: "Découvrir nos produits",
        secondaryCTAText: "En savoir plus",
      },
      products: [],
      testimonials: [],
      about: {
        story: {
          headline: "Notre Histoire",
          content:
            "CS-Kréyasion est née de la passion pour l'artisanat martiniquais...",
        },
        values: [],
        process: [],
        team: [],
      },
      contact: {
        info: {
          address: "Fort-de-France, Martinique",
          phone: "+596 696 00 00 00",
          email: "contact@cs-kreyasion.com",
        },
        faq: [],
      },
    };
  }

  renderPageContent() {
    const currentPage = this.getCurrentPage();

    switch (currentPage) {
      case "index":
        this.renderHomePage();
        this.renderTestimonials();
        break;
      case "about":
        this.renderAboutPage();
        break;
      case "articles":
        this.renderArticlesPage();
        break;
      case "contact":
        this.renderContactPage();
        break;
      default:
        this.renderHomePage();
        this.renderTestimonials();
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes("about.html")) return "about";
    if (path.includes("articles.html")) return "articles";
    if (path.includes("contact.html")) return "contact";
    return "index";
  }

  renderTestimonials() {
    if (!this.contentData?.testimonials) return;

    const container = document.getElementById("testimonials-grid");
    if (!container) return;

    container.innerHTML = this.contentData.testimonials
      .map(
        (testimonial) => `
      <div class="bg-white p-8 rounded-xl shadow-lg">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 rounded-full bg-wood-200 mr-4"></div>
          <div>
            <h4 class="font-bold text-wood-900">${testimonial.name}</h4>
            <div class="flex text-martinique-red">
              ${this.renderStars(testimonial.rating)}
            </div>
          </div>
        </div>
        <p class="text-wood-700 italic">"${testimonial.content}"</p>
      </div>
    `
      )
      .join("");
  }

  renderStars(rating) {
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

  renderProductTag(tag) {
    if (!tag || tag.trim() === "") return "";
    
    const tagColors = {
      "Nouveau": "bg-green-500",
      "Populaire": "bg-red-500",
      "Promo": "bg-yellow-500",
      "Limité": "bg-purple-500"
    };
    
    const bgColor = tagColors[tag] || "bg-blue-500";
    
    return `
      <div class="absolute top-2 right-2 ${bgColor} text-white text-xs font-bold px-2 py-1 rounded-full">
        ${tag}
      </div>
    `;
  }

  renderHomePage() {
    if (!this.contentData) return;

    // Hero section
    this.renderElement("hero-title", this.contentData.hero?.headline);
    this.renderElement("hero-subtitle", this.contentData.hero?.subheadline);

    // Hero buttons
    const heroButtons = document.getElementById("hero-buttons");
    if (heroButtons && this.contentData.hero?.primaryCTAText) {
      heroButtons.innerHTML = `
        <a href="pages/articles.html" class="bg-martinique-red hover:bg-martinique-red-dark text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
          ${this.contentData.hero.primaryCTAText}
        </a>
        <a href="pages/about.html" class="bg-transparent border-2 border-white hover:bg-white hover:text-wood-900 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
          ${this.contentData.hero.secondaryCTAText || "En savoir plus"}
        </a>
      `;
    }

    // Featured products - use first 3 from productCatalog
    this.renderFeaturedProducts();
  }

  renderAboutPage() {
    if (!this.contentData?.about) return;

    const about = this.contentData.about;

    // Hero section
    this.renderDataContent("about.hero.title", about.story?.headline);
    this.renderDataContent("about.hero.subtitle", about.story?.content);

    // Values section
    this.renderValues();

    // Team section
    this.renderTeam();
  }

  renderArticlesPage() {
    if (!this.contentData?.products) return;

    // Render products grid
    this.renderProductsGrid();
  }

  renderContactPage() {
    if (!this.contentData?.contact) return;

    const contact = this.contentData.contact;

    // Contact info
    this.renderDataContent("contact.address", contact.info?.address);
    this.renderDataContent("contact.phone", contact.info?.phone);
    this.renderDataContent("contact.email", contact.info?.email);
  }

  renderElement(id, content) {
    const element = document.getElementById(id);
    if (element && content) {
      element.textContent = content;
    }
  }

  renderDataContent(selector, content) {
    const elements = document.querySelectorAll(`[data-content="${selector}"]`);
    elements.forEach((element) => {
      if (content) {
        element.textContent = content;
      }
    });
  }

  renderFeaturedProducts() {
    if (!this.contentData?.featuredProducts && !this.contentData?.products)
      return;

    const container = document.getElementById("featured-products-grid");
    if (!container) return;

    // Use featuredProducts if available, otherwise use first 3 products
    const featuredProducts =
      this.contentData.featuredProducts ||
      this.contentData.products.slice(0, 3);

    container.innerHTML = featuredProducts
      .map(
        (product) => `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-105">
        <div class="relative h-64 bg-gradient-to-br from-wood-200 to-wood-300 flex items-center justify-center">
          <i class="fas fa-${
            product.icon || "gift"
          } text-6xl text-wood-600"></i>
          ${this.renderProductTag(product.tag)}
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-wood-900 mb-2">${product.name}</h3>
          <p class="text-wood-700 mb-4">${product.description || ""}</p>
          <div class="flex justify-between items-center">
            <span class="text-2xl font-bold text-martinique-red">${
              product.price || "Sur demande"
            }</span>
            <a href="pages/articles.html" class="bg-wood-800 hover:bg-wood-900 text-white px-4 py-2 rounded-lg transition duration-300">
              Voir plus
            </a>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  renderProductsGrid() {
    if (!this.contentData?.products) return;

    const container = document.getElementById("products-grid");
    if (!container) return;

    container.innerHTML = this.contentData.products
      .map(
        (product) => `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
        <div class="relative h-48 bg-gradient-to-br from-wood-200 to-wood-300 flex items-center justify-center">
          <i class="fas fa-${
            product.icon || "gift"
          } text-4xl text-wood-600"></i>
          ${this.renderProductTag(product.tag)}
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-wood-900 mb-2">${product.name}</h3>
          <p class="text-wood-700 mb-4">${product.description || ""}</p>
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold text-martinique-red">${
              product.price || "Sur demande"
            }</span>
            <button class="bg-wood-800 hover:bg-wood-900 text-white px-4 py-2 rounded-lg transition duration-300">
              Commander
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  renderValues() {
    if (!this.contentData?.about?.values) return;

    const container = document.getElementById("values-container");
    if (!container) return;

    container.innerHTML = this.contentData.about.values
      .map(
        (value) => `
      <div class="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300">
        <div class="w-16 h-16 bg-martinique-red rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-${value.icon || "star"} text-white text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-wood-900 mb-3">${value.title}</h3>
        <p class="text-wood-700">${value.description}</p>
      </div>
    `
      )
      .join("");
  }

  renderTeam() {
    if (!this.contentData?.about?.team) return;

    const container = document.getElementById("team-container");
    if (!container) return;

    container.innerHTML = this.contentData.about.team
      .map(
        (member) => `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden text-center hover:shadow-xl transition duration-300">
        <div class="h-48 bg-gradient-to-br from-wood-200 to-wood-300 flex items-center justify-center">
          <i class="fas fa-user text-6xl text-wood-600"></i>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-wood-900 mb-2">${member.name}</h3>
          <p class="text-martinique-red font-medium mb-3">${member.role}</p>
          <p class="text-wood-700 text-sm">${member.description}</p>
        </div>
      </div>
    `
      )
      .join("");
  }
}

// Helper function for rendering product tags
function renderProductTag(tag) {
  if (!tag || tag.trim() === "") return "";
  
  const tagColors = {
    "Nouveau": "bg-green-500",
    "Populaire": "bg-red-500",
    "Promo": "bg-yellow-500",
    "Limité": "bg-purple-500"
  };
  
  const bgColor = tagColors[tag] || "bg-blue-500";
  
  return `
    <div class="absolute top-2 right-2 ${bgColor} text-white text-xs font-bold px-2 py-1 rounded-full">
      ${tag}
    </div>
  `;
}

// Export function for articles page
export function renderArticlesContent(contentData) {
  if (!contentData?.products) return;

  const container = document.getElementById("products-container");
  if (!container) return;

  container.innerHTML = contentData.products
    .map(
      (product) => `
    <div class="product-item bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300" data-category="${
      product.category?.toLowerCase() || "all"
    }">
      <div class="relative h-48 bg-gradient-to-br from-wood-200 to-wood-300 flex items-center justify-center">
        <i class="fas fa-${product.icon || "gift"} text-4xl text-wood-600"></i>
        ${renderProductTag(product.tag)}
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold text-wood-900 mb-2">${product.name}</h3>
        <p class="text-wood-700 mb-4">${product.description || ""}</p>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold text-martinique-red">${
            product.price || "Sur demande"
          }</span>
          <button class="bg-wood-800 hover:bg-wood-900 text-white px-4 py-2 rounded-lg transition duration-300">
            Commander
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Export function for contact page
export function renderContactContent(contentData) {
  if (!contentData?.contact) return;

  const contact = contentData.contact;

  // Update contact information
  const addressElement = document.querySelector(
    '[data-content="contact.address.content"]'
  );
  if (addressElement && contact.address) {
    addressElement.textContent = contact.address;
  }

  const phoneElement = document.querySelector(
    '[data-content="contact.phone.content"]'
  );
  if (phoneElement && contact.phone) {
    phoneElement.innerHTML = `${contact.phone}<br />Disponible du lundi au vendredi, 9h-17h`;
  }

  const emailElement = document.querySelector(
    '[data-content="contact.email.content"]'
  );
  if (emailElement && contact.email) {
    emailElement.innerHTML = `${contact.email}<br />Nous répondons sous 24-48 heures`;
  }

  // Update social media links
  if (contact.social) {
    const socialLinks = document.querySelectorAll(".fab");
    socialLinks.forEach((link) => {
      if (link.classList.contains("fa-facebook-f") && contact.social.facebook) {
        link.parentElement.href = contact.social.facebook;
      }
      if (link.classList.contains("fa-instagram") && contact.social.instagram) {
        link.parentElement.href = contact.social.instagram;
      }
      if (
        link.classList.contains("fa-pinterest-p") &&
        contact.social.pinterest
      ) {
        link.parentElement.href = contact.social.pinterest;
      }
    });
  }

  // Render FAQ if available
  if (contact.faq && contact.faq.length > 0) {
    renderFAQ(contact.faq);
  }
}

// Function to render FAQ
function renderFAQ(faqItems) {
  // Find the FAQ section container (the one with the static FAQ items)
  const faqSection = document.querySelector("section.py-20.bg-white");
  if (!faqSection) return;

  const faqContainer = faqSection.querySelector(".max-w-3xl.mx-auto");
  if (!faqContainer) return;

  faqContainer.innerHTML = faqItems
    .map(
      (item, index) => `
    <div class="border-b border-wood-200 pb-6 mb-6">
      <button class="flex justify-between items-center w-full text-left" onclick="toggleFAQ(${index})">
        <h3 class="text-xl font-bold text-wood-900">${item.question}</h3>
        <i class="fas fa-chevron-down text-martinique-red faq-icon-${index}"></i>
      </button>
      <div class="mt-4 text-wood-700 faq-answer-${index}" style="display: none;">
        <p>${item.answer}</p>
      </div>
    </div>
  `
    )
    .join("");

  // Add toggle function to window
  window.toggleFAQ = function (index) {
    const answer = document.querySelector(`.faq-answer-${index}`);
    const icon = document.querySelector(`.faq-icon-${index}`);

    if (answer.style.display === "none") {
      answer.style.display = "block";
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
    } else {
      answer.style.display = "none";
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
    }
  };
}

// Initialize the data renderer when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DataRenderer();
});

export default DataRenderer;
