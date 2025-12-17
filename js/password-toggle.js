document.addEventListener("DOMContentLoaded", function () {
    // Function to toggle password visibility
    function togglePassword(inputField, toggleIcon) {
        if (!inputField || !toggleIcon) return;

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

    // Login password toggle
    const loginPassword = document.getElementById("login-password");
    const toggleLoginPassword = document.getElementById("toggle-login-password");
    togglePassword(loginPassword, toggleLoginPassword);

    // Signup password toggle
    const signupPassword = document.getElementById("signup-password");
    const toggleSignupPassword = document.getElementById("toggle-signup-password");
    togglePassword(signupPassword, toggleSignupPassword);

    // Signup confirm password toggle
    const signupConfirmPassword = document.getElementById("signup-confirm-password");
    const toggleSignupConfirm = document.getElementById("toggle-signup-confirm-password");
    togglePassword(signupConfirmPassword, toggleSignupConfirm);
});
