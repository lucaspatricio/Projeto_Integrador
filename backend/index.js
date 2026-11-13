require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const { verifyToken, authorizeRoles, JWT_SECRET } = require('./auth');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// HEALTH
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, mensagem: 'API e banco funcionando' });
  } catch (e) {
    res.status(500).json({ ok: false, erro: e.message });
  }
});

// AUTH - LOGIN REAL
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email e senha são obrigatórios.' });

    const [linhas] = await pool.query(
      'SELECT id, nome, email, senha_hash, role FROM usuarios WHERE email = ? LIMIT 1',
      [email.toLowerCase().trim()]
    );
    if (linhas.length === 0) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const user = linhas[0];
    const senhaOk = await bcrypt.compare(password, user.senha_hash);
    if (!senhaOk) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: { id: user.id, name: user.nome, email: user.email, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const [linhas] = await pool.query(
      'SELECT id, nome, email, role FROM usuarios WHERE id = ? LIMIT 1',
      [req.user.id]
    );
    if (linhas.length === 0) return res.status(401).json({ message: 'Usuário não encontrado.' });
    const u = linhas[0];
    res.json({ user: { id: u.id, name: u.nome, email: u.email, role: u.role } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.post('/api/auth/logout', (req, res) => res.json({ ok: true }));

// ADMIN - protegidas
app.use('/api/admin', verifyToken, authorizeRoles('admin'));

app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const [[alunos]] = await pool.query('SELECT COUNT(*) AS total FROM alunos');
    const [[receita]] = await pool.query("SELECT COALESCE(SUM(valor),0) AS total FROM financeiro WHERE status='pago'");
    const [[checkins]] = await pool.query('SELECT COUNT(*) AS total FROM frequencia WHERE data = CURDATE() AND presente = 1');
    const [[pendentes]] = await pool.query("SELECT COUNT(*) AS qtd, COALESCE(SUM(valor),0) AS valor FROM financeiro WHERE status IN ('pendente','atrasado')");
    const [[atrasados]] = await pool.query("SELECT COUNT(*) AS qtd FROM financeiro WHERE status='atrasado'");
    const [[mesFreq]] = await pool.query(`SELECT COUNT(*) AS total, COUNT(DISTINCT data) AS dias FROM frequencia WHERE MONTH(data)=MONTH(CURDATE()) AND YEAR(data)=YEAR(CURDATE()) AND presente=1`);
    const mediaDiaria = mesFreq.dias > 0 ? Math.round(mesFreq.total / mesFreq.dias) : 0;
    const [recentes] = await pool.query(`SELECT f.id, TIME_FORMAT(f.horario,'%H:%i') AS horario_str, a.nome FROM frequencia f LEFT JOIN alunos a ON a.id=f.aluno_id WHERE f.data=CURDATE() AND f.presente=1 ORDER BY f.horario DESC LIMIT 5`);
    const colors = ['bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-violet-100 text-violet-700','bg-amber-100 text-amber-700','bg-rose-100 text-rose-700'];
    const recentCheckins = recentes.map((r,i) => {
      const nome = r.nome || 'Aluno';
      const initials = nome.split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase();
      return { name: nome, initials: initials||'AL', plan: 'Mensal', time: r.horario_str||'—', color: colors[i%colors.length] };
    });
    res.json({
      metrics: {
        totalAlunos: Number(alunos.total)||0,
        receitaMes: Number(receita.total)||0,
        checkinsHoje: Number(checkins.total)||0,
        mediaDiaria,
        pendentesCount: Number(pendentes.qtd)||0,
        pendentesValor: Number(pendentes.valor)||0,
      },
      recentCheckins,
      alertas: { atrasados: Number(atrasados.qtd)||0 },
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/admin/students', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT * FROM alunos ORDER BY id DESC');
    res.json(linhas.map(a => ({
      id: a.id, name: a.nome, email: a.email || '', plan: a.plano || 'Mensal',
      renewal: a.criado_em ? new Date(a.criado_em).toLocaleDateString('pt-BR') : '-',
      status: 'Ativo',
    })));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/admin/students', async (req, res) => {
  try {
    const { name, email, plan } = req.body || {};
    if (!name || !email) return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
    const matricula = `MAT${Date.now().toString().slice(-6)}`;
    const [result] = await pool.query('INSERT INTO alunos (nome,email,matricula) VALUES (?,?,?)', [name,email,matricula]);
    res.status(201).json({ id: result.insertId, name, email, plan });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/admin/finance', async (req, res) => {
  try {
    const [linhas] = await pool.query(`SELECT f.id,f.valor,f.status,f.vencimento,f.descricao,f.metodo,a.nome AS aluno_nome FROM financeiro f LEFT JOIN alunos a ON a.id=f.aluno_id ORDER BY f.vencimento DESC`);
    const statusMap = { pago: 'Recebido', pendente: 'Pendente', atrasado: 'Atrasado' };
    res.json(linhas.map(f => ({
      id: f.id, name: f.aluno_nome||'Aluno removido', description: f.descricao||'Mensalidade',
      date: f.vencimento ? new Date(f.vencimento).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'}) : '-',
      amount: Number(f.valor), status: statusMap[f.status]||f.status, method: f.metodo||'—',
    })));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.patch('/api/admin/finance/:id/receber', async (req, res) => {
  try {
    const [result] = await pool.query("UPDATE financeiro SET status='pago', metodo=COALESCE(metodo,'Pix') WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Pagamento não encontrado.' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/admin/attendance', async (req, res) => {
  try {
    const [linhas] = await pool.query(`SELECT f.id,DATE_FORMAT(f.data,'%Y-%m-%d') AS data_iso,TIME_FORMAT(f.horario,'%H:%i') AS horario_str,f.presente,a.nome AS aluno_nome FROM frequencia f LEFT JOIN alunos a ON a.id=f.aluno_id ORDER BY f.data DESC,f.horario DESC`);
    const records = linhas.map(f => {
      const iso = f.data_iso||'';
      const [yyyy,mm,dd] = iso.split('-');
      return { id: f.id, name: f.aluno_nome||'Aluno removido', plan: 'Mensal', date: iso, dateLabel: yyyy&&mm&&dd?`${dd}/${mm}/${yyyy}`:'-', time: f.horario_str||'—', status: f.presente?'Presente':'Ausente' };
    });
    const [[m]] = await pool.query(`SELECT SUM(CASE WHEN data=CURDATE() AND presente=1 THEN 1 ELSE 0 END) AS h, SUM(CASE WHEN MONTH(data)=MONTH(CURDATE()) AND YEAR(data)=YEAR(CURDATE()) AND presente=1 THEN 1 ELSE 0 END) AS me, COUNT(DISTINCT CASE WHEN MONTH(data)=MONTH(CURDATE()) AND YEAR(data)=YEAR(CURDATE()) AND presente=1 THEN data END) AS d FROM frequencia`);
    const checkinsHoje = Number(m.h)||0, frequenciaMes = Number(m.me)||0, diasUnicos = Number(m.d)||0;
    res.json({ records, metrics: { checkinsHoje, frequenciaMes, mediaDiaria: diasUnicos>0?Math.round(frequenciaMes/diasUnicos):0 } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/admin/equipment', async (req, res) => {
  try {
    const [linhas] = await pool.query(`SELECT id,nome,categoria,DATE_FORMAT(ultima_revisao,'%d/%m/%Y') AS uf,DATE_FORMAT(proxima_revisao,'%d/%m/%Y') AS pf,status FROM equipamentos ORDER BY id DESC`);
    res.json(linhas.map(e => ({ id: e.id, name: e.nome, category: e.categoria, lastReview: e.uf||'—', nextReview: e.pf||'—', status: e.status })));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/admin/equipment', async (req, res) => {
  try {
    const { name, category, nextReview } = req.body || {};
    if (!name || !category || !nextReview) return res.status(400).json({ message: 'Nome, categoria e data são obrigatórios.' });
    const [r] = await pool.query(`INSERT INTO equipamentos (nome,categoria,proxima_revisao,status) VALUES (?,?,?,'Manutenção pendente')`, [name,category,nextReview]);
    res.status(201).json({ id: r.insertId });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.patch('/api/admin/equipment/:id/concluir', async (req, res) => {
  try {
    const [r] = await pool.query(`UPDATE equipamentos SET status='Disponível', ultima_revisao=CURDATE() WHERE id=?`, [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: 'Equipamento não encontrado.' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/admin/settings', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT chave, valor FROM configuracoes');
    const booleans = new Set(['paymentAlerts','maintenanceAlerts','weeklyReport']);
    const settings = {};
    for (const { chave, valor } of linhas) settings[chave] = booleans.has(chave) ? valor === 'true' : valor;
    res.json(settings);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/admin/settings', async (req, res) => {
  try {
    const entries = Object.entries(req.body || {});
    if (entries.length === 0) return res.status(400).json({ message: 'Nenhuma configuração enviada.' });
    for (const [chave, valor] of entries) {
      await pool.query(`INSERT INTO configuracoes (chave,valor) VALUES (?,?) ON DUPLICATE KEY UPDATE valor=VALUES(valor)`, [chave, String(valor)]);
    }
    res.json({ ok: true, updated: entries.length });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PROFESSOR - protegidas
app.use('/api/professor', verifyToken, authorizeRoles('professor'));

async function getProf(email) {
  if (email) {
    const [l] = await pool.query('SELECT * FROM professores WHERE email = ? LIMIT 1', [email]);
    if (l[0]) return l[0];
  }
  const [l] = await pool.query('SELECT * FROM professores ORDER BY id LIMIT 1');
  return l[0] || null;
}

app.get('/api/professor/dashboard', async (req, res) => {
  try {
    const p = await getProf(req.user.email);
    if (!p) return res.status(404).json({ message: 'Nenhum professor cadastrado.' });
    const [[t]] = await pool.query('SELECT COUNT(*) AS total FROM turmas WHERE professor_id=?', [p.id]);
    const [[a]] = await pool.query('SELECT COUNT(*) AS total FROM alunos a INNER JOIN turmas t ON t.id=a.turma_id WHERE t.professor_id=?', [p.id]);
    const [[f]] = await pool.query(`SELECT COUNT(*) AS total FROM frequencia f INNER JOIN alunos a ON a.id=f.aluno_id INNER JOIN turmas t ON t.id=a.turma_id WHERE t.professor_id=? AND f.data=CURDATE() AND f.presente=1`, [p.id]);
    res.json({
      professor: { nome: p.nome, disciplina: p.disciplina },
      metrics: { aulasHoje: Number(t.total)||0, alunosTurno: Number(a.total)||0, avaliacoesPendentes: 3, horasSemana: 18, checkinsHoje: Number(f.total)||0 },
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/professor/classes', async (req, res) => {
  try {
    const p = await getProf(req.user.email);
    const [t] = await pool.query(`SELECT t.id,t.nome,(SELECT COUNT(*) FROM alunos a WHERE a.turma_id=t.id) AS total_alunos FROM turmas t WHERE t.professor_id=? ORDER BY t.id`, [p.id]);
    const horarios = ['08:00','10:00','14:00','19:00'], status = ['Próxima','Agendada','Agendada','Concluída'];
    res.json({
      description: 'Consulte as aulas que você ministra e acompanhe a participação das turmas.',
      metrics: [['Aulas hoje', String(t.length)], ['Alunos nas turmas', String(t.reduce((s,x)=>s+x.total_alunos,0))], ['Próxima aula', horarios[0]]],
      rows: t.map((x,i) => [x.nome, `${horarios[i%4]} · Sala · ${x.total_alunos} alunos`, status[i%4]]),
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/professor/students', async (req, res) => {
  try {
    const p = await getProf(req.user.email);
    const [a] = await pool.query(`SELECT a.id,a.nome,a.email,t.nome AS turma FROM alunos a INNER JOIN turmas t ON t.id=a.turma_id WHERE t.professor_id=? ORDER BY a.nome`, [p.id]);
    res.json({
      description: 'Consulte os alunos das suas turmas e os acompanhamentos recentes.',
      metrics: [['Alunos nas turmas', String(a.length)], ['Avaliações pendentes','3'], ['Acompanhar','2']],
      rows: a.map(x => [x.nome, `${x.email} · ${x.turma}`, 'Em dia']),
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/professor/attendance', async (req, res) => {
  try {
    const p = await getProf(req.user.email);
    const [l] = await pool.query(`SELECT f.id,DATE_FORMAT(f.data,'%d/%m') AS d,TIME_FORMAT(f.horario,'%H:%i') AS h,f.presente,a.nome FROM frequencia f INNER JOIN alunos a ON a.id=f.aluno_id INNER JOIN turmas t ON t.id=a.turma_id WHERE t.professor_id=? ORDER BY f.data DESC,f.horario DESC LIMIT 10`, [p.id]);
    const [[r]] = await pool.query(`SELECT SUM(CASE WHEN f.data=CURDATE() AND f.presente=1 THEN 1 ELSE 0 END) AS ph,SUM(CASE WHEN f.presente=1 THEN 1 ELSE 0 END) AS tp,COUNT(*) AS tot FROM frequencia f INNER JOIN alunos a ON a.id=f.aluno_id INNER JOIN turmas t ON t.id=a.turma_id WHERE t.professor_id=?`, [p.id]);
    const fm = r.tot > 0 ? Math.round((r.tp/r.tot)*100) : 0;
    res.json({
      description: 'Acompanhe a presença e a frequência das suas turmas.',
      metrics: [['Presenças hoje', String(r.ph||0)], ['Frequência média', `${fm}%`], ['Registros totais', String(r.tot||0)]],
      rows: l.map(f => [f.nome, `${f.d} · ${f.h||'—'}`, f.presente?'Presente':'Ausente']),
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/professor/schedule', async (req, res) => {
  try {
    const p = await getProf(req.user.email);
    const [t] = await pool.query('SELECT id,nome FROM turmas WHERE professor_id=? ORDER BY id', [p.id]);
    const h = ['08:00','10:00','11:30','14:00','19:00'], s = ['Sala de pesos','Sala 2','Sala de avaliação','Sala de pesos','Sala 2'], st = ['Próxima','Agendada','Agendada','Agendada','Agendada'];
    res.json({
      description: 'Visualize seus horários e os próximos compromissos na academia.',
      metrics: [['Compromissos hoje', String(t.length)], ['Horas nesta semana','18h'], ['Próximo horário', h[0]]],
      rows: t.map((x,i) => [h[i%5], `${x.nome} · ${s[i%5]}`, st[i%5]]),
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ALUNO - protegidas
app.use('/api/aluno', verifyToken, authorizeRoles('aluno'));

async function getAluno(email) {
  if (email) {
    const [l] = await pool.query('SELECT * FROM alunos WHERE email = ? LIMIT 1', [email]);
    if (l[0]) return l[0];
  }
  const [l] = await pool.query('SELECT * FROM alunos ORDER BY id LIMIT 1');
  return l[0] || null;
}

app.get('/api/aluno/dashboard', async (req, res) => {
  try {
    const a = await getAluno(req.user.email);
    if (!a) return res.status(404).json({ message: 'Nenhum aluno cadastrado.' });
    const [[f]] = await pool.query(`SELECT SUM(CASE WHEN MONTH(data)=MONTH(CURDATE()) AND YEAR(data)=YEAR(CURDATE()) AND presente=1 THEN 1 ELSE 0 END) AS tm,COUNT(*) AS t,SUM(CASE WHEN presente=1 THEN 1 ELSE 0 END) AS tp FROM frequencia WHERE aluno_id=?`, [a.id]);
    const tm = Number(f.tm)||0, fm = f.t>0?Math.round((f.tp/f.t)*100):0;
    res.json({
      aluno: { nome: a.nome, email: a.email },
      plano: { tipo: a.plano, vencimento: a.plano_vencimento, status: a.plano_status },
      metrics: { treinosMes: tm, metaMensal: 16, progresso: Math.round((tm/16)*100), frequenciaMedia: fm, sequencia: 4 },
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/aluno/workouts', async (req, res) => {
  try {
    const a = await getAluno(req.user.email);
    const [l] = await pool.query(`SELECT nome_treino,exercicio,series,repeticoes FROM treinos WHERE aluno_id=? AND nome_treino='Treino A' ORDER BY id`, [a.id]);
    if (l.length === 0) return res.json({ description: 'Nenhum treino cadastrado.', metrics: [['Treino de hoje','—'],['Exercícios','0'],['Duração','—']], rows: [] });
    res.json({
      description: 'Consulte os exercícios e as orientações do treino preparado para você.',
      metrics: [['Treino de hoje', l[0].nome_treino], ['Exercícios', String(l.length)], ['Duração estimada','50 min']],
      rows: l.map(x => [x.exercicio, `${x.series} séries · ${x.repeticoes} repetições`, x.nome_treino]),
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/aluno/attendance', async (req, res) => {
  try {
    const a = await getAluno(req.user.email);
    const [l] = await pool.query(`SELECT DATE_FORMAT(data,'%d/%m') AS d,TIME_FORMAT(horario,'%H:%i') AS h,presente FROM frequencia WHERE aluno_id=? ORDER BY data DESC LIMIT 15`, [a.id]);
    const [[r]] = await pool.query(`SELECT SUM(CASE WHEN MONTH(data)=MONTH(CURDATE()) AND YEAR(data)=YEAR(CURDATE()) AND presente=1 THEN 1 ELSE 0 END) AS m,SUM(CASE WHEN presente=1 THEN 1 ELSE 0 END) AS tp,COUNT(*) AS t FROM frequencia WHERE aluno_id=?`, [a.id]);
    const f = r.t>0?Math.round((r.tp/r.t)*100):0;
    res.json({
      description: 'Acompanhe seus treinos realizados e seu progresso ao longo do mês.',
      metrics: [['Treinos no mês', String(r.m||0)], ['Meta mensal','16'], ['Frequência', `${f}%`]],
      rows: l.map(x => [x.d, `Check-in às ${x.h||'—'}`, x.presente?'Concluído':'Ausente']),
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/aluno/plan', async (req, res) => {
  try {
    const a = await getAluno(req.user.email);
    const v = a.plano_vencimento ? new Date(a.plano_vencimento).toLocaleDateString('pt-BR') : '—';
    res.json({
      description: 'Confira os detalhes e a validade do seu plano na academia.',
      metrics: [['Plano atual', a.plano||'—'], ['Situação', a.plano_status||'—'], ['Vencimento', v]],
      rows: [[`Plano ${a.plano||'—'}`, 'Acesso à musculação e às aulas', a.plano_status||'—'], ['Próxima renovação', v, 'Agendada'], ['Pagamento', 'Consulte a recepção', 'Informação']],
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/aluno/schedule', async (req, res) => {
  try {
    const a = await getAluno(req.user.email);
    const [l] = await pool.query(`SELECT DISTINCT nome_treino,foco,dia_semana,horario,local FROM treinos WHERE aluno_id=? ORDER BY horario`, [a.id]);
    res.json({
      description: 'Veja seu próximo treino e os horários programados.',
      metrics: [['Próximo treino', l[0]?.nome_treino||'—'], ['Horário', l[0]?.horario?String(l[0].horario).slice(0,5):'—'], ['Local', l[0]?.local||'—']],
      rows: l.map(x => [`${x.dia_semana} · ${String(x.horario||'').slice(0,5)}`, `${x.nome_treino} · ${x.foco}`, 'Agendado']),
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/aluno/checkin', async (req, res) => {
  try {
    const a = await getAluno(req.user.email);
    if (!a) return res.status(404).json({ message: 'Aluno não encontrado.' });
    await pool.query(`INSERT INTO frequencia (aluno_id,data,presente,horario) VALUES (?,CURDATE(),TRUE,CURTIME())`, [a.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));