let charts = {}; // Objeto para armazenar os gráficos

// Função para calcular montantes
function calcularMontante(capital, taxa, meses, partes, aporte = 0) {
    const montantes = [];
    const intervalos = [];
    const passo = meses / partes;

    for (let t = 0; t <= meses; t += passo) {
        const montante = capital * Math.pow((1 + taxa / 100), t) +
            (aporte > 0 ? aporte * ((Math.pow((1 + taxa / 100), t) - 1) / (taxa / 100)) : 0);
        montantes.push(montante.toFixed(2));
        intervalos.push(`${t.toFixed(0)}m`);
    }

    return { montantes, intervalos };
}

// Função genérica para inicializar um gráfico
function inicializarGrafico(canvasId, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Taxa de Aplicação', data: [], borderColor: 'blue', fill: false },
                { label: 'Taxa do IPCA', data: [], borderColor: 'red', fill: false },
                { label: 'Diferença (Aplicação - IPCA)', data: [], borderColor: 'green', fill: false, borderDash: [5, 5] }
            ]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: title } },
            scales: {
                x: { title: { display: true, text: 'Tempo (meses)' } },
                y: { title: { display: true, text: 'Montante (R$)' }, beginAtZero: true }
            }
        }
    });
}

// Função para atualizar os dados de um gráfico
function atualizarGrafico(canvasId, capital, aporte, taxaAplicacao, taxaIPCA, meses) {
    const partes = 10; // Divisão em 10 partes para o gráfico

    const resultadoAplicacao = calcularMontante(capital, taxaAplicacao, meses, partes, aporte);
    const resultadoIPCA = calcularMontante(capital, taxaIPCA, meses, partes, aporte);

    const diferencas = resultadoAplicacao.montantes.map((valor, index) =>
        (valor - resultadoIPCA.montantes[index]).toFixed(2)
    );

    const chart = charts[canvasId];
    chart.data.labels = resultadoAplicacao.intervalos;
    chart.data.datasets[0].data = resultadoAplicacao.montantes;
    chart.data.datasets[1].data = resultadoIPCA.montantes;
    chart.data.datasets[2].data = diferencas;

    chart.update();
}

// Funções específicas para cada gráfico
function atualizarGraficoInicial() {
    const capital = parseFloat(document.getElementById('capital').value);
    const meses = parseInt(document.getElementById('tempo').value);
    const taxaAplicacao = parseFloat(document.getElementById('taxa').value);
    const taxaIPCA = parseFloat(document.getElementById('ipca').value);

    atualizarGrafico('grafico1', capital, 0, taxaAplicacao, taxaIPCA, meses);
}

function atualizarGraficoAporte() {
    const capital = parseFloat(document.getElementById('capitalAporte').value);
    const aporte = parseFloat(document.getElementById('aporte').value);
    const meses = parseInt(document.getElementById('tempoAporte').value);
    const taxaAplicacao = parseFloat(document.getElementById('taxaAporte').value);
    const taxaIPCA = parseFloat(document.getElementById('ipcaAporte').value);

    atualizarGrafico('graficoAporte', capital, aporte, taxaAplicacao, taxaIPCA, meses);
}

// Inicializa os gráficos ao carregar a página
window.onload = () => {
    inicializarGrafico('grafico1', 'Evolução do Montante - Juros Compostos');
    inicializarGrafico('graficoAporte', 'Evolução do Montante com Aportes e Diferenças');
};


function calcularTempos() {
    const velocidade = parseFloat(document.getElementById("velocidade").value); // Velocidade de processamento
    const volume = parseFloat(document.getElementById("volume").value); // Volume em megabytes

    // Converte o volume em MB para número de elementos (1 MB = 125.000 números, considerando 8 bytes por número)
    const numElementos = volume * 125000;

    // Funções para calcular o tempo em segundos para cada método
    function bubbleSort(n) {
        return (n ** 2) / velocidade;
    }
    function mergeSort(n) {
        return (n * Math.log2(n)) / velocidade;
    }
    function quickSort(n) {
        return (n * Math.log2(n)) / velocidade;
    }

    // Divide o volume de dados em 20 partes
    const partes = 20;
    const tamanhos = Array.from({ length: partes }, (_, i) => Math.ceil((i + 1) * numElementos / partes));

    const temposBubble = tamanhos.map(bubbleSort);
    const temposMerge = tamanhos.map(mergeSort);
    const temposQuick = tamanhos.map(quickSort);

    // Exibe o gráfico
    const ctx = document.getElementById("grafico3").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: tamanhos.map(size => `${(size / 125000).toFixed(2)} MB`),
            datasets: [
                {
                    label: "Bubble Sort",
                    data: temposBubble,
                    borderColor: "red",
                    fill: false,
                },
                {
                    label: "Merge Sort",
                    data: temposMerge,
                    borderColor: "blue",
                    fill: false,
                },
                {
                    label: "Quick Sort",
                    data: temposQuick,
                    borderColor: "green",
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Tempos de Ordenação por Método"
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Volume de Dados (em MB)"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Tempo (em segundos)"
                    },
                    beginAtZero: true
                }
            }
        }
    });
}