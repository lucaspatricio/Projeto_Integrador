require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ============ HEALTH ============
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, mensagem: 'API e banco funcionando' });
  } catch (e) {
    res.status(500).json({ ok: false, erro: e.message });
  }
});

// ============ AUTH (mock temporário) ============
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }
  const lower = email.toLowerCase();
  let role = 'aluno';
  if (lower.includes('admin')) role = 'admin';
  else if (lower.includes('prof')) role = 'professor';

  res.json({
    user: { id: '1', name: email.split('@')[0], email, role },
  });
});

app.get('/api/auth/me', (req, res) => {
  res.status(401).json({ message: 'Não autenticado' });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ ok: true });
});

// ============ ADMIN: ALUNOS ============
app.get('/api/admin/students', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT * FROM alunos ORDER BY id DESC');
    const students = linhas.map((a) => ({
      id: a.id,
      name: a.nome,
      email: a.email || '',
      plan: 'Mensal',
      renewal: a.criado_em
        ? new Date(a.criado_em).toLocaleDateString('pt-BR')
        : '-',
      status: 'Ativo',
    }));
    res.json(students);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.post('/api/admin/students', async (req, res) => {
  try {
    const { name, email, plan } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
    }
    const matricula = `MAT${Date.now().toString().slice(-6)}`;
    const [result] = await pool.query(
      'INSERT INTO alunos (nome, email, matricula) VALUES (?, ?, ?)',
      [name, email, matricula]
    );
    res.status(201).json({ id: result.insertId, name, email, plan });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ============ ADMIN: STUBS (a gente ajusta depois) ============
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const [[{ totalAlunos }]] = await pool.query('SELECT COUNT(*) AS totalAlunos FROM alunos');
    res.json({ totalAlunos, receita: 0, inadimplentes: 0 });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get('/api/admin/finance', (req, res) => res.json([]));
app.get('/api/admin/attendance', (req, res) => res.json([]));
app.get('/api/admin/equipment', (req, res) => res.json([]));
app.get('/api/admin/settings', (req, res) => res.json({}));
app.put('/api/admin/settings', (req, res) => res.json({ ok: true }));

// ============ ROTAS ANTIGAS (mantidas) ============
app.get('/api/alunos', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT * FROM alunos');
    res.json(linhas);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

app.get('/api/professores', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT * FROM professores');
    res.json(linhas);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});