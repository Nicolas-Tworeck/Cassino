let saldo = 10000;
const saldoDisplay = document.querySelector(".banca label");

function atualizarSaldo() {
    saldoDisplay.textContent = `R$${saldo.toFixed(2).replace('.', ',')}`;
}

atualizarSaldo();

const symbols = ["🍀", "🍒", "⭐", "🍉", "🔔", "💎", "🍋", "🔑", "🐅"];
const reels = [
    document.getElementById("reel-1"),
    document.getElementById("reel-2"),
    document.getElementById("reel-3")
];
const girar = document.getElementById("girar");
const aposta = document.getElementById("aposta");
const popup = document.getElementById("popup");
const closePopupBtn = document.getElementById("closePopupBtn");
const valorLabel = document.querySelector(".valor label");
const teclasNumericas = document.querySelectorAll(".teclado-numerico button");
const checkBtn = document.getElementById("checkBtn");
const errorMessage = document.getElementById("error-message");

let isSpinning = false;
let valorAtual = "";
let numeroDigitado = false;

function formatarValor(valor) {
    valor = valor.replace(/\D/g, '');
    if (valor.length > 7) valor = valor.slice(0, 7);
    if (valor.length > 2) {
        const reais = valor.slice(0, -2);
        const centavos = valor.slice(-2);
        return `R$${reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ,${centavos}`;
    } else {
        return `R$00,${valor.padStart(2, '0')}`;
    }
}

function isApostaValida() {
    const valor = valorAtual.replace(/\D/g, '');
    const valorEmReais = Number(valor) / 100;
    return valorEmReais >= 2 && valorEmReais <= 10000;
}

function verificarLimiteAposta() {
    const valor = valorAtual.replace(/\D/g, '');
    const valorEmReais = Number(valor) / 100;

    if (valorEmReais < 2) {
        errorMessage.textContent = "A aposta mínima é de R$2,00";
        errorMessage.style.display = "block";
        return false;
    } else if (valorEmReais > 10000) {
        errorMessage.textContent = "A aposta máxima é de R$10.000,00";
        errorMessage.style.display = "block";
        return false;
    } else {
        errorMessage.style.display = "none";
        return true;
    }
}

function setupReels() {
    reels.forEach(reel => {
        reel.innerHTML = "";
        const reelInner = document.createElement("div");
        reelInner.classList.add("reel-inner");
        const totalSymbolsToDisplay = symbols.length * 100;

        for (let i = 0; i < totalSymbolsToDisplay; i++) {
            const symbolDiv = document.createElement("div");
            symbolDiv.classList.add("symbol");
            symbolDiv.textContent = symbols[i % symbols.length];
            reelInner.appendChild(symbolDiv);
        }
        reel.appendChild(reelInner);
    });
}

function spinReelsMaisRapido() {
    if (isSpinning) return;
    isSpinning = true;
    girar.disabled = true;

    const shouldWin = Math.random() < 0.25;
    const winningSymbol = shouldWin ? symbols[Math.floor(Math.random() * symbols.length)] : null;

    reels.forEach((reel, index) => {
        const reelInner = reel.querySelector(".reel-inner");
        const duration = 3;

        reelInner.style.transition = `transform ${duration}s ease-out`;

        let stopPosition;
        if (shouldWin) {
            stopPosition = symbols.indexOf(winningSymbol);
            reelInner.style.transform = `translateY(-${stopPosition * 100}px)`;
        } else {
            stopPosition = Math.floor(Math.random() * symbols.length);
            const offset = (stopPosition + Math.floor(Math.random() * symbols.length * 10)) * 100;
            reelInner.style.transform = `translateY(-${offset}px)`;
        }

        setTimeout(() => {
            if (index === reels.length - 1) {
                if (shouldWin) {
                    const valorAposta = Number(valorAtual.replace(/\D/g, '')) / 100;
                    const ganho = valorAposta + valorAposta * 0.5;
                    saldo += ganho;
                    atualizarSaldo();
                }
                isSpinning = false;
                girar.disabled = false;
            }
        }, duration * 1000);
    });
}

girar.addEventListener("click", function (event) {
    event.preventDefault();
    if (verificarLimiteAposta()) {
        const valorAposta = Number(valorAtual.replace(/\D/g, '')) / 100;
        if (saldo >= valorAposta) {
            saldo -= valorAposta;
            atualizarSaldo();
            spinReelsMaisRapido();
        } else {
            errorMessage.textContent = "Saldo insuficiente!";
            errorMessage.style.display = "block";
        }
    }
});

aposta.addEventListener("click", function (event) {
    event.preventDefault();
    popup.style.display = "flex";
    errorMessage.style.display = "none";
});

closePopupBtn.addEventListener("click", function (event) {
    event.preventDefault();
    popup.style.display = "none";
});

teclasNumericas.forEach((botao) => {
    botao.addEventListener("click", function () {
        const conteudo = botao.textContent.trim();
        const isDelete = botao.id === "deleteBtn";

        if (conteudo === "0" && !numeroDigitado) return;
        if (valorAtual.length >= 7 && !isDelete) return;

        if (isDelete) {
            valorAtual = valorAtual.slice(0, -1);
            if (valorAtual === "") numeroDigitado = false;
        } else {
            valorAtual += conteudo;
            if (conteudo !== "0") numeroDigitado = true;
        }
        valorLabel.textContent = formatarValor(valorAtual);
    });
});

checkBtn.addEventListener("click", function () {
    if (verificarLimiteAposta()) {
        const apostaLabel = document.getElementById("aposta-label");
        apostaLabel.textContent = formatarValor(valorAtual);
        popup.style.display = "none";
    }
});

popup.addEventListener("click", function (event) {
    if (!event.target.closest('.popup-content')) {
        if (verificarLimiteAposta()) {
            const apostaLabel = document.getElementById("aposta-label");
            apostaLabel.textContent = formatarValor(valorAtual);
            popup.style.display = "none";
        }
    }
});

setupReels();

function reloadPage() {
    location.reload();
}

function reloadAccount() {
    if (saldo < 10000) {
        saldo = 10000;
        atualizarSaldo();
        console.log("Saldo recarregado para R$10.000,00");
    }
}
