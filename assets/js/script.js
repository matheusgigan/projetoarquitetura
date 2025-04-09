document.addEventListener('DOMContentLoaded', () => {
    // Script para o formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Impede o comportamento padrão do formulário

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            console.log('Dados enviados:', { username, password }); // Log para depuração

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
                        // Redireciona para a tela principal
                        window.location.href = 'TelaPrincipal.html';
                    } else {
                        alert(result.message); // Exibe a mensagem de erro do servidor
                    }
                } else {
                    alert('Erro ao conectar ao servidor.');
                }
            } catch (error) {
                console.error('Erro:', error);
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
                } else {
                    alert(result.message); // Exibe mensagem de erro
                }
            } catch (error) {
                console.error('Erro ao enviar o formulário:', error);
                alert('Erro ao cadastrar. Tente novamente.');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const rotinaForm = document.getElementById('rotinaForm');
    const timerDisplay = document.getElementById('timerDisplay');
    let countdown;

    rotinaForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o comportamento padrão do formulário

        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;

        let totalSeconds = (hours * 3600) + (minutes * 60);

        if (countdown) clearInterval(countdown); // Limpa qualquer contagem anterior

        countdown = setInterval(() => {
            const hrs = Math.floor(totalSeconds / 3600);
            const mins = Math.floor((totalSeconds % 3600) / 60);
            const secs = totalSeconds % 60;

            timerDisplay.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            if (totalSeconds <= 0) {
                clearInterval(countdown);
                alert('Tempo esgotado!');
            }

            totalSeconds--;
        }, 1000);
    });
});