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

const addToCartButton = document.getElementById("addToCartButton");
const buyNowButton = document.getElementById("buyNowButton");
const cartCount = document.getElementById("cartCount");

const rentLinks = document.querySelectorAll("a[href]");

let currentFilter = "all";
let selectedProduct = null;

window.addEventListener("load", function () {
    if (!pageLoader) {
        return;
    }

    pageLoader.style.width = "100%";

    setTimeout(function () {
        pageLoader.style.opacity = "0";
    }, 500);
});

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

    filterProducts();
    updateCartCount();
});

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("darkMode");

        const darkModeEnabled =
            document.body.classList.contains("darkMode");

        if (themeIcon) {
            themeIcon.textContent =
                darkModeEnabled ? "☀" : "☾";
        }

        localStorage.setItem(
            "farmRentTheme",
            darkModeEnabled ? "dark" : "light"
        );
    });
}

if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", function (event) {
        event.stopPropagation();

        if (!navigationLinks) {
            return;
        }

        navigationLinks.classList.add("menuOpen");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );
    });
}

if (closeMenuButton) {
    closeMenuButton.addEventListener("click", function () {
        closeMobileMenu();
    });
}

function closeMobileMenu() {
    if (!navigationLinks) {
        return;
    }

    navigationLinks.classList.remove("menuOpen");

    if (mobileMenuButton) {
        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }
}

if (navigationLinks) {
    navigationLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            closeMobileMenu();
        });
    });
}

document.addEventListener("click", function (event) {
    if (!navigationLinks || !mobileMenuButton) {
        return;
    }

    const menuIsOpen =
        navigationLinks.classList.contains("menuOpen");

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

rentLinks.forEach(function (link) {
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

function filterProducts() {
    const searchTerm = agroSearch
        ? agroSearch.value.trim().toLowerCase()
        : "";

    let visibleProducts = 0;

    agroCards.forEach(function (card) {
        const category =
            (card.dataset.category || "").toLowerCase();

        const name =
            (card.dataset.name || "").toLowerCase();

        const location =
            (card.dataset.location || "").toLowerCase();

        const description =
            (card.dataset.description || "").toLowerCase();

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
        noResults.style.display =
            visibleProducts === 0 ? "block" : "none";
    }
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        filterButtons.forEach(function (item) {
            item.classList.remove("activeFilter");
            item.setAttribute("aria-pressed", "false");
        });

        button.classList.add("activeFilter");
        button.setAttribute("aria-pressed", "true");

        currentFilter =
            button.dataset.filter || "all";

        filterProducts();
    });
});

if (agroSearch) {
    agroSearch.addEventListener("input", function () {
        filterProducts();
    });

    agroSearch.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            filterProducts();
        }
    });
}

if (searchButton) {
    searchButton.addEventListener("click", function () {
        filterProducts();
    });
}

function getCart() {
    const savedCart =
        localStorage.getItem("farmRentCart");

    if (!savedCart) {
        return [];
    }

    try {
        const parsedCart =
            JSON.parse(savedCart);

        return Array.isArray(parsedCart)
            ? parsedCart
            : [];
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

function updateCartCount() {
    const cart = getCart();

    const totalItems = cart.reduce(
        function (total, item) {
            return total + Number(item.quantity || 1);
        },
        0
    );

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function createProductFromCard(card) {
    const imageElement =
        card.querySelector(".agroImage");

    let imageClass = "agroImageEight";

    if (imageElement) {
        if (
            imageElement.classList.contains(
                "agroImageOne"
            )
        ) {
            imageClass = "agroImageOne";
        } else if (
            imageElement.classList.contains(
                "agroImageTwo"
            )
        ) {
            imageClass = "agroImageTwo";
        } else if (
            imageElement.classList.contains(
                "agroImageThree"
            )
        ) {
            imageClass = "agroImageThree";
        } else if (
            imageElement.classList.contains(
                "agroImageFour"
            )
        ) {
            imageClass = "agroImageFour";
        } else if (
            imageElement.classList.contains(
                "agroImageFive"
            )
        ) {
            imageClass = "agroImageFive";
        } else if (
            imageElement.classList.contains(
                "agroImageSix"
            )
        ) {
            imageClass = "agroImageSix";
        } else if (
            imageElement.classList.contains(
                "agroImageSeven"
            )
        ) {
            imageClass = "agroImageSeven";
        }
    }

    return {
        id: (card.dataset.name || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-"),

        name: card.dataset.name || "",
        category: card.dataset.category || "",
        location: card.dataset.location || "",
        price: card.dataset.price || "",
        period: card.dataset.period || "",
        description: card.dataset.description || "",
        imageClass: imageClass,
        quantity: 1
    };
}

function openProductModal(card) {
    if (
        !modalBackdrop ||
        !modalImage ||
        !modalTitle ||
        !modalLocation ||
        !modalDescription ||
        !modalPrice ||
        !modalPeriod
    ) {
        return;
    }

    selectedProduct =
        createProductFromCard(card);

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
        "modalImage " +
        selectedProduct.imageClass;

    modalBackdrop.classList.add("showModal");

    document.body.style.overflow = "hidden";

    if (modalCloseButton) {
        modalCloseButton.focus();
    }
}

agroCards.forEach(function (card) {
    const viewButton =
        card.querySelector(".viewButton");

    if (viewButton) {
        viewButton.addEventListener("click", function () {
            openProductModal(card);
        });
    }
});

function closeModal() {
    if (modalBackdrop) {
        modalBackdrop.classList.remove("showModal");
    }

    document.body.style.overflow = "";

    selectedProduct = null;
}

if (modalCloseButton) {
    modalCloseButton.addEventListener(
        "click",
        function () {
            closeModal();
        }
    );
}

if (modalBackdrop) {
    modalBackdrop.addEventListener(
        "click",
        function (event) {
            if (event.target === modalBackdrop) {
                closeModal();
            }
        }
    );
}

function addProductToCart(product) {
    const cart = getCart();

    const existingProduct =
        cart.find(function (item) {
            return item.id === product.id;
        });

    if (existingProduct) {
        existingProduct.quantity =
            Number(existingProduct.quantity || 0) + 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
}

if (addToCartButton) {
    addToCartButton.addEventListener(
        "click",
        function () {
            if (!selectedProduct) {
                return;
            }

            addProductToCart(selectedProduct);

            addToCartButton.textContent =
                "Added to Cart";

            setTimeout(function () {
                addToCartButton.textContent =
                    "Add to Cart";
            }, 1200);
        }
    );
}

if (buyNowButton) {
    buyNowButton.addEventListener(
        "click",
        function () {
            if (!selectedProduct) {
                return;
            }

            addProductToCart(selectedProduct);

            showPageLoader();

            window.location.href = "cart.html";
        }
    );
}

document.addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Escape") {
            closeModal();
            closeMobileMenu();
        }
    }
);

window.addEventListener(
    "scroll",
    function () {
        if (!backToTop) {
            return;
        }

        if (window.scrollY > 400) {
            backToTop.classList.add("showButton");
        } else {
            backToTop.classList.remove("showButton");
        }
    }
);

if (backToTop) {
    backToTop.addEventListener(
        "click",
        function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}