const cartStorageKey = "farmRentCart";
const checkoutStorageKey = "farmRentCheckout";
const orderStorageKey = "farmRentOrder";

const themeToggle = document.getElementById("themeToggle");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLogout = document.getElementById("mobileLogout");
const cartCount = document.getElementById("cartCount");

const paymentMethods = document.querySelectorAll(".paymentMethod");
const cardPaymentForm = document.getElementById("cardPaymentForm");
const bankPaymentInfo = document.getElementById("bankPaymentInfo");
const payButton = document.getElementById("payButton");
const payAmount = document.getElementById("payAmount");

const orderProducts = document.getElementById("orderProducts");
const summaryItemCount = document.getElementById("summaryItemCount");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryTotal = document.getElementById("summaryTotal");

const cardName = document.getElementById("cardName");
const cardNumber = document.getElementById("cardNumber");
const expiryDate = document.getElementById("expiryDate");
const cvv = document.getElementById("cvv");

const cardNameError = document.getElementById("cardNameError");
const cardNumberError = document.getElementById("cardNumberError");
const expiryError = document.getElementById("expiryError");
const cvvError = document.getElementById("cvvError");

const backToTop = document.getElementById("backToTop");

let cartProducts = [];
let checkoutData = {};

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(amount);
}

function getCartProducts() {
    try {
        return JSON.parse(localStorage.getItem(cartStorageKey)) || [];
    } catch (error) {
        return [];
    }
}

function getCheckoutData() {
    try {
        return JSON.parse(localStorage.getItem(checkoutStorageKey)) || {};
    } catch (error) {
        return {};
    }
}

function updateCartCount() {
    const totalQuantity = cartProducts.reduce((total, product) => {
        return total + Number(product.quantity || 1);
    }, 0);

    cartCount.textContent = totalQuantity;
}

function getSubtotal() {
    return cartProducts.reduce((total, product) => {
        const price = Number(product.price || 0);
        const quantity = Number(product.quantity || 1);

        return total + price * quantity;
    }, 0);
}

function getItemCount() {
    return cartProducts.reduce((total, product) => {
        return total + Number(product.quantity || 1);
    }, 0);
}

function renderOrderProducts() {
    orderProducts.innerHTML = "";

    cartProducts.forEach((product) => {
        const quantity = Number(product.quantity || 1);
        const price = Number(product.price || 0);
        const itemTotal = price * quantity;

        const productElement = document.createElement("div");

        productElement.className = "orderProduct";

        productElement.innerHTML = `
            <div class="productImage ${product.imageClass || ""}"></div>

            <div class="productInfo">
                <h3>${product.name || "Agro Product"}</h3>
                <p>${product.location || "Nigeria"}</p>
                <span class="productQuantity">Qty: ${quantity}</span>
            </div>

            <strong class="productPrice">
                ${formatCurrency(itemTotal)}
            </strong>
        `;

        orderProducts.appendChild(productElement);
    });
}

function updateOrderSummary() {
    const itemCount = getItemCount();
    const subtotal = getSubtotal();

    summaryItemCount.textContent = itemCount;
    summarySubtotal.textContent = formatCurrency(subtotal);
    summaryTotal.textContent = formatCurrency(subtotal);
    payAmount.textContent = formatCurrency(subtotal);
}

function showEmptyCartMessage() {
    const paymentMain = document.querySelector(".paymentMain");

    paymentMain.innerHTML = `
        <div class="paymentCard emptyPayment">
            <div class="emptyIcon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add products to your cart before proceeding to payment.</p>
            <a href="agro-products.html" class="payButton emptyButton">
                Browse Agro Products
            </a>
        </div>
    `;
}

function formatCardNumber(value) {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 16);

    return numbersOnly.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 4);

    if (numbersOnly.length > 2) {
        return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
    }

    return numbersOnly;
}

cardNumber.addEventListener("input", () => {
    cardNumber.value = formatCardNumber(cardNumber.value);
});

expiryDate.addEventListener("input", () => {
    expiryDate.value = formatExpiry(expiryDate.value);
});

cvv.addEventListener("input", () => {
    cvv.value = cvv.value.replace(/\D/g, "").slice(0, 4);
});

