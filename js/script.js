document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const links = document.querySelectorAll('[data-link]');

    // Toggle menu on hamburger click
    menuToggle.addEventListener("click", (event) => {
        navLinks.classList.toggle("active");
        event.stopPropagation(); // Prevents immediate closing when clicking the menu toggle
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
        if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
            navLinks.classList.remove("active");
        }
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
});
