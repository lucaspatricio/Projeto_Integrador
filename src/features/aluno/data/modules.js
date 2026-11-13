export const studentModules = {
    "Meu treino": {
      description: "Consulte os exercícios e as orientações do treino preparado para você.",
      metrics: [["Treino de hoje", "Treino A"], ["Exercícios", "6"], ["Duração estimada", "50 min"]],
      rows: [
        ["Supino reto", "3 séries · 12 repetições", "Treino A"],
        ["Supino inclinado", "3 séries · 10 repetições", "Treino A"],
        ["Crucifixo na máquina", "3 séries · 12 repetições", "Treino A"],
        ["Tríceps na polia", "3 séries · 12 repetições", "Treino A"],
      ],
    },
    "Minha frequência": {
      description: "Acompanhe seus treinos realizados e seu progresso ao longo do mês.",
      metrics: [["Treinos no mês", "12"], ["Meta mensal", "16"], ["Frequência", "85%"]],
      rows: [
        ["Hoje", "Treino A · Peito e tríceps", "Agendado"],
        ["02/out", "Treino B · Costas e bíceps", "Concluído"],
        ["30/set", "Treino A · Peito e tríceps", "Concluído"],
        ["28/set", "Treino C · Pernas", "Concluído"],
      ],
    },
    "Meu plano": {
      description: "Confira os detalhes e a validade do seu plano na academia.",
      metrics: [["Plano atual", "Anual"], ["Situação", "Ativo"], ["Vencimento", "15/mar/2027"]],
      rows: [
        ["Plano anual", "Acesso à musculação e às aulas coletivas", "Ativo"],
        ["Próxima renovação", "15 de março de 2027", "Agendada"],
        ["Forma de pagamento", "Consulte a recepção para atualizar os dados", "Informação"],
      ],
    },
    Agenda: {
      description: "Veja seu próximo treino e os horários programados.",
      metrics: [["Próximo treino", "Hoje"], ["Horário", "18:30"], ["Local", "Sala de musculação"]],
      rows: [
        ["Hoje · 18:30", "Treino A · Peito e tríceps", "Agendado"],
        ["Amanhã · 18:30", "Treino B · Costas e bíceps", "Planejado"],
        ["Quarta · 19:00", "Treino C · Pernas", "Planejado"],
      ],
    },
    Configurações: {
      description: "Gerencie as preferências da sua conta e seus avisos.",
      metrics: [["Perfil", "Aluno"], ["Lembretes", "Ativos"], ["Privacidade", "Padrão"]],
      rows: [
        ["Dados do perfil", "Nome, contato e informações pessoais", "Consultar"],
        ["Lembretes de treino", "Avisos sobre os horários da sua agenda", "Ativos"],
        ["Ajuda e suporte", "Fale com a equipe da academia", "Disponível"],
      ],
    },
  };
