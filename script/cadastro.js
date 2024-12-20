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
  data = data.replace(/\D/g, ''); 
  if (data.length <= 2) {
    data = data.replace(/(\d{2})/, '$1/');
  } else if (data.length <= 5) {
    data = data.replace(/(\d{2})(\d{2})/, '$1/$2');
  } else {
    data = data.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  }
  return data;
}

function validarIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento.split("/").reverse().join("-"));
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

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

function validateDateOfBirth(date) {
  const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
  return datePattern.test(date) && date.length === 10;
}

function validatePasswordMatch() {
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');
  const confirmPasswordError = document.getElementById('confirm-password-error');

  if (confirmPassword.value !== password.value) {
    confirmPasswordError.style.display = 'block';
    confirmPasswordError.textContent = 'The passwords do not match. Please try again.';
    return false;
  } else {
    confirmPasswordError.style.display = 'none';
    return true;
  }
}

function checkRequiredFields() {
  const fields = document.querySelectorAll(`.page:nth-child(${current}) input, .page:nth-child(${current}) select`);
  let allValid = true;

  fields.forEach(field => {
    const errorPopup = document.getElementById(`${field.id}-error`);
    let isValid = field.value.trim() !== '';
    let customValid = true;

    if (field.id === 'cpf') {
      field.value = mascaraCPF(field.value);
      if (!validateCPF(field.value)) {
        customValid = false;
        errorPopup.textContent = 'Por favor, preencha o CPF corretamente (XXX.XXX.XXX-XX).';
      }
    } else if (field.id === 'phone') {
      field.value = mascaraTelefone(field.value);
      if (!validatePhone(field.value)) {
        customValid = false;
        errorPopup.textContent = 'Por favor, preencha o telefone corretamente (XX) XXXXX-XXXX.';
      }
    } else if (field.id === 'birthdate') {
      field.value = mascaraData(field.value);
      if (!validateDateOfBirth(field.value)) {
        customValid = false;
        errorPopup.textContent = '';
      } else {
        const idade = validarIdade(field.value);
        if (idade < 18) {
          customValid = false;
          document.getElementById('age-error').style.display = 'block';
        } else {
          document.getElementById('age-error').style.display = 'none';
        }
      }
    } else if (field.id === 'email') {
      if (!validateEmail(field.value)) {
        customValid = false;
        errorPopup.textContent = 'Por favor, preencha o email corretamente.';
      }
    }

    if (!isValid || !customValid) {
      errorPopup.style.display = 'block';
      allValid = false;
    } else {
      errorPopup.style.display = 'none';
    }
  });

  if (!validatePasswordMatch()) {
    allValid = false;
  }

  return allValid;
}

document.getElementById('cpf').addEventListener('input', function() {
  this.value = mascaraCPF(this.value);
});

document.getElementById('phone').addEventListener('input', function() {
  this.value = mascaraTelefone(this.value);
});

document.getElementById('birthdate').addEventListener('input', function() {
  this.value = mascaraData(this.value);
});

document.getElementById('email').addEventListener('input', function() {
  checkRequiredFields();
});

document.getElementById('confirm-password').addEventListener('input', function() {
  validatePasswordMatch();
});

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

prevBtnSec.addEventListener("click", function () {
  slidePage.style.marginLeft = "0%";
  bullet[current - 1].classList.remove("active");
  progressCheck[current - 1].classList.remove("active");
  progressText[current - 1].classList.remove("active");
  current -= 1;
});

prevBtnThird.addEventListener("click", function () {
  slidePage.style.marginLeft = "-25%";
  bullet[current - 1].classList.remove("active");
  progressCheck[current - 1].classList.remove("active");
  progressText[current - 1].classList.remove("active");
  current -= 1;
});

prevBtnFourth.addEventListener("click", function () {
  slidePage.style.marginLeft = "-50%";
  bullet[current - 1].classList.remove("active");
  progressCheck[current - 1].classList.remove("active");
  progressText[current - 1].classList.remove("active");
  current -= 1;
});

function mascaraCEP(cep) {
  cep = cep.replace(/\D/g, ''); 
  cep = cep.replace(/^(\d{5})(\d)/, '$1-$2'); 
  return cep;
}

document.getElementById('cep').addEventListener('input', function() {
  this.value = mascaraCEP(this.value);
});

$(document).ready(function () {
  $("#telefone").inputmask({
    mask: ["(99) 9999-9999", "(99) 99999-9999",],
    keepStatic: true
  });
})

function mascara(i) {
  var v = i.value;
  if (isNaN(v[v.length - 1])) {
    i.value = v.substring(0, v.length - 1);
    return;
  }
  i.setAttribute("maxlength", "14");
  if (v.length == 3 || v.length == 7) i.value += ".";
  if (v.length == 11) i.value += "-";
}

let senha = document.getElementById('senha');
let senhaC = document.getElementById('senhaC');

function validarSenha() {
  if (senha.value != senhaC.value) {
    senhaC.setCustomValidity("Senhas diferentes!");
    senhaC.reportValidity();
    return false;
  } else {
    senhaC.setCustomValidity("");
    return true;
  }
}

senhaC.addEventListener('input', validarSenha);
