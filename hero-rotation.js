/* Accessible rotating HISCORP hero messages and high-resolution background imagery. */
(function () {
  "use strict";
  var top = document.getElementById("heroRotatingTop");
  var title = document.getElementById("heroRotatingTitle");
  var tagline = document.getElementById("heroRotatingTagline");
  var homeImage = document.querySelector(".hero-image");
  var pageHeroes = Array.from(document.querySelectorAll(".page-hero"));
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var slides = [
    {
      top: "Difficult jobs.",
      title: "Difficult places.",
      tagline: "BUILT FOR THE TOUGHEST ENVIRONMENTS"
    },
    {
      top: "Hard ground.",
      title: "Dependable delivery.",
      tagline: "INTEGRITY · QUALITY · RELIABILITY"
    },
    {
      top: "Remote sites.",
      title: "Real results.",
      tagline: "LOCAL KNOWLEDGE · PROFESSIONAL STANDARDS"
    },
    {
      top: "One partner.",
      title: "Every challenge.",
      tagline: "SAFETY · HONESTY · COMMITMENT"
    }
  ];

  /* Home hero rotates through the company's own photos. */
  var images = [
    "Images/home-bg-1.jpg",
    "Images/home-bg-2.jpg",
    "Images/home-bg-3.jpg",
    "Images/home-bg-4.jpg"
  ];

  function swapText(el, value) {
    if (!el) return;
    el.classList.remove("is-changing");
    void el.offsetWidth;
    el.textContent = value;
    el.classList.add("is-changing");
  }

  if (homeImage) {
    var imageIndex = 0;
    homeImage.style.backgroundImage = 'url("' + images[0] + '")';
    images.slice(1).forEach(function (url) { var img = new Image(); img.src = url; });
    if (!reduced) {
      window.setInterval(function () {
        if (document.hidden) return;
        imageIndex = (imageIndex + 1) % images.length;
        homeImage.classList.add("image-fade");
        window.setTimeout(function () {
          homeImage.style.backgroundImage = 'url("' + images[imageIndex] + '")';
          homeImage.classList.remove("image-fade");
        }, 650);
      }, 7000);
    }
  }

  if (top || title || tagline) {
    var phraseIndex = 0;
    if (!reduced) {
      window.setInterval(function () {
        if (document.hidden) return;
        phraseIndex = (phraseIndex + 1) % slides.length;
        swapText(top, slides[phraseIndex].top);
        swapText(title, slides[phraseIndex].title);
        if (tagline) tagline.textContent = slides[phraseIndex].tagline;
      }, 4200);
    }
  }

  /* Secondary page banners softly rotate through the same HD image collection. */
  pageHeroes.forEach(function (hero) {
    var layer = document.createElement("div");
    layer.className = "page-hero-rotating-bg";
    layer.setAttribute("aria-hidden", "true");
    hero.prepend(layer);
    layer.style.backgroundImage = 'url("' + images[0] + '")';
    var idx = 0;
    if (!reduced) {
      window.setInterval(function () {
        if (document.hidden) return;
        idx = (idx + 1) % images.length;
        layer.classList.add("fade-out");
        window.setTimeout(function () {
          layer.style.backgroundImage = 'url("' + images[idx] + '")';
          layer.classList.remove("fade-out");
        }, 650);
      }, 8000);
    }
  });
})();
