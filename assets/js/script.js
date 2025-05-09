let tempo = 0;
let intervalo;
let rotinaAtual = null;

// Alterna entre telas
function mostrarTela(classe) {
    document.querySelectorAll('.tela').forEach(tela => tela.classList.remove('ativa'));
    const telaAtiva = document.querySelector(`.${classe}`);
    if (telaAtiva) {
        telaAtiva.classList.add('ativa');

        // Verifica se a tela ativa é "Minhas Rotinas" e carrega as rotinas
        if (classe === 'minhasRotinas') {
            carregarRotinas();
        }
    } else {
        console.error(`Tela com a classe "${classe}" não encontrada.`);
    }
}
// Login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        localStorage.setItem('usuario_id', result.usuario_id);
                        alert(result.message);
                        mostrarTela('telaPrincipal');
                    } else {
                        alert(result.message);
                    }
                } else {
                    alert('Erro ao conectar ao servidor.');
                }
            } catch (error) {
                console.error('Erro ao processar o login:', error);
                alert('Erro ao processar o login.');
            }
        });
    }
});

// Cadastro
const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(cadastroForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message);
                mostrarTela('telaLogin');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            alert('Erro ao cadastrar. Tente novamente.');
        }
    });
}

// Criar rotina
salvarRotinaBtn.addEventListener('click', async () => {
    const nome = document.getElementById('nomeRotina').value;
    const tipo = document.getElementById('tipoRotina').value;
    const descricao = document.getElementById('descricaoRotina').value;
    const tempo = parseInt(document.getElementById('tempoRotina').value);
    const pausa = parseInt(document.getElementById('pausaRotina').value);
    const repeticoes = parseInt(document.getElementById('repeticoesRotina').value);
    const usuario_id = localStorage.getItem('usuario_id');

    if (!nome || !tipo || !tempo || !pausa || !repeticoes || tempo < 1 || pausa < 1 || repeticoes < 1 || !usuario_id) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    try {
        const response = await fetch('/api/rotinas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, tipo, descricao, tempo, pausa, repeticoes, usuario_id }),
        });

        const result = await response.json();
        if (result.success) {
            alert("Rotina salva com sucesso!");
            mostrarTela('telaPrincipal');
            await carregarRotinas();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Erro ao salvar rotina:', error);
        alert('Erro ao salvar rotina. Tente novamente.');
    }
});

