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


function metodoBissecao(funcao, inicio, fim, tolerancia, maxIteracoes) {
    let a = inicio;
    let b = fim;
    const tabela = [];

    for (let i = 0; i < maxIteracoes; i++) {
        const c = (a + b) / 2;
        const fc = funcao(c);

        tabela.push({
            iteracao: i + 1,
            inicio: a,
            fim: b,
            medio: c,
            ymédio: fc,
            yfinal: funcao(b),
            tolerância: Math.abs(b - a)
        });

        // Verifica a convergência
        if (Math.abs(fc) < tolerancia || Math.abs(b - a) < tolerancia) {
            document.getElementById("resultadoRaiz").textContent = `Raiz Estimada: ${c.toFixed(6)}`;
            document.getElementById("resultadoTolerancia").textContent = `Tolerância Alcançada: ${Math.abs(fc).toFixed(6)}`;
            break;
        }

        // Atualiza o intervalo
        if (funcao(a) * fc < 0) {
            b = c;
        } else {
            a = c;
        }
    }

    // Atualiza a tabela de iterações
    const tabelaBissecao = document.getElementById("tabelaBissecao").getElementsByTagName("tbody")[0];
    tabelaBissecao.innerHTML = ""; // Limpa a tabela antes de atualizar
    tabela.forEach((linha) => {
        const row = tabelaBissecao.insertRow();
        Object.values(linha).forEach((valor) => {
            const cell = row.insertCell();
            cell.textContent = valor.toFixed(6);
        });
    });

    // Plota o gráfico da função no intervalo
    const ctx = document.getElementById("graficoBissecao").getContext("2d");
    const pontosX = [];
    const pontosY = [];
    const passos = 100;
    const incremento = (fim - inicio) / passos;
    for (let x = inicio; x <= fim; x += incremento) {
        pontosX.push(x.toFixed(6));
        pontosY.push(funcao(x).toFixed(6));
    }

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
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                return `Tempo: ${tooltipItem.raw.toFixed(2)}s (Bubble Sort)`;
                            }
                        }
                    }
                },
                {
                    label: "Merge Sort",
                    data: temposMerge,
                    borderColor: "blue",
                    fill: false,
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                return `Tempo: ${tooltipItem.raw.toFixed(2)}s (Merge Sort)`;
                            }
                        }
                    }
                },
                {
                    label: "Quick Sort",
                    data: temposQuick,
                    borderColor: "green",
                    fill: false,
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                return `Tempo: ${tooltipItem.raw.toFixed(2)}s (Quick Sort)`;
                            }
                        }
                    }
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

// Exibe as características dos algoritmos
const descricaoBubbleSort = "Bubble Sort: Comparação de elementos adjacentes e troca, complexidade O(n²).";
const descricaoMergeSort = "Merge Sort: Divide e conquista, divide o array em subarrays e os mescla, complexidade O(n log n).";
const descricaoQuickSort = "Quick Sort: Divide e conquista com escolha de um pivô, particionando o array, complexidade O(n²) no pior caso, mas geralmente O(n log n).";

document.getElementById("descricaoAlgoritmos").innerHTML = `
    <h3>Características dos Algoritmos de Ordenação</h3>
    <p><strong>Bubble Sort:</strong> ${descricaoBubbleSort}</p>
    <p><strong>Merge Sort:</strong> ${descricaoMergeSort}</p>
    <p><strong>Quick Sort:</strong> ${descricaoQuickSort}</p>
`;




function calcularBissecao() {
    // Obtém os valores do formulário
    const inicio = parseFloat(document.getElementById("inicio").value);
    const fim = parseFloat(document.getElementById("fim").value);
    const tolerancia = parseFloat(document.getElementById("tolerancia").value);
    const maxIteracoes = parseInt(document.getElementById("maxIteracoes").value, 10);
    const funcaoInput = document.getElementById("funcao").value;

    // Transforma a string da função em uma função JavaScript
    let funcao;
    try {
        funcao = new Function("x", `return ${funcaoInput};`);
    } catch (e) {
        alert("Erro na função fornecida. Verifique a sintaxe.");
        return;
    }

    // Chama o método da bisseção
    metodoBissecao(funcao, inicio, fim, tolerancia, maxIteracoes);
}

function metodoBissecao(funcao, inicio, fim, tolerancia, maxIteracoes) {
    let a = inicio;
    let b = fim;
    const tabela = [];
    const pontosMedios = []; // Para armazenar os pontos médios

    for (let i = 0; i < maxIteracoes; i++) {
        const c = (a + b) / 2;
        const fc = funcao(c);

        tabela.push({
            iteracao: i + 1,
            inicio: a,
            fim: b,
            medio: c,
            ymédio: fc,
            yfinal: funcao(b),
            tolerância: Math.abs(b - a)
        });

        // Armazena o ponto médio e seu valor
        pontosMedios.push({ x: c, y: fc });

        // Verifica a convergência
        if (Math.abs(fc) < tolerancia || Math.abs(b - a) < tolerancia) {
            document.getElementById("resultadoRaiz").textContent = `Raiz Estimada: ${c.toFixed(6)}`;
            document.getElementById("resultadoTolerancia").textContent = `Tolerância Alcançada: ${Math.abs(fc).toFixed(6)}`;
            break;
        }

        // Atualiza o intervalo
        if (funcao(a) * fc < 0) {
            b = c;
        } else {
            a = c;
        }
    }

    // Atualiza a tabela de iterações
    const tabelaBissecao = document.getElementById("tabelaBissecao").getElementsByTagName("tbody")[0];
    tabelaBissecao.innerHTML = ""; // Limpa a tabela
    tabela.forEach((linha) => {
        const row = tabelaBissecao.insertRow();
        Object.values(linha).forEach((valor) => {
            const cell = row.insertCell();
            cell.textContent = valor.toFixed(6);
        });
    });

    // Plota o gráfico da função no intervalo
    const ctx = document.getElementById("graficoBissecao").getContext("2d");
    const pontosX = [];
    const pontosY = [];
    const passos = 100;
    const incremento = (fim - inicio) / passos;

    for (let x = inicio; x <= fim; x += incremento) {
        pontosX.push(x.toFixed(6));
        pontosY.push(funcao(x).toFixed(6));
    }

    new Chart(ctx, {
        type: "line",
        data: {
            labels: pontosX,
            datasets: [{
                label: "Função",
                data: pontosY,
                borderColor: "blue",
                fill: false,
            }, {
                label: "Pontos Médios",
                data: pontosMedios.map(p => p.y.toFixed(6)),
                borderColor: "red",
                pointStyle: 'circle',
                pointRadius: 5,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Gráfico da Função no Intervalo"
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "x"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "f(x)"
                    }
                }
            }
        }
    });
}
