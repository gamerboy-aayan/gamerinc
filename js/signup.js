document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");

    if (!signupForm) {
        console.warn("Warning: signup-form not found! signup.js is running on the wrong page.");
        return;
    }

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const username = document.getElementById("signup-username").value;

        if (password.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                return userCredential.user.updateProfile({
                    displayName: username,
                    photoURL: "default-profile-pic-url"
                });
            })
            .then(() => {
                alert("Sign-up successful! Please log in.");
                signupForm.reset();
                window.location.href = "login.html"; // Redirect to login
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    alert("This email is already registered. Please log in instead.");
                } else {
                    console.error("Error:", error.message);
                }
            });
    });
});
