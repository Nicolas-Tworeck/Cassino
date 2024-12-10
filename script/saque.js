document.addEventListener("DOMContentLoaded", function () {
    const inputElement = document.querySelector(".input input");
    const maxValue = 20000;
    const minValue = 100;
    const warningMessage = document.getElementById("warning-message");
    const okButton = document.querySelector("#button-check");

    function showWarning(message) {
        warningMessage.textContent = message;
        warningMessage.style.visibility = "visible";
    }

    function clearWarning() {
        warningMessage.textContent = "";
        warningMessage.style.visibility = "hidden";
    }

    function formatAndValidate(value) {
        let rawValue = value.replace(/[^\d]/g, "");

        if (rawValue.length > 5) {
            rawValue = rawValue.slice(0, 5);
        }

        if (rawValue.length > 1 && rawValue.startsWith("0")) {
            rawValue = rawValue.slice(1);
        }

        let formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        inputElement.value = `R$${formattedValue}`;

        let numericValue = parseInt(rawValue, 10);

        if (numericValue < minValue) {
            showWarning("O valor mínimo de depósito é R$100");
        } else if (numericValue > maxValue) {
            showWarning("O valor máximo de depósito é R$20.000");
        } else {
            clearWarning();
        }

        checkInputValue();
    }

    function checkInputValue() {
        let value = inputElement.value.replace(/[^\d]/g, "");

        if (inputElement.value.trim() === "" || inputElement.value.trim() === "R$") {
            okButton.disabled = true;
            warningMessage.textContent = "Enter the amount you wish to withdraw";
            warningMessage.style.visibility = "visible";
        } else if (parseInt(value) < 100) {
            okButton.disabled = true;
            warningMessage.textContent = "The minimum withdraw amount is R$100";
            warningMessage.style.visibility = "visible";
        } else if (parseInt(value) > 10000) {
            okButton.disabled = true;
            warningMessage.textContent = "The maximum withdraw amount is R$10.000";
            warningMessage.style.visibility = "visible";
        } else {
            okButton.disabled = false;
            warningMessage.style.visibility = "hidden";
        }
    }

    inputElement.addEventListener("input", function () {
        formatAndValidate(inputElement.value);
    });

    inputElement.addEventListener("focus", function () {
        if (!inputElement.value.startsWith("R$")) {
            inputElement.value = "R$";
        }
    });

    inputElement.addEventListener("blur", function () {
        if (inputElement.value === "R$") {
            inputElement.value = "";
        }
    });

    function setValue(amount) {
        let value = amount.toString().replace(/[^\d]/g, "");
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        inputElement.value = `R$${value}`;
        formatAndValidate(inputElement.value);
    }

    const buttons = document.querySelectorAll('.button-value button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            setValue(parseInt(button.textContent.replace(/[^\d]/g, ""), 10));
        });
    });

    checkInputValue();
});
