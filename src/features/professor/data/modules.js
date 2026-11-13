export const professorModules = {
    "Minhas aulas": {
      description: "Consulte as aulas que você ministra e acompanhe a participação das turmas.",
      metrics: [["Aulas hoje", "4"], ["Alunos nas turmas", "32"], ["Próxima aula", "10:00"]],
      rows: [
        ["Musculação", "10:00 · Sala de pesos · 8 alunos", "Próxima"],
        ["Treinamento funcional", "11:30 · Sala 2 · 12 alunos", "Agendada"],
        ["Avaliação física", "14:00 · Sala de avaliação", "Agendada"],
        ["Musculação", "08:00 · Sala de pesos · 8 alunos", "Concluída"],
      ],
    },
    Alunos: {
      description: "Consulte os alunos das suas turmas e os acompanhamentos recentes.",
      metrics: [["Alunos nas turmas", "32"], ["Avaliações pendentes", "3"], ["Acompanhar", "2"]],
      rows: [
        ["Mariana Oliveira", "Avaliação física agendada para hoje", "Avaliação"],
        ["Lucas Ferreira", "Frequência dentro da meta", "Em dia"],
        ["Beatriz Santos", "Sem treinar há 5 dias", "Acompanhar"],
        ["Pedro Henrique", "Turma de musculação · 08:00", "Em dia"],
      ],
    },
    Frequência: {
      description: "Acompanhe a presença e a frequência das suas turmas.",
      metrics: [["Presenças hoje", "32"], ["Frequência média", "85%"], ["Ausências para revisar", "4"]],
      rows: [
        ["Musculação · 08:00", "8 alunos previstos", "Concluída"],
        ["Musculação · 10:00", "6 de 8 alunos presentes", "Em andamento"],
        ["Funcional · 11:30", "12 alunos previstos", "Agendada"],
        ["Avaliações", "3 alunos aguardando registro", "Pendente"],
      ],
    },
    Agenda: {
      description: "Visualize seus horários e os próximos compromissos na academia.",
      metrics: [["Compromissos hoje", "4"], ["Horas nesta semana", "18h"], ["Próximo horário", "10:00"]],
      rows: [
        ["10:00", "Musculação · Sala de pesos", "Próxima"],
        ["11:30", "Treinamento funcional · Sala 2", "Agendada"],
        ["14:00", "Avaliação física · Mariana O.", "Agendada"],
        ["Quarta · 09:00", "Reunião da equipe técnica", "Agendada"],
      ],
    },
    Configurações: {
      description: "Ajuste suas preferências de agenda e comunicação.",
      metrics: [["Perfil", "Professor"], ["Agenda", "Sincronizada"], ["Notificações", "Ativas"]],
      rows: [
        ["Dados profissionais", "Informações do seu perfil e especialidades", "Configurado"],
        ["Disponibilidade", "Horários disponíveis para aulas e avaliações", "Editar"],
        ["Lembretes de aula", "Avisos antes do início dos seus horários", "Ativos"],
      ],
    },
  };