async function carregarRotinas() {
    const rotinasContainer = document.getElementById("rotinasContainer");
    const siteSearch = document.getElementById("site-search");
    const filtroRotina = document.getElementById("filtroRotina");

    if (!rotinasContainer || !siteSearch || !filtroRotina) {
        console.error("Elementos necessários para carregar rotinas não foram encontrados.");
        return;
    }

    rotinasContainer.innerHTML = ""; // Limpa o contêiner antes de adicionar novas rotinas
    const usuario_id = localStorage.getItem("usuario_id");

    if (!usuario_id) {
        alert("Usuário não autenticado.");
        return;
    }

    try {
        const response = await fetch(`/api/rotinas?usuario_id=${usuario_id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar rotinas do servidor.');
        }

        const rotinas = await response.json();
        if (!Array.isArray(rotinas)) {
            throw new Error('Resposta do servidor não é uma lista de rotinas.');
        }

        // Função para renderizar os cards com base nos filtros
        function renderizarRotinas(filtroNome = "", filtroStatus = "") {
        rotinasContainer.innerHTML = ""; // Limpa o contêiner

        const rotinasFiltradas = rotinas.filter(rotina => {
            const nomeMatch = rotina.nome.toLowerCase().includes(filtroNome.toLowerCase());
            const statusMatch =
                filtroStatus === "" ||
                (filtroStatus === "concluido" && rotina.progresso >= 30) ||
                (filtroStatus === "em-andamento" && rotina.progresso < 30);

            return nomeMatch && statusMatch;
        });

        if (rotinasFiltradas.length === 0) {
            rotinasContainer.innerHTML = "<p>Nenhuma rotina encontrada.</p>";
            return;
        }

        rotinasFiltradas.forEach(rotina => {
            const card = document.createElement("div");
            card.className = "card-rotina";

            card.innerHTML = `
                <h3>${rotina.nome}</h3>
                <p>Tipo: ${rotina.tipo}</p>
                <p>Descrição: ${rotina.descricao}</p>
                <p>Tempo: ${rotina.tempo} min</p>
                <p>Progresso: ${rotina.progresso}/30</p>
                <div class="progress-bar">
                    <div class="progress-bar-inner" style="width: ${(rotina.progresso / 30) * 100}%;"></div>
                </div>
            `;

            // Adiciona o botão de iniciar rotina
            const iniciarBtn = document.createElement("button");
            iniciarBtn.textContent = "Iniciar Rotina";
            iniciarBtn.addEventListener("click", () => iniciarRotina(rotina.id));
            card.appendChild(iniciarBtn);

            rotinasContainer.appendChild(card);
        });
    }

        // Renderiza as rotinas inicialmente
        renderizarRotinas();

        // Adiciona eventos para busca e filtro
        siteSearch.addEventListener("input", () => {
            renderizarRotinas(siteSearch.value, filtroRotina.value);
        });

        filtroRotina.addEventListener("change", () => {
            renderizarRotinas(siteSearch.value, filtroRotina.value);
        });
    } catch (error) {
        console.error('Erro ao carregar rotinas:', error);
        alert('Erro ao carregar rotinas. Tente novamente.');
    }
}

async function iniciarRotina(id) {
    console.log('Iniciando rotina com ID:', id); // Log para depuração

    if (!id) {
        alert('Selecione uma rotina para iniciar.');
        return;
    }

    try {
        const response = await fetch(`/api/rotinas/${id}`);
        console.log('Resposta do servidor:', response); // Log para depuração

        if (!response.ok) {
            throw new Error('Erro ao buscar rotina do servidor.');
        }

        const rotina = await response.json();
        console.log('Rotina recebida:', rotina); // Log para depuração

        if (rotina) {
            document.getElementById('tituloPomodoro').innerText = rotina.nome;
            document.getElementById('contador').innerText = `${rotina.tempo.toString().padStart(2, '0')}:00`;
            document.getElementById('comecarPomodoroBtn').setAttribute('data-tempo', rotina.tempo);
            mostrarTela('pomodoro');
        } else {
            alert('Rotina não encontrada.');
        }
    } catch (error) {
        console.error('Erro ao iniciar rotina:', error);
        alert('Erro ao iniciar rotina. Tente novamente.');
    }
}
// Pomodoro e registrar progresso
async function comecarPomodoro() {
    const contador = document.getElementById('contador');
    const tempoRotina = parseInt(document.getElementById('comecarPomodoroBtn').getAttribute('data-tempo'));

    if (isNaN(tempoRotina) || tempoRotina <= 0) {
        alert('Tempo inválido para iniciar o Pomodoro.');
        return;
    }

    tempo = tempoRotina * 60;

    clearInterval(intervalo);
    intervalo = setInterval(async () => {
        if (tempo > 0) {
            tempo--;
            atualizarTimer();
        } else {
            clearInterval(intervalo);
            alert("Pomodoro concluído!");

            try {
                if (!rotinaAtual || !rotinaAtual.id) {
                    throw new Error('Rotina atual não está definida.');
                }

                const response = await fetch(`/api/rotinas/${rotinaAtual.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ progresso: 1 }),
                });

                if (!response.ok) {
                    throw new Error('Erro ao atualizar o progresso da rotina.');
                }

                const result = await response.json();
                mostrarTela('telaPrincipal');
                await carregarRotinas();
            } catch (error) {
                console.error('Erro ao atualizar o progresso da rotina:', error);
                alert("Erro ao atualizar o progresso da rotina.");
            }
        }
    }, 1000);
}

function atualizarTimer() {
    const minutos = String(Math.floor(tempo / 60)).padStart(2, '0');
    const segundos = String(tempo % 60).padStart(2, '0');
    document.getElementById('contador').textContent = `${minutos}:${segundos}`;
}