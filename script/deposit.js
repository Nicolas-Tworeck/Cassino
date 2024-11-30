document.addEventListener("DOMContentLoaded", function () {
    const inputElement = document.querySelector(".input input");
    const maxValue = 20000;
    const minValue = 100;
    const warningMessage = document.getElementById("warning-message"); // Referência ao elemento de aviso
    const okButton = document.querySelector("#button-check"); // Referência ao botão OK

    // Função para mostrar o aviso de valor mínimo/máximo
    function showWarning(message) {
        warningMessage.textContent = message;
        warningMessage.style.visibility = "visible"; // Torna o aviso visível
    }

    // Função para limpar o aviso
    function clearWarning() {
        warningMessage.textContent = "";
        warningMessage.style.visibility = "hidden"; // Oculta o aviso
    }

    // Função de formatação e validação
    function formatAndValidate(value) {
        let rawValue = value.replace(/[^\d]/g, ""); // Remove caracteres não numéricos

        // Verifica se a quantidade total de caracteres excede o limite de 5 caracteres
        if (rawValue.length > 5) {
            rawValue = rawValue.slice(0, 5); // Limita a quantidade de caracteres (max 5 sem formatação)
        }

        // Verifica se o primeiro caractere é 0 e o impede
        if (rawValue.length > 1 && rawValue.startsWith("0")) {
            rawValue = rawValue.slice(1); // Remove o zero inicial
        }

        // Adiciona a formatação de milhar
        let formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        // Atualiza o valor formatado
        inputElement.value = `R$${formattedValue}`;

        // Converte o valor de volta para número para validação
        let numericValue = parseInt(rawValue, 10);

        // Valida se o valor está dentro do intervalo permitido
        if (numericValue < minValue) {
            showWarning("O valor mínimo de depósito é R$100");
        } else if (numericValue > maxValue) {
            showWarning("O valor máximo de depósito é R$20.000");
        } else {
            clearWarning(); // Remove o aviso se o valor estiver dentro do intervalo correto
        }

        // Verifica se o valor está dentro dos limites e habilita/desabilita o botão OK
        checkInputValue();
    }

    // Função para verificar o valor do input
    function checkInputValue() {
        // Remove qualquer caractere não numérico para verificar o valor real
        let value = inputElement.value.replace(/[^\d]/g, "");

        // Se o campo estiver vazio ou com o valor "R$"
        if (inputElement.value.trim() === "" || inputElement.value.trim() === "R$") {
            okButton.disabled = true; // Desabilita o botão OK
            warningMessage.textContent = "Enter the amount you wish to deposit"; // Exibe o aviso
            warningMessage.style.visibility = "visible"; // Torna o aviso visível
        }
        // Se o valor for menor que 100 ou maior que 20000
        else if (parseInt(value) < 100) {
            okButton.disabled = true; // Desabilita o botão OK
            warningMessage.textContent = "The minimum deposit amount is R$100"; // Exibe o aviso de valor mínimo
            warningMessage.style.visibility = "visible"; // Torna o aviso visível
        } else if (parseInt(value) > 20000) {
            okButton.disabled = true; // Desabilita o botão OK
            warningMessage.textContent = "The maximum deposit amount is R$20.000"; // Exibe o aviso de valor máximo
            warningMessage.style.visibility = "visible"; // Torna o aviso visível
        }
        // Se o valor estiver dentro do intervalo permitido
        else {
            okButton.disabled = false; // Habilita o botão OK
            warningMessage.style.visibility = "hidden"; // Oculta o aviso
        }
    }

    // Evento de input para formatar o valor e verificar limites
    inputElement.addEventListener("input", function () {
        formatAndValidate(inputElement.value); // Valida o valor enquanto digita
    });

    // Adiciona o prefixo "R$" ao focar no campo vazio
    inputElement.addEventListener("focus", function () {
        if (!inputElement.value.startsWith("R$")) {
            inputElement.value = "R$";
        }
    });

    // Remove o prefixo "R$" se o campo estiver vazio ao perder o foco
    inputElement.addEventListener("blur", function () {
        if (inputElement.value === "R$") {
            inputElement.value = "";
        }
    });

    // Função chamada ao clicar nos botões de valor
    function setValue(amount) {
        // Remove qualquer caractere não numérico
        let value = amount.toString().replace(/[^\d]/g, "");
        
        // Formatação de milhar
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        // Atualiza o valor no input com o prefixo "R$"
        inputElement.value = `R$${value}`;
        
        // Verifica se o valor está dentro dos limites após a seleção do valor
        formatAndValidate(inputElement.value); // Chama a função de validação após definir o valor
    }

    // Adiciona evento de clique para todos os botões de valor
    const buttons = document.querySelectorAll('.button-value button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // Obtém o valor do botão, que já contém o valor formatado, e chama setValue
            setValue(parseInt(button.textContent.replace(/[^\d]/g, ""), 10)); // Remove o "R$" antes de passar para a função
        });
    });

    // Inicializa a verificação logo após o carregamento
    checkInputValue();
});
