// Seleciona os elementos
const symbols = ["🍀", "🍒", "⭐", "🍉", "🔔", "💎", "🍋", "🔑", "🐅"];
const reels = [
    document.getElementById("reel-1"),
    document.getElementById("reel-2"),
    document.getElementById("reel-3")
];
const girar = document.getElementById("girar");
const resultDiv = document.getElementById("result");
const aposta = document.getElementById("aposta");
const closePopupBtn = document.getElementById("closePopupBtn");
const popup = document.getElementById("popup");

let isSpinning = false;

// Adiciona os símbolos dentro das bobinas
function setupReels() {
    reels.forEach(reel => {
        reel.innerHTML = ""; // Limpa o conteúdo para evitar duplicatas
        const reelInner = document.createElement("div");
        reelInner.classList.add("reel-inner");

        // Aumentando o número de símbolos visíveis nas bobinas
        const totalSymbolsToDisplay = symbols.length * 4; // Aqui aumentei a quantidade de símbolos

        // Adiciona símbolos suficientes para criar a ilusão de rotação contínua
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

    // Determinar se o jogador deve ganhar 
    const shouldWin = Math.random() < 0.01;
    const winningSymbol = shouldWin ? symbols[Math.floor(Math.random() * symbols.length)] : null;

    reels.forEach((reel, index) => {
        const reelInner = reel.querySelector(".reel-inner");

        // Reduzimos o tempo de animação para tornar o giro mais rápido
        const duration = 0.3 + 0.1 * index; // Tempo de animação reduzido para velocidade maior

        reelInner.style.transition = `transform ${duration}s ease-out`;

        let stopPosition;

        if (shouldWin) {
            // Forçar a parada no símbolo vencedor
            stopPosition = symbols.indexOf(winningSymbol);
        } else {
            // Posição aleatória se o jogador não for ganhar
            stopPosition = Math.floor(Math.random() * symbols.length);
        }

        const offset = stopPosition * 100; // Deslocamento para baixo
        reelInner.style.transform = `translateY(-${offset}px)`; // Gira para baixo (sentido negativo)

        // Garantir que a animação pare corretamente
        setTimeout(() => {
            if (index === reels.length - 1) {
                showResult(winningSymbol); // Verifica o resultado ao final do último giro
            }
        }, duration * 1000);
    });
}

// Exibe o resultado
function showResult(winningSymbol) {
    const finalSymbols = reels.map(reel => {
        const reelInner = reel.querySelector(".reel-inner");
        const transformValue = reelInner.style.transform;
        const offset = parseInt(transformValue.match(/-?\d+/)[0], 10); // Extrai o valor do offset
        const stopIndex = (offset / 100) % symbols.length;
        return symbols[stopIndex < 0 ? stopIndex + symbols.length : stopIndex];
    });

    const isWinning = winningSymbol !== null;
    resultDiv.textContent = isWinning
        ? `Você ganhou!`
        : "Você perdeu! Tente novamente.";

    isSpinning = false;
    girar.disabled = false;
}

// Configurações iniciais
girar.addEventListener("click", spinReels);

// Popup
// Mostra o popup
aposta.addEventListener("click", function(event) {
    event.preventDefault(); // Impede o comportamento padrão do botão
    popup.style.display = "flex";
});

// Fecha o popup quando o botão de fechar for clicado
closePopupBtn.addEventListener("click", function() {
    popup.style.display = "none";
});

// Configura as bobinas
setupReels();
