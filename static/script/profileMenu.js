const asideButton = document.querySelector(".asideButton");
let asideOpen = false;
menuButton.addEventListener("click", () => {
  if(!menuOpen){
    asideButton.classList.add("asideOpen");
    asideOpen = true;
  }
  else{
    asideButton.classList.remove("asideOpen");
    asideOpen = false;
  }
})
