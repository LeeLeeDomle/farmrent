
const pageLoader = document.getElementById("pageLoader");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const mobileMenuButton = document.getElementById("mobileMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navigationLinks = document.getElementById("navigationLinks");

const agroSearch = document.getElementById("agroSearch");
const searchButton = document.getElementById("searchButton");
const filterButtons = document.querySelectorAll(".filterButton");
const agroCards = document.querySelectorAll(".agroCard");
const noResults = document.getElementById("noResults");

const backToTop = document.getElementById("backToTop");

const modalBackdrop = document.getElementById("modalBackdrop");
const modalCloseButton = document.getElementById("modalCloseButton");
const modalImage = document.getElementById("modalImage");
const modalLocation = document.getElementById("modalLocation");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalPeriod = document.getElementById("modalPeriod");

const addToCartButton =
    document.getElementById("addToCartButton");

const buyNowButton =
    document.getElementById("buyNowButton");

let currentFilter = "all";
let selectedProduct = null;

window.addEventListener("load", () => {

    if (pageLoader) {
        pageLoader.style.width = "100%";

        setTimeout(() => {
            pageLoader.style.opacity = "0";
        }, 500);
    }

});

const savedTheme =
    localStorage.getItem("farmRentTheme");

if (savedTheme === "dark") {

    document.body.classList.add("darkMode");

    if (themeIcon) {
        themeIcon.textContent = "☀";
    }

}

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("darkMode");

        const darkModeEnabled =
            document.body.classList.contains("darkMode");

        if (darkModeEnabled) {

            themeIcon.textContent = "☀";

            localStorage.setItem(
                "farmRentTheme",
                "dark"
            );

        } else {

            themeIcon.textContent = "☾";

            localStorage.setItem(
                "farmRentTheme",
                "light"
            );

        }

    });

}

if (mobileMenuButton) {

    mobileMenuButton.addEventListener("click", () => {

        navigationLinks.classList.add("menuOpen");

    });

}

if (closeMenuButton) {

    closeMenuButton.addEventListener("click", () => {

        navigationLinks.classList.remove("menuOpen");

    });

}

if (navigationLinks) {

    navigationLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            navigationLinks.classList.remove("menuOpen");

        });

    });

}

function filterProducts() {

    if (!agroSearch) {
        return;
    }

    const searchTerm =
        agroSearch.value.trim().toLowerCase();

    let visibleProducts = 0;

    agroCards.forEach((card) => {

        const category =
            card.dataset.category.toLowerCase();

        const name =
            card.dataset.name.toLowerCase();

        const location =
            card.dataset.location.toLowerCase();

        const description =
            card.dataset.description.toLowerCase();

        const matchesFilter =
            currentFilter === "all" ||
            category === currentFilter;

        const matchesSearch =
            name.includes(searchTerm) ||
            location.includes(searchTerm) ||
            description.includes(searchTerm);

        if (matchesFilter && matchesSearch) {

            card.style.display = "";

            visibleProducts++;

        } else {

            card.style.display = "none";

        }

    });

    if (noResults) {

        if (visibleProducts === 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

    }

}

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        filterButtons.forEach((item) => {

            item.classList.remove("activeFilter");

        });

        button.classList.add("activeFilter");

        currentFilter =
            button.dataset.filter;

        filterProducts();

    });

});

if (agroSearch) {

    agroSearch.addEventListener("input", () => {

        filterProducts();

    });

}

if (searchButton) {

    searchButton.addEventListener("click", () => {

        filterProducts();

    });

}

agroCards.forEach((card) => {

    const viewButton =
        card.querySelector(".viewButton");

    if (!viewButton) {
        return;
    }

    viewButton.addEventListener("click", () => {

        const imageClass =
            card.querySelector(".agroImage").classList[1];

        selectedProduct = {

            name: card.dataset.name,

            location: card.dataset.location,

            price: card.dataset.price,

            period: card.dataset.period,

            description: card.dataset.description,

            imageClass: imageClass

        };

        modalLocation.textContent =
            selectedProduct.location;

        modalTitle.textContent =
            selectedProduct.name;

        modalDescription.textContent =
            selectedProduct.description;

        modalPrice.textContent =
            selectedProduct.price;

        modalPeriod.textContent =
            selectedProduct.period;

        modalImage.className =
            "modalImage";

        modalImage.classList.add(
            selectedProduct.imageClass
        );

        modalBackdrop.classList.add(
            "showModal"
        );

        document.body.style.overflow =
            "hidden";

    });

});

function closeModal() {

    if (!modalBackdrop) {
        return;
    }

    modalBackdrop.classList.remove(
        "showModal"
    );

    document.body.style.overflow = "";

}

if (modalCloseButton) {

    modalCloseButton.addEventListener(
        "click",
        closeModal
    );

}

if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                modalBackdrop
            ) {

                closeModal();

            }

        }
    );

}

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeModal();

        if (navigationLinks) {

            navigationLinks.classList.remove(
                "menuOpen"
            );

        }

    }

});

function getCart() {

    const savedCart =
        localStorage.getItem(
            "farmRentCart"
        );

    if (!savedCart) {
        return [];
    }

    try {

        return JSON.parse(savedCart);

    } catch (error) {

        return [];

    }

}

function saveCart(cart) {

    localStorage.setItem(
        "farmRentCart",
        JSON.stringify(cart)
    );

}

function addProductToCart() {

    if (!selectedProduct) {
        return;
    }

    const cart =
        getCart();

    const existingProduct =
        cart.find(
            (product) =>
                product.name ===
                selectedProduct.name
        );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            name: selectedProduct.name,

            location: selectedProduct.location,

            price: selectedProduct.price,

            period: selectedProduct.period,

            description:
                selectedProduct.description,

            imageClass:
                selectedProduct.imageClass,

            quantity: 1

        });

    }

    saveCart(cart);

}

if (addToCartButton) {

    addToCartButton.addEventListener(
        "click",
        () => {

            addProductToCart();

            window.location.href =
                "cart.html";

        }
    );

}

if (buyNowButton) {

    buyNowButton.addEventListener(
        "click",
        () => {

            addProductToCart();

            window.location.href =
                "cart.html";

        }
    );

}

window.addEventListener("scroll", () => {

    if (!backToTop) {
        return;
    }

    if (window.scrollY > 400) {

        backToTop.classList.add(
            "showButton"
        );

    } else {

        backToTop.classList.remove(
            "showButton"
        );

    }

});

if (backToTop) {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}

