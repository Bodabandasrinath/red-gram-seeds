document.getElementById("year").textContent = new Date().getFullYear();

const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav nav");
menu?.addEventListener("click", () => {
  const open = nav.style.display === "flex";
  nav.style.display = open ? "" : "flex";
  if (!open) {
    nav.style.position = "absolute";
    nav.style.top = "76px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.padding = "18px 4%";
    nav.style.background = "#fff";
    nav.style.flexDirection = "column";
    nav.style.gap = "15px";
    nav.style.borderBottom = "1px solid #e9eee9";
  }
});
