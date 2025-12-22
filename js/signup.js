document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");

    if (!signupForm) {
        console.warn("signup-form not found. signup.js loaded on the wrong page.");
        return;
    }

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("firstname").value.trim();
        const lastName = document.getElementById("lastname").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;

        if (!firstName || !lastName) {
            alert("Please enter your first and last name.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await user.updateProfile({
                displayName: `${firstName} ${lastName}`,
                photoURL: "default-profile-pic-url"
            });

            await user.sendEmailVerification();

            alert("Verification email sent. Please verify your email before logging in.");
            await auth.signOut();
            signupForm.reset();
            window.location.href = "login.html";

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("This email is already registered. Please log in instead.");
                window.location.href = "login.html";
            } else {
                console.error("Signup Error:", error);
                alert(error.message);
            }
        }
    });

    // Google Sign-Up
    const googleBtn = document.getElementById("google-signup");
    if (googleBtn) {
        googleBtn.addEventListener("click", async () => {
            const provider = new firebase.auth.GoogleAuthProvider();

            try {
                const result = await auth.signInWithPopup(provider);
                console.log("Google Sign-Up Success:", result.user);
                window.location.href = "index.html";
            } catch (error) {
                console.error("Google Sign-Up Error:", error);
                alert(error.message);
            }
        });
    }
});
