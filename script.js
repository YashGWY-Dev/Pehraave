function updateLayoutVariables() {
  const navbarHeight = $("#navbar").outerHeight();

  document.documentElement.style.setProperty(
    "--actual-navbar-height",
    navbarHeight + "px"
  );

  $("body").css("padding-top", navbarHeight + "px");
}

const AppConfig = {
  whatsappNumber: "917982644983",
};

$(document).ready(function () {
  // Loader
  $("#loader").fadeOut("slow");

  updateLayoutVariables();

  // Mobile Menu Toggle
  const hamburger = document.getElementById("hamburger-menu");
  const navLinks = document.getElementById("mobile-menu");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      console.log("Hamburger clicked! Toggling classes.");
      navLinks.classList.toggle("open");
      hamburger.classList.toggle("active");
      document.body.classList.toggle(
        "no-scroll",
        navLinks.classList.contains("open")
      );

      updateLayoutVariables();
    });
  }

  // Close menu when a nav link is clicked
  document.querySelectorAll("#mobile-menu a").forEach((link) => {
    if (!$(link).parent().hasClass("mega-menu-parent")) {
      link.addEventListener("click", () => {
        if (navLinks) {
          navLinks.classList.remove("open");
        }
        if (hamburger) {
          hamburger.classList.remove("active");
        }
        document.body.classList.remove("no-scroll");
      });
    }
  });

  // Smooth scrolling for navigation links
  $('a[href^="#"]').on("click", function (event) {
    if (this.hash !== "" && !$(this).hasClass("no-smooth-scroll")) {
      event.preventDefault();

      const hash = this.hash;
      let targetOffset = $(hash).offset().top;

      const navbarHeight = $("#navbar").outerHeight();
      targetOffset -= navbarHeight;

      if (hash === "#home" || hash === "#") {
        targetOffset = 0;
      }

      $("html, body").animate(
        {
          scrollTop: targetOffset,
        },
        800,
        function () {}
      );
    }
  });

  // Product card actions (Add to Cart, Order on WhatsApp, Notify Me)
  $(".btn-add-to-cart").on("click", function (e) {
    e.preventDefault();
    const productName = $(this).closest(".product-card").data("product-name");
    alert(`${productName} added to cart! (This is a placeholder action)`);
  });

  $(".btn-order-whatsapp").on("click", function (e) {
    e.preventDefault();
    const productName = $(this).closest(".product-card").data("product-name");
    const productPrice = $(this).closest(".product-card").data("product-price");
    const message = encodeURIComponent(
      `Hi, I'd like to order the "${productName}" (Price: ${productPrice}).`
    );
    const whatsappUrl = `https://wa.me/${AppConfig.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  });

  $(".btn-notify-me").on("click", function (e) {
    e.preventDefault();
    const productName = $(this).closest(".product-card").data("product-name");
    const message = encodeURIComponent(
      `Hi, I'd like to be notified when the "${productName}" is back in stock.`
    );
    const whatsappUrl = `https://wa.me/${AppConfig.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  });

  $(".mega-menu-parent > a").on("click", function (e) {
    if (window.innerWidth < 900) {
      e.preventDefault();
      const $parent = $(this).parent();
      if ($parent.hasClass("active")) {
        $parent.removeClass("active");
      } else {
        $(".mega-menu-parent").not($parent).removeClass("active");
        $parent.addClass("active");
      }
    }
  });

  $(window).on("resize", function () {
    if (navLinks) {
      navLinks.classList.remove("open");
    }
    if (hamburger) {
      hamburger.classList.remove("active");
    }
    document.body.classList.remove("no-scroll");
    updateLayoutVariables();
  });

  // // FAQ
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", function () {
      const item = this.parentElement;
      const isActive = item.classList.contains("active");

      // {NOTE:-Remove this block if you want multiple open}
      document.querySelectorAll(".faq-item").forEach((faq) => {
        faq.classList.remove("active");
        faq
          .querySelector(".faq-question")
          .setAttribute("aria-expanded", "false");
        faq.querySelector(".faq-icon").textContent = "+";
      });

      // Toggle current FAQ
      if (!isActive) {
        item.classList.add("active");
        this.setAttribute("aria-expanded", "true");
        this.querySelector(".faq-icon").textContent = "−";
      }
    });
  });

  // Testimonial Slider
  const $testimonialContainer = $(".testimonial-cards-container");
  const $testimonialCards = $(".testimonial-card");
  const totalTestimonials = $testimonialCards.length;
  let currentIndex = 0;

  function updateTestimonialSlider() {
    const cardWidth = $testimonialCards.outerWidth(true);
    $testimonialContainer.scrollLeft(currentIndex * cardWidth);

    // Update button states
    $("#prevTestimonial").prop("disabled", currentIndex === 0);
    $("#nextTestimonial").prop(
      "disabled",
      currentIndex >= totalTestimonials - 1
    );
  }

  $("#nextTestimonial").on("click", function () {
    if (currentIndex < totalTestimonials - 1) {
      currentIndex++;
      updateTestimonialSlider();
    }
  });

  $("#prevTestimonial").on("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateTestimonialSlider();
    }
  });

  updateTestimonialSlider();

  $(".tab-btn").on("click", function () {
    const category = $(this).data("category");

    $(".tab-btn").removeClass("active");
    $(this).addClass("active");

    $(".new-arrivals-grid .product-card").hide();

    // Show products of the selected category
    if (category === "all") {
      $(".new-arrivals-grid .product-card").fadeIn();
    } else {
      $(
        `.new-arrivals-grid .product-card[data-category="${category}"]`
      ).fadeIn();
    }
  });

  $('.tab-btn[data-category="all"]').click();
});
