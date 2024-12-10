function cadastro() {
  window.location.href = "cadastro.html";
}
function login() {
  window.location.href = "login.html";
}
function contrato() {
  window.location.href = "contrato.html";
}
function contato() {
  window.location.href = "https://www.instagram.com/vegass.bet/profilecard/?igsh=em0zN2E0eTgxbnNu";
}
function profile() {
  window.location.href = "profile.html";
}
function index() {
  window.location.href = "index.html";
}

function deposit() {
  window.location.href = "deposit.html";
}
function saque() {
  window.location.href = "saque.html";
}

function editProfile() {
  window.location.href = "editProfile.html";
}

function demo() {
  window.location.href = "demo.html";
}
function voltar() {
  window.history.back();
}

//MUSICA DE FUNDO
document.addEventListener("DOMContentLoaded", () => {
  const music = new Audio("../audio/ambiente.mp3");
  music.loop = true;
  music.volume = 0.25;

  music.play().catch(() => {
    console.warn("Reprodução automática bloqueada. Necessário interação do usuário.");
  });

  document.addEventListener("click", () => {
    if (music.paused) {
      music.play();
    }
  });
});
