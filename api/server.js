const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname, '../pages')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'projeto_db'
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

// Rota para criar uma nova rotina
app.post('/api/rotinas', (req, res) => {
    const { nome, tipo, descricao, tempo, pausa, repeticoes, usuario_id } = req.body;

    if (!nome || !tipo || !tempo || !pausa || !repeticoes || !usuario_id) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos obrigatórios.' });
    }

    const query = `
        INSERT INTO rotinas (nome, tipo, descricao, tempo, pausa, repeticoes, usuario_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [nome, tipo, descricao, tempo, pausa, repeticoes, usuario_id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Erro ao criar rotina:', err);
            return res.status(500).json({ success: false, message: 'Erro ao criar rotina.' });
        }
        res.json({ success: true, message: 'Rotina criada com sucesso!' });
    });
});

// Rota para listar rotinas
app.get('/api/rotinas', (req, res) => {
    const { usuario_id } = req.query;

    if (!usuario_id) {
        return res.status(400).json({ success: false, message: 'Usuário não autenticado.' });
    }

    const query = `
        SELECT id, nome, tipo, descricao, tempo, pausa, repeticoes, progresso
        FROM rotinas
        WHERE usuario_id = ?
    `;

    db.query(query, [usuario_id], (err, rows) => {
        if (err) {
            console.error('Erro ao listar rotinas:', err);
            return res.status(500).json({ success: false, message: 'Erro ao listar rotinas.' });
        }

        res.json(rows); // Envie apenas as rotinas do usuário autenticado
    });
});

// Rota para buscar uma rotina específica
// Rota para buscar uma rotina específica
app.get('/api/rotinas/:id', (req, res) => {
    const { id } = req.params;

    console.log('ID recebido para buscar rotina:', id); // Log para depuração

    const query = `
        SELECT id, nome, tipo, descricao, tempo, pausa, repeticoes, progresso
        FROM rotinas
        WHERE id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar rotina:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar rotina.' });
        }

        console.log('Resultados da consulta:', results); // Log para depuração

        if (results.length === 0) {
            console.log('Nenhuma rotina encontrada com o ID:', id); // Log adicional
            return res.status(404).json({ success: false, message: 'Rotina não encontrada.' });
        }

        res.json(results[0]); // Retorna a rotina encontrada
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