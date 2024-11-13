const slidePage = document.querySelector(".slide-page");
const nextBtnFirst = document.querySelector(".firstNext");
const prevBtnSec = document.querySelector(".prev-1");
const nextBtnSec = document.querySelector(".next-1");
const prevBtnThird = document.querySelector(".prev-2");
const nextBtnThird = document.querySelector(".next-2");
const prevBtnFourth = document.querySelector(".prev-3");
const submitBtn = document.querySelector(".submit");
const progressText = [...document.querySelectorAll(".step p")];
const progressCheck = [...document.querySelectorAll(".step .check")];
const bullet = [...document.querySelectorAll(".step .bullet")];
let max = 4;
let current = 1;

// Funções de máscara
function mascaraCPF(cpf) {
  cpf = cpf.replace(/\D/g, ''); 
  cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  return cpf;
}

function mascaraTelefone(phone) {
  phone = phone.replace(/\D/g, ''); 
  phone = phone.replace(/^(\d{2})(\d)/, '($1) $2');
  phone = phone.replace(/(\d{5})(\d)/, '$1-$2');
  return phone;
}

function mascaraData(data) {
  data = data.replace(/\D/g, ''); // Remove qualquer caractere não numérico
  if (data.length <= 2) {
    data = data.replace(/(\d{2})/, '$1/');
  } else if (data.length <= 5) {
    data = data.replace(/(\d{2})(\d{2})/, '$1/$2');
  } else {
    data = data.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  }
  return data;
}

// Função para validar CPF, telefone e email
function validateCPF(cpf) {
  const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return cpfPattern.test(cpf);
}

function validatePhone(phone) {
  const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
  return phonePattern.test(phone);
}

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

// Função para validar a data de nascimento (exatamente 10 caracteres)
function validateDateOfBirth(date) {
  const datePattern = /^\d{2}\/\d{2}\/\d{4}$/; // Formato dd/mm/yyyy
  return datePattern.test(date) && date.length === 10; // Verifica se tem exatamente 10 caracteres
}

// Função para verificar a confirmação de senha
function validatePasswordMatch() {
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');
  const confirmPasswordError = document.getElementById('confirm-password-error');

  if (confirmPassword.value !== password.value) {
    confirmPasswordError.style.display = 'block';
    confirmPasswordError.textContent = 'As senhas não coincidem. Por favor, tente novamente.';
    return false;
  } else {
    confirmPasswordError.style.display = 'none';
    return true;
  }
}

// Função de verificação dos campos obrigatórios
function checkRequiredFields() {
  const fields = document.querySelectorAll(`.page:nth-child(${current}) input, .page:nth-child(${current}) select`);
  let allValid = true;

  fields.forEach(field => {
    const errorPopup = document.getElementById(`${field.id}-error`);
    let isValid = field.value.trim() !== '';
    let customValid = true;

    // Aplique a máscara de CPF, Telefone, Data de Nascimento e Email
    if (field.id === 'cpf') {
      field.value = mascaraCPF(field.value); // Aplica a máscara do CPF
      if (!validateCPF(field.value)) {
        customValid = false;
        errorPopup.textContent = 'Por favor, preencha o CPF corretamente (XXX.XXX.XXX-XX).';
      }
    } else if (field.id === 'phone') {
      field.value = mascaraTelefone(field.value); // Aplica a máscara do telefone
      if (!validatePhone(field.value)) {
        customValid = false;
        errorPopup.textContent = 'Por favor, preencha o telefone corretamente (XX) XXXXX-XXXX.';
      }
    } else if (field.id === 'birthdate') {
      field.value = mascaraData(field.value); // Aplica a máscara de data
      if (!validateDateOfBirth(field.value)) {
        customValid = false;
        errorPopup.textContent = 'Please fill in the date of birth correctly (dd/mm/yyyy).';
      }
    } else if (field.id === 'email') {
      if (!validateEmail(field.value)) {
        customValid = false;
        errorPopup.textContent = 'Por favor, preencha o email corretamente.';
      }
    }

    // Verificação final
    if (!isValid || !customValid) {
      errorPopup.style.display = 'block';
      allValid = false;
    } else {
      errorPopup.style.display = 'none';
    }
  });

  // Verificar se as senhas coincidem na última etapa
  if (!validatePasswordMatch()) {
    allValid = false;
  }

  return allValid;
}

// Aplicar a máscara em tempo real
document.getElementById('cpf').addEventListener('input', function() {
  this.value = mascaraCPF(this.value);
});

document.getElementById('phone').addEventListener('input', function() {
  this.value = mascaraTelefone(this.value);
});

document.getElementById('birthdate').addEventListener('input', function() {
  this.value = mascaraData(this.value);
});

// Validar email ao digitar
document.getElementById('email').addEventListener('input', function() {
  checkRequiredFields(); // Verifica se o email está válido enquanto o usuário digita
});

// Validar a confirmação de senha ao digitar
document.getElementById('confirm-password').addEventListener('input', function() {
  validatePasswordMatch(); // Verifica se as senhas coincidem enquanto o usuário digita
});

// Botões de navegação para avançar
nextBtnFirst.addEventListener("click", function () {
  if (checkRequiredFields()) {
    slidePage.style.marginLeft = "-25%";
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current += 1;
  }
});

nextBtnSec.addEventListener("click", function () {
  if (checkRequiredFields()) {
    slidePage.style.marginLeft = "-50%";
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current += 1;
  }
});

nextBtnThird.addEventListener("click", function () {
  if (checkRequiredFields()) {
    slidePage.style.marginLeft = "-75%";
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current += 1;
  }
});

submitBtn.addEventListener("click", function () {
  if (checkRequiredFields()) {
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current += 1;
    setTimeout(function () {
      alert("Seu formulário foi enviado com sucesso.");
      location.reload();
    }, 800);
  }
});

// Botões de navegação para voltar
prevBtnSec.addEventListener("click", function () {
  slidePage.style.marginLeft = "0%";
  bullet[current - 2].classList.remove("active");
  progressCheck[current - 2].classList.remove("active");
  progressText[current - 2].classList.remove("active");
  current -= 1;
});

prevBtnThird.addEventListener("click", function () {
  slidePage.style.marginLeft = "-25%";
  bullet[current - 2].classList.remove("active");
  progressCheck[current - 2].classList.remove("active");
  progressText[current - 2].classList.remove("active");
  current -= 1;
});

prevBtnFourth.addEventListener("click", function () {
  slidePage.style.marginLeft = "-50%";
  bullet[current - 2].classList.remove("active");
  progressCheck[current - 2].classList.remove("active");
  progressText[current - 2].classList.remove("active");
  current -= 1;
});

// Máscara de CEP
document.addEventListener('DOMContentLoaded', function() {
  const cepInput = document.getElementById('cep');

  cepInput.addEventListener('input', function(e) {
    let value = e.target.value;

    // Remove qualquer caractere não numérico
    value = value.replace(/\D/g, '');

    // Aplica a máscara de CEP (XXXXX-XXX)
    if (value.length <= 5) {
      value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    } else {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    e.target.value = value;
  });
});
