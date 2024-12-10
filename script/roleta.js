let saldo = 0;//VARIAVEL QUE VAI O VALOR QUE A PESSOA DEPOSITOU
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

const somRoleta = new Audio('../audio/rulet.mp3');
somRoleta.loop = true;

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
    reels.forEach((reel, index) => {
        reel.innerHTML = "";
        const reelInner = document.createElement("div");
        reelInner.classList.add("reel-inner");

        const symbolsForReel = symbols.slice(index).concat(symbols.slice(0, index));

        const totalSymbolsToDisplay = symbols.length * 500;

        for (let i = 0; i < totalSymbolsToDisplay; i++) {
            const symbolDiv = document.createElement("div");
            symbolDiv.classList.add("symbol");
            symbolDiv.textContent = symbolsForReel[i % symbolsForReel.length];
            reelInner.appendChild(symbolDiv);
        }
        reel.appendChild(reelInner);
    });
}
//NÃO SEI COMO ESSA BUCETA TA FUNCIONANDO, MAS TÁ, NÃO VOU MEXER
function exibirImagemVitoria() {
    const somVitoria = new Audio('../audio/vitoria.mp3');//EFEITO QUANDO GANHA
    somVitoria.currentTime = 0;
    somVitoria.play();

    const imagemVitoria = document.createElement("img");
    imagemVitoria.src = "../img/ganho.png";//IMG QUANDO GANHA
    imagemVitoria.alt = "Vitória!";
    imagemVitoria.className = "imagem-vitoria";

    const fundoEscuro = document.createElement("div");
    fundoEscuro.className = "fundo-escuro";
    //ESSES NGC SÃO PARA A ESTILIZAÇÃO DA ANIMAÇÃO DE VITORIA OU GANHO
    imagemVitoria.style.position = "fixed";
    imagemVitoria.style.top = "50%";
    imagemVitoria.style.left = "50%";
    imagemVitoria.style.transform = "translate(-50%, -50%) scale(0)";
    imagemVitoria.style.opacity = "0";
    imagemVitoria.style.transition = "transform 1s ease, opacity 1s ease";

    document.body.appendChild(fundoEscuro);
    document.body.appendChild(imagemVitoria);

    setTimeout(() => {
        imagemVitoria.style.transform = "translate(-50%, -50%) scale(2)";
        imagemVitoria.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        imagemVitoria.style.transform = "translate(-50%, -50%) scale(4)";
        imagemVitoria.style.opacity = "0";
    }, 3100);

    setTimeout(() => {
        imagemVitoria.remove();
        fundoEscuro.remove();
    }, 4100);
}

function exibirImagemPerda() {
    const somPerda = new Audio('../audio/perda.mp3');//EFEITO QUANDO PERDE
    somPerda.currentTime = 0;
    somPerda.play();

    const imagemPerda = document.createElement("img");
    imagemPerda.src = "../img/perda.png";//IMG QUANDO PERDE
    imagemPerda.alt = "Você perdeu!";
    imagemPerda.className = "imagem-perda";

    const fundoEscuro = document.createElement("div");
    fundoEscuro.className = "fundo-escuro";

    imagemPerda.style.position = "fixed";
    imagemPerda.style.top = "50%";
    imagemPerda.style.left = "50%";
    imagemPerda.style.transform = "translate(-50%, -50%) scale(0)";
    imagemPerda.style.opacity = "0";
    imagemPerda.style.transition = "transform 1s ease, opacity 1s ease";

    document.body.appendChild(fundoEscuro);
    document.body.appendChild(imagemPerda);

    setTimeout(() => {
        imagemPerda.style.transform = "translate(-50%, -50%) scale(2)";
        imagemPerda.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        imagemPerda.style.transform = "translate(-50%, -50%) scale(4)";
        imagemPerda.style.opacity = "0";
    }, 3100);

    setTimeout(() => {
        imagemPerda.remove();
        fundoEscuro.remove();
    }, 4100);
}

function spinReels() {
    if (isSpinning) return;
    isSpinning = true;
    girar.disabled = true;

    somRoleta.play();

    const shouldWin = Math.random() < 0.05;
    const winningSymbol = shouldWin ? symbols[Math.floor(Math.random() * symbols.length)] : null;

    reels.forEach((reel, index) => {
        const reelInner = reel.querySelector(".reel-inner");
        const duration = 5;

        reelInner.style.transition = `transform ${duration}s ease-out`;
        //ALGUÉM ME EXPLICA COMO ISSO TA FUNCIONANDOOOOOOOOOOOOOOOO
        let stopPosition;
        if (shouldWin) {
            stopPosition = symbols.indexOf(winningSymbol);
            reelInner.style.transform = `translateY(-${stopPosition * 100}px)`;
        } else {
            stopPosition = Math.floor(Math.random() * symbols.length);
            const offset = (stopPosition + Math.floor(Math.random() * symbols.length * 200)) * 100;//O 200 É A QUANTIA DE SIMBOLOS QUE IRÁ GIRAR, PODEMOS DIZER TBM QUE É A VELOCIDADE DAS BOBINAS
            reelInner.style.transform = `translateY(-${offset}px)`;
        }

        setTimeout(() => {
            if (index === reels.length - 1) {
                somRoleta.pause();
                somRoleta.currentTime = 0;

                if (shouldWin) {
                    const valorAposta = Number(valorAtual.replace(/\D/g, '')) / 100;
                    const ganho = valorAposta + valorAposta * 3;//O 3 É O MULTIPLICADOR DE GANHO, QUANTO VOCÊ APOSTAR ELE MULTIPLICARÁ ESSE VALOR
                    saldo += ganho;
                    atualizarSaldo();
                    exibirImagemVitoria();
                } else {
                    exibirImagemPerda();
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
            spinReels();
            //ESSA MERDA NÃO É PRA MIM
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
        //PUT@ QUE P@RIU, MEU CHEFE VAI COMER MEU C#
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
}});

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
