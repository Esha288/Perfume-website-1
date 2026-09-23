/* SEARCH */

const searchToggle = document.querySelector(".search-toggle");
const searchBox = document.querySelector(".search-box");
const closeSearch = document.querySelector(".close-search");
const searchInput = document.querySelector("#searchInput");

searchToggle.addEventListener("click", function () {
    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {
        searchInput.focus();
    }
});

closeSearch.addEventListener("click", function () {
    searchBox.classList.remove("active");
    searchInput.value = "";
});


/* MOBILE MENU (slide-in) */

const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mobileNav = document.querySelector(".mobile-nav");
const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
const mobileNavClose = document.querySelector(".mobile-nav-close");

function openMobileNav() {
    mobileNav.classList.add("active");
    mobileNavOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    const icon = mobileMenuBtn.querySelector("i");
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-xmark");
}

function closeMobileNav() {
    mobileNav.classList.remove("active");
    mobileNavOverlay.classList.remove("active");
    document.body.style.overflow = "";

    const icon = mobileMenuBtn.querySelector("i");
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
}

mobileMenuBtn.addEventListener("click", function () {
    if (mobileNav.classList.contains("active")) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
});

mobileNavClose.addEventListener("click", closeMobileNav);
mobileNavOverlay.addEventListener("click", closeMobileNav);


/* MOBILE COLLECTION */

const mobileCollectionBtn = document.querySelector(".mobile-collection-btn");
const mobileDropdown = document.querySelector(".mobile-dropdown");

mobileCollectionBtn.addEventListener("click", function () {
    mobileDropdown.classList.toggle("active");

    const icon = mobileCollectionBtn.querySelector("i");

    if (mobileDropdown.classList.contains("active")) {
        icon.style.transform = "rotate(180deg)";
    } else {
        icon.style.transform = "rotate(0deg)";
    }
});


/* CLOSE MOBILE MENU AFTER LINK CLICK */

const mobileLinks = document.querySelectorAll(".mobile-nav a:not(.mobile-collection-btn)");

mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        closeMobileNav();
    });
});


/* ESCAPE KEY */

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        searchBox.classList.remove("active");
        closeMobileNav();
        themeToggle.setAttribute("aria-expanded", "false");
        themePanel.classList.remove("active");
    }
});


/* THEME SWITCHER */

const THEMES = {
    gold: { accent: "#c9a227", light: "#e8c874", dark: "#8f7118", rgb: "201, 162, 39" },
    rose: { accent: "#c98a9c", light: "#f4c9c2", dark: "#a06376", rgb: "201, 138, 156" },
    emerald: { accent: "#3fae7f", light: "#7fd9ad", dark: "#2c7d5b", rgb: "63, 174, 127" },
    sapphire: { accent: "#4a7fd4", light: "#8fb8f0", dark: "#33599c", rgb: "74, 127, 212" },
    amethyst: { accent: "#a374d1", light: "#cba3ea", dark: "#7a4f9e", rgb: "163, 116, 209" }
};

const THEME_STORAGE_KEY = "elegance-theme";

const themeToggle = document.querySelector(".theme-toggle");
const themePanel = document.querySelector(".theme-panel");
const allThemeSwatchGroups = document.querySelectorAll(".theme-swatches");

function setThemeVariables(themeKey) {
    const theme = THEMES[themeKey] || THEMES.gold;
    const root = document.documentElement;

    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-light", theme.light);
    root.style.setProperty("--accent-dark", theme.dark);
    root.style.setProperty("--accent-rgb", theme.rgb);
}

function setActiveSwatch(themeKey) {
    document.querySelectorAll(".theme-swatch").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.theme === themeKey);
    });
}

function playThemeRipple(originEvent, accentColor) {
    const overlay = document.createElement("div");
    overlay.className = "theme-transition-overlay";
    overlay.style.background = accentColor;

    const x = originEvent ? originEvent.clientX : window.innerWidth / 2;
    const y = originEvent ? originEvent.clientY : 0;
    overlay.style.left = x + "px";
    overlay.style.top = y + "px";

    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
        overlay.classList.add("expand");
    });

    overlay.addEventListener("transitionend", function () {
        overlay.remove();
    });
}

