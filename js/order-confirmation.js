const orderStorageKey = "farmRentOrder";
const cartStorageKey = "farmRentCart";
const themeStorageKey = "farmRentTheme";

const orderNumber = document.getElementById("orderNumber");
const orderStatus = document.getElementById("orderStatus");
const confirmationProducts = document.getElementById("confirmationProducts");
const itemCount = document.getElementById("itemCount");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerEmail = document.getElementById("customerEmail");
const customerState = document.getElementById("customerState");
const customerAddress = document.getElementById("customerAddress");
const customerCity = document.getElementById("customerCity");
const deliveryMethod = document.getElementById("deliveryMethod");
const deliveryNote = document.getElementById("deliveryNote");
const paymentStatus = document.getElementById("paymentStatus");
const paymentMessage = document.getElementById("paymentMessage");

const themeToggle = document.getElementById("themeToggle");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");
const backToTop = document.getElementById("backToTop");
const logoutButton = document.getElementById("logoutButton");

const continueShoppingButton = document.getElementById("continueShoppingButton");
const homeButton = document.getElementById("homeButton");

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(amount || 0);
};

const getCart = () => {
    try {
        return JSON.parse(localStorage.getItem(cartStorageKey)) || [];
    } catch (error) {
        return [];
    }
};

const getOrder = () => {
    try {
        return JSON.parse(localStorage.getItem(orderStorageKey));
    } catch (error) {
        return null;
    }
};

const getImageClass = (product) => {
    return product.imageClass || "agroImageOne";
};

const getDeliveryMethod = (method) => {
    if (method === "pickup") {
        return "Pickup";
    }

    return "Standard Delivery";
};

const calculateItemTotal = (product) => {
    const price = Number(product.price) || 0;
    const quantity = Number(product.quantity) || 1;

    return price * quantity;
};

const renderProducts = (products) => {
    if (!confirmationProducts) {
        return;
    }

    confirmationProducts.innerHTML = "";

    if (!products.length) {
        confirmationProducts.innerHTML = `
            <div class="emptyProducts">
                <p>No products found for this order.</p>
            </div>
        `;
        return;
    }

    products.forEach((product) => {
        const quantity = Number(product.quantity) || 1;
        const productTotal = calculateItemTotal(product);

        const productItem = document.createElement("article");
        productItem.className = "confirmationProduct";

        productItem.innerHTML = `
            <div class="productImage ${getImageClass(product)}"></div>

            <div class="productDetails">
                <h3>${product.name || "Farm Product"}</h3>
                <p>${product.location || "Nigeria"}</p>
                <span>Quantity: ${quantity}</span>
            </div>

            <strong>${formatCurrency(productTotal)}</strong>
        `;

        confirmationProducts.appendChild(productItem);
    });
};

const showNoOrderState = () => {
    if (orderNumber) {
        orderNumber.textContent = "No recent order";
    }

    if (orderStatus) {
        orderStatus.textContent = "No Order Found";
    }

    if (confirmationProducts) {
        confirmationProducts.innerHTML = `
            <div class="emptyProducts">
                <h3>No recent order found</h3>
                <p>Your order information is not available on this device.</p>
            </div>
        `;
    }

    if (itemCount) {
        itemCount.textContent = "0";
    }

    if (subtotal) {
        subtotal.textContent = formatCurrency(0);
    }

    if (total) {
        total.textContent = formatCurrency(0);
    }
};

