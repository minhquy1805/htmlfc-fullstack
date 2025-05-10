// side menu
const toggleMenuButton = document.getElementById("openMenuButton");
const closeMenuButton = document.getElementById("closeMenuButton");
const closeMenuButtonbybody = document.getElementById("body");
const sideMenu = document.getElementById("sideMenu");

toggleMenuButton.addEventListener("click", () => {
  sideMenu.classList.add("open"); // 
});

closeMenuButton.addEventListener("click", () => {
  sideMenu.classList.remove("open"); 
});