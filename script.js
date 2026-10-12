/* =========================================================
   ASHLEYDESIGN.TECH
   PREMIUM INTERACTION SYSTEM
   JavaScript — version complète
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       HELPERS
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(pointer: fine)"
    ).matches;


    /* =====================================================
       LOADER
    ===================================================== */

    const loader = $("#loader");

    if (loader) {

        const hideLoader = () => {
            loader.classList.add("hide");
            document.body.classList.add("page-ready");
        };

        window.addEventListener("load", () => {
            setTimeout(
                hideLoader,
                reducedMotion ? 0 : 700
            );
        }, { once: true });

        /* Sécurité : le loader ne doit jamais bloquer le site */
        setTimeout(hideLoader, 3500);
    }


    /* =====================================================
       CUSTOM CURSOR
    ===================================================== */

    const cursorDot = $(".cursor-dot");
    const cursorRing = $(".cursor-ring");

    if (
        cursorDot &&
        cursorRing &&
        finePointer &&
        !reducedMotion
    ) {

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let ringX = mouseX;
        let ringY = mouseY;

        document.body.classList.add("cursor-ready");

        window.addEventListener("mousemove", (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

        }, { passive: true });


        const animateCursor = () => {

            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();


        const cursorTargets = $$(
            "a, button, input, textarea, select, .gallery-item, .service-card, .price-card"
        );

        cursorTargets.forEach((element) => {

            element.addEventListener("mouseenter", () => {
                document.body.classList.add("cursor-hover");
            });

            element.addEventListener("mouseleave", () => {
                document.body.classList.remove("cursor-hover");
            });

        });
    }


    /* =====================================================
       HEADER
    ===================================================== */

    const header = $("#siteHeader");

    const updateHeader = () => {

        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle = $(".menu-toggle");
    const mobileMenu = $(".mobile-menu");

    const closeMobileMenu = () => {

        if (!mobileMenu || !menuToggle) return;

        mobileMenu.classList.remove("open");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    };


    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener("click", () => {

            const opened =
                mobileMenu.classList.toggle("open");

            document.body.classList.toggle(
                "menu-open",
                opened
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(opened)
            );
        });


        $$(".mobile-menu a").forEach((link) => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });


        window.addEventListener("resize", () => {

            if (window.innerWidth > 1000) {
                closeMobileMenu();
            }

        });
    }


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    $$('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const id =
                link.getAttribute("href");

            if (!id || id === "#") return;

            const target = $(id);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reducedMotion
                    ? "auto"
                    : "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       REVEAL ANIMATIONS
    ===================================================== */

    const revealElements = $$(".reveal");

    if (
        "IntersectionObserver" in window &&
        !reducedMotion
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) return;

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -70px 0px"
                }
            );


        revealElements.forEach((element, index) => {

            element.style.transitionDelay =
                `${(index % 6) * 80}ms`;

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       HERO SLIDER
    ===================================================== */

    const heroSlides = $$(".hero-slide");
    const heroNext = $(".hero-next");
    const heroPrev = $(".hero-prev");
    const heroCurrent = $("#heroCurrent");
    const previewImage = $(".preview-image");
    const hero = $(".hero");

    let heroIndex = 0;
    let heroInterval = null;
    let heroPaused = false;


    const updateHero = (index) => {

        if (!heroSlides.length) return;

        heroIndex =
            (index + heroSlides.length) %
            heroSlides.length;


        heroSlides.forEach((slide, i) => {

            slide.classList.toggle(
                "active",
                i === heroIndex
            );

        });


        if (heroCurrent) {

            heroCurrent.textContent =
                String(heroIndex + 1)
                    .padStart(2, "0");

        }


        if (previewImage && heroSlides.length > 1) {

            const previewIndex =
                (heroIndex + 1) %
                heroSlides.length;

            const nextSlide =
                heroSlides[previewIndex];

            if (nextSlide) {

                const background =
                    getComputedStyle(
                        nextSlide
                    ).backgroundImage;

                previewImage.style.opacity = "0";

                setTimeout(() => {

                    previewImage.style.backgroundImage =
                        background;

                    previewImage.style.opacity = "1";

                }, reducedMotion ? 0 : 200);
            }
        }
    };


    const nextHero = () => {
        updateHero(heroIndex + 1);
    };

    const previousHero = () => {
        updateHero(heroIndex - 1);
    };


    const stopHero = () => {

        if (heroInterval) {
            clearInterval(heroInterval);
            heroInterval = null;
        }
    };


    const startHero = () => {

        stopHero();

        if (
            reducedMotion ||
            heroSlides.length < 2
        ) return;

        heroInterval = setInterval(() => {

            if (
                !heroPaused &&
                document.visibilityState === "visible"
            ) {
                nextHero();
            }

        }, 6500);
    };


    if (heroSlides.length) {

        updateHero(0);
        startHero();


        heroNext?.addEventListener(
            "click",
            () => {
                nextHero();
                startHero();
            }
        );


        heroPrev?.addEventListener(
            "click",
            () => {
                previousHero();
                startHero();
            }
        );


        hero?.addEventListener(
            "mouseenter",
            () => {
                heroPaused = true;
            }
        );


        hero?.addEventListener(
            "mouseleave",
            () => {
                heroPaused = false;
            }
        );
    }


    /* =====================================================
       HERO KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (!heroSlides.length) return;

            if (event.key === "ArrowRight") {
                nextHero();
            }

            if (event.key === "ArrowLeft") {
                previousHero();
            }

        }
    );


    /* =====================================================
       HERO PARALLAX
    ===================================================== */

    if (
        finePointer &&
        !reducedMotion
    ) {

        let parallaxRunning = false;

        window.addEventListener(
            "scroll",
            () => {

                if (parallaxRunning) return;

                parallaxRunning = true;

                requestAnimationFrame(() => {

                    const scroll =
                        window.scrollY;

                    heroSlides.forEach((slide) => {

                        if (
                            slide.classList.contains(
                                "active"
                            )
                        ) {

                            const movement =
                                Math.min(
                                    scroll * 0.06,
                                    50
                                );

                            slide.style.backgroundPosition =
                                `center calc(50% + ${movement}px)`;
                        }

                    });

                    parallaxRunning = false;

                });

            },
            { passive: true }
        );
    }


    /* =====================================================
       GALLERY LIGHTBOX
    ===================================================== */

    const galleryItems =
        $$(".gallery-item");

    if (galleryItems.length) {

        const lightbox =
            document.createElement("div");

        lightbox.className =
            "ashley-lightbox";

        lightbox.innerHTML = `
            <button
                class="ashley-lightbox-close"
                aria-label="Close"
            >
                ×
            </button>

            <button
                class="ashley-lightbox-prev"
                aria-label="Previous"
            >
                ‹
            </button>

            <div class="ashley-lightbox-content">
                <img
                    class="ashley-lightbox-image"
                    src=""
                    alt=""
                >
            </div>

            <button
                class="ashley-lightbox-next"
                aria-label="Next"
            >
                ›
            </button>
        `;

        document.body.appendChild(lightbox);


        const lightboxImage =
            $(".ashley-lightbox-image");

        const lightboxClose =
            $(".ashley-lightbox-close");

        const lightboxPrev =
            $(".ashley-lightbox-prev");

        const lightboxNext =
            $(".ashley-lightbox-next");


        let galleryIndex = 0;


        const getGalleryImage = (item) => {

            const image =
                $("img", item);

            if (image?.src) {
                return image.src;
            }

            const background =
                getComputedStyle(item)
                    .backgroundImage;

            const match =
                background.match(
                    /url\(["']?(.*?)["']?\)/
                );

            return match
                ? match[1]
                : "";
        };


        const showGalleryImage = (index) => {

            galleryIndex =
                (index + galleryItems.length) %
                galleryItems.length;

            const item =
                galleryItems[galleryIndex];

            const source =
                getGalleryImage(item);

            if (!source) return;

            lightboxImage.src = source;

            lightbox.classList.add("active");

            document.body.style.overflow =
                "hidden";
        };


        const closeLightbox = () => {

            lightbox.classList.remove("active");

            document.body.style.overflow = "";
        };


        galleryItems.forEach((item, index) => {

            item.addEventListener(
                "click",
                () => {
                    showGalleryImage(index);
                }
            );

        });


        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );


        lightboxPrev.addEventListener(
            "click",
            () => {
                showGalleryImage(
                    galleryIndex - 1
                );
            }
        );


        lightboxNext.addEventListener(
            "click",
            () => {
                showGalleryImage(
                    galleryIndex + 1
                );
            }
        );


        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === lightbox
                ) {
                    closeLightbox();
                }

            }
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    !lightbox.classList.contains(
                        "active"
                    )
                ) return;


                if (event.key === "Escape") {
                    closeLightbox();
                }

                if (event.key === "ArrowLeft") {
                    showGalleryImage(
                        galleryIndex - 1
                    );
                }

                if (event.key === "ArrowRight") {
                    showGalleryImage(
                        galleryIndex + 1
                    );
                }

            }
        );


        const lightboxStyle =
            document.createElement("style");

        lightboxStyle.textContent = `

            .ashley-lightbox {
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 25px;
                padding: 30px;
                background: rgba(5,5,5,.96);
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transition: .35s ease;
            }

            .ashley-lightbox.active {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }

            .ashley-lightbox-content {
                width: min(850px, 75vw);
                height: min(80vh, 750px);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .ashley-lightbox-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                display: block;
                box-shadow: 0 30px 100px rgba(0,0,0,.5);
            }

            .ashley-lightbox button {
                width: 50px;
                height: 50px;
                border: 1px solid rgba(255,255,255,.25);
                background: rgba(255,255,255,.05);
                color: white;
                cursor: pointer;
                font-size: 30px;
                transition: .3s ease;
            }

            .ashley-lightbox button:hover {
                background: #c9a46a;
                color: #111;
                border-color: #c9a46a;
                transform: scale(1.08);
            }

            .ashley-lightbox-close {
                position: absolute;
                top: 25px;
                right: 25px;
            }

            @media(max-width:700px) {

                .ashley-lightbox {
                    padding: 70px 10px 20px;
                    gap: 8px;
                }

                .ashley-lightbox-content {
                    width: calc(100vw - 90px);
                    height: 70vh;
                }

                .ashley-lightbox button {
                    width: 40px;
                    height: 40px;
                    font-size: 24px;
                }

            }
        `;

        document.head.appendChild(
            lightboxStyle
        );
    }


    /* =====================================================
       REVIEW SLIDER
    ===================================================== */

    const reviews = $$(".review");
    const reviewNext = $(".review-next");
    const reviewPrev = $(".review-prev");
    const reviewCount = $("#reviewCount");

    let reviewIndex = 0;
    let reviewTimer = null;


    const updateReview = (index) => {

        if (!reviews.length) return;

        reviewIndex =
            (index + reviews.length) %
            reviews.length;


        reviews.forEach((review, i) => {

            review.classList.toggle(
                "active",
                i === reviewIndex
            );

        });


        if (reviewCount) {

            reviewCount.textContent =
                `${String(reviewIndex + 1).padStart(2, "0")} / ${String(reviews.length).padStart(2, "0")}`;

        }
    };


    const startReviews = () => {

        if (reviewTimer) {
            clearInterval(reviewTimer);
        }

        if (
            reducedMotion ||
            reviews.length < 2
        ) return;

        reviewTimer = setInterval(() => {

            if (
                document.visibilityState ===
                "visible"
            ) {
                updateReview(
                    reviewIndex + 1
                );
            }

        }, 6000);
    };


    if (reviews.length) {

        updateReview(0);
        startReviews();


        reviewNext?.addEventListener(
            "click",
            () => {
                updateReview(
                    reviewIndex + 1
                );
                startReviews();
            }
        );


        reviewPrev?.addEventListener(
            "click",
            () => {
                updateReview(
                    reviewIndex - 1
                );
                startReviews();
            }
        );
    }


    /* =====================================================
       STATISTICS COUNTERS
    ===================================================== */

    const stats =
        $$(".stats-row strong");


    const animateCounter = (element) => {

        const original =
            element.textContent.trim();

        const match =
            original.match(
                /^([\d.]+)(.*)$/
            );

        if (!match) return;

        const target =
            parseFloat(match[1]);

        const suffix =
            match[2];

        if (Number.isNaN(target)) return;

        const decimals =
            original.includes(".")
                ? 1
                : 0;

        const duration = 1600;

        const start =
            performance.now();


        const animation = (time) => {

            const progress =
                Math.min(
                    (time - start) /
                    duration,
                    1
                );

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );

            const value =
                target * eased;

            element.textContent =
                `${value.toFixed(decimals)}${suffix}`;


            if (progress < 1) {

                requestAnimationFrame(
                    animation
                );

            } else {

                element.textContent =
                    original;
            }
        };


        requestAnimationFrame(
            animation
        );
    };


    if (
        stats.length &&
        "IntersectionObserver" in window
    ) {

        const statsObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (
                            !entry.isIntersecting
                        ) return;

                        animateCounter(
                            entry.target
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.5
                }
            );


        stats.forEach((stat) => {
            statsObserver.observe(stat);
        });
    }


    /* =====================================================
       BOOKING FORM
    ===================================================== */

    const bookingForm =
        $("#bookingForm");

    const formMessage =
        $("#formMessage");


    if (bookingForm) {

        const dateInput =
            $('input[name="date"]', bookingForm);


        if (dateInput) {

            const today =
                new Date();

            const year =
                today.getFullYear();

            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    today.getDate()
                ).padStart(2, "0");


            dateInput.min =
                `${year}-${month}-${day}`;
        }


        bookingForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                if (
                    !bookingForm.checkValidity()
                ) {

                    bookingForm.reportValidity();

                    if (formMessage) {

                        formMessage.textContent =
                            "Please complete all required fields.";

                    }

                    return;
                }


                const button =
                    $(".form-submit", bookingForm);


                if (button) {

                    button.disabled = true;

                    button.style.opacity = ".6";

                    button.style.pointerEvents =
                        "none";
                }


                if (formMessage) {

                    formMessage.textContent =
                        "Your request is being prepared…";
                }


                setTimeout(() => {

                    if (formMessage) {

                        formMessage.textContent =
                            "Thank you. Your booking request has been received.";

                    }


                    bookingForm.reset();


                    if (button) {

                        button.disabled = false;

                        button.style.opacity = "";

                        button.style.pointerEvents =
                            "";
                    }

                }, reducedMotion ? 0 : 1000);
            }
        );
    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const navLinks =
        $$(".desktop-nav a");

    const sections =
        $$("main section[id]");


    if (
        navLinks.length &&
        "IntersectionObserver" in window
    ) {

        const navigationObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (
                            !entry.isIntersecting
                        ) return;

                        const id =
                            entry.target.id;


                        navLinks.forEach((link) => {

                            link.classList.toggle(
                                "active",
                                link.getAttribute(
                                    "href"
                                ) === `#${id}`
                            );

                        });

                    });

                },
                {
                    threshold: 0.25,
                    rootMargin:
                        "-15% 0px -60% 0px"
                }
            );


        sections.forEach((section) => {

            navigationObserver.observe(
                section
            );

        });
    }


    /* =====================================================
       MAGNETIC BUTTONS
    ===================================================== */

    if (
        finePointer &&
        !reducedMotion
    ) {

        const magnetic =
            $$(".btn-gold, .header-cta");


        magnetic.forEach((button) => {

            button.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        button.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width -
                        0.5;


                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height -
                        0.5;


                    button.style.transform =
                        `translate(${x * 10}px, ${y * 8}px)`;

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "";

                }
            );
        });
    }


    /* =====================================================
       3D CARD EFFECT
    ===================================================== */

    if (
        finePointer &&
        !reducedMotion
    ) {

        const cards =
            $$(".service-card, .price-card");


        cards.forEach((card) => {

            card.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width -
                        0.5;


                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height -
                        0.5;


                    card.style.transform =
                        `
                        perspective(900px)
                        rotateX(${(-y * 4).toFixed(2)}deg)
                        rotateY(${(x * 4).toFixed(2)}deg)
                        translateY(-6px)
                        `;
                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );
        });
    }


    /* =====================================================
       IMAGE HOVER EFFECT
    ===================================================== */

    if (
        finePointer &&
        !reducedMotion
    ) {

        $$("img").forEach((image) => {

            image.addEventListener(
                "mouseenter",
                () => {

                    image.style.transition =
                        "transform .6s cubic-bezier(.2,.8,.2,1)";

                }
            );

        });
    }


    /* =====================================================
       TILT FOR GALLERY
    ===================================================== */

    if (
        finePointer &&
        !reducedMotion
    ) {

        galleryItems.forEach((item) => {

            item.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        item.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width -
                        0.5;


                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height -
                        0.5;


                    item.style.transform =
                        `
                        perspective(1000px)
                        rotateX(${(-y * 3).toFixed(2)}deg)
                        rotateY(${(x * 3).toFixed(2)}deg)
                        scale(1.02)
                        `;
                }
            );


            item.addEventListener(
                "mouseleave",
                () => {

                    item.style.transform =
                        "";

                }
            );
        });
    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeMobileMenu();
            }

        }
    );


    /* =====================================================
       VISIBILITY
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                heroPaused = true;

            } else {

                heroPaused = false;

            }
        }
    );


    /* =====================================================
       PREVENT IMAGE DRAG
    ===================================================== */

    $$("img").forEach((image) => {

        image.setAttribute(
            "draggable",
            "false"
        );

    });


    /* =====================================================
       CONSOLE
    ===================================================== */

    console.log(
        "%c ASHLEYDESIGN.TECH ",
        "background:#c9a46a;color:#0a0908;font-weight:bold;padding:8px 14px;"
    );

    console.log(
        "%c Premium interaction system loaded ✓ ",
        "color:#c9a46a;font-weight:bold;"
    );

});