const loadOrder = () => {
    const order = getOrder();

    if (!order) {
        showNoOrderState();
        return;
    }

    const products = Array.isArray(order.products) ? order.products : [];
    const customer = order.customer || {};

    const calculatedItemCount = products.reduce((totalQuantity, product) => {
        return totalQuantity + (Number(product.quantity) || 1);
    }, 0);

    const orderSubtotal = Number(order.subtotal) || 0;
    const orderTotal = Number(order.total) || orderSubtotal;

    if (orderNumber) {
        orderNumber.textContent = order.orderNumber || "FR00000000";
    }

    if (orderStatus) {
        orderStatus.textContent = order.orderStatus || "Order Received";
    }

    if (itemCount) {
        itemCount.textContent = calculatedItemCount || Number(order.itemCount) || 0;
    }

    if (subtotal) {
        subtotal.textContent = formatCurrency(orderSubtotal);
    }

    if (total) {
        total.textContent = formatCurrency(orderTotal);
    }

    if (customerName) {
        customerName.textContent = customer.fullName || "Not provided";
    }

    if (customerPhone) {
        customerPhone.textContent = customer.phoneNumber || "Not provided";
    }

    if (customerEmail) {
        customerEmail.textContent = customer.emailAddress || "Not provided";
    }

    if (customerState) {
        customerState.textContent = customer.state || "Not provided";
    }

    if (customerAddress) {
        customerAddress.textContent = customer.deliveryAddress || "Not provided";
    }

    if (customerCity) {
        customerCity.textContent = customer.city || "Not provided";
    }

    if (deliveryMethod) {
        deliveryMethod.textContent = getDeliveryMethod(customer.deliveryMethod);
    }

    if (deliveryNote) {
        deliveryNote.textContent = customer.deliveryNote || "No delivery note provided.";
    }

    if (paymentStatus) {
        paymentStatus.textContent = order.paymentStatus || "Pending";
    }

    if (paymentMessage) {
        if (order.paymentMethod === "card") {
            paymentMessage.textContent = "Your payment has been recorded and your order is now being processed.";
        } else {
            paymentMessage.textContent = "Your order has been received. Complete the bank transfer using the instructions provided.";
        }
    }

    renderProducts(products);
};

const updateThemeIcon = () => {
    if (!themeToggle) {
        return;
    }

    const currentTheme = document.body.classList.contains("darkMode");

    themeToggle.textContent = currentTheme ? "☀" : "☾";
    themeToggle.setAttribute(
        "aria-label",
        currentTheme ? "Switch to light mode" : "Switch to dark mode"
    );
};

const loadTheme = () => {
    const savedTheme = localStorage.getItem(themeStorageKey);

    if (savedTheme === "dark") {
        document.body.classList.add("darkMode");
    }

    updateThemeIcon();
};

const toggleTheme = () => {
    document.body.classList.toggle("darkMode");

    const isDarkMode = document.body.classList.contains("darkMode");

    localStorage.setItem(
        themeStorageKey,
        isDarkMode ? "dark" : "light"
    );

    updateThemeIcon();
};

const updateCartCount = () => {
    const cart = getCart();

    const totalQuantity = cart.reduce((total, product) => {
        return total + (Number(product.quantity) || 1);
    }, 0);

    const cartCountElements = document.querySelectorAll(".cartCount");

    cartCountElements.forEach((element) => {
        element.textContent = totalQuantity;
    });
};

const toggleMobileMenu = () => {
    if (!mobileMenu || !mobileMenuButton) {
        return;
    }

    mobileMenu.classList.toggle("open");

    const isOpen = mobileMenu.classList.contains("open");

    mobileMenuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
};

const closeMobileMenu = () => {
    if (!mobileMenu || !mobileMenuButton) {
        return;
    }

    mobileMenu.classList.remove("open");
    mobileMenuButton.setAttribute("aria-expanded", "false");
};

const handleLogout = () => {
    localStorage.removeItem("farmRentUser");
    localStorage.removeItem("farmRentLoggedIn");

    window.location.href = "login.html";
};

const handleScroll = () => {
    if (!backToTop) {
        return;
    }

    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
}

if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", toggleMobileMenu);
}

if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
}

if (backToTop) {
    backToTop.addEventListener("click", scrollToTop);
}

if (continueShoppingButton) {
    continueShoppingButton.addEventListener("click", () => {
        window.location.href = "agro-products.html";
    });
}

if (homeButton) {
    homeButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

if (mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll("a");

    mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });
}

document.addEventListener("click", (event) => {
    if (!mobileMenu || !mobileMenuButton) {
        return;
    }

    if (
        mobileMenu.classList.contains("open") &&
        !mobileMenu.contains(event.target) &&
        !mobileMenuButton.contains(event.target)
    ) {
        closeMobileMenu();
    }
});

window.addEventListener("scroll", handleScroll);

loadTheme();
loadOrder();
updateCartCount();
handleScroll();