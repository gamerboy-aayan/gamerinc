document.addEventListener("DOMContentLoaded", function () {
    // Function to toggle password visibility
    function togglePassword(inputField, toggleIcon) {
        toggleIcon.addEventListener("click", () => {
            if (inputField.type === "password") {
                inputField.type = "text";  // Show password
                toggleIcon.classList.remove("fa-eye");
                toggleIcon.classList.add("fa-eye-slash"); // Change to slash eye icon
            } else {
                inputField.type = "password"; // Hide password
                toggleIcon.classList.remove("fa-eye-slash");
                toggleIcon.classList.add("fa-eye"); // Change back to eye icon
            }
        });
    }

    // Select elements and apply toggle function
    const loginPassword = document.getElementById("login-password");
    const toggleLoginPassword = document.getElementById("toggle-login-password");

    const signupPassword = document.getElementById("signup-password");
    const toggleSignupPassword = document.getElementById("toggle-signup-password");

    if (loginPassword && toggleLoginPassword) {
        togglePassword(loginPassword, toggleLoginPassword);
    }
    if (signupPassword && toggleSignupPassword) {
        togglePassword(signupPassword, toggleSignupPassword);
    }
});
