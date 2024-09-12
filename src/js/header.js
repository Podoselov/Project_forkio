const openBurger = document.querySelector(".navbar__burger");
const closeBurger = document.querySelector(".navbar__cross");
const menu = document.querySelector(".navbar__menu");
function menuToggle(event) {
  if (event.target.closest(".navbar__burger")) {
    openBurger.style.display = "none";
    closeBurger.style.display = "block";
    menu.classList.add("menu__adaptive");
  } else if (event.target === closeBurger) {
    openBurger.style.display = "block";
    closeBurger.style.display = "none";
    menu.classList.remove("menu__adaptive");
  }
}
openBurger.addEventListener("click", menuToggle);
closeBurger.addEventListener("click", menuToggle);
