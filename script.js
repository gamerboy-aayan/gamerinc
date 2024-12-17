// JavaScript to Toggle Hamburger Menu
document.getElementById("menuToggle").addEventListener("click", function () {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
});