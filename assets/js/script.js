document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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
            if (result.success) {
                // Redireciona para a tela principal
                window.location.href = 'TelaPrincipal.html';
            } else {
                alert('Usuário ou senha inválidos!');
            }
        } else {
            alert('Erro ao conectar ao servidor.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao processar o login.');
    }
});