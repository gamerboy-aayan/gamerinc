document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const links = document.querySelectorAll('[data-link]');

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        console.log("Toggled active class:", navLinks.classList.contains("active"));
    });

    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            console.log("Removed active class after clicking:", link.textContent);
        });
    });
});