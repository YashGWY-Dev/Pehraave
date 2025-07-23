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
        document.body.classList.remove("no-scroll"); // Ensure scroll is re-enabled
      });
    }
  });


  // Smooth scrolling for navigation links
  $('a[href^="#"]').on('click', function (event) {
    // Check if the link is not an external link or a simple hash link for the current page
    if (this.hash !== "" && !$(this).hasClass("no-smooth-scroll")) {
      event.preventDefault();

      const hash = this.hash;
      let targetOffset = $(hash).offset().top;

      // Adjust for fixed navbar height
      const navbarHeight = $("#navbar").outerHeight();
      targetOffset -= navbarHeight; // Subtract navbar height

      // Check if the target is the hero section or top of the page (e.g., #home)
      if (hash === "#home" || hash === "#") {
        targetOffset = 0; // Go to the very top
      }

      $('html, body').animate({
        scrollTop: targetOffset
      }, 800, function () {
        // Optional: Add hash to URL after scroll completes, without causing a jump
        // window.location.hash = hash;
      });
    }
  });


  // Product card actions (Add to Cart, Order on WhatsApp, Notify Me)
  $(".btn-add-to-cart").on("click", function (e) {
    e.preventDefault();
    const productName = $(this).closest(".product-card").data("product-name");
    alert(`${productName} added to cart! (This is a placeholder action)`);
    // In a real scenario, you'd add logic to push to a cart array/object
  });

  // --- FIX APPLIED HERE: Changed selector from .btn-order-whatsapp to .btn-whatsapp-order ---
  $(".btn-whatsapp-order").on("click", function (e) {
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
    updateLayoutVariables(); // Recalculate navbar height on resize
  });

  // FAQ
  $(".faq-question").on("click", function () {
    $(this).next(".faq-answer").slideToggle();
    $(this).parent().toggleClass("active");
    // Toggle the chevron icon to indicate open/close state
    $(this).find("i.faq-arrow").toggleClass("fa-chevron-down fa-chevron-up");
  });

  // Testimonial Slider
  const $testimonialContainer = $(".testimonial-cards-container");
  const $testimonialCards = $(".testimonial-card");
  const totalTestimonials = $testimonialCards.length;
  let currentIndex = 0;

  function updateTestimonialSlider() {
    // Calculate scroll position based on current index and card width
    // Assuming all cards have the same width and there's some gap
    const cardWidth = $testimonialCards.outerWidth(true); // true includes margin
    $testimonialContainer.scrollLeft(currentIndex * cardWidth);

    // Update button states
    $("#prevTestimonial").prop("disabled", currentIndex === 0);
    $("#nextTestimonial").prop("disabled", currentIndex >= totalTestimonials - 1); // Adjust for partial visibility
  }

  $("#nextTestimonial").on("click", function () {
    if (currentIndex < totalTestimonials - 1) { // Allow scrolling past last full card
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

  // Initialize slider on load
  updateTestimonialSlider();


  // Tabbed Products (New Arrivals Categories)
  $(".tab-btn").on("click", function () {
    const category = $(this).data("category");

    // Remove active class from all buttons and add to the clicked one
    $(".tab-btn").removeClass("active");
    $(this).addClass("active");

    // Hide all product cards
    $(".new-arrivals-grid .product-card").hide();

    // Show only products of the selected category
    if (category === "all") {
      $(".new-arrivals-grid .product-card").fadeIn();
    } else {
      $(`.new-arrivals-grid .product-card[data-category="${category}"]`).fadeIn();
    }
  });

  // Trigger click on the "All" button on page load to show all products initially
  $('.tab-btn[data-category="all"]').click();

});