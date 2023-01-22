var prevScrollpos = window.pageYOffset;
var searchToggle = document.querySelector(".search__toggle");
var searchForm = document.querySelector("div.search");
var body = document.querySelector("body");
var overlay = document.querySelector("body>.overlay");

window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    var header = document.getElementById("header")
    if(currentScrollPos >= 200){
        if (prevScrollpos > currentScrollPos) {
            header.style.top = "0";
          } else {
            header.style.top = -header.offsetHeight+'px'; //hide menu
          }
          prevScrollpos = currentScrollPos;
    }

    searchForm.classList.remove("active");
    searchToggle.classList.remove("active");
}



searchToggle.addEventListener("click", showSearch);

function showSearch() {
  searchForm.classList.toggle("active");
  searchToggle.classList.toggle("active");

  if (searchToggle.classList.contains("active")) {
    searchToggle.setAttribute("aria-label", "Close search");
  } else {
    searchToggle.setAttribute("aria-label", "Open search");
  }
}

document.querySelector("#hamburger").onchange = (e) => {
  let checked = e.target.checked;
  if (checked) {
    body.classList.add("active");
  } else {
    body.classList.remove("active");
  }
}
overlay.addEventListener("click", function(){
  document.getElementById("hamburger").checked = false;
  body.classList.remove("active");
});