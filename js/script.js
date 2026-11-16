const splashScreen = document.getElementById("splashScreen");
const pageLoader = document.getElementById("pageLoader");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navigationLinks = document.getElementById("navigationLinks");
const backToTop = document.getElementById("backToTop");
const equipmentGrid = document.getElementById("equipmentGrid");
const carouselPrevious = document.getElementById("carouselPrevious");
const carouselNext = document.getElementById("carouselNext");

const heroSlides = document.querySelectorAll(".heroSlide");
const heroIndicators = document.querySelectorAll(".heroIndicator");
const navigationItems = document.querySelectorAll(".navigationLinks a");
const rentNowButtons = document.querySelectorAll(".rentNowButton");

const equipmentModal = document.getElementById("equipmentModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalCloseButton = document.getElementById("modalCloseButton");
const bookNowButton = document.getElementById("bookNowButton");

const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalLocation = document.getElementById("modalLocation");
const modalLocationDetail = document.getElementById("modalLocationDetail");
const modalPrice = document.getElementById("modalPrice");
const modalPeriod = document.getElementById("modalPeriod");
const modalDescription = document.getElementById("modalDescription");

let currentSlide = 0;
let heroInterval = null;
let selectedEquipment = null;

document.addEventListener("DOMContentLoaded", function () {
    const savedTheme = localStorage.getItem("farmRentTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("darkMode");

        if (themeIcon) {
            themeIcon.textContent = "☀";
        }
    } else if (themeIcon) {
        themeIcon.textContent = "☾";
    }

    setTimeout(function () {
        if (splashScreen) {
            splashScreen.classList.add("hidden");
        }
    }, 1000);
});

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("darkMode");

        const isDarkMode = document.body.classList.contains("darkMode");

        if (themeIcon) {
            themeIcon.textContent = isDarkMode ? "☀" : "☾";
        }

        localStorage.setItem(
            "farmRentTheme",
            isDarkMode ? "dark" : "light"
        );
    });
}

function openMobileMenu() {
    if (!navigationLinks) {
        return;
    }

    navigationLinks.classList.add("open");

    if (mobileMenuButton) {
        mobileMenuButton.setAttribute("aria-expanded", "true");
    }
}

function closeMobileMenu() {
    if (!navigationLinks) {
        return;
    }

    navigationLinks.classList.remove("open");

    if (mobileMenuButton) {
        mobileMenuButton.setAttribute("aria-expanded", "false");
    }
}

if (mobileMenuButton) {
    mobileMenuButton.setAttribute("aria-expanded", "false");

    mobileMenuButton.addEventListener("click", function () {
        openMobileMenu();
    });
}

if (closeMenuButton) {
    closeMenuButton.addEventListener("click", function () {
        closeMobileMenu();
    });
}

navigationItems.forEach(function (navigationItem) {
    navigationItem.addEventListener("click", function () {
        closeMobileMenu();
    });
});

function showSlide(slideNumber) {
    if (heroSlides.length === 0) {
        return;
    }

    heroSlides.forEach(function (slide) {
        slide.classList.remove("activeSlide");
    });

    heroIndicators.forEach(function (indicator) {
        indicator.classList.remove("activeIndicator");
        indicator.setAttribute("aria-current", "false");
    });

    if (heroSlides[slideNumber]) {
        heroSlides[slideNumber].classList.add("activeSlide");
    }

    if (heroIndicators[slideNumber]) {
        heroIndicators[slideNumber].classList.add("activeIndicator");
        heroIndicators[slideNumber].setAttribute("aria-current", "true");
    }

    currentSlide = slideNumber;
}

function startHeroSlider() {
    if (heroSlides.length <= 1) {
        return;
    }

    clearInterval(heroInterval);

    heroInterval = setInterval(function () {
        currentSlide++;

        if (currentSlide >= heroSlides.length) {
            currentSlide = 0;
        }

        showSlide(currentSlide);
    }, 6000);
}

function resetHeroSlider() {
    clearInterval(heroInterval);
    startHeroSlider();
}