function applyTheme(themeKey, originEvent) {
    const theme = THEMES[themeKey] || THEMES.gold;

    playThemeRipple(originEvent, theme.accent);

    window.setTimeout(function () {
        setThemeVariables(themeKey);
    }, 180);

    setActiveSwatch(themeKey);
    localStorage.setItem(THEME_STORAGE_KEY, themeKey);
}

allThemeSwatchGroups.forEach(function (group) {
    group.addEventListener("click", function (event) {
        const swatch = event.target.closest(".theme-swatch");
        if (!swatch) return;

        applyTheme(swatch.dataset.theme, event);
    });
});

themeToggle.addEventListener("click", function () {
    themePanel.classList.toggle("active");
});

document.addEventListener("click", function (event) {
    if (!themePanel.contains(event.target) && !themeToggle.contains(event.target)) {
        themePanel.classList.remove("active");
    }
});

/* Restore saved theme on load (no ripple, instant) */
(function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && THEMES[savedTheme]) {
        setThemeVariables(savedTheme);
        setActiveSwatch(savedTheme);
    }
})();


/* HERO SLIDER */

const heroSection = document.querySelector(".hero");
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");
const heroPrevBtn = document.querySelector(".hero-arrow-prev");
const heroNextBtn = document.querySelector(".hero-arrow-next");
const heroIndexCurrent = document.querySelector(".hero-index-current");

const HERO_INTERVAL = 6000;
let heroCurrentIndex = 0;
let heroTimer = null;

function goToHeroSlide(targetIndex) {
    if (!heroSlides.length) return;

    heroSlides[heroCurrentIndex].classList.remove("active");
    if (heroDots[heroCurrentIndex]) heroDots[heroCurrentIndex].classList.remove("active");

    heroCurrentIndex = (targetIndex + heroSlides.length) % heroSlides.length;

    heroSlides[heroCurrentIndex].classList.add("active");
    if (heroDots[heroCurrentIndex]) heroDots[heroCurrentIndex].classList.add("active");

    if (heroIndexCurrent) {
        heroIndexCurrent.textContent = String(heroCurrentIndex + 1).padStart(2, "0");
    }
}

function heroNextSlide() {
    goToHeroSlide(heroCurrentIndex + 1);
}

function heroPrevSlide() {
    goToHeroSlide(heroCurrentIndex - 1);
}

function startHeroAutoplay() {
    clearInterval(heroTimer);
    heroTimer = setInterval(heroNextSlide, HERO_INTERVAL);
}

if (heroSlides.length) {
    startHeroAutoplay();

    heroNextBtn && heroNextBtn.addEventListener("click", function () {
        heroNextSlide();
        startHeroAutoplay();
    });

    heroPrevBtn && heroPrevBtn.addEventListener("click", function () {
        heroPrevSlide();
        startHeroAutoplay();
    });

    heroDots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            goToHeroSlide(i);
            startHeroAutoplay();
        });
    });

    if (heroSection) {
        heroSection.addEventListener("mouseenter", function () {
            clearInterval(heroTimer);
        });

        heroSection.addEventListener("mouseleave", startHeroAutoplay);
    }
}


/* HERO FRAGRANCE-MIST PARTICLES */

const heroParticlesContainer = document.querySelector(".hero-particles");

if (heroParticlesContainer) {
    const PARTICLE_COUNT = 16;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement("span");
        particle.className = "hero-particle";

        const size = (Math.random() * 3 + 2).toFixed(1);
        particle.style.left = Math.random() * 100 + "%";
        particle.style.width = size + "px";
        particle.style.height = size + "px";
        particle.style.animationDuration = (Math.random() * 6 + 8) + "s";
        particle.style.animationDelay = (Math.random() * 9) + "s";

        heroParticlesContainer.appendChild(particle);
    }
}
