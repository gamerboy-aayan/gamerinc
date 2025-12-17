document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const errorMsg = document.getElementById("login-error");
    const resendBtn = document.getElementById("resend-verification");
    const googleLoginBtn = document.getElementById("google-login");

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    if (!user.emailVerified) {
                        errorMsg.innerText = "Your email is not verified. Check your inbox.";
                        errorMsg.style.display = "block";
                        auth.signOut(); // block access until verified
                        return;
                    }

                    // Email verified — login success
                    errorMsg.style.display = "none";
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    console.error("Login Error:", error.message);
                    if (error.code === "auth/wrong-password") {
                        errorMsg.innerText = "The Password is incorrect";
                    } else if (error.code === "auth/user-not-found") {
                        errorMsg.innerText = "No account found with this email";
                    } else if (error.code === "auth/invalid-email") {
                        errorMsg.innerText = "Invalid email format";
                    } else {
                        errorMsg.innerText = "Login failed. Please try again.";
                    }
                    errorMsg.style.display = "block";
                });
        });
    }

    // Google Sign-In
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", () => {
            const provider = new firebase.auth.GoogleAuthProvider();

            auth.signInWithPopup(provider)
                .then((result) => {
                    console.log("Google Sign-In Success:", result.user);
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    console.error("Google Sign-In Error:", error.message);
                });
        });
    }

    // Resend verification email logic
    if (resendBtn) {
        resendBtn.style.display = "none"; // hidden by default

        auth.onAuthStateChanged((user) => {
            // Show resend button if logged in but not verified
            if (user && !user.emailVerified) {
                resendBtn.style.display = "block";
            } else {
                resendBtn.style.display = "none";
            }
        });

        resendBtn.addEventListener("click", () => {
            const user = auth.currentUser;
            if (user && !user.emailVerified) {
                user.sendEmailVerification()
                    .then(() => {
                        alert("Verification email sent again. Check your inbox!");
                    })
                    .catch((err) => {
                        console.error("Error sending verification email:", err.message);
                        alert("Failed to send verification email. Try again later.");
                    });
            } else {
                alert("Your email is already verified!");
                resendBtn.style.display = "none";
            }
        });
    }
});