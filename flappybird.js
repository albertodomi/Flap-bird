// Tabuleiro
let tabuleiro;
let larguraTabuleiro = 360;
let alturaTabuleiro = 640;
let contexto;

// Pássaro
let larguraPassaro = 34;
let alturaPassaro = 24;
let posicaoInicialPassaroX = larguraTabuleiro / 8;
let posicaoInicialPassaroY = alturaTabuleiro / 2;
let imagemPassaro;

let passaro = {
    x: posicaoInicialPassaroX,
    y: posicaoInicialPassaroY,
    largura: larguraPassaro,
    altura: alturaPassaro
}

// Canos
let arrayCanos = [];
let larguraCano = 64;
let alturaCano = 512;
let posicaoInicialCanoX = larguraTabuleiro;
let posicaoInicialCanoY = 0;

let imagemCanoSuperior;
let imagemCanoInferior;

// Física
let velocidadeX = -2; // Velocidade de movimento dos canos para a esquerda
let velocidadeY = 0; // Velocidade de salto do pássaro
let gravidade = 0.4;

let jogoEncerrado = false;
let pontuacao = 0;

window.onload = function() {
    tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.height = alturaTabuleiro;
    tabuleiro.width = larguraTabuleiro;
    contexto = tabuleiro.getContext("2d");

    // Desenhar o pássaro
    imagemPassaro = new Image();
    imagemPassaro.src = "./flappybird.png";
    imagemPassaro.onload = function() {
        contexto.drawImage(imagemPassaro, passaro.x, passaro.y, passaro.largura, passaro.altura);
    }

    // Carregar imagens dos canos
    imagemCanoSuperior = new Image();
    imagemCanoSuperior.src = "./toppipe.png";

    imagemCanoInferior = new Image();
    imagemCanoInferior.src = "./bottompipe.png";

    requestAnimationFrame(atualizar);
    setInterval(colocarCanos, 1500); // a cada 1.5 segundos
    document.addEventListener("keydown", moverPassaro);
}

function atualizar() {
    requestAnimationFrame(atualizar);
    if (jogoEncerrado) {
        return;
    }
    contexto.clearRect(0, 0, tabuleiro.width, tabuleiro.height);

    // Atualizar posição do pássaro
    velocidadeY += gravidade;
    passaro.y = Math.max(passaro.y + velocidadeY, 0); // Aplicar a gravidade à posição y do pássaro, limitando a posição ao topo do canvas
    contexto.drawImage(imagemPassaro, passaro.x, passaro.y, passaro.largura, passaro.altura);

    if (passaro.y > tabuleiro.height) {
        jogoEncerrado = true;
    }

    // Atualizar posição dos canos
    for (let i = 0; i < arrayCanos.length; i++) {
        let cano = arrayCanos[i];
        cano.x += velocidadeX;
        contexto.drawImage(cano.imagem, cano.x, cano.y, cano.largura, cano.altura);

        if (!cano.passou && passaro.x > cano.x + cano.largura) {
            pontuacao += 0.5; // 0.5 porque há 2 canos! Então, 0.5*2 = 1, 1 para cada conjunto de canos
            cano.passou = true;
        }

        if (detectarColisao(passaro, cano)) {
            jogoEncerrado = true;
        }
    }

    // Remover canos que saíram da tela
    while (arrayCanos.length > 0 && arrayCanos[0].x < -larguraCano) {
        arrayCanos.shift(); // Remove o primeiro elemento do array
    }

    // Desenhar pontuação
    contexto.fillStyle = "white";
    contexto.font = "45px sans-serif";
    contexto.fillText(pontuacao, 5, 45);

    if (jogoEncerrado) {
        contexto.fillText("FIM DE JOGO", 5, 90);
    }
}

function colocarCanos() {
    if (jogoEncerrado) {
        return;
    }

    // (0-1) * alturaCano/2.
    // 0 -> -128 (alturaCano/4)
    // 1 -> -128 - 256 (alturaCano/4 - alturaCano/2) = -3/4 alturaCano
    let posicaoAleatoriaCanoY = posicaoInicialCanoY - alturaCano / 4 - Math.random() * (alturaCano / 2);
    let espacoAberto = tabuleiro.height / 4;

    let canoSuperior = {
        imagem: imagemCanoSuperior,
        x: posicaoInicialCanoX,
        y: posicaoAleatoriaCanoY,
        largura: larguraCano,
        altura: alturaCano,
        passou: false
    }
    arrayCanos.push(canoSuperior);

    let canoInferior = {
        imagem: imagemCanoInferior,
        x: posicaoInicialCanoX,
        y: posicaoAleatoriaCanoY + alturaCano + espacoAberto,
        largura: larguraCano,
        altura: alturaCano,
        passou: false
    }
    arrayCanos.push(canoInferior);
}

function moverPassaro(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        // Salto
        velocidadeY = -6;

        // Reiniciar jogo
        if (jogoEncerrado) {
            passaro.y = posicaoInicialPassaroY;
            arrayCanos = [];
            pontuacao = 0;
            jogoEncerrado = false;
        }
    }
}

function detectarColisao(a, b) {
    return a.x < b.x + b.largura &&   // Canto superior esquerdo de a não alcança o canto superior direito de b
        a.x + a.largura > b.x &&       // Canto superior direito de a ultrapassa o canto superior esquerdo de b
        a.y < b.y + b.altura &&        // Canto superior esquerdo de a não alcança o canto inferior esquerdo de b
        a.y + a.altura > b.y;          // Canto inferior esquerdo de a ultrapassa o canto superior esquerdo de b
}