heroIndicators.forEach(function (indicator) {
    indicator.addEventListener("click", function () {
        const selectedSlide = Number(indicator.dataset.slide);

        if (
            Number.isInteger(selectedSlide) &&
            selectedSlide >= 0 &&
            selectedSlide < heroSlides.length
        ) {
            showSlide(selectedSlide);
            resetHeroSlider();
        }
    });
});

if (heroSlides.length > 0) {
    showSlide(0);
    startHeroSlider();
}

if (carouselNext && equipmentGrid) {
    carouselNext.addEventListener("click", function () {
        equipmentGrid.scrollBy({
            left: 290,
            behavior: "smooth"
        });
    });
}

if (carouselPrevious && equipmentGrid) {
    carouselPrevious.addEventListener("click", function () {
        equipmentGrid.scrollBy({
            left: -290,
            behavior: "smooth"
        });
    });
}

function openEquipmentModal(button) {
    if (
        !equipmentModal ||
        !modalImage ||
        !modalName ||
        !modalLocation ||
        !modalLocationDetail ||
        !modalPrice ||
        !modalPeriod ||
        !modalDescription
    ) {
        return;
    }

    selectedEquipment = {
        name: button.dataset.name || "",
        location: button.dataset.location || "",
        price: button.dataset.price || "",
        period: button.dataset.period || "",
        image: button.dataset.image || "",
        description: button.dataset.description || ""
    };

    modalName.textContent = selectedEquipment.name;
    modalLocation.textContent = selectedEquipment.location;
    modalLocationDetail.textContent = selectedEquipment.location;
    modalPrice.textContent = selectedEquipment.price;
    modalPeriod.textContent = "/ " + selectedEquipment.period;
    modalDescription.textContent = selectedEquipment.description;

    if (selectedEquipment.image) {
        modalImage.style.backgroundImage =
            "url('" + selectedEquipment.image + "')";
    } else {
        modalImage.style.backgroundImage = "none";
    }

    equipmentModal.classList.add("active");
    document.body.classList.add("modalOpen");
}

function closeEquipmentModal() {
    if (equipmentModal) {
        equipmentModal.classList.remove("active");
    }

    document.body.classList.remove("modalOpen");
    selectedEquipment = null;
}

rentNowButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        openEquipmentModal(button);
    });
});

if (modalCloseButton) {
    modalCloseButton.addEventListener("click", function () {
        closeEquipmentModal();
    });
}

if (modalBackdrop) {
    modalBackdrop.addEventListener("click", function () {
        closeEquipmentModal();
    });
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeEquipmentModal();
        closeMobileMenu();
    }
});

if (bookNowButton) {
    bookNowButton.addEventListener("click", function () {
        const loggedIn =
            localStorage.getItem("farmRentLoggedIn") === "true";

        if (!loggedIn) {
            const equipmentName = selectedEquipment
                ? selectedEquipment.name
                : "";

            if (equipmentName) {
                localStorage.setItem(
                    "farmRentBookingEquipment",
                    equipmentName
                );
            }

            window.location.href = "login.html";
            return;
        }

        if (selectedEquipment) {
            localStorage.setItem(
                "farmRentBookingEquipment",
                selectedEquipment.name
            );
        }

        window.location.href = "checkout.html";
    });
}

window.addEventListener("scroll", function () {
    if (!backToTop) {
        return;
    }

    if (window.scrollY > 500) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
});

if (backToTop) {
    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

const internalLinks = document.querySelectorAll("a[href]");

internalLinks.forEach(function (link) {
    const linkTarget = link.getAttribute("href");

    if (!linkTarget) {
        return;
    }

    const isExternal =
        linkTarget.startsWith("http://") ||
        linkTarget.startsWith("https://") ||
        linkTarget.startsWith("//") ||
        linkTarget.startsWith("mailto:") ||
        linkTarget.startsWith("tel:");

    const isAnchor = linkTarget.startsWith("#");
    const isDownload = link.hasAttribute("download");

    const isHtmlPage =
        linkTarget.endsWith(".html") ||
        linkTarget.includes(".html?");

    if (
        isHtmlPage &&
        !isExternal &&
        !isAnchor &&
        !isDownload
    ) {
        link.addEventListener("click", function () {
            if (pageLoader) {
                pageLoader.classList.add("active");
            }
        });
    }
});