// Seleciona os elementos principais
const symbols = ["🍀", "🍒", "⭐", "🍉", "🔔", "💎", "🍋", "🔑", "🐅"];
const reels = [
    document.getElementById("reel-1"),
    document.getElementById("reel-2"),
    document.getElementById("reel-3")
];
const girar = document.getElementById("girar");
const resultDiv = document.getElementById("result");
const aposta = document.getElementById("aposta");
const popup = document.getElementById("popup");
const closePopupBtn = document.getElementById("closePopupBtn");
const valorLabel = document.querySelector(".valor label");
const teclasNumericas = document.querySelectorAll(".teclado-numerico button");
const checkBtn = document.getElementById("checkBtn"); // Botão de "check"
const errorMessage = document.getElementById("error-message"); // Mensagem de erro abaixo do valor

// Variáveis para controlar o valor inserido
let isSpinning = false;
let valorAtual = "";
let numeroDigitado = false; // Flag para detectar se já foi inserido um número não-zero

// Função para formatar o valor como moeda R$
function formatarValor(valor) {
    valor = valor.replace(/\D/g, ''); // Remove qualquer caractere não numérico

    if (valor.length > 7) {
        valor = valor.slice(0, 7); // Limita o valor a no máximo 7 caracteres
    }

    if (valor.length > 2) {
        const reais = valor.slice(0, -2);
        const centavos = valor.slice(-2);
        return `R$${reais},${centavos}`;
    } else {
        return `R$00,${valor.padStart(2, '0')}`;
    }
}

// Função para verificar se a aposta é válida
function isApostaValida() {
    const valor = valorAtual.replace(/\D/g, '');
    const valorEmReais = Number(valor) / 100;
    return valorEmReais >= 2 && valorEmReais <= 10000;
}

// Função para verificar se a aposta está fora do limite
function verificarLimiteAposta() {
    const valor = valorAtual.replace(/\D/g, '');
    const valorEmReais = Number(valor) / 100;

    if (valorEmReais < 2) {
        errorMessage.textContent = "A aposta mínima é de R$2,00";
        errorMessage.style.display = "block";
    } else if (valorEmReais > 10000) {
        errorMessage.textContent = "A aposta máxima é de R$10.000,00";
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }
}

// Adiciona os símbolos nas bobinas
function setupReels() {
    reels.forEach(reel => {
        reel.innerHTML = ""; // Limpa o conteúdo para evitar duplicatas
        const reelInner = document.createElement("div");
        reelInner.classList.add("reel-inner");

        const totalSymbolsToDisplay = symbols.length * 4;

        for (let i = 0; i < totalSymbolsToDisplay; i++) {
            const symbolDiv = document.createElement("div");
            symbolDiv.classList.add("symbol");
            symbolDiv.textContent = symbols[i % symbols.length];
            reelInner.appendChild(symbolDiv);
        }

        reel.appendChild(reelInner);
    });
}

// Inicia o giro das bobinas
function spinReels() {
    if (isSpinning) return;
    isSpinning = true;
    girar.disabled = true;
    resultDiv.textContent = "Girando...";

    const shouldWin = Math.random() < 0.01;
    const winningSymbol = shouldWin ? symbols[Math.floor(Math.random() * symbols.length)] : null;

    reels.forEach((reel, index) => {
        const reelInner = reel.querySelector(".reel-inner");
        const duration = 0.6 + 0.2 * index;

        reelInner.style.transition = `transform ${duration}s ease-out`;

        let stopPosition;
        if (shouldWin) {
            stopPosition = symbols.indexOf(winningSymbol);
        } else {
            stopPosition = Math.floor(Math.random() * symbols.length);
        }

        const offset = stopPosition * 100;
        reelInner.style.transform = `translateY(-${offset}px)`;

        setTimeout(() => {
            if (index === reels.length - 1) {
                showResult(winningSymbol);
            }
        }, duration * 1000);
    });
}

// Exibe o resultado
function showResult(winningSymbol) {
    const isWinning = winningSymbol !== null;
    resultDiv.textContent = isWinning
        ? `Você ganhou!`
        : "Você perdeu! Tente novamente.";

    isSpinning = false;
    girar.disabled = false;
}

// Eventos para o botão girar
girar.addEventListener("click", function (event) {
    event.preventDefault();
    verificarLimiteAposta();

    if (errorMessage.style.display === "block") {
        return;
    }

    spinReels();
});

// Mostra o popup
aposta.addEventListener("click", function (event) {
    event.preventDefault();
    popup.style.display = "flex";
    errorMessage.style.display = "none";
});

// Fecha o popup
closePopupBtn.addEventListener("click", function (event) {
    event.preventDefault();
    popup.style.display = "none";
});

// Atualiza o valor ao clicar nos botões do teclado numérico
teclasNumericas.forEach((botao) => {
    botao.addEventListener("click", function () {
        const conteudo = botao.textContent.trim();
        const isDelete = botao.id === "deleteBtn";

        if (conteudo === "0" && !numeroDigitado) {
            return;
        }

        if (valorAtual.length >= 7 && !isDelete) {
            return;
        }

        if (isDelete) {
            valorAtual = valorAtual.slice(0, -1);
            if (valorAtual === "") {
                numeroDigitado = false;
            }
        } else {
            valorAtual += conteudo;
            if (conteudo !== "0") {
                numeroDigitado = true;
            }
        }

        valorLabel.textContent = formatarValor(valorAtual);
    });
});

// Quando o botão "✔" for pressionado
checkBtn.addEventListener("click", function () {
    verificarLimiteAposta();

    if (errorMessage.style.display === "block") {
        return;
    }

    const apostaLabel = document.getElementById("aposta-label");
    apostaLabel.textContent = formatarValor(valorAtual);

    popup.style.display = "none";
});

// Configura as bobinas
setupReels();
