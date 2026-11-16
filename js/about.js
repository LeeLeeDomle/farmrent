
const pageLoader = document.getElementById("pageLoader");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const mobileMenuButton = document.getElementById("mobileMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navigationLinks = document.getElementById("navigationLinks");

const backToTop = document.getElementById("backToTop");

const certificateButton = document.getElementById("certificateButton");
const certificateModal = document.getElementById("certificateModal");
const certificateModalClose = document.getElementById("certificateModalClose");

window.addEventListener("load", () => {
    pageLoader.style.width = "100%";

    setTimeout(() => {
        pageLoader.style.opacity = "0";
    }, 500);
});

const savedTheme = localStorage.getItem("farmRentTheme");

if (savedTheme === "dark") {
    document.body.classList.add("darkMode");
    themeIcon.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("darkMode");

    const darkModeEnabled = document.body.classList.contains("darkMode");

    if (darkModeEnabled) {
        themeIcon.textContent = "☀";
        localStorage.setItem("farmRentTheme", "dark");
    } else {
        themeIcon.textContent = "☾";
        localStorage.setItem("farmRentTheme", "light");
    }
});

mobileMenuButton.addEventListener("click", () => {
    navigationLinks.classList.add("menuOpen");
});

closeMenuButton.addEventListener("click", () => {
    navigationLinks.classList.remove("menuOpen");
});

navigationLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navigationLinks.classList.remove("menuOpen");
    });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTop.classList.add("showButton");
    } else {
        backToTop.classList.remove("showButton");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

certificateButton.addEventListener("click", () => {
    certificateModal.classList.add("showModal");
    document.body.style.overflow = "hidden";
});

function closeCertificateModal() {
    certificateModal.classList.remove("showModal");
    document.body.style.overflow = "";
}

certificateModalClose.addEventListener("click", closeCertificateModal);

certificateModal.addEventListener("click", (event) => {
    if (event.target === certificateModal) {
        closeCertificateModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        navigationLinks.classList.remove("menuOpen");
        closeCertificateModal();
    }
});

