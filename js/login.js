document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorMsg = document.getElementById("login-error");

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
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

// Google Sign-In
document.getElementById("google-login").addEventListener("click", () => {
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
