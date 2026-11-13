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
// ============ ADMIN: DASHBOARD ============
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const [[alunos]] = await pool.query('SELECT COUNT(*) AS total FROM alunos');

    const [[receita]] = await pool.query(`
      SELECT COALESCE(SUM(valor), 0) AS total
      FROM financeiro WHERE status = 'pago'
    `);

    const [[checkins]] = await pool.query(`
      SELECT COUNT(*) AS total FROM frequencia
      WHERE data = CURDATE() AND presente = 1
    `);

    const [[pendentes]] = await pool.query(`
      SELECT COUNT(*) AS qtd, COALESCE(SUM(valor), 0) AS valor
      FROM financeiro WHERE status IN ('pendente', 'atrasado')
    `);

    const [[atrasados]] = await pool.query(`
      SELECT COUNT(*) AS qtd FROM financeiro WHERE status = 'atrasado'
    `);

    const [[mesFreq]] = await pool.query(`
      SELECT COUNT(*) AS total, COUNT(DISTINCT data) AS dias
      FROM frequencia
      WHERE MONTH(data) = MONTH(CURDATE()) AND YEAR(data) = YEAR(CURDATE()) AND presente = 1
    `);
    const mediaDiaria = mesFreq.dias > 0 ? Math.round(mesFreq.total / mesFreq.dias) : 0;

    const [recentes] = await pool.query(`
      SELECT f.id, TIME_FORMAT(f.horario, '%H:%i') AS horario_str, a.nome
      FROM frequencia f
      LEFT JOIN alunos a ON a.id = f.aluno_id
      WHERE f.data = CURDATE() AND f.presente = 1
      ORDER BY f.horario DESC
      LIMIT 5
    `);

    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-emerald-100 text-emerald-700',
      'bg-violet-100 text-violet-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
    ];

    const recentCheckins = recentes.map((r, i) => {
      const nome = r.nome || 'Aluno';
      const initials = nome.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
      return {
        name: nome,
        initials: initials || 'AL',
        plan: 'Mensal',
        time: r.horario_str || '—',
        color: colors[i % colors.length],
      };
    });

    res.json({
      metrics: {
        totalAlunos: Number(alunos.total) || 0,
        receitaMes: Number(receita.total) || 0,
        checkinsHoje: Number(checkins.total) || 0,
        mediaDiaria,
        pendentesCount: Number(pendentes.qtd) || 0,
        pendentesValor: Number(pendentes.valor) || 0,
      },
      recentCheckins,
      alertas: {
        atrasados: Number(atrasados.qtd) || 0,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
// ============ ADMIN: FINANCEIRO (de verdade) ============
app.get('/api/admin/finance', async (req, res) => {
  try {
    const [linhas] = await pool.query(`
      SELECT f.id, f.valor, f.status, f.vencimento, f.descricao, f.metodo,
             a.nome AS aluno_nome
      FROM financeiro f
      LEFT JOIN alunos a ON a.id = f.aluno_id
      ORDER BY f.vencimento DESC
    `);

    const statusMap = { pago: 'Recebido', pendente: 'Pendente', atrasado: 'Atrasado' };

    const payments = linhas.map((f) => ({
      id: f.id,
      name: f.aluno_nome || 'Aluno removido',
      description: f.descricao || 'Mensalidade',
      date: f.vencimento
        ? new Date(f.vencimento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        : '-',
      amount: Number(f.valor),
      status: statusMap[f.status] || f.status,
      method: f.metodo || '—',
    }));

    res.json(payments);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.patch('/api/admin/finance/:id/receber', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "UPDATE financeiro SET status = 'pago', metodo = COALESCE(metodo, 'Pix') WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pagamento não encontrado.' });
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
// ============ ADMIN: FREQUÊNCIA (de verdade) ============
app.get('/api/admin/attendance', async (req, res) => {
  try {
    const [linhas] = await pool.query(`
      SELECT f.id,
             DATE_FORMAT(f.data, '%Y-%m-%d') AS data_iso,
             TIME_FORMAT(f.horario, '%H:%i') AS horario_str,
             f.presente,
             a.nome AS aluno_nome
      FROM frequencia f
      LEFT JOIN alunos a ON a.id = f.aluno_id
      ORDER BY f.data DESC, f.horario DESC
    `);

    const records = linhas.map((f) => {
      const iso = f.data_iso || '';
      const [yyyy, mm, dd] = iso.split('-');
      return {
        id: f.id,
        name: f.aluno_nome || 'Aluno removido',
        plan: 'Mensal',
        date: iso,
        dateLabel: yyyy && mm && dd ? `${dd}/${mm}/${yyyy}` : '-',
        time: f.horario_str || '—',
        status: f.presente ? 'Presente' : 'Ausente',
      };
    });

    const [metricas] = await pool.query(`
      SELECT
        SUM(CASE WHEN data = CURDATE() AND presente = 1 THEN 1 ELSE 0 END) AS checkins_hoje,
        SUM(CASE WHEN MONTH(data) = MONTH(CURDATE()) AND YEAR(data) = YEAR(CURDATE()) AND presente = 1 THEN 1 ELSE 0 END) AS frequencia_mes,
        COUNT(DISTINCT CASE WHEN MONTH(data) = MONTH(CURDATE()) AND YEAR(data) = YEAR(CURDATE()) AND presente = 1 THEN data END) AS dias_unicos
      FROM frequencia
    `);

    const m = metricas[0] || {};
    const checkinsHoje = Number(m.checkins_hoje) || 0;
    const frequenciaMes = Number(m.frequencia_mes) || 0;
    const diasUnicos = Number(m.dias_unicos) || 0;
    const mediaDiaria = diasUnicos > 0 ? Math.round(frequenciaMes / diasUnicos) : 0;

    res.json({
      records,
      metrics: { checkinsHoje, frequenciaMes, mediaDiaria },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
// ============ ADMIN: EQUIPAMENTOS ============
app.get('/api/admin/equipment', async (req, res) => {
  try {
    const [linhas] = await pool.query(`
      SELECT id, nome, categoria,
             DATE_FORMAT(ultima_revisao, '%d/%m/%Y') AS ultima_fmt,
             DATE_FORMAT(proxima_revisao, '%d/%m/%Y') AS proxima_fmt,
             status
      FROM equipamentos
      ORDER BY id DESC
    `);

    const list = linhas.map((e) => ({
      id: e.id,
      name: e.nome,
      category: e.categoria,
      lastReview: e.ultima_fmt || '—',
      nextReview: e.proxima_fmt || '—',
      status: e.status,
    }));

    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.post('/api/admin/equipment', async (req, res) => {
  try {
    const { name, category, nextReview } = req.body || {};
    if (!name || !category || !nextReview) {
      return res.status(400).json({ message: 'Nome, categoria e data são obrigatórios.' });
    }
    const [result] = await pool.query(
      `INSERT INTO equipamentos (nome, categoria, proxima_revisao, status)
       VALUES (?, ?, ?, 'Manutenção pendente')`,
      [name, category, nextReview]
    );
    res.status(201).json({ id: result.insertId });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.patch('/api/admin/equipment/:id/concluir', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      `UPDATE equipamentos
       SET status = 'Disponível', ultima_revisao = CURDATE()
       WHERE id = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipamento não encontrado.' });
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
// ============ ADMIN: CONFIGURAÇÕES ============
app.get('/api/admin/settings', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT chave, valor FROM configuracoes');
    const booleans = new Set(['paymentAlerts', 'maintenanceAlerts', 'weeklyReport']);
    const settings = {};
    for (const { chave, valor } of linhas) {
      settings[chave] = booleans.has(chave) ? valor === 'true' : valor;
    }
    res.json(settings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.put('/api/admin/settings', async (req, res) => {
  try {
    const body = req.body || {};
    const entries = Object.entries(body);
    if (entries.length === 0) {
      return res.status(400).json({ message: 'Nenhuma configuração enviada.' });
    }

    for (const [chave, valor] of entries) {
      const valorString = typeof valor === 'boolean' ? String(valor) : String(valor);
      await pool.query(
        `INSERT INTO configuracoes (chave, valor) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE valor = VALUES(valor)`,
        [chave, valorString]
      );
    }

    res.json({ ok: true, updated: entries.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

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