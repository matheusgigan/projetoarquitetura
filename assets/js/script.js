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
    // Script para o formulário de login
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
                        alert(result.message); // Exibe mensagem de sucesso
                        mostrarTela('telaPrincipal'); // Mostra a tela principal
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
    
            if (!nome || !tempo || tempo < 1) {
                alert("Preencha nome e tempo válidos.");
                return;
            }
    
            try {
                const response = await fetch('/api/rotinas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, tempo }),
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
        const seletor = document.getElementById('seletorRotina');
        seletor.innerHTML = ""; // Limpa o seletor antes de adicionar novas opções
    
        try {
            const response = await fetch('/api/rotinas');
            const rotinas = await response.json();
    
            rotinas.forEach(rotina => {
                let option = document.createElement('option');
                option.value = rotina.id;
                option.text = `${rotina.nome} - ${rotina.tempo} min (${rotina.progresso}/30)`;
                seletor.appendChild(option);
            });
    
            atualizarProgresso(); // Atualiza o progresso da rotina selecionada
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

            try {
                const response = await fetch(`/api/rotinas/${id}`);
                const rotina = await response.json();

                if (rotina) {
                    document.getElementById('tituloPomodoro').innerText = rotina.nome;
                    mostrarTela('pomodoro');
                } else {
                    alert('Rotina não encontrada.');
                }
            } catch (error) {
                console.error('Erro ao iniciar rotina:', error);
                alert('Erro ao iniciar rotina. Tente novamente.');
            }
        });
    }
});