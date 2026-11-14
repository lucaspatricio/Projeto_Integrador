-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 14/11/2026 às 17:17
-- Versão do servidor: 10.11.16-MariaDB
-- Versão do PHP: 8.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `projeto_integrador`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `alunos`
--

CREATE TABLE `alunos` (
  `id` int(11) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `matricula` varchar(30) DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  `turma_id` int(11) DEFAULT NULL,
  `plano` varchar(30) DEFAULT 'Mensal',
  `plano_vencimento` date DEFAULT NULL,
  `plano_status` varchar(20) DEFAULT 'Ativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `alunos`
--

INSERT INTO `alunos` (`id`, `nome`, `email`, `matricula`, `criado_em`, `turma_id`, `plano`, `plano_vencimento`, `plano_status`) VALUES
(1, 'Aluno Teste', 'teste@exemplo.com', 'MAT001', '2026-11-13 01:28:59', 1, 'Anual', '2027-03-15', 'Ativo'),
(2, 'Lucas Ramalho Patricio', '24208786@aluno.univesp.br', 'MAT499134', '2026-11-13 02:21:39', 3, 'Mensal', NULL, 'Ativo'),
(3, 'Teste do Banco', 'bancoteste@exemplo.com', 'MATBANCO1', '2026-11-13 02:24:49', 3, 'Mensal', NULL, 'Ativo'),
(4, 'Lucas Teste', 'lucas@teste.com', NULL, '2026-11-13 03:31:59', NULL, 'Mensal', NULL, 'Ativo'),
(5, 'Aluno Novo', 'novo@teste.com', 'MAT099', '2026-11-13 05:07:34', 1, 'Mensal', NULL, 'Ativo');

-- --------------------------------------------------------

--
-- Estrutura para tabela `configuracoes`
--

CREATE TABLE `configuracoes` (
  `chave` varchar(60) NOT NULL,
  `valor` text DEFAULT NULL,
  `atualizado_em` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `configuracoes`
--

INSERT INTO `configuracoes` (`chave`, `valor`, `atualizado_em`) VALUES
('address', 'Av. dos Autonomistas, 1234 — Osasco, SP', '2026-11-13 03:45:15'),
('email', 'contato@gestaofit.com.br', '2026-11-13 03:45:15'),
('maintenanceAlerts', 'true', '2026-11-13 03:45:15'),
('name', 'Nossa Academia', '2026-11-13 04:04:19'),
('paymentAlerts', 'true', '2026-11-13 03:45:15'),
('phone', '(11) 3456-7890', '2026-11-13 03:45:15'),
('weeklyReport', 'false', '2026-11-13 03:45:15');

-- --------------------------------------------------------

--
-- Estrutura para tabela `equipamentos`
--

CREATE TABLE `equipamentos` (
  `id` int(11) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `ultima_revisao` date DEFAULT NULL,
  `proxima_revisao` date DEFAULT NULL,
  `status` enum('Disponível','Agendada','Manutenção pendente') DEFAULT 'Disponível',
  `criado_em` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `equipamentos`
--

INSERT INTO `equipamentos` (`id`, `nome`, `categoria`, `ultima_revisao`, `proxima_revisao`, `status`, `criado_em`) VALUES
(1, 'Esteira 03', 'Cardio', '2026-11-13', '2026-10-08', 'Disponível', '2026-11-13 03:34:38'),
(2, 'Bicicleta 02', 'Cardio', '2026-10-01', '2026-11-01', 'Disponível', '2026-11-13 03:34:38'),
(3, 'Leg press', 'Musculação', '2026-09-18', '2026-10-18', 'Agendada', '2026-11-13 03:34:38'),
(4, 'Esteira 01', 'Cardio', '2026-09-25', '2026-10-25', 'Disponível', '2026-11-13 03:34:38');

-- --------------------------------------------------------

--
-- Estrutura para tabela `financeiro`
--

CREATE TABLE `financeiro` (
  `id` int(11) NOT NULL,
  `aluno_id` int(11) DEFAULT NULL,
  `valor` decimal(10,2) NOT NULL,
  `status` enum('pago','pendente','atrasado') DEFAULT 'pendente',
  `vencimento` date DEFAULT NULL,
  `descricao` varchar(120) DEFAULT 'Mensalidade',
  `metodo` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `financeiro`
--

INSERT INTO `financeiro` (`id`, `aluno_id`, `valor`, `status`, `vencimento`, `descricao`, `metodo`) VALUES
(1, 1, 150.00, 'pago', '2026-10-04', 'Mensalidade · Plano anual', 'Cartão'),
(2, 1, 120.00, 'pago', '2026-10-04', 'Mensalidade · Plano mensal', 'Pix'),
(3, 1, 180.00, 'pago', '2026-10-03', 'Mensalidade · Plano trimestral', 'Pix'),
(4, 1, 120.00, 'pago', '2026-10-02', 'Mensalidade · Plano mensal', 'Pix'),
(5, 1, 890.00, 'pago', '2026-10-01', 'Renovação · Plano anual', 'Pix');

-- --------------------------------------------------------

--
-- Estrutura para tabela `frequencia`
--

CREATE TABLE `frequencia` (
  `id` int(11) NOT NULL,
  `aluno_id` int(11) DEFAULT NULL,
  `data` date NOT NULL,
  `presente` tinyint(1) DEFAULT 1,
  `horario` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `frequencia`
--

INSERT INTO `frequencia` (`id`, `aluno_id`, `data`, `presente`, `horario`) VALUES
(1, 1, '2026-11-13', 1, '08:42:00'),
(2, 1, '2026-11-13', 1, '08:35:00'),
(3, 1, '2026-11-13', 1, '08:21:00'),
(4, 1, '2026-11-13', 1, '08:04:00'),
(5, 1, '2026-11-12', 1, '18:12:00'),
(6, 1, '2026-11-12', 0, NULL),
(7, 1, '2026-11-13', 1, '10:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `professores`
--

CREATE TABLE `professores` (
  `id` int(11) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `disciplina` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `professores`
--

INSERT INTO `professores` (`id`, `nome`, `email`, `disciplina`) VALUES
(1, 'Prof. Carlos Silva', 'carlos@gestaofit.com', 'Musculação'),
(2, 'Profa. Ana Costa', 'ana@gestaofit.com', 'Funcional');

-- --------------------------------------------------------

--
-- Estrutura para tabela `treinos`
--

CREATE TABLE `treinos` (
  `id` int(11) NOT NULL,
  `aluno_id` int(11) NOT NULL,
  `nome_treino` varchar(60) NOT NULL,
  `foco` varchar(60) DEFAULT NULL,
  `dia_semana` varchar(20) DEFAULT NULL,
  `horario` time DEFAULT NULL,
  `local` varchar(60) DEFAULT NULL,
  `exercicio` varchar(120) DEFAULT NULL,
  `series` int(11) DEFAULT NULL,
  `repeticoes` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `treinos`
--

INSERT INTO `treinos` (`id`, `aluno_id`, `nome_treino`, `foco`, `dia_semana`, `horario`, `local`, `exercicio`, `series`, `repeticoes`) VALUES
(1, 1, 'Treino A', 'Peito e tríceps', 'Hoje', '18:30:00', 'Sala de musculação', 'Supino reto', 3, '12'),
(2, 1, 'Treino A', 'Peito e tríceps', 'Hoje', '18:30:00', 'Sala de musculação', 'Supino inclinado', 3, '10'),
(3, 1, 'Treino A', 'Peito e tríceps', 'Hoje', '18:30:00', 'Sala de musculação', 'Crucifixo na máquina', 3, '12'),
(4, 1, 'Treino A', 'Peito e tríceps', 'Hoje', '18:30:00', 'Sala de musculação', 'Tríceps na polia', 3, '12'),
(5, 1, 'Treino A', 'Peito e tríceps', 'Hoje', '18:30:00', 'Sala de musculação', 'Tríceps francês', 3, '12'),
(6, 1, 'Treino A', 'Peito e tríceps', 'Hoje', '18:30:00', 'Sala de musculação', 'Mergulho no banco', 3, '10'),
(7, 1, 'Treino B', 'Costas e bíceps', 'Amanhã', '18:30:00', 'Sala de musculação', 'Puxada frontal', 3, '12'),
(8, 1, 'Treino B', 'Costas e bíceps', 'Amanhã', '18:30:00', 'Sala de musculação', 'Remada curvada', 3, '10'),
(9, 1, 'Treino B', 'Costas e bíceps', 'Amanhã', '18:30:00', 'Sala de musculação', 'Rosca direta', 3, '12'),
(10, 1, 'Treino B', 'Costas e bíceps', 'Amanhã', '18:30:00', 'Sala de musculação', 'Rosca alternada', 3, '12'),
(11, 1, 'Treino C', 'Pernas', 'Quarta', '19:00:00', 'Sala de musculação', 'Agachamento livre', 4, '10'),
(12, 1, 'Treino C', 'Pernas', 'Quarta', '19:00:00', 'Sala de musculação', 'Leg press', 3, '12'),
(13, 1, 'Treino C', 'Pernas', 'Quarta', '19:00:00', 'Sala de musculação', 'Cadeira extensora', 3, '12'),
(14, 1, 'Treino C', 'Pernas', 'Quarta', '19:00:00', 'Sala de musculação', 'Panturrilha em pé', 4, '15');

-- --------------------------------------------------------

--
-- Estrutura para tabela `turmas`
--

CREATE TABLE `turmas` (
  `id` int(11) NOT NULL,
  `nome` varchar(80) NOT NULL,
  `professor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `turmas`
--

INSERT INTO `turmas` (`id`, `nome`, `professor_id`) VALUES
(1, 'Musculação Manhã', 1),
(2, 'Musculação Noite', 1),
(3, 'Funcional Tarde', 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `role` enum('admin','professor','aluno') NOT NULL,
  `criado_em` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha_hash`, `role`, `criado_em`) VALUES
(1, 'Administrador', 'admin@gestaofit.com', '$2b$10$FQvm2seiVcoikz/MAJJOOuH0IEbl9ax6l77uoPVrIWGoneQS3T44i', 'admin', '2026-11-13 05:29:20'),
(2, 'Prof. Carlos Silva', 'carlos@gestaofit.com', '$2b$10$FUqfThE7iIrRdn8fBj22gOhgCWMaLbRXHi.E4G8y4ZiqDutddSkze', 'professor', '2026-11-13 05:29:20'),
(3, 'Aluno Teste', 'aluno@teste.com', '$2b$10$MnizscIQCVjdxpUygWglyuvMqUwXdCAoidh0iStkDulLEQBFKeZ.6', 'aluno', '2026-11-13 05:29:20');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `alunos`
--
ALTER TABLE `alunos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricula` (`matricula`);

--
-- Índices de tabela `configuracoes`
--
ALTER TABLE `configuracoes`
  ADD PRIMARY KEY (`chave`);

--
-- Índices de tabela `equipamentos`
--
ALTER TABLE `equipamentos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `financeiro`
--
ALTER TABLE `financeiro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aluno_id` (`aluno_id`);

--
-- Índices de tabela `frequencia`
--
ALTER TABLE `frequencia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aluno_id` (`aluno_id`);

--
-- Índices de tabela `professores`
--
ALTER TABLE `professores`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `treinos`
--
ALTER TABLE `treinos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aluno_id` (`aluno_id`);

--
-- Índices de tabela `turmas`
--
ALTER TABLE `turmas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `professor_id` (`professor_id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `alunos`
--
ALTER TABLE `alunos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `equipamentos`
--
ALTER TABLE `equipamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `financeiro`
--
ALTER TABLE `financeiro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `frequencia`
--
ALTER TABLE `frequencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `professores`
--
ALTER TABLE `professores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `treinos`
--
ALTER TABLE `treinos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `turmas`
--
ALTER TABLE `turmas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `financeiro`
--
ALTER TABLE `financeiro`
  ADD CONSTRAINT `financeiro_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `alunos` (`id`);

--
-- Restrições para tabelas `frequencia`
--
ALTER TABLE `frequencia`
  ADD CONSTRAINT `frequencia_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `alunos` (`id`);

--
-- Restrições para tabelas `treinos`
--
ALTER TABLE `treinos`
  ADD CONSTRAINT `treinos_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `alunos` (`id`);

--
-- Restrições para tabelas `turmas`
--
ALTER TABLE `turmas`
  ADD CONSTRAINT `turmas_ibfk_1` FOREIGN KEY (`professor_id`) REFERENCES `professores` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
