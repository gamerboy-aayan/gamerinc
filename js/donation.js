function copyUPI() {
  const upiText = document.getElementById("upi").innerText;
  const btn = document.getElementById("copyBtn");
  const text = document.getElementById("copyText");
  const icon = document.getElementById("copyIcon");

  if (btn.classList.contains("copied")) return;

  const onSuccess = () => {
    btn.classList.add("copied");
    text.textContent = "Copied";

    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    setTimeout(() => {
      btn.classList.remove("copied");
      text.textContent = "Copy UPI";

      icon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"></rect>
          <rect x="3" y="3" width="13" height="13" rx="2"></rect>
        </svg>
      `;
    }, 2000);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(upiText)
      .then(onSuccess)
      .catch(() => fallbackCopy(upiText, onSuccess));
  } else {
    fallbackCopy(upiText, onSuccess);
  }
}

function fallbackCopy(text, callback) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
    callback();
  } catch (err) {
    alert("Copy failed. Please copy manually.");
  }

  document.body.removeChild(textarea);
}
