document.addEventListener("DOMContentLoaded", function () {

  /* ---------- CONFIG ---------- */
  const LOADER_MIN_TIME = 1500;
  const PUBLIC_PAGES = ["login.html", "signup.html"];

  const loaderStartTime = Date.now();

  /* ---------- THEME SYSTEM ---------- */
  const themeLink = document.getElementById("theme-style");

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark" && themeLink) {
    themeLink.href = "dark.css";
  }

  // Global toggle function
  window.toggleTheme = function () {
    if (!themeLink) return;

    if (themeLink.href.includes("light.css")) {
      themeLink.href = "dark.css";
      localStorage.setItem("theme", "dark");
    } else {
      themeLink.href = "light.css";
      localStorage.setItem("theme", "light");
    }
  };

  /* ---------- GLOBAL FLAGS ---------- */
  window.isUserLoggedIn = false;
  window.isUserVerified = false;
  window.authReady = false;

  /* ---------- ELEMENTS ---------- */
  const authLoader = document.getElementById("auth-loader-overlay");

  const authLinks = document.getElementById("auth-links");
  const profileContainer = document.getElementById("profile-container");
  const profileImg = document.getElementById("profile-img");
  const profileUpload = document.getElementById("profile-upload");
  const profileMenu = document.getElementById("profile-menu");
  const profileName = document.getElementById("profile-name");
  const changePicBtn = document.getElementById("change-pic");
  const removePicBtn = document.getElementById("remove-pic");
  const logoutBtn = document.getElementById("logoutBtn");

  /* ---------- AUTH STATE ---------- */
  auth.onAuthStateChanged((user) => {

    if (user) {
      window.isUserLoggedIn = true;
      window.isUserVerified = user.emailVerified;

      if (authLinks) authLinks.style.display = "none";
      if (profileContainer) profileContainer.style.display = "block";

      // Set profile name (Firstname + Lastname)
      if (profileName) {
        profileName.textContent = user.displayName || "User";
      }

      // Load profile picture
      if (profileImg) {
        database.ref("users/" + user.uid)
          .once("value")
          .then((snapshot) => {
            const userData = snapshot.val();
            profileImg.src = userData?.profilePicture || "pics/default.webp";
          });
      }

    } else {
      window.isUserLoggedIn = false;
      window.isUserVerified = false;

      if (authLinks) authLinks.style.display = "block";
      if (profileContainer) profileContainer.style.display = "none";
    }

    /* ---------- AUTH READY ---------- */
    window.authReady = true;

    /* ---------- LOADER (MIN 1.5s) ---------- */
    if (authLoader) {
      const elapsed = Date.now() - loaderStartTime;
      const remaining = Math.max(LOADER_MIN_TIME - elapsed, 0);

      setTimeout(() => {
        authLoader.classList.add("hidden");
      }, remaining);
    }
  });

  /* ---------- SAFETY ---------- */
  if (!profileContainer) return;

  /* ---------- PROFILE MENU TOGGLE ---------- */
  profileImg?.addEventListener("click", () => {
    profileMenu.style.display =
      profileMenu.style.display === "block" ? "none" : "block";
  });

  /* ---------- CHANGE PROFILE PIC ---------- */
  changePicBtn?.addEventListener("click", () => {
    profileUpload.click();
  });

  profileUpload?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Image = reader.result;

      database.ref("users/" + user.uid)
        .update({ profilePicture: base64Image })
        .then(() => {
          profileImg.src = base64Image;
        });
    };
  });

  /* ---------- REMOVE PROFILE PIC ---------- */
  removePicBtn?.addEventListener("click", () => {
    const user = auth.currentUser;
    if (!user) return;

    database.ref("users/" + user.uid)
      .update({ profilePicture: "pics/default.webp" })
      .then(() => {
        profileImg.src = "pics/default.webp";
      });
  });

  /* ---------- LOGOUT ---------- */
  logoutBtn?.addEventListener("click", () => {
    auth.signOut().then(() => {
      profileMenu.style.display = "none";
    });
  });

  /* ---------- CLOSE MENU ON OUTSIDE CLICK ---------- */
  document.addEventListener("click", (e) => {
    if (!profileContainer.contains(e.target)) {
      profileMenu.style.display = "none";
    }
  });

});