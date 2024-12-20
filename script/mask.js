//telefone
$(document).ready(function () {
    $("#telefone").inputmask({
      mask: ["(99) 9999-9999", "(99) 99999-9999",],
      keepStatic: true
    });
  })
  
  //CPF
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
  
  //senhas
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
  
  