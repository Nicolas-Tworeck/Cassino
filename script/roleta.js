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

let isSpinning = false;
let valorAtual = "";

// Adiciona os símbolos nas bobinas
function setupReels() {
    reels.forEach(reel => {
        reel.innerHTML = ""; // Limpa o conteúdo para evitar duplicatas
        const reelInner = document.createElement("div");
        reelInner.classList.add("reel-inner");

        const totalSymbolsToDisplay = symbols.length * 4; // Multiplicamos para criar efeito visual

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

        const offset = stopPosition * 100; // Calcula o deslocamento
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
    event.preventDefault(); // Evita comportamento padrão do formulário
    spinReels();
});

// Mostra o popup
aposta.addEventListener("click", function (event) {
    event.preventDefault(); // Evita comportamento padrão
    popup.style.display = "flex";
});

// Fecha o popup
closePopupBtn.addEventListener("click", function (event) {
    event.preventDefault(); // Evita comportamento padrão
    popup.style.display = "none";
});

// Atualiza o valor ao clicar nos botões do teclado numérico
teclasNumericas.forEach((botao) => {
    botao.addEventListener("click", function () {
        const conteudo = botao.textContent.trim();
        const isDelete = botao.id === "deleteBtn"; // Verifica se é o botão de apagar

        if (isDelete) {
            // Apagar o último caractere
            valorAtual = valorAtual.slice(0, -1);
        } else if (conteudo === "✔") {
            // Confirmar e fechar popup
            popup.style.display = "none";
        } else {
            // Adiciona o número
            valorAtual += conteudo;
        }

        // Atualiza o texto do label
        valorLabel.textContent = `R$${valorAtual || "0,00"}`;
    });
});

// Configura as bobinas
setupReels();
