document.addEventListener("DOMContentLoaded", function () {
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById("auth-links").style.display = "none";
            document.getElementById("profile-container").style.display = "block";

            // ✅ Use `database` instead of `firebase.database()`
            database.ref("users/" + user.uid).once("value").then((snapshot) => {
                const userData = snapshot.val();
                if (userData && userData.profilePicture) {
                    document.getElementById("profile-img").src = userData.profilePicture;
                }
            });
        } else {
            document.getElementById("auth-links").style.display = "block";
            document.getElementById("profile-container").style.display = "none";
        }
    });

    // ✅ Define Elements
    const profileContainer = document.getElementById("profile-container");
    const profileImg = document.getElementById("profile-img");
    const profileUpload = document.getElementById("profile-upload");
    const profileMenu = document.getElementById("profile-menu");
    const changePicBtn = document.getElementById("change-pic");
    const removePicBtn = document.getElementById("remove-pic");

    if (!profileContainer) {
        console.warn("Warning: profileContainer not found! Check your HTML.");
        return;
    }

    // ✅ Show/hide dropdown menu when clicking profile picture
    profileImg.addEventListener("click", () => {
        profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });

    // ✅ Click 'Change Profile Picture' → Open file upload
    changePicBtn.addEventListener("click", () => {
        profileUpload.click();
    });

    // ✅ Upload new profile picture (Base64 stored in Firebase Database)
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

            // ✅ Use `database` instead of `firebase.database()`
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

    // ✅ Remove profile picture
    removePicBtn.addEventListener("click", () => {
        const user = auth.currentUser;
        if (!user) return;

        // ✅ Use `database` instead of `firebase.database()`
        database.ref("users/" + user.uid).update({
            profilePicture: "pic/default.jpg"
        }).then(() => {
            profileImg.src = "pic/default.jpg";
            alert("Profile picture removed.");
        }).catch((error) => {
            console.error("Error removing profile picture:", error.message);
        });
    });

    // ✅ Hide menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!profileContainer.contains(e.target)) {
            profileMenu.style.display = "none";
        }
    });
});
