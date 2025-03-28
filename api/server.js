const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../pages')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use(express.json());

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/TelaLogin.html'));
});

// Simulação de banco de dados
const users = [
    { username: 'admin', password: '1234' },
    { username: 'user', password: 'password' },
];

// Rota para login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Dados recebidos:', req.body); // Log para depuração

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true }); // Retorna sucesso
    } else {
        res.json({ success: false }); // Retorna falha
    }
});

// Rota do cadastro

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/TelaCadastro.html'));
}
);

app.get('/CriarRotina', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/CriarRotina.html'));
  });

app.get('/MinhasRotinas', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/MinhasRotinas.html'));
});
  
  

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});