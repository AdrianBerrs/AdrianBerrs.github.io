document.addEventListener("DOMContentLoaded", function () {
  // Intersection Observer for fade-in and slide-in animations
  var animObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  document
    .querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")
    .forEach(function (el) {
      animObserver.observe(el);
    });

  // Intersection Observer for skill bars - animated loading on scroll
  var skillObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var items = entry.target.querySelectorAll(".skill-item");
          items.forEach(function (item, index) {
            setTimeout(function () {
              item.classList.add("animate");
              var fill = item.querySelector(".skill-fill");
              if (fill) {
                fill.style.width = fill.getAttribute("data-width") + "%";
              }
            }, index * 150);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  var skillBars = document.getElementById("skill-bars");
  if (skillBars) {
    skillObserver.observe(skillBars);
  }
});
