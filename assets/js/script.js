    let tempo = 0;
    let intervalo; // Variável global para controlar o temporizador
    let rotinaAtual = null;
   
   // Função para alternar entre telas
    function mostrarTela(classe) {
        console.log(`Tentando ativar a tela: ${classe}`); // Log para depuração

        // Esconde todas as telas
        document.querySelectorAll('.tela').forEach(tela => tela.classList.remove('ativa'));

        // Mostra a tela com a classe especificada
        const telaAtiva = document.querySelector(`.${classe}`);
        if (telaAtiva) {
            telaAtiva.classList.add('ativa');
            console.log(`Tela "${classe}" ativada.`); // Log para depuração
        } else {
            console.error(`Tela com a classe "${classe}" não encontrada.`);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async function (event) {
                event.preventDefault(); // Impede o comportamento padrão do formulário
    
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
    
                console.log('Dados enviados para o servidor:', { username, password }); // Log para depuração
    
                try {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password }),
                    });
    
                    if (response.ok) {
                        const result = await response.json();
                        console.log('Resposta do servidor:', result); // Log para depuração
                        if (result.success) {
                            localStorage.setItem('usuario_id', result.usuario_id); // Armazena o ID do usuário
                            alert(result.message); // Exibe mensagem de sucesso
                            mostrarTela('telaPrincipal'); // Mostra a tela principal
                            await carregarRotinas(); // Carrega as rotinas do usuário
                        } else {
                            alert(result.message); // Exibe a mensagem de erro do servidor
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
    // Script para o formulário de cadastro
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const formData = new FormData(cadastroForm);
            const data = Object.fromEntries(formData.entries());

            console.log('Dados enviados para o servidor:', data); // Log para depuração

            try {
                const response = await fetch('/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                console.log('Resposta do servidor:', result); // Log para depuração

                if (result.success) {
                    alert(result.message); // Exibe mensagem de sucesso
                    mostrarTela('telaLogin'); // Mostra a tela de login
                } else {
                    alert(result.message); // Exibe mensagem de erro
                }
            } catch (error) {
                console.error('Erro ao enviar o formulário:', error);
                alert('Erro ao cadastrar. Tente novamente.');
            }
        });
    }

    // Função para salvar uma nova rotina
    const salvarRotinaBtn = document.getElementById('salvarRotinaBtn');
    if (salvarRotinaBtn) {
        salvarRotinaBtn.addEventListener('click', async () => {
            const nome = document.getElementById('nomeRotina').value;
            const tempo = parseInt(document.getElementById('tempoRotina').value);
            const usuario_id = localStorage.getItem('usuario_id'); // Obtém o ID do usuário autenticado

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
                console.log('Resposta do servidor:', result); // Log para depuração

                if (result.success) {
                    alert("Rotina salva com sucesso!");
                    mostrarTela('telaPrincipal');
                    await carregarRotinas(); // Atualiza a lista de rotinas
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Erro ao salvar rotina:', error);
                alert('Erro ao salvar rotina. Tente novamente.');
            }
        });
    }

    // Função para carregar rotinas
    async function carregarRotinas() {
        const seletor = document.getElementById("seletorRotina");
        const progressoElemento = document.getElementById("progresso");
        seletor.innerHTML = "";
        progressoElemento.innerText = ""; // Limpa o progresso anterior
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
    
            // Atualiza o progresso da rotina selecionada
            seletor.addEventListener("change", () => {
                const rotinaSelecionada = rotinas.find(rotina => rotina.id == seletor.value);
                if (rotinaSelecionada) {
                    progressoElemento.innerText = `Progresso: ${rotinaSelecionada.progresso}/30`;
                } else {
                    progressoElemento.innerText = "";
                }
            });
    
            // Atualiza o progresso da primeira rotina por padrão
            if (rotinas.length > 0) {
                progressoElemento.innerText = `Progresso: ${rotinas[0].progresso}/30`;
            }
        } catch (error) {
            console.error('Erro ao carregar rotinas:', error);
            alert('Erro ao carregar rotinas. Tente novamente.');
        }
    }
    // Função para iniciar uma rotina
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
                    rotinaAtual = rotina; // Inicializa a variável global com os dados da rotina
                    document.getElementById('tituloPomodoro').innerText = rotina.nome;
                    document.getElementById('contador').innerText = `${rotina.tempo.toString().padStart(2, '0')}:00`; // Exibe o tempo inicial
                    mostrarTela('pomodoro'); // Mostra a tela de Pomodoro
    
                    // Armazena o tempo da rotina para ser usado ao clicar no botão "Começar"
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
    async function comecarPomodoro() {
        const contador = document.getElementById('contador');
        const tempoRotina = parseInt(document.getElementById('comecarPomodoroBtn').getAttribute('data-tempo'));
    
        if (isNaN(tempoRotina) || tempoRotina <= 0) {
            alert('Tempo inválido para iniciar o Pomodoro.');
            return;
        }
    
        tempo = tempoRotina * 60; // Converte minutos para segundos
    
        clearInterval(intervalo); // Garante que nenhum temporizador anterior esteja rodando
        intervalo = setInterval(async () => {
            if (tempo > 0) {
                tempo--;
                atualizarTimer();
            } else {
                clearInterval(intervalo);
                alert("Pomodoro concluído!");
    
                // Atualiza o progresso no backend
                try {
                    if (!rotinaAtual || !rotinaAtual.id) {
                        throw new Error('Rotina atual não está definida.');
                    }
    
                    const response = await fetch(`/api/rotinas/${rotinaAtual.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ progresso: 1 }), // Incrementa o progresso em 1
                    });
    
                    if (!response.ok) {
                        throw new Error('Erro ao atualizar o progresso da rotina.');
                    }
    
                    const result = await response.json();
                    console.log('Progresso atualizado:', result);
    
                    // Retorna para a tela "Minhas Rotinas"
                    mostrarTela('telaPrincipal');
                    await carregarRotinas(); // Atualiza a lista de rotinas com o progresso atualizado
                } catch (error) {
                    console.error('Erro ao atualizar o progresso da rotina:', error);
                    alert("Erro ao atualizar o progresso da rotina.");
                }
            }
        }, 1000); // Atualiza a cada segundo
    }

    function atualizarProgresso() {
        const progresso = document.getElementById('progresso');
        progresso.innerText = "Progresso atualizado!";
    }

    function atualizarTimer() {
        const minutos = String(Math.floor(tempo / 60)).padStart(2, '0');
        const segundos = String(tempo % 60).padStart(2, '0');
        document.getElementById('contador').textContent = `${minutos}:${segundos}`;
    }