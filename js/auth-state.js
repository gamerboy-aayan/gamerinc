document.addEventListener("DOMContentLoaded", function () {
    const LOADER_MIN_TIME = 3000; // 3 seconds
    const loaderStartTime = Date.now();

  window.isUserLoggedIn = false;
  window.isUserVerified = false;
  window.authReady = false;

  const authLoader = document.getElementById("auth-loader-overlay");

  const authLinks = document.getElementById("auth-links");
  const profileContainer = document.getElementById("profile-container");
  const profileImg = document.getElementById("profile-img");
  const profileUpload = document.getElementById("profile-upload");
  const profileMenu = document.getElementById("profile-menu");
  const changePicBtn = document.getElementById("change-pic");
  const removePicBtn = document.getElementById("remove-pic");
  const logoutBtn = document.getElementById("logoutBtn");

  // ---------- AUTH STATE ----------
  auth.onAuthStateChanged((user) => {
    if (user) {
      window.isUserLoggedIn = true;
      window.isUserVerified = user.emailVerified;

      if (authLinks) authLinks.style.display = "none";
      if (profileContainer) profileContainer.style.display = "block";

      if (profileImg) {
        database
          .ref("users/" + user.uid)
          .once("value")
          .then((snapshot) => {
            const userData = snapshot.val();
            profileImg.src =
              userData?.profilePicture || "pic/default.jpg";
          });
      }
    } else {
      window.isUserLoggedIn = false;
      window.isUserVerified = false;

      if (authLinks) authLinks.style.display = "block";
      if (profileContainer) profileContainer.style.display = "none";
    }

    // 🔑 AUTH IS READY
    window.authReady = true;

    // 🔥 HIDE LOADER (smooth)
    if (authLoader) {
    const elapsed = Date.now() - loaderStartTime;
    const remainingTime = Math.max(LOADER_MIN_TIME - elapsed, 0);

    setTimeout(() => {
        authLoader.classList.add("hidden");
    }, remainingTime);
    }
  });

  // ---------- SAFETY CHECK ----------
  if (!profileContainer) {
    console.warn("profile-container not found — skipping profile logic");
    return;
  }

  // ---------- PROFILE MENU ----------
  profileImg?.addEventListener("click", () => {
    profileMenu.style.display =
      profileMenu.style.display === "block" ? "none" : "block";
  });

  changePicBtn?.addEventListener("click", () => {
    profileUpload.click();
  });

  profileUpload?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to upload a profile picture.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Image = reader.result;

      database
        .ref("users/" + user.uid)
        .update({ profilePicture: base64Image })
        .then(() => {
          profileImg.src = base64Image;
          alert("Profile picture updated successfully!");
        })
        .catch((err) => {
          console.error("Profile update failed:", err.message);
        });
    };
  });

  removePicBtn?.addEventListener("click", () => {
    const user = auth.currentUser;
    if (!user) return;

    database
      .ref("users/" + user.uid)
      .update({ profilePicture: "pic/default.jpg" })
      .then(() => {
        profileImg.src = "pic/default.jpg";
        alert("Profile picture removed.");
      })
      .catch((err) => {
        console.error("Remove picture failed:", err.message);
      });
  });

  // ---------- LOGOUT ----------
  logoutBtn?.addEventListener("click", () => {
    auth
      .signOut()
      .then(() => {
        profileMenu.style.display = "none";
        window.location.href = "login.html";
      })
      .catch((err) => {
        console.error("Logout failed:", err.message);
      });
  });

  // ---------- CLOSE MENU ON OUTSIDE CLICK ----------
  document.addEventListener("click", (e) => {
    if (!profileContainer.contains(e.target)) {
      profileMenu.style.display = "none";
    }
  });
});
