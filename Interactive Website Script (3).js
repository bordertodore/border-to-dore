// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    console.log("Website script loaded successfully.");

    // Initialize all interactive components
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initScrollHeader();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            menuToggle.classList.toggle("open");
        });
    }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

/**
 * Basic Form Validation and Handling
 */
function initContactForm() {
    const form = document.querySelector("#contact-form");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = form.querySelector('[name="name"]')?.value.trim();
            const email = form.querySelector('[name="email"]')?.value.trim();
            const message = form.querySelector('[name="message"]')?.value.trim();

            if (!name || !email || !message) {
                alert("Please fill in all required fields.");
                return;
            }

            // Simulate form submission success
            alert(`Thank you, ${name}! Your message has been sent.`);
            form.reset();
        });
    }
}

/**
 * Header Shadow/Class Change on Scroll
 */
function initScrollHeader() {
    const header = document.querySelector("header");

    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }
}