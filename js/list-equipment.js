const pageLoader = document.getElementById("pageLoader");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const navigationLinks = document.getElementById("navigationLinks");
const backToTop = document.getElementById("backToTop");

const equipmentListingForm = document.getElementById("equipmentListingForm");
const equipmentPhotos = document.getElementById("equipmentPhotos");
const photoPreviewGrid = document.getElementById("photoPreviewGrid");

const successModal = document.getElementById("successModal");
const successBackdrop = document.getElementById("successBackdrop");
const successCloseButton = document.getElementById("successCloseButton");
const successHomeButton = document.getElementById("successHomeButton");

const savedTheme = localStorage.getItem("farmRentTheme");

function updateThemeIcon() {
    if (document.body.classList.contains("darkMode")) {
        themeIcon.textContent = "☀";
    } else {
        themeIcon.textContent = "☾";
    }
}

function enableSavedTheme() {
    if (savedTheme === "dark") {
        document.body.classList.add("darkMode");
    }

    updateThemeIcon();
}

function toggleTheme() {
    document.body.classList.toggle("darkMode");

    const currentTheme = document.body.classList.contains("darkMode")
        ? "dark"
        : "light";

    localStorage.setItem("farmRentTheme", currentTheme);

    updateThemeIcon();
}

function openMobileMenu() {
    navigationLinks.classList.add("openNavigation");
    document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
    navigationLinks.classList.remove("openNavigation");
    document.body.style.overflow = "";
}

function updatePageLoader() {
    pageLoader.style.width = "100%";

    setTimeout(function() {
        pageLoader.style.width = "0";
    }, 500);
}

function updateBackToTop() {
    if (window.scrollY > 500) {
        backToTop.classList.add("showBackToTop");
    } else {
        backToTop.classList.remove("showBackToTop");
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function displayPhotoPreview(file) {
    const reader = new FileReader();

    reader.addEventListener("load", function() {
        const preview = document.createElement("div");
        preview.className = "photoPreview";

        const image = document.createElement("img");
        image.src = reader.result;
        image.alt = "Equipment preview";

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "removePhotoButton";
        removeButton.textContent = "×";
        removeButton.setAttribute("aria-label", "Remove photo");

        removeButton.addEventListener("click", function() {
            preview.remove();
        });

        preview.appendChild(image);
        preview.appendChild(removeButton);
        photoPreviewGrid.appendChild(preview);
    });

    reader.readAsDataURL(file);
}

function handlePhotoUpload() {
    photoPreviewGrid.innerHTML = "";

    const files = Array.from(equipmentPhotos.files);

    files.slice(0, 6).forEach(function(file) {
        displayPhotoPreview(file);
    });
}

function openSuccessModal() {
    successModal.classList.add("showSuccessModal");
    document.body.style.overflow = "hidden";
}

function closeSuccessModal() {
    successModal.classList.remove("showSuccessModal");
    document.body.style.overflow = "";
}

function handleFormSubmit(event) {
    event.preventDefault();

    const submitButton = equipmentListingForm.querySelector(".submitListingButton");

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    setTimeout(function() {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit Equipment <span>→</span>';

        equipmentListingForm.reset();
        photoPreviewGrid.innerHTML = "";

        openSuccessModal();
    }, 1000);
}

themeToggle.addEventListener("click", toggleTheme);

mobileMenuButton.addEventListener("click", openMobileMenu);

closeMenuButton.addEventListener("click", closeMobileMenu);

backToTop.addEventListener("click", scrollToTop);

window.addEventListener("scroll", updateBackToTop);

equipmentPhotos.addEventListener("change", handlePhotoUpload);

equipmentListingForm.addEventListener("submit", handleFormSubmit);

successBackdrop.addEventListener("click", closeSuccessModal);

successCloseButton.addEventListener("click", closeSuccessModal);

successHomeButton.addEventListener("click", function() {
    window.location.href = "index.html";
});

navigationLinks.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("load", function() {
    enableSavedTheme();
    updatePageLoader();
    updateBackToTop();
});