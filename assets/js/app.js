const cl = console.log;

const hide = document.getElementById("hide");
const show = document.getElementById("show");
const mainnavbar = document.getElementById("mainnavbar");
const togglenav = document.getElementById("togglenav");
const upbtn = document.getElementById("upbtn");
const navbarSupportedContent = document.getElementById(
  "navbarSupportedContent"
);

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offsetTop = section.offsetTop;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
    hide.classList.remove("d-none");
    show.classList.add("d-none");
    navbarSupportedContent.classList.remove("show");
  } else {
    console.error(`Section with id "${sectionId}" not found.`);
  }
}

hide.addEventListener("click", (eve) => {
  eve.target.classList.add("d-none");
  show.classList.remove("d-none");
});
show.addEventListener("click", (eve) => {
  eve.target.classList.add("d-none");
  hide.classList.remove("d-none");
});

window.addEventListener("scroll", function () {
  var scrollPosition = window.scrollY || window.pageYOffset;
  var viewportHeight = window.innerHeight;
  var eightyPercentViewportHeight = viewportHeight * 0.9;
  if (scrollPosition > eightyPercentViewportHeight) {
    mainnavbar.style.background =
      "linear-gradient(25deg, var(--color-gradient))";
    mainnavbar.style.position = "fixed";
  } else {
    mainnavbar.style.background = "";
    mainnavbar.style.position = "static";
  }
});

window.onscroll = function () {
  if (
    document.body.scrollTop > 1000 ||
    document.documentElement.scrollTop > 1000
  ) {
    upbtn.style.display = "block";
  } else {
    upbtn.style.display = "none";
  }
};
upbtn.addEventListener("click", (e) => {
  window.scrollTo(0, 0);
});
