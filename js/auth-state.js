document.addEventListener("DOMContentLoaded", function () {
    window.isUserLoggedIn = false;
    window.isUserVerified = false;
    window.authReady = false;

    auth.onAuthStateChanged((user) => {
        const authLinks = document.getElementById("auth-links");
        const profileContainer = document.getElementById("profile-container");
        const profileImg = document.getElementById("profile-img");

        if (user) {
            window.isUserLoggedIn = true;
            window.isUserVerified = user.emailVerified;

            if (authLinks) authLinks.style.display = "none";
            if (profileContainer) profileContainer.style.display = "block";

            if (profileImg) {
                database.ref("users/" + user.uid).once("value").then((snapshot) => {
                    const userData = snapshot.val();
                    if (userData?.profilePicture) {
                        profileImg.src = userData.profilePicture;
                    }
                });
            }
        } else {
            window.isUserLoggedIn = false;
            window.isUserVerified = false;

            if (authLinks) authLinks.style.display = "block";
            if (profileContainer) profileContainer.style.display = "none";
        }

        window.authReady = true;
});

    const profileContainer = document.getElementById("profile-container");
    const profileImg = document.getElementById("profile-img");
    const profileUpload = document.getElementById("profile-upload");
    const profileMenu = document.getElementById("profile-menu");
    const changePicBtn = document.getElementById("change-pic");
    const removePicBtn = document.getElementById("remove-pic");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!profileContainer) {
        console.warn("Warning: profileContainer not found! Check your HTML.");
        return;
    }

    profileImg.addEventListener("click", () => {
        profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });

    changePicBtn.addEventListener("click", () => {
        profileUpload.click();
    });

    profileUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64Image = reader.result;

            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in to upload a profile picture.");
                return;
            }

            database.ref("users/" + user.uid).update({
                profilePicture: base64Image
            }).then(() => {
                profileImg.src = base64Image;
                alert("Profile picture updated successfully!");
            }).catch((error) => {
                console.error("Error saving profile picture:", error.message);
            });
        };
    });

    removePicBtn.addEventListener("click", () => {
        const user = auth.currentUser;
        if (!user) return;

        database.ref("users/" + user.uid).update({
            profilePicture: "pic/default.jpg"
        }).then(() => {
            profileImg.src = "pic/default.jpg";
            alert("Profile picture removed.");
        }).catch((error) => {
            console.error("Error removing profile picture:", error.message);
        });
    });

        logoutBtn.addEventListener("click", () => {
        auth.signOut()
            .then(() => {
                profileMenu.style.display = "none";
                console.log("User logged out successfully");
                
                window.location.href = "login.html";
            })
            .catch((error) => {
                console.error("Logout failed:", error.message);
            });
    });

    document.addEventListener("click", (e) => {
        if (!profileContainer.contains(e.target)) {
            profileMenu.style.display = "none";
        }
    });
});
