
const pageLoader = document.getElementById("pageLoader");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const mobileMenuButton = document.getElementById("mobileMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navigationLinks = document.getElementById("navigationLinks");

const backToTop = document.getElementById("backToTop");

const profileMenuButtons =
    document.querySelectorAll(".profileMenuButton");

const profilePanels =
    document.querySelectorAll(".profilePanel");

const editProfileButton =
    document.getElementById("editProfileButton");

const personalEditButton =
    document.getElementById("personalEditButton");

const editModalBackdrop =
    document.getElementById("editModalBackdrop");

const modalCloseButton =
    document.getElementById("modalCloseButton");

const editProfileForm =
    document.getElementById("editProfileForm");

const logoutButton =
    document.getElementById("logoutButton");

const changePasswordButton =
    document.getElementById("changePasswordButton");

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

function showProfileSection(sectionId) {

    profilePanels.forEach((panel) => {

        panel.style.display = "none";

    });

    profileMenuButtons.forEach((button) => {

        button.classList.remove("activeMenu");

    });

    const selectedPanel =
        document.getElementById(sectionId);

    if (selectedPanel) {

        selectedPanel.style.display = "block";

    }

}

profileMenuButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const sectionId =
            button.getAttribute("data-section");

        showProfileSection(sectionId);

        button.classList.add("activeMenu");

    });

});

showProfileSection("personalSection");

function openEditModal() {

    editModalBackdrop.classList.add("showModal");
    document.body.style.overflow = "hidden";

}

function closeEditModal() {

    editModalBackdrop.classList.remove("showModal");
    document.body.style.overflow = "";

}

editProfileButton.addEventListener("click", openEditModal);

personalEditButton.addEventListener("click", openEditModal);

modalCloseButton.addEventListener("click", closeEditModal);

editModalBackdrop.addEventListener("click", (event) => {

    if (event.target === editModalBackdrop) {

        closeEditModal();

    }

});

editProfileForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const firstName =
        document.getElementById("editFirstName").value.trim();

    const lastName =
        document.getElementById("editLastName").value.trim();

    const phone =
        document.getElementById("editPhone").value.trim();

    const address =
        document.getElementById("editAddress").value.trim();

    const state =
        document.getElementById("editState").value.trim();

    const location =
        document.getElementById("editLocation").value.trim();

    document.getElementById("profileFirstName").textContent =
        firstName;

    document.getElementById("profileLastName").textContent =
        lastName;

    document.getElementById("profilePhone").textContent =
        phone;

    document.getElementById("profileAddress").textContent =
        address;

    document.getElementById("profileState").textContent =
        state;

    document.getElementById("profileLocation").textContent =
        location;

    document.querySelector(".profileCard h2").textContent =
        `${firstName} ${lastName}`;

    document.querySelector(".profileAvatar").textContent =
        firstName.charAt(0).toUpperCase();

    closeEditModal();

});

changePasswordButton.addEventListener("click", () => {

    alert("Password change will be connected to the backend authentication system.");

});
const rentalHistory = document.getElementById("rentalHistory");
const emptyRentalState = document.getElementById("emptyRentalState");
const rentalTabs = document.querySelectorAll(".rentalTab");

function getSavedBooking() {
    const savedBooking = localStorage.getItem("farmRentCurrentBooking");

    if (!savedBooking) {
        return null;
    }

    try {
        return JSON.parse(savedBooking);
    } catch (error) {
        return null;
    }
}

function displayRentals(statusFilter) {
    if (!rentalHistory || !emptyRentalState) {
        return;
    }

    const booking = getSavedBooking();

    const existingCard = rentalHistory.querySelector(".rentalCard");

    if (existingCard) {
        existingCard.remove();
    }

    if (!booking) {
        emptyRentalState.style.display = "block";
        return;
    }

    if (
        statusFilter !== "all" &&
        booking.bookingStatus !== statusFilter
    ) {
        emptyRentalState.style.display = "block";
        return;
    }

    emptyRentalState.style.display = "none";

    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    const duration =
        Math.ceil(
            (endDate.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;

    const totalAmount =
        booking.dailyPrice * duration;

    const formattedStart =
        startDate.toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    const formattedEnd =
        endDate.toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    const rentalCard = document.createElement("article");

    rentalCard.className = "rentalCard";

    rentalCard.innerHTML = `
        <div class="rentalCardMain">

            <div class="rentalCardImage"></div>

            <div class="rentalCardDetails">

                <p>
                    ${booking.location}
                </p>

                <h3>
                    ${booking.equipment}
                </h3>

                <div class="rentalDates">
                    ${formattedStart} - ${formattedEnd}
                </div>

            </div>

        </div>

        <div class="rentalCardSide">

            <span class="rentalStatus">
                ${booking.bookingStatus}
            </span>

            <strong class="rentalAmount">
                ₦${totalAmount.toLocaleString("en-NG")}
            </strong>

            <button
                class="rentalViewButton"
                type="button"
            >
                View Details
            </button>

        </div>
    `;

    rentalHistory.appendChild(rentalCard);
}

if (rentalTabs.length > 0) {

    rentalTabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            rentalTabs.forEach((item) => {
                item.classList.remove("activeRentalTab");
            });

            tab.classList.add("activeRentalTab");

            displayRentals(tab.dataset.status);

        });

    });

}

displayRentals("all");


logoutButton.addEventListener("click", () => {

    const confirmLogout =
        window.confirm("Are you sure you want to log out?");

    if (!confirmLogout) {

        return;

    }

    window.location.href = "login.html";

});

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        backToTop.classList.add("showButton");

    } else {

        backToTop.classList.remove("showButton");

    }

});

document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("farmRentLoggedIn");
    localStorage.removeItem("farmRentUserEmail");
    window.location.href = "login.html";
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

