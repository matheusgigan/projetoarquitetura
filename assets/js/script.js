let tempo = 0;
let intervalo;
let rotinaAtual = null;

// Alterna entre telas
function mostrarTela(classe) {
    document.querySelectorAll('.tela').forEach(tela => tela.classList.remove('ativa'));
    const telaAtiva = document.querySelector(`.${classe}`);
    if (telaAtiva) {
        telaAtiva.classList.add('ativa');
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
                        await carregarRotinas();
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
const salvarRotinaBtn = document.getElementById('salvarRotinaBtn');
if (salvarRotinaBtn) {
    salvarRotinaBtn.addEventListener('click', async () => {
        const nome = document.getElementById('nomeRotina').value;
        const tempo = parseInt(document.getElementById('tempoRotina').value);
        const usuario_id = localStorage.getItem('usuario_id');

        if (!nome || !tempo || tempo < 1 || !usuario_id) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        try {
            const response = await fetch('/api/rotinas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, tempo, usuario_id }),
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
}

// Listar rotinas
async function carregarRotinas() {
    const seletor = document.getElementById("seletorRotina");
    const progressoElemento = document.getElementById("progresso");
    seletor.innerHTML = "";
    progressoElemento.innerText = "";
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
        rotinas.forEach(rotina => {
            let option = document.createElement("option");
            option.value = rotina.id;
            option.text = `${rotina.nome} - ${rotina.tempo} min (${rotina.progresso}/30)`;
            seletor.appendChild(option);
        });

        seletor.addEventListener("change", () => {
            const rotinaSelecionada = rotinas.find(rotina => rotina.id == seletor.value);
            progressoElemento.innerText = rotinaSelecionada ? `Progresso: ${rotinaSelecionada.progresso}/30` : "";
        });

        if (rotinas.length > 0) {
            progressoElemento.innerText = `Progresso: ${rotinas[0].progresso}/30`;
        }
    } catch (error) {
        console.error('Erro ao carregar rotinas:', error);
        alert('Erro ao carregar rotinas. Tente novamente.');
    }
}

// Iniciar rotina
const iniciarRotinaBtn = document.getElementById('iniciarRotinaBtn');
if (iniciarRotinaBtn) {
    iniciarRotinaBtn.addEventListener('click', async () => {
        const id = document.getElementById('seletorRotina').value;

        if (!id) {
            alert('Selecione uma rotina para iniciar.');
            return;
        }

        try {
            const response = await fetch(`/api/rotinas/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar rotina do servidor.');
            }

            const rotina = await response.json();
            if (rotina) {
                rotinaAtual = rotina;
                document.getElementById('tituloPomodoro').innerText = rotina.nome;
                document.getElementById('contador').innerText = `${rotina.tempo.toString().padStart(2, '0')}:00`;
                mostrarTela('pomodoro');
                document.getElementById('comecarPomodoroBtn').setAttribute('data-tempo', rotina.tempo);
            } else {
                alert('Rotina não encontrada.');
            }
        } catch (error) {
            console.error('Erro ao iniciar rotina:', error);
            alert('Erro ao iniciar rotina. Tente novamente.');
        }
    });
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