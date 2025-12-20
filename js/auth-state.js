document.addEventListener("DOMContentLoaded", function () {

  /* ---------- CONFIG ---------- */
  const LOADER_MIN_TIME = 3000; // 3 seconds
  const PUBLIC_PAGES = ["login.html", "signup.html"];

  const loaderStartTime = Date.now();
  const currentPage = location.pathname.split("/").pop() || "index.html";
  const isPublicPage = PUBLIC_PAGES.includes(currentPage);

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

      if (profileImg) {
        database.ref("users/" + user.uid)
          .once("value")
          .then((snapshot) => {
            const userData = snapshot.val();
            profileImg.src = userData?.profilePicture || "pic/default.jpg";
          });
      }
    } 
    else {
      window.isUserLoggedIn = false;
      window.isUserVerified = false;

      if (authLinks) authLinks.style.display = "block";
      if (profileContainer) profileContainer.style.display = "none";
    }

    /* ---------- AUTH READY ---------- */
    window.authReady = true;

    /* ---------- LOADER CONTROL (ALWAYS 3s) ---------- */
    if (authLoader) {
      const elapsed = Date.now() - loaderStartTime;
      const remaining = Math.max(LOADER_MIN_TIME - elapsed, 0);

      setTimeout(() => {
        authLoader.classList.add("hidden");

        // 🔐 Redirect ONLY after loader finishes
        if (!window.isUserLoggedIn && !isPublicPage) {
          window.location.replace("login.html");
        }

      }, remaining);
    }
  });

  /* ---------- SAFETY CHECK ---------- */
  if (!profileContainer) return;

  /* ---------- PROFILE MENU ---------- */
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

  removePicBtn?.addEventListener("click", () => {
    const user = auth.currentUser;
    if (!user) return;

    database.ref("users/" + user.uid)
      .update({ profilePicture: "pic/default.jpg" })
      .then(() => {
        profileImg.src = "pic/default.jpg";
      });
  });

  /* ---------- LOGOUT ---------- */
  logoutBtn?.addEventListener("click", () => {
    auth.signOut().then(() => {
      window.location.replace("login.html");
    });
  });

  /* ---------- CLOSE MENU ---------- */
  document.addEventListener("click", (e) => {
    if (!profileContainer.contains(e.target)) {
      profileMenu.style.display = "none";
    }
  });

});
