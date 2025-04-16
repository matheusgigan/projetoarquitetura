const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../pages')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111', // Substitua pela sua senha do MySQL
    database: 'projeto_db' // Substitua pelo nome correto do banco de dados
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/telateste.html'));
});

// Rota para login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).json({ success: false, message: 'Erro no servidor. Tente novamente mais tarde.' });
        }

        if (results.length > 0) {
            const usuario_id = results[0].id; // Obtém o ID do usuário autenticado
            res.json({ success: true, message: 'Login realizado com sucesso!', usuario_id });
        } else {
            res.json({ success: false, message: 'Usuário ou senha inválidos!' });
        }
    });
});

// Rota para cadastro
app.post('/cadastro', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err);
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar. Tente novamente.' });
        }
        res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
    });
});

// Rota para salvar uma nova rotina
app.post('/api/rotinas', (req, res) => {
    const { nome, tempo, usuario_id } = req.body;

    if (!nome || !tempo || !usuario_id) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    const sql = 'INSERT INTO rotinas (usuario_id, nome, tempo, progresso) VALUES (?, ?, ?, 0)';
    db.query(sql, [usuario_id, nome, tempo], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err);
            return res.status(500).json({ success: false, message: 'Erro ao salvar rotina. Tente novamente.' });
        }
        res.json({ success: true, message: 'Rotina salva com sucesso!' });
    });
});

// Rota para listar todas as rotinas
app.get('/api/rotinas', (req, res) => {
    const usuario_id = req.query.usuario_id; // Obtém o ID do usuário da query string

    if (!usuario_id) {
        return res.status(400).json({ success: false, message: 'Usuário não especificado.' });
    }

    const sql = 'SELECT * FROM rotinas WHERE usuario_id = ?';
    db.query(sql, [usuario_id], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).json({ success: false, message: 'Erro ao carregar rotinas.' });
        }
        res.json(results);
    });
});

// Rota para buscar uma rotina específica
app.get('/api/rotinas/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM rotinas WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar rotina.' });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ success: false, message: 'Rotina não encontrada.' });
        }
    });
});

// Rota para atualizar o progresso de uma rotina
app.put('/api/rotinas/:id', (req, res) => {
    const { id } = req.params;
    const { progresso } = req.body;

    const sql = 'UPDATE rotinas SET progresso = progresso + ? WHERE id = ?';
    db.query(sql, [progresso, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar o banco de dados:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar rotina.' });
        }
        res.json({ success: true, message: 'Progresso atualizado com sucesso!' });
    });
});
// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});