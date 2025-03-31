const express = require('express');
const path = require('path');
const mysql = require('mysql2'); // Adicionado: Importação do módulo mysql

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

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'projeto_db'
});

const users = [
    { username: 'admin', password: '1234' },
    { username: 'user', password: 'password' },
];

db.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao MySQL:', err);
      return;
    }
    console.log('Conectado ao MySQL!');
  });
  

// Rota para login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Dados recebidos no login:', req.body); // Log para depuração

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).json({ success: false, message: 'Erro no servidor. Tente novamente mais tarde.' });
        }

        if (results.length > 0) {
            res.json({ success: true, message: 'Login realizado com sucesso!' });
        } else {
            res.json({ success: false, message: 'Usuário ou senha inválidos!' });
        }
    });
});

// Rota do cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/TelaCadastro.html'));
});

app.get('/CriarRotina', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/CriarRotina.html'));
});

app.get('/MinhasRotinas', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/MinhasRotinas.html'));
});

// Cadastro de usuário
app.post('/cadastro', (req, res) => {
    console.log('Dados recebidos no cadastro:', req.body); // Log para depuração

    const { username, email, password } = req.body;
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err); // Log do erro
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar. Tente novamente.' });
        }
        console.log('Usuário cadastrado com sucesso:', result); // Log do sucesso
        res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});