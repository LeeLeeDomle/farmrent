const pageLoader = document.getElementById("pageLoader");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const mobileMenuButton = document.getElementById("mobileMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navigationLinks = document.getElementById("navigationLinks");

const checkoutForm = document.getElementById("checkoutForm");
const checkoutItems = document.getElementById("checkoutItems");

const cartCount = document.getElementById("cartCount");
const mobileCartCount = document.getElementById("mobileCartCount");

const checkoutItemCount = document.getElementById("checkoutItemCount");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutDelivery = document.getElementById("checkoutDelivery");
const checkoutTotal = document.getElementById("checkoutTotal");

const backToTop = document.getElementById("backToTop");
const mobileLogoutLink = document.getElementById("mobileLogoutLink");

const cartStorageKey = "farmRentCart";
const checkoutStorageKey = "farmRentCheckout";

let cartProducts = [];

window.addEventListener("load", () => {
    if (pageLoader) {
        pageLoader.style.width = "100%";

        setTimeout(() => {
            pageLoader.style.opacity = "0";
        }, 500);
    }
});

function formatCurrency(amount) {
    return "₦" + Number(amount).toLocaleString("en-NG");
}

function loadCart() {
    const savedCart = localStorage.getItem(cartStorageKey);

    if (!savedCart) {
        cartProducts = [];
        showEmptyCartMessage();
        return;
    }

    try {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
            cartProducts = parsedCart;
        } else {
            cartProducts = [];
        }
    } catch (error) {
        cartProducts = [];
    }

    cartProducts = cartProducts.map((product) => {
        return {
            ...product,
            quantity: Math.max(1, Number(product.quantity) || 1),
            price: Number(product.price) || 0
        };
    });

    if (cartProducts.length === 0) {
        showEmptyCartMessage();
        return;
    }

    updateCartCount();
    renderCheckoutItems();
    updateCheckoutSummary();
}

function showEmptyCartMessage() {
    if (checkoutItems) {
        checkoutItems.innerHTML = `
            <div class="emptyCheckout">
                <h3>Your cart is empty</h3>
                <p>Add agro products to your cart before continuing to checkout.</p>
                <a href="agro-products.html">Browse Agro Products</a>
            </div>
        `;
    }

    if (checkoutForm) {
        checkoutForm.style.display = "none";
    }

    if (checkoutItemCount) {
        checkoutItemCount.textContent = "0";
    }

    if (checkoutSubtotal) {
        checkoutSubtotal.textContent = "₦0";
    }

    if (checkoutTotal) {
        checkoutTotal.textContent = "₦0";
    }

    if (checkoutDelivery) {
        checkoutDelivery.textContent = "Calculated later";
    }

    updateCartCount();
}

function getTotalQuantity() {
    return cartProducts.reduce((total, product) => {
        return total + product.quantity;
    }, 0);
}

function getSubtotal() {
    return cartProducts.reduce((total, product) => {
        return total + product.price * product.quantity;
    }, 0);
}

function updateCartCount() {
    const totalQuantity = getTotalQuantity();

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }

    if (mobileCartCount) {
        mobileCartCount.textContent = totalQuantity;
    }
}

function renderCheckoutItems() {
    if (!checkoutItems) {
        return;
    }

    checkoutItems.innerHTML = "";

    cartProducts.forEach((product) => {
        const item = document.createElement("div");
        item.className = "checkoutItem";

        const image = document.createElement("div");
        image.className = "checkoutItemImage";

        if (product.imageClass) {
            image.classList.add(product.imageClass);
        }

        const details = document.createElement("div");
        details.className = "checkoutItemDetails";

        const name = document.createElement("h4");
        name.textContent = product.name || "Agro Product";

        const quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + product.quantity;

        const price = document.createElement("p");
        price.className = "checkoutItemPrice";
        price.textContent = formatCurrency(
            product.price * product.quantity
        );

        details.appendChild(name);
        details.appendChild(quantity);
        details.appendChild(price);

        item.appendChild(image);
        item.appendChild(details);

        checkoutItems.appendChild(item);
    });
}

function updateCheckoutSummary() {
    const quantity = getTotalQuantity();
    const subtotal = getSubtotal();

    if (checkoutItemCount) {
        checkoutItemCount.textContent = quantity;
    }

    if (checkoutSubtotal) {
        checkoutSubtotal.textContent = formatCurrency(subtotal);
    }

    if (checkoutDelivery) {
        checkoutDelivery.textContent = "Calculated later";
    }

    if (checkoutTotal) {
        checkoutTotal.textContent = formatCurrency(subtotal);
    }
}

function setupTheme() {
    const savedTheme = localStorage.getItem("farmRentTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("darkMode");

        if (themeIcon) {
            themeIcon.textContent = "☀";
        }
    }

    if (!themeToggle) {
        return;
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("darkMode");

        const darkModeEnabled =
            document.body.classList.contains("darkMode");

        if (darkModeEnabled) {
            if (themeIcon) {
                themeIcon.textContent = "☀";
            }

            localStorage.setItem("farmRentTheme", "dark");
        } else {
            if (themeIcon) {
                themeIcon.textContent = "☾";
            }

            localStorage.setItem("farmRentTheme", "light");
        }
    });
}

function setupMobileMenu() {
    if (mobileMenuButton && navigationLinks) {
        mobileMenuButton.addEventListener("click", () => {
            navigationLinks.classList.add("menuOpen");
        });
    }

    if (closeMenuButton && navigationLinks) {
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

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (navigationLinks) {
                navigationLinks.classList.remove("menuOpen");
            }
        }
    });
}

function saveCheckoutDetails() {
    const formData = new FormData(checkoutForm);

    const checkoutDetails = {
        fullName: formData.get("fullName"),
        phoneNumber: formData.get("phoneNumber"),
        emailAddress: formData.get("emailAddress"),
        state: formData.get("state"),
        deliveryAddress: formData.get("deliveryAddress"),
        city: formData.get("city"),
        deliveryNote: formData.get("deliveryNote"),
        deliveryMethod: formData.get("deliveryMethod"),
        subtotal: getSubtotal(),
        itemCount: getTotalQuantity(),
        products: cartProducts
    };

    localStorage.setItem(
        checkoutStorageKey,
        JSON.stringify(checkoutDetails)
    );
}

function setupCheckoutForm() {
    if (!checkoutForm) {
        return;
    }

    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (cartProducts.length === 0) {
            return;
        }

        if (!checkoutForm.checkValidity()) {
            checkoutForm.reportValidity();
            return;
        }

        saveCheckoutDetails();

        window.location.href = "payment.html";
    });
}

function setupLogout() {
    if (!mobileLogoutLink) {
        return;
    }

    mobileLogoutLink.addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.removeItem("farmRentUser");
        localStorage.removeItem("farmRentLoggedIn");

        window.location.href = "login.html";
    });
}

function setupBackToTop() {
    if (!backToTop) {
        return;
    }

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
}

setupTheme();
setupMobileMenu();
setupCheckoutForm();
setupLogout();
setupBackToTop();
loadCart();