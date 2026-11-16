
const pageLoader = document.getElementById("pageLoader");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const closeMenuButton =
    document.getElementById("closeMenuButton");

const navigationLinks =
    document.getElementById("navigationLinks");

const mobileLogoutLink =
    document.getElementById("mobileLogoutLink");

const backToTop =
    document.getElementById("backToTop");

const bookingForm =
    document.getElementById("bookingForm");

const startDate =
    document.getElementById("startDate");

const endDate =
    document.getElementById("endDate");

const deliveryOption =
    document.getElementById("deliveryOption");

const deliveryAddressGroup =
    document.getElementById("deliveryAddressGroup");

const deliveryAddress =
    document.getElementById("deliveryAddress");

const rentalDays =
    document.getElementById("rentalDays");

const estimatedTotal =
    document.getElementById("estimatedTotal");

const confirmation =
    document.getElementById("bookingConfirmation");

const confirmBookingButton =
    document.getElementById("confirmBookingButton");

const dailyPrice =
    80000;

const selectedEquipment =
    document.getElementById("selectedEquipment");

const selectedLocation =
    document.getElementById("selectedLocation");

const selectedPrice =
    document.getElementById("selectedPrice");

const summaryDailyPrice =
    document.getElementById("summaryDailyPrice");

window.addEventListener("load", () => {

    pageLoader.style.width = "100%";

    setTimeout(() => {
        pageLoader.style.opacity = "0";
    }, 500);

});

const savedTheme =
    localStorage.getItem("farmRentTheme");

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

if (mobileLogoutLink) {

    mobileLogoutLink.addEventListener("click", (event) => {

        event.preventDefault();

        localStorage.removeItem("farmRentLoggedIn");
        localStorage.removeItem("farmRentUserEmail");

        window.location.href = "login.html";

    });

}

function formatCurrency(amount) {

    return "₦" + amount.toLocaleString("en-NG");

}

function calculateRental() {

    if (!startDate.value || !endDate.value) {

        rentalDays.textContent = "0 days";
        estimatedTotal.textContent = "₦0";

        return;

    }

    const start =
        new Date(startDate.value);

    const end =
        new Date(endDate.value);

    const difference =
        end.getTime() - start.getTime();

    const days =
        Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        ) + 1;

    if (days <= 0) {

        rentalDays.textContent = "0 days";
        estimatedTotal.textContent = "₦0";

        return;

    }

    const total =
        days * dailyPrice;

    rentalDays.textContent =
        days + (days === 1 ? " day" : " days");

    estimatedTotal.textContent =
        formatCurrency(total);

}

startDate.addEventListener(
    "change",
    calculateRental
);

endDate.addEventListener(
    "change",
    calculateRental
);

deliveryOption.addEventListener("change", () => {

    if (deliveryOption.value === "delivery") {

        deliveryAddressGroup.classList.add(
            "showAddress"
        );

    } else {

        deliveryAddressGroup.classList.remove(
            "showAddress"
        );

        deliveryAddress.value = "";

    }

});

const today =
    new Date();

const todayString =
    today.toISOString().split("T")[0];

startDate.min = todayString;
endDate.min = todayString;

startDate.addEventListener("change", () => {

    endDate.min = startDate.value;

    if (
        endDate.value &&
        endDate.value < startDate.value
    ) {
        endDate.value = "";
    }

    calculateRental();

});

function clearErrors() {

    document.querySelectorAll(".errorMessage")
        .forEach((error) => {
            error.textContent = "";
        });

}

bookingForm.addEventListener("submit", (event) => {

    event.preventDefault();

    clearErrors();

    let valid =
        true;

    if (!startDate.value) {

        document.getElementById(
            "startDateError"
        ).textContent =
            "Please select a start date.";

        valid = false;

    }

    if (!endDate.value) {

        document.getElementById(
            "endDateError"
        ).textContent =
            "Please select an end date.";

        valid = false;

    }

    if (
        startDate.value &&
        endDate.value &&
        endDate.value < startDate.value
    ) {

        document.getElementById(
            "endDateError"
        ).textContent =
            "End date cannot be before the start date.";

        valid = false;

    }

    if (!deliveryOption.value) {

        document.getElementById(
            "deliveryError"
        ).textContent =
            "Please select a delivery option.";

        valid = false;

    }

    if (
        deliveryOption.value === "delivery" &&
        deliveryAddress.value.trim() === ""
    ) {

        document.getElementById(
            "addressError"
        ).textContent =
            "Please enter your delivery address.";

        valid = false;

    }

    const phoneNumber =
        document.getElementById(
            "phoneNumber"
        ).value.trim();

    if (phoneNumber === "") {

        document.getElementById(
            "phoneError"
        ).textContent =
            "Please enter your phone number.";

        valid = false;

    }

    const farmLocation =
        document.getElementById(
            "farmLocation"
        ).value.trim();

    if (farmLocation === "") {

        document.getElementById(
            "farmLocationError"
        ).textContent =
            "Please enter your farm location.";

        valid = false;

    }

    if (!confirmation.checked) {

        document.getElementById(
            "confirmationError"
        ).textContent =
            "Please confirm the information provided.";

        valid = false;

    }

    if (!valid) {

        return;

    }

    confirmBookingButton.disabled = true;
    confirmBookingButton.textContent =
        "Processing...";

    setTimeout(() => {

        const booking = {
            equipment: selectedEquipment.textContent,
            location: selectedLocation.textContent,
            dailyPrice: dailyPrice,
            startDate: startDate.value,
            endDate: endDate.value,
            deliveryOption: deliveryOption.value,
            phoneNumber: phoneNumber,
            farmLocation: farmLocation,
            bookingStatus: "Pending"
        };

        localStorage.setItem(
            "farmRentCurrentBooking",
            JSON.stringify(booking)
        );

        confirmBookingButton.disabled = false;
        confirmBookingButton.textContent =
            "Confirm Rental";

        alert(
            "Your rental request has been submitted successfully."
        );

        window.location.href =
            "profile.html";

    }, 900);

});

window.addEventListener("scroll", () => {

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

backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
