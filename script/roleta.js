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
    // Remove qualquer caractere não numérico (caso o usuário insira algo indevido)
    valor = valor.replace(/\D/g, '');

    // Limita o valor a no máximo 7 caracteres
    if (valor.length > 7) {
        valor = valor.slice(0, 7);
    }

    // Se o valor tiver 6 ou mais caracteres, separa os reais e centavos
    if (valor.length > 2) {
        const reais = valor.slice(0, -2);  // Pega todos os caracteres exceto os dois últimos
        const centavos = valor.slice(-2);  // Pega os dois últimos caracteres
        return `R$${reais},${centavos}`;
    } else {
        // Se o valor for menor que 3 caracteres, exibe os centavos com 2 dígitos
        return `R$00,${valor.padStart(2, '0')}`;
    }
}

// Função para verificar se a aposta é válida (valor >= R$2 e <= R$10.000)
function isApostaValida() {
    const valor = valorAtual.replace(/\D/g, ''); // Remove não numéricos
    const valorEmReais = Number(valor) / 100; // Converte para reais
    return valorEmReais >= 2 && valorEmReais <= 10000; // Verifica se está entre 2 e 10.000 reais
}

// Função para verificar se a aposta é menor que 2 ou maior que 10000
function verificarLimiteAposta() {
    const valor = valorAtual.replace(/\D/g, ''); // Remove não numéricos
    const valorEmReais = Number(valor) / 100; // Converte para reais

    if (valorEmReais < 2) {
        errorMessage.textContent = "A aposta mínima é de R$2,00"; // Exibe a mensagem de erro
        errorMessage.style.display = "block"; // Torna a mensagem visível
    } else if (valorEmReais > 10000) {
        errorMessage.textContent = "A aposta máxima é de R$10.000,00"; // Exibe a mensagem de erro
        errorMessage.style.display = "block"; // Torna a mensagem visível
    } else {
        errorMessage.style.display = "none"; // Esconde a mensagem de erro, caso a aposta seja válida
    }
}

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
    verificarLimiteAposta(); // Verifica os limites da aposta

    if (errorMessage.style.display === "block") {
        return; // Se houver mensagem de erro, impede o giro
    }
    
    spinReels(); // Inicia o giro se a aposta for válida
});

// Mostra o popup
aposta.addEventListener("click", function (event) {
    event.preventDefault(); // Evita comportamento padrão
    popup.style.display = "flex";
    errorMessage.style.display = "none"; // Esconde a mensagem de erro ao abrir o popup
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

        // Caso o número seja zero, só adicione se já foi inserido um número diferente de zero
        if (conteudo === "0" && !numeroDigitado) {
            return; // Não adiciona o zero se nenhum outro número foi digitado
        }

        // Não adiciona mais números se o limite de 7 caracteres for alcançado
        if (valorAtual.length >= 7 && !isDelete) {
            return; // Não faz nada se o limite de caracteres for atingido
        }

        if (isDelete) {
            // Apaga o último caractere visível na tela
            valorAtual = valorAtual.slice(0, -1);
            if (valorAtual === "") {
                numeroDigitado = false; // Reseta a flag se apagar tudo
            }
        } else {
            // Adiciona o número
            valorAtual += conteudo;
            if (conteudo !== "0") {
                numeroDigitado = true; // Marca que um número não zero foi digitado
            }
        }

        // Atualiza o texto do label com a máscara
        valorLabel.textContent = formatarValor(valorAtual);
    });
});

// Quando o botão "✔" for pressionado, transfere o valor para o label da aposta
checkBtn.addEventListener("click", function () {
    // Verifica os limites da aposta antes de transferir o valor
    verificarLimiteAposta();

    if (errorMessage.style.display === "block") {
        return; // Se houver mensagem de erro, impede a transferência
    }

    // Atualiza o valor no label da aposta
    const apostaLabel = document.getElementById("aposta-label");
    apostaLabel.textContent = formatarValor(valorAtual); // Exibe o valor formatado no label da aposta

    // Fecha o popup
    popup.style.display = "none";
});

// Configura as bobinas
setupReels();

// Seleciona os elementos do popup e do botão de fechar
const popupBanca = document.getElementById("popupBanca");
const closePopupBancaBtn = document.getElementById("closePopupBanca");
const banca = document.querySelector(".banca");

// Exibe o popup quando a classe .banca for clicada
banca.addEventListener("click", function () {
    popupBanca.style.display = "block";
});

// Fecha o popup quando o botão de fechar for clicado
closePopupBancaBtn.addEventListener("click", function () {
    popupBanca.style.display = "none";
});

// Fecha o popup da banca quando o clique for fora da área do popup
window.addEventListener("click", function (event) {
    if (event.target === popupBanca) {
        popupBanca.style.display = "none"; // Fecha o popup
    }
});
