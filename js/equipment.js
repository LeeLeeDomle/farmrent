
const pageLoader = document.getElementById("pageLoader");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navigationLinks = document.getElementById("navigationLinks");
const backToTop = document.getElementById("backToTop");

const equipmentSearch = document.getElementById("equipmentSearch");
const searchButton = document.getElementById("searchButton");
const filterButtons = document.querySelectorAll(".filterButton");
const equipmentGrid = document.querySelector(".equipmentGrid");
const noResults = document.getElementById("noResults");

const modalBackdrop = document.getElementById("modalBackdrop");
const modalCloseButton = document.getElementById("modalCloseButton");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalLocation = document.getElementById("modalLocation");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const bookButton = document.getElementById("bookButton");

const navigationItems = document.querySelectorAll(".navigationLinks a");
const internalLinks = document.querySelectorAll("a[href]");

let selectedFilter = "all";
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

    if (mobileMenuButton) {
        mobileMenuButton.setAttribute("aria-expanded", "false");
    }

    attachRentButtons();
    filterEquipment();
});

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("darkMode");

        const isDarkMode =
            document.body.classList.contains("darkMode");

        if (themeIcon) {
            themeIcon.textContent =
                isDarkMode ? "☀" : "☾";
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
        mobileMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );
    }
}

function closeMobileMenu() {
    if (!navigationLinks) {
        return;
    }

    navigationLinks.classList.remove("open");

    if (mobileMenuButton) {
        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }
}

if (mobileMenuButton) {
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

document.addEventListener("click", function (event) {
    if (!navigationLinks || !mobileMenuButton) {
        return;
    }

    const menuIsOpen =
        navigationLinks.classList.contains("open");

    if (!menuIsOpen) {
        return;
    }

    const clickedInsideMenu =
        navigationLinks.contains(event.target);

    const clickedMenuButton =
        mobileMenuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedMenuButton) {
        closeMobileMenu();
    }
});

function showPageLoader() {
    if (pageLoader) {
        pageLoader.classList.add("active");
    }
}

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
            showPageLoader();
        });
    }
});

function filterEquipment() {
    const searchValue = equipmentSearch
        ? equipmentSearch.value.trim().toLowerCase()
        : "";

    const equipmentCards =
        document.querySelectorAll(".equipmentCard");

    let visibleCards = 0;

    equipmentCards.forEach(function (card) {
        const equipmentName =
            (card.dataset.name || "").toLowerCase();

        const equipmentLocation =
            (card.dataset.location || "").toLowerCase();

        const equipmentCategory =
            (card.dataset.category || "").toLowerCase();

        const equipmentDescription =
            (card.dataset.description || "").toLowerCase();

        const matchesSearch =
            equipmentName.includes(searchValue) ||
            equipmentLocation.includes(searchValue) ||
            equipmentDescription.includes(searchValue);

        const matchesFilter =
            selectedFilter === "all" ||
            equipmentCategory === selectedFilter;

        if (matchesSearch && matchesFilter) {
            card.style.display = "";
            visibleCards++;
        } else {
            card.style.display = "none";
        }
    });

    if (noResults) {
        noResults.style.display =
            visibleCards === 0 ? "block" : "none";
    }
}

if (equipmentSearch) {
    equipmentSearch.addEventListener("input", function () {
        filterEquipment();
    });

    equipmentSearch.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            filterEquipment();
        }
    });
}

if (searchButton) {
    searchButton.addEventListener("click", function () {
        filterEquipment();
    });
}

filterButtons.forEach(function (filterButton) {
    filterButton.addEventListener("click", function () {
        filterButtons.forEach(function (button) {
            button.classList.remove("activeFilter");
            button.setAttribute("aria-pressed", "false");
        });

        filterButton.classList.add("activeFilter");
        filterButton.setAttribute("aria-pressed", "true");

        selectedFilter =
            filterButton.dataset.filter || "all";

        filterEquipment();
    });
});

function attachRentButtons() {
    const rentButtons =
        document.querySelectorAll(".rentButton");

    rentButtons.forEach(function (rentButton) {
        rentButton.addEventListener("click", function () {
            const card =
                rentButton.closest(".equipmentCard");

            if (card) {
                openEquipmentModal(card);
            }
        });
    });
}

function openEquipmentModal(card) {
    if (
        !modalBackdrop ||
        !modalImage ||
        !modalTitle ||
        !modalLocation ||
        !modalPrice ||
        !modalDescription
    ) {
        return;
    }

    selectedEquipment = {
        name: card.dataset.name || "",
        location: card.dataset.location || "",
        price: card.dataset.price || "",
        description: card.dataset.description || "",
        image: card.dataset.image || ""
    };

    modalTitle.textContent =
        selectedEquipment.name;

    modalLocation.textContent =
        selectedEquipment.location;

    modalPrice.textContent =
        selectedEquipment.price;

    modalDescription.textContent =
        selectedEquipment.description;

    modalImage.className = "modalImage";

    if (selectedEquipment.image) {
        modalImage.classList.add(
            selectedEquipment.image
        );
    }

    modalImage.setAttribute(
        "aria-label",
        selectedEquipment.name +
        " available for rent"
    );

    modalBackdrop.classList.add("open");
    document.body.classList.add("modalOpen");

    if (modalCloseButton) {
        modalCloseButton.focus();
    }
}

function closeEquipmentModal() {
    if (modalBackdrop) {
        modalBackdrop.classList.remove("open");
    }

    document.body.classList.remove("modalOpen");
    selectedEquipment = null;
}

if (modalCloseButton) {
    modalCloseButton.addEventListener("click", function () {
        closeEquipmentModal();
    });
}

if (modalBackdrop) {
    modalBackdrop.addEventListener("click", function (event) {
        if (event.target === modalBackdrop) {
            closeEquipmentModal();
        }
    });
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        if (
            modalBackdrop &&
            modalBackdrop.classList.contains("open")
        ) {
            closeEquipmentModal();
        }

        closeMobileMenu();
    }
});

if (bookButton) {
    bookButton.addEventListener("click", function () {
        const isLoggedIn =
            localStorage.getItem("farmRentLoggedIn") === "true";

        if (selectedEquipment) {
            localStorage.setItem(
                "farmRentBookingEquipment",
                selectedEquipment.name
            );
        }

        showPageLoader();

        if (isLoggedIn) {
            window.location.href = "checkout.html";
        } else {
            window.location.href =
                "login.html?redirect=checkout";
        }
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
