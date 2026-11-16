const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileCloseButton = document.getElementById("mobileCloseButton");
const navigationLinks = document.getElementById("navigationLinks");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

if (mobileMenuButton && navigationLinks) {
    mobileMenuButton.addEventListener("click", function () {
        navigationLinks.classList.add("active");
    });
}

if (mobileCloseButton && navigationLinks) {
    mobileCloseButton.addEventListener("click", function () {
        navigationLinks.classList.remove("active");
    });
}

if (navigationLinks) {
    const mobileLinks = navigationLinks.querySelectorAll("a");

    mobileLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            navigationLinks.classList.remove("active");
        });
    });
}

if (themeToggle && themeIcon) {
    const savedTheme = localStorage.getItem("farmRentTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("darkMode");
        themeIcon.textContent = "☀";
    }

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("darkMode");

        if (document.body.classList.contains("darkMode")) {
            localStorage.setItem("farmRentTheme", "dark");
            themeIcon.textContent = "☀";
        } else {
            localStorage.setItem("farmRentTheme", "light");
            themeIcon.textContent = "☾";
        }
    });
}