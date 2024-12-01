// Definindo o saldo inicial de 10 mil reais
let saldo = 10000; // R$10.000,00
const saldoDisplay = document.querySelector(".banca label"); // Elemento onde o saldo será exibido

// Função para atualizar o saldo na tela
function atualizarSaldo() {
    saldoDisplay.textContent = `R$${saldo.toFixed(2).replace('.', ',')}`;
}

// Inicializando a exibição do saldo
atualizarSaldo();

// Definindo os símbolos da roleta
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

// Função para formatar o valor da aposta com ponto para milhar e vírgula para centavos
function formatarValor(valor) {
    valor = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (valor.length > 7) valor = valor.slice(0, 7); // Limita a 7 caracteres

    // Se o valor for maior que 2 (reais e centavos)
    if (valor.length > 2) {
        const reais = valor.slice(0, -2); // Extrai a parte dos reais
        const centavos = valor.slice(-2); // Extrai os centavos
        // Adiciona ponto como separador de milhar e vírgula para os centavos
        return `R$${reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ,${centavos}`;
    } else {
        // Se o valor for menor que 1 real, preenche com zero
        return `R$00,${valor.padStart(2, '0')}`;
    }
}

// Função para verificar se a aposta é válida
function isApostaValida() {
    const valor = valorAtual.replace(/\D/g, '');
    const valorEmReais = Number(valor) / 100;
    return valorEmReais >= 2 && valorEmReais <= 10000;
}

// Função para verificar o limite da aposta
function verificarLimiteAposta() {
    const valor = valorAtual.replace(/\D/g, '');
    const valorEmReais = Number(valor) / 100;

    if (valorEmReais < 2) {
        errorMessage.textContent = "A aposta mínima é de R$2,00";
        errorMessage.style.display = "block";
        return false; // Retorna false se a aposta não for válida
    } else if (valorEmReais > 10000) {
        errorMessage.textContent = "A aposta máxima é de R$10.000,00";
        errorMessage.style.display = "block";
        return false; // Retorna false se a aposta não for válida
    } else {
        errorMessage.style.display = "none";
        return true; // Retorna true se a aposta for válida
    }
}

// Função para configurar as bobinas da roleta
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

// Função para girar as bobinas
function spinReelsMaisRapido() {
    if (isSpinning) return;
    isSpinning = true;
    girar.disabled = true;

    const shouldWin = Math.random() < 0.5;  // Probabilidade de ganhar (10%)
    const winningSymbol = shouldWin ? symbols[Math.floor(Math.random() * symbols.length)] : null;

    reels.forEach((reel, index) => {
        const reelInner = reel.querySelector(".reel-inner");
        const duration = 2;  // A duração continua em 2 segundos

        reelInner.style.transition = `transform ${duration}s ease-out`;

        let stopPosition;
        if (shouldWin) {
            // Se a aposta for vencedora, garanta que as bobinas mostrem símbolos vencedores
            stopPosition = symbols.indexOf(winningSymbol);
            // Para garantir que todos os rolos tenham a mesma combinação vencedora
            reelInner.style.transform = `translateY(-${stopPosition * 100}px)`;
        } else {
            stopPosition = Math.floor(Math.random() * symbols.length);
            const offset = (stopPosition + Math.floor(Math.random() * symbols.length * 10)) * 100;
            reelInner.style.transform = `translateY(-${offset}px)`;
        }

        setTimeout(() => {
            if (index === reels.length - 1) {
                // Se o jogador ganhou e as bobinas coincidem
                if (shouldWin) {
                    const valorAposta = Number(valorAtual.replace(/\D/g, '')) / 100;
                    const ganho = valorAposta + valorAposta * 0.5;  // Ganha 50% a mais do valor apostado
                    saldo += ganho;  // Atualiza o saldo com o valor ganho
                    atualizarSaldo();  // Atualiza o saldo na tela
                }
                isSpinning = false;
                girar.disabled = false;
            }
        }, duration * 1000);
    });
}

// Ação ao clicar no botão de girar
girar.addEventListener("click", function (event) {
    event.preventDefault();
    if (verificarLimiteAposta()) { // Verifica se a aposta é válida antes de girar
        // Calculando o valor da aposta
        const valorAposta = Number(valorAtual.replace(/\D/g, '')) / 100;
        
        // Verificando se o saldo é suficiente
        if (saldo >= valorAposta) {
            saldo -= valorAposta; // Subtrai o valor da aposta do saldo
            atualizarSaldo(); // Atualiza o saldo na tela
            spinReelsMaisRapido(); // Gira a roleta mais rápido
        } else {
            errorMessage.textContent = "Saldo insuficiente!";
            errorMessage.style.display = "block";
        }
    }
});

// Ação ao clicar na área da aposta
aposta.addEventListener("click", function (event) {
    event.preventDefault();
    popup.style.display = "flex";
    errorMessage.style.display = "none";
});

// Fechar o popup
closePopupBtn.addEventListener("click", function (event) {
    event.preventDefault();
    popup.style.display = "none";
});

// Ação nas teclas numéricas
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

// Ação no botão de verificação da aposta
checkBtn.addEventListener("click", function () {
    if (verificarLimiteAposta()) { // Verifica se a aposta é válida antes de salvar
        // Exibe o valor digitado na div da aposta
        const apostaLabel = document.getElementById("aposta-label");
        apostaLabel.textContent = formatarValor(valorAtual); // Atualiza o valor na div de aposta
        popup.style.display = "none"; // Fecha o popup após salvar o valor
    }
});

// Agora, quando clicar na área fora do popup, também valida e atualiza o valor da aposta
popup.addEventListener("click", function (event) {
    if (!event.target.closest('.popup-content')) { // Verifica se o clique foi fora do conteúdo do popup
        if (verificarLimiteAposta()) { // Verifica se a aposta é válida
            const apostaLabel = document.getElementById("aposta-label");
            apostaLabel.textContent = formatarValor(valorAtual); // Atualiza o valor na div de aposta
            popup.style.display = "none"; // Fecha o popup
        }
    }
});

// Configura as bobinas da roleta ao carregar a página
setupReels();

// Função para recarregar a página
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
