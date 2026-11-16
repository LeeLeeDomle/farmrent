
const pageLoader = document.getElementById("pageLoader");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const mobileMenuButton = document.getElementById("mobileMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navigationLinks = document.getElementById("navigationLinks");

const backToTop = document.getElementById("backToTop");

const helpSearch = document.getElementById("helpSearch");
const helpSearchButton = document.getElementById("helpSearchButton");

const faqItems = document.querySelectorAll(".faqItem");
const categoryCards = document.querySelectorAll(".categoryCard");
const noFaqResults = document.getElementById("noFaqResults");

const supportForm = document.getElementById("supportForm");
const formMessage = document.getElementById("formMessage");

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

faqItems.forEach((faqItem) => {

    const question = faqItem.querySelector(".faqQuestion");
    const answer = faqItem.querySelector(".faqAnswer");

    question.addEventListener("click", () => {

        const isOpen = faqItem.classList.contains("open");

        faqItems.forEach((item) => {
            item.classList.remove("open");
            item.querySelector(".faqAnswer").style.maxHeight = null;
        });

        if (!isOpen) {
            faqItem.classList.add("open");
            answer.style.maxHeight = `${answer.scrollHeight}px`;
        }

    });

});

function filterFaqs(searchTerm) {

    const normalizedTerm = searchTerm.trim().toLowerCase();

    let visibleCount = 0;

    faqItems.forEach((faqItem) => {

        const faqText = faqItem.textContent.toLowerCase();

        if (
            normalizedTerm === "" ||
            faqText.includes(normalizedTerm)
        ) {
            faqItem.style.display = "";
            visibleCount++;
        } else {
            faqItem.style.display = "none";
            faqItem.classList.remove("open");
            faqItem.querySelector(".faqAnswer").style.maxHeight = null;
        }

    });

    if (visibleCount === 0) {
        noFaqResults.classList.add("showResults");
    } else {
        noFaqResults.classList.remove("showResults");
    }

}

helpSearch.addEventListener("input", () => {
    filterFaqs(helpSearch.value);
});

helpSearchButton.addEventListener("click", () => {
    filterFaqs(helpSearch.value);

    document.querySelector(".faqSection").scrollIntoView({
        behavior: "smooth"
    });
});

categoryCards.forEach((categoryCard) => {

    categoryCard.addEventListener("click", () => {

        const category = categoryCard.dataset.category;

        const matchingFaqs = [];

        faqItems.forEach((faqItem) => {

            if (faqItem.dataset.topic === category) {
                matchingFaqs.push(faqItem);
            }

        });

        faqItems.forEach((faqItem) => {
            faqItem.style.display = "none";
            faqItem.classList.remove("open");
            faqItem.querySelector(".faqAnswer").style.maxHeight = null;
        });

        matchingFaqs.forEach((faqItem) => {
            faqItem.style.display = "";
        });

        noFaqResults.classList.remove("showResults");

        document.querySelector(".faqSection").scrollIntoView({
            behavior: "smooth"
        });

    });

});

supportForm.addEventListener("submit", (event) => {

    event.preventDefault();

    formMessage.textContent =
        "Your message has been received. Our support team will get back to you.";

    formMessage.classList.add("showMessage");

    supportForm.reset();

});

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {
        backToTop.classList.add("showButton");
    } else {
        backToTop.classList.remove("showButton");
    }

});
const mobileLogoutLink = document.getElementById("mobileLogoutLink");

if (mobileLogoutLink) {
    mobileLogoutLink.addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.removeItem("farmRentLoggedIn");
        localStorage.removeItem("farmRentUserEmail");

        window.location.href = "login.html";
    });
}
backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

