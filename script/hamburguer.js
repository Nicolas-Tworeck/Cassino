//hamburguer

document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const sideMenu = document.getElementById("sideMenu");
    const closeButton = document.getElementById("closeButton");
    const body = document.body;
  
    menuButton.addEventListener("click", () => {
        sideMenu.classList.add("open");
        body.style.overflow = "hidden"; // Impede rolagem
    });
  
    closeButton.addEventListener("click", () => {
        sideMenu.classList.remove("open");
        body.style.overflow = ""; // Restaura rolagem
    });
  
    // Fecha o menu ao clicar fora dele
    window.addEventListener("click", (e) => {
        if (!sideMenu.contains(e.target) && e.target !== menuButton) {
            sideMenu.classList.remove("open");
            body.style.overflow = ""; // Restaura rolagem
        }
    });
  });