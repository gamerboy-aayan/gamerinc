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
                const user = userCredential.user;

                return user.updateProfile({
                    displayName: username,
                    photoURL: "default-profile-pic-url"
                }).then(() => user);
            })
            .then((user) => {
                return user.sendEmailVerification();
            })
            .then(() => {
                alert("Verification email sent. Please verify your email before logging in.");
                auth.signOut();
                signupForm.reset();
                window.location.href = "login.html";
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    alert("This email is already registered. Please log in instead.");
                    window.location.href = "login.html";
                } else {
                    console.error("Error:", error.message);
                    alert(error.message);
                }
            });
    });
});

document.getElementById("google-signup").addEventListener("click", () => {
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
