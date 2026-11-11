/* Mobile navigation */
(function () {
  var button = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!button || !nav) return;

  var label = button.querySelector(".sr-only");

  function closeMenu() {
    nav.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    if (label) label.textContent = "Open menu";
  }

  function openMenu() {
    nav.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    if (label) label.textContent = "Close menu";
  }

  button.addEventListener("click", function () {
    if (button.getAttribute("aria-expanded") === "true") closeMenu();
    else openMenu();
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", function (event) {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || button.contains(event.target)) return;
    closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 760) closeMenu();
  });
})();
