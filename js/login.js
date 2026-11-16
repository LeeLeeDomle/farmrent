```javascript
const pageLoader = document.getElementById("pageLoader");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const mobileMenuButton = document.getElementById("mobileMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navigationLinks = document.getElementById("navigationLinks");

const backToTop = document.getElementById("backToTop");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const forgotPassword = document.getElementById("forgotPassword");

const googleLogin = document.getElementById("googleLogin");
const facebookLogin = document.getElementById("facebookLogin");

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

    const darkModeEnabled =
        document.body.classList.contains("darkMode");

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

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

    } else {

        passwordInput.type = "password";

    }

});

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {

        loginMessage.textContent =
            "Please enter your email and password.";

        loginMessage.classList.add("showMessage");

        return;

    }

    loginMessage.textContent =
        "Login details received. Authentication will be connected when the backend is ready.";

    loginMessage.classList.add("showMessage");

});

forgotPassword.addEventListener("click", (event) => {

    event.preventDefault();

    loginMessage.textContent =
        "Password recovery will be available when the account system is connected.";

    loginMessage.classList.add("showMessage");

});

googleLogin.addEventListener("click", () => {

    loginMessage.textContent =
        "Google login will be connected when social authentication is added.";

    loginMessage.classList.add("showMessage");

});

facebookLogin.addEventListener("click", () => {

    loginMessage.textContent =
        "Facebook login will be connected when social authentication is added.";

    loginMessage.classList.add("showMessage");

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
```
