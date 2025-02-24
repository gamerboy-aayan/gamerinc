document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorMsg = document.getElementById("login-error"); // 🔴 Error message element

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            errorMsg.style.display = "none"; // ✅ Hide error message if login is successful
            window.location.href = "index.html"; // ✅ Redirect to dashboard or home page
        })
        .catch((error) => {
            console.error("Login Error:", error.message);

            // ✅ Show specific error messages
            if (error.code === "auth/wrong-password") {
                errorMsg.innerText = "The Password is incorrect";
            } else if (error.code === "auth/user-not-found") {
                errorMsg.innerText = "No account found with this email";
            } else if (error.code === "auth/invalid-email") {
                errorMsg.innerText = "Invalid email format";
            } else {
                errorMsg.innerText = "Login failed. Please try again.";
            }

            errorMsg.style.display = "block"; // 🔴 Show the error message in red
        });
});
