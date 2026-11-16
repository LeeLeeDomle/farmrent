const pageLoader = document.getElementById("pageLoader");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const mobileMenuButton = document.getElementById("mobileMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navigationLinks = document.getElementById("navigationLinks");

const cartItemsContainer = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const cartSummary = document.getElementById("cartSummary");

const cartCount = document.getElementById("cartCount");
const mobileCartCount = document.getElementById("mobileCartCount");
const summaryItemCount = document.getElementById("summaryItemCount");

const cartSubtotal = document.getElementById("cartSubtotal");
const deliveryFee = document.getElementById("deliveryFee");
const cartTotal = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");
const backToTop = document.getElementById("backToTop");
const mobileLogoutLink = document.getElementById("mobileLogoutLink");

const cartStorageKey = "farmRentCart";

let cartProducts = [];

window.addEventListener("load", () => {
    if (pageLoader) {
        pageLoader.style.width = "100%";

        setTimeout(() => {
            pageLoader.style.opacity = "0";
        }, 500);
    }
});

function loadCart() {
    const savedCart = localStorage.getItem(cartStorageKey);

    if (!savedCart) {
        cartProducts = [];
        renderCart();
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

    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartProducts));
}

function formatCurrency(amount) {
    return "₦" + Number(amount).toLocaleString("en-NG");
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

    if (summaryItemCount) {
        summaryItemCount.textContent =
            totalQuantity === 1
                ? "1 item"
                : totalQuantity + " items";
    }
}

function renderCart() {
    if (!cartItemsContainer || !emptyCart || !cartSummary) {
        return;
    }

    cartItemsContainer.innerHTML = "";

    updateCartCount();

    if (cartProducts.length === 0) {
        emptyCart.style.display = "block";
        cartSummary.style.display = "none";
        return;
    }

    emptyCart.style.display = "none";
    cartSummary.style.display = "block";

    cartProducts.forEach((product, index) => {
        const cartItem = document.createElement("article");
        cartItem.className = "cartItem";

        const image = document.createElement("div");
        image.className = "cartItemImage";

        if (product.imageClass) {
            image.classList.add(product.imageClass);
        }

        const content = document.createElement("div");
        content.className = "cartItemContent";

        const location = document.createElement("p");
        location.className = "cartItemLocation";
        location.textContent = product.location || "Nigeria";

        const name = document.createElement("h3");
        name.className = "cartItemName";
        name.textContent = product.name || "Agro Product";

        const seller = document.createElement("p");
        seller.className = "cartItemSeller";
        seller.textContent = product.seller
            ? "Seller: " + product.seller
            : "Available from FarmRent marketplace";

        const bottom = document.createElement("div");
        bottom.className = "cartItemBottom";

        const price = document.createElement("p");
        price.className = "cartItemPrice";

        const productPrice = document.createElement("strong");
        productPrice.textContent = formatCurrency(product.price);

        const period = document.createElement("span");
        period.textContent = product.period || "";

        price.appendChild(productPrice);
        price.appendChild(document.createTextNode(" "));
        price.appendChild(period);

        const controls = document.createElement("div");
        controls.className = "cartItemControls";

        const quantityControl = document.createElement("div");
        quantityControl.className = "quantityControl";

        const decreaseButton = document.createElement("button");
        decreaseButton.className = "quantityButton";
        decreaseButton.type = "button";
        decreaseButton.textContent = "−";
        decreaseButton.setAttribute(
            "aria-label",
            "Decrease quantity"
        );

        const quantityValue = document.createElement("span");
        quantityValue.className = "quantityValue";
        quantityValue.textContent = product.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.className = "quantityButton";
        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.setAttribute(
            "aria-label",
            "Increase quantity"
        );

        quantityControl.appendChild(decreaseButton);
        quantityControl.appendChild(quantityValue);
        quantityControl.appendChild(increaseButton);

        const removeButton = document.createElement("button");
        removeButton.className = "removeButton";
        removeButton.type = "button";
        removeButton.textContent = "Remove";

        decreaseButton.addEventListener("click", () => {
            changeQuantity(index, -1);
        });

        increaseButton.addEventListener("click", () => {
            changeQuantity(index, 1);
        });

        removeButton.addEventListener("click", () => {
            removeProduct(index);
        });

        controls.appendChild(quantityControl);
        controls.appendChild(removeButton);

        bottom.appendChild(price);
        bottom.appendChild(controls);

        content.appendChild(location);
        content.appendChild(name);
        content.appendChild(seller);
        content.appendChild(bottom);

        cartItem.appendChild(image);
        cartItem.appendChild(content);

        cartItemsContainer.appendChild(cartItem);
    });

    updateSummary();
}

function changeQuantity(index, change) {
    if (!cartProducts[index]) {
        return;
    }

    cartProducts[index].quantity += change;

    if (cartProducts[index].quantity < 1) {
        cartProducts[index].quantity = 1;
    }

    saveCart();
    renderCart();
}

function removeProduct(index) {
    if (!cartProducts[index]) {
        return;
    }

    cartProducts.splice(index, 1);

    saveCart();
    renderCart();
}

function updateSummary() {
    const subtotal = getSubtotal();

    const delivery = 0;

    const total = subtotal + delivery;

    if (cartSubtotal) {
        cartSubtotal.textContent = formatCurrency(subtotal);
    }

    if (deliveryFee) {
        deliveryFee.textContent = delivery === 0
            ? "Calculated at checkout"
            : formatCurrency(delivery);
    }

    if (cartTotal) {
        cartTotal.textContent = formatCurrency(total);
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

function setupCheckout() {
    if (!checkoutButton) {
        return;
    }

    checkoutButton.addEventListener("click", () => {
        if (cartProducts.length === 0) {
            return;
        }

        window.location.href = "checkout.html";
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
setupCheckout();
setupLogout();
setupBackToTop();
loadCart();