function clearErrors() {
    cardNameError.textContent = "";
    cardNumberError.textContent = "";
    expiryError.textContent = "";
    cvvError.textContent = "";
}

function validateCardDetails() {
    clearErrors();

    let isValid = true;

    const nameValue = cardName.value.trim();
    const cardNumberValue = cardNumber.value.replace(/\s/g, "");
    const expiryValue = expiryDate.value.trim();
    const cvvValue = cvv.value.trim();

    if (nameValue.length < 2) {
        cardNameError.textContent = "Enter the name on your card.";
        isValid = false;
    }

    if (cardNumberValue.length !== 16) {
        cardNumberError.textContent = "Enter a valid 16-digit card number.";
        isValid = false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryValue)) {
        expiryError.textContent = "Use MM/YY format.";
        isValid = false;
    }

    if (cvvValue.length < 3) {
        cvvError.textContent = "Enter a valid CVV.";
        isValid = false;
    }

    return isValid;
}

function getSelectedPaymentMethod() {
    const selectedMethod = document.querySelector(
        'input[name="paymentMethod"]:checked'
    );

    return selectedMethod ? selectedMethod.value : "card";
}

function createOrder() {
    const subtotal = getSubtotal();
    const itemCount = getItemCount();
    const paymentMethod = getSelectedPaymentMethod();

    const orderNumber = `FR${Date.now().toString().slice(-8)}`;

    const orderData = {
        orderNumber: orderNumber,
        orderDate: new Date().toISOString(),
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === "card" ? "Paid" : "Pending",
        orderStatus: paymentMethod === "card" ? "Payment Confirmed" : "Awaiting Transfer",
        subtotal: subtotal,
        delivery: "Calculated later",
        total: subtotal,
        itemCount: itemCount,
        customer: checkoutData,
        products: cartProducts
    };

    localStorage.setItem(orderStorageKey, JSON.stringify(orderData));

    localStorage.removeItem(cartStorageKey);

    return orderData;
}

function processPayment() {
    const selectedMethod = getSelectedPaymentMethod();

    if (selectedMethod === "card") {
        const isValid = validateCardDetails();

        if (!isValid) {
            return;
        }
    }

    payButton.disabled = true;
    payButton.querySelector("span:first-child").textContent = "Processing...";

    setTimeout(() => {
        createOrder();

        window.location.href = "order-confirmation.html";
    }, 900);
}

paymentMethods.forEach((method) => {
    method.addEventListener("click", () => {
        paymentMethods.forEach((item) => {
            item.classList.remove("active");
        });

        method.classList.add("active");

        const input = method.querySelector("input");

        if (input) {
            input.checked = true;
        }

        const selectedMethod = input ? input.value : "card";

        if (selectedMethod === "card") {
            cardPaymentForm.style.display = "block";
            bankPaymentInfo.classList.remove("show");
        } else {
            cardPaymentForm.style.display = "none";
            bankPaymentInfo.classList.add("show");
            clearErrors();
        }
    });
});

payButton.addEventListener("click", processPayment);

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("darkMode");

    const isDarkMode = document.body.classList.contains("darkMode");

    localStorage.setItem("farmRentTheme", isDarkMode ? "dark" : "light");

    themeToggle.querySelector(".themeIcon").textContent =
        isDarkMode ? "☀" : "☾";
});

function loadSavedTheme() {
    const savedTheme = localStorage.getItem("farmRentTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("darkMode");
        themeToggle.querySelector(".themeIcon").textContent = "☀";
    } else {
        themeToggle.querySelector(".themeIcon").textContent = "☾";
    }
}

menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});

mobileLogout.addEventListener("click", (event) => {
    event.preventDefault();

    localStorage.removeItem("farmRentUser");
    localStorage.removeItem("farmRentLoggedIn");

    window.location.href = "login.html";
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

function initializePaymentPage() {
    cartProducts = getCartProducts();
    checkoutData = getCheckoutData();

    updateCartCount();
    loadSavedTheme();

    if (cartProducts.length === 0) {
        showEmptyCartMessage();
        return;
    }

    renderOrderProducts();
    updateOrderSummary();
}

initializePaymentPage();