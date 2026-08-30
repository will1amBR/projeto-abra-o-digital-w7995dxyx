migrate(
  (app) => {
    const vpCol = app.findCollectionByNameOrId('volunteer_profiles')
    const vmCol = app.findCollectionByNameOrId('volunteer_missions')
    const vbCol = app.findCollectionByNameOrId('volunteer_badges')
    const vebCol = app.findCollectionByNameOrId('volunteer_earned_badges')
    const vaCol = app.findCollectionByNameOrId('volunteer_actions')
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    // 1. Seed Badges
    const badgesData = [
      {
        name: 'Primeiro Abraço',
        description: 'Completou seu cadastro como voluntário e iniciou a jornada',
        icon_name: 'HeartHandshake',
        category: 'Geral',
        points_required: 0,
        color: '#3b82f6',
        rarity: 'Comum',
      },
      {
        name: 'Embaixador da Solidariedade',
        description: 'Trouxe 3 novos voluntários para a causa do Projeto Abraço',
        icon_name: 'Users',
        category: 'Indicações',
        points_required: 300,
        color: '#10b981',
        rarity: 'Raro',
      },
      {
        name: 'Coração Generoso',
        description: 'Realizou ou mobilizou doações para kits de alimentos ou eventos',
        icon_name: 'Gift',
        category: 'Doações',
        points_required: 500,
        color: '#f59e0b',
        rarity: 'Raro',
      },
      {
        name: 'Guardião do Abraço',
        description: 'Participou ativamente de 5 ações presenciais em comunidades',
        icon_name: 'ShieldCheck',
        category: 'Presença',
        points_required: 1000,
        color: '#8b5cf6',
        rarity: 'Lendário',
      },
      {
        name: 'Herói do Abraço',
        description: 'Alcançou o nível máximo de dedicação e liderança comunitária',
        icon_name: 'Sparkles',
        category: 'Destaque',
        points_required: 2500,
        color: '#ec4899',
        rarity: 'Mestre',
      },
      {
        name: 'Estrela da Abraçolândia',
        description: 'Atuou como voluntário oficial durante a festa anual Abraçolândia',
        icon_name: 'PartyPopper',
        category: 'Presença',
        points_required: 600,
        color: '#06b6d4',
        rarity: 'Raro',
      },
    ]

    const badgeRecordMap = {}
    for (const b of badgesData) {
      try {
        const existing = app.findFirstRecordByData('volunteer_badges', 'name', b.name)
        badgeRecordMap[b.name] = existing
      } catch (_) {
        const rec = new Record(vbCol)
        rec.set('name', b.name)
        rec.set('description', b.description)
        rec.set('icon_name', b.icon_name)
        rec.set('category', b.category)
        rec.set('points_required', b.points_required)
        rec.set('color', b.color)
        rec.set('rarity', b.rarity)
        app.save(rec)
        badgeRecordMap[b.name] = rec
      }
    }

    // 2. Seed Missions
    const missionsData = [
      {
        title: 'Convide um Amigo para ser Voluntário',
        description:
          '<p>Compartilhe seu <strong>link ou código de indicação</strong> com um amigo ou colega. Quando ele se cadastrar, você ganha 150 pontos!</p>',
        category: 'Indicação',
        points_reward: 150,
        icon_name: 'UserPlus',
        active: true,
        difficulty: 'Fácil',
        instructions:
          'Envie seu link de indicação ou informe o e-mail cadastrado pelo seu indicado no formulário de comprovação.',
        order: 1,
      },
      {
        title: 'Promover / Fazer Doação de Cesta Básica',
        description:
          '<p>Arrecade ou faça uma doação no valor equivalente a uma cesta básica (R$ 80+) para as famílias assistidas pelo projeto.</p>',
        category: 'Doação',
        points_reward: 200,
        icon_name: 'Gift',
        active: true,
        difficulty: 'Médio',
        instructions:
          'Envie o comprovante de PIX ou foto da entrega física dos alimentos na sede do projeto.',
        order: 2,
      },
      {
        title: 'Participar de Mutirão de Triagem e Entregas',
        description:
          '<p>Dedique 3 horas em nosso galpão de triagem de donativos ou em um dia de distribuição na comunidade local.</p>',
        category: 'Ação Social',
        points_reward: 250,
        icon_name: 'HeartHandshake',
        active: true,
        difficulty: 'Médio',
        instructions:
          'Registre sua presença na lista do coordenador e envie uma foto durante a atividade.',
        order: 3,
      },
      {
        title: 'Voluntariado na Festa Abraçolândia',
        description:
          '<p>Participe da equipe de recepção, recreação infantil ou apoio ao bingo beneficente da Abraçolândia.</p>',
        category: 'Ação Social',
        points_reward: 400,
        icon_name: 'PartyPopper',
        active: true,
        difficulty: 'Avançado',
        instructions: 'Seja escalado e atue em um dos turnos oficiais do evento.',
        order: 4,
      },
      {
        title: 'Divulgar Campanha nas Redes Sociais',
        description:
          '<p>Compartilhe os posts e stories do Projeto Abraço ou da Abraçolândia no Instagram/LinkedIn com a hashtag #ProjetoAbraco.</p>',
        category: 'Divulgação',
        points_reward: 80,
        icon_name: 'Share2',
        active: true,
        difficulty: 'Fácil',
        instructions: 'Envie o link da postagem ou o print do story postado há mais de 2 horas.',
        order: 5,
      },
      {
        title: 'Desafio Guardião: 3 Ações no Mês',
        description:
          '<p>Participe de pelo menos 3 iniciativas sociais ou doações em um mesmo mês e ganhe um bônus especial de pontuação!</p>',
        category: 'Especial',
        points_reward: 500,
        icon_name: 'Sparkles',
        active: true,
        difficulty: 'Épico',
        instructions:
          'Complete 3 missões regulares e solicite a validação deste desafio de dedicação contínua.',
        order: 6,
      },
    ]

    for (const m of missionsData) {
      try {
        app.findFirstRecordByData('volunteer_missions', 'title', m.title)
      } catch (_) {
        const rec = new Record(vmCol)
        rec.set('title', m.title)
        rec.set('description', m.description)
        rec.set('category', m.category)
        rec.set('points_reward', m.points_reward)
        rec.set('icon_name', m.icon_name)
        rec.set('active', m.active)
        rec.set('difficulty', m.difficulty)
        rec.set('instructions', m.instructions)
        rec.set('order', m.order)
        app.save(rec)
      }
    }

    // 3. Seed Sample Volunteer Users and Profiles for gamification showcase & ranking
    const sampleUsers = [
      {
        email: 'william@korenambiental.com',
        name: 'William Souza',
        phone: '(11) 98765-4321',
        city: 'São Paulo/SP',
        bio: 'Voluntário fundador e coordenador de logística. Apaixonado pela transformação social.',
        points: 1850,
        level_name: 'Guardião do Abraço',
        referral_code: 'WILL2025',
        total_actions: 8,
        total_donations: 450,
        total_invited: 5,
        avatar_url: 'https://img.usecurling.com/ppl/medium?gender=male&seed=10',
      },
      {
        email: 'mariana.silva@exemplo.com',
        name: 'Mariana Silva',
        phone: '(11) 97777-1111',
        city: 'Guarulhos/SP',
        bio: 'Voluntária atuante na Abraçolândia e recreação infantil.',
        points: 1420,
        level_name: 'Guardião do Abraço',
        referral_code: 'MARI8899',
        total_actions: 6,
        total_donations: 200,
        total_invited: 4,
        avatar_url: 'https://img.usecurling.com/ppl/medium?gender=female&seed=22',
      },
      {
        email: 'carlos.mendes@exemplo.com',
        name: 'Carlos Mendes',
        phone: '(11) 96666-2222',
        city: 'São Bernardo do Campo/SP',
        bio: 'Engenheiro e voluntário nas ações de infraestrutura e triagem.',
        points: 980,
        level_name: 'Voluntário Dedicado',
        referral_code: 'CARLOS55',
        total_actions: 4,
        total_donations: 150,
        total_invited: 3,
        avatar_url: 'https://img.usecurling.com/ppl/medium?gender=male&seed=33',
      },
      {
        email: 'beatriz.oliveira@exemplo.com',
        name: 'Beatriz Oliveira',
        phone: '(11) 95555-3333',
        city: 'São Paulo/SP',
        bio: 'Comunicadora e embaixadora digital do Projeto Abraço.',
        points: 620,
        level_name: 'Voluntário Dedicado',
        referral_code: 'BIAABRACO',
        total_actions: 3,
        total_donations: 80,
        total_invited: 2,
        avatar_url: 'https://img.usecurling.com/ppl/medium?gender=female&seed=44',
      },
      {
        email: 'lucas.ferreira@exemplo.com',
        name: 'Lucas Ferreira',
        phone: '(11) 94444-4444',
        city: 'Santo André/SP',
        bio: 'Novo voluntário animado para ajudar nas entregas de alimentos.',
        points: 180,
        level_name: 'Voluntário Iniciante',
        referral_code: 'LUCAS990',
        total_actions: 1,
        total_donations: 0,
        total_invited: 1,
        avatar_url: 'https://img.usecurling.com/ppl/medium?gender=male&seed=55',
      },
    ]

    for (const u of sampleUsers) {
      let userRec
      try {
        userRec = app.findAuthRecordByEmail('_pb_users_auth_', u.email)
      } catch (_) {
        userRec = new Record(usersCol)
        userRec.setEmail(u.email)
        userRec.setPassword('Skip@Pass')
        userRec.setVerified(true)
        userRec.set('name', u.name)
        userRec.set('role', u.email === 'william@korenambiental.com' ? 'admin' : 'editor')
        app.save(userRec)
      }

      let vpRec
      try {
        vpRec = app.findFirstRecordByData('volunteer_profiles', 'user_id', userRec.id)
      } catch (_) {
        vpRec = new Record(vpCol)
        vpRec.set('user_id', userRec.id)
        vpRec.set('display_name', u.name)
        vpRec.set('phone', u.phone)
        vpRec.set('city', u.city)
        vpRec.set('bio', u.bio)
        vpRec.set('points', u.points)
        vpRec.set('level_name', u.level_name)
        vpRec.set('referral_code', u.referral_code)
        vpRec.set('total_actions_completed', u.total_actions)
        vpRec.set('total_donations_value', u.total_donations)
        vpRec.set('total_volunteers_invited', u.total_invited)
        vpRec.set('avatar_url', u.avatar_url)
        app.save(vpRec)

        // Earned badges for William
        if (u.email === 'william@korenambiental.com') {
          const badgeNamesToEarn = [
            'Primeiro Abraço',
            'Embaixador da Solidariedade',
            'Coração Generoso',
            'Guardião do Abraço',
          ]
          for (const name of badgeNamesToEarn) {
            const bRec = badgeRecordMap[name]
            if (bRec) {
              try {
                const ebRec = new Record(vebCol)
                ebRec.set('volunteer_profile_id', vpRec.id)
                ebRec.set('badge_id', bRec.id)
                ebRec.set('earned_at', '2025-01-15')
                ebRec.set('reason', 'Conquista atingida pelo engajamento exemplar')
                app.save(ebRec)
              } catch (_) {}
            }
          }
        }

        // Sample actions for William
        if (u.email === 'william@korenambiental.com') {
          const sampleActions = [
            {
              title: 'Indicação de 3 novos voluntários para logística',
              description: 'Convidei amigos de faculdade para participar do mutirão de triagem.',
              action_type: 'indicacao',
              points_claimed: 300,
              status: 'approved',
              reviewed_by: 'Equipe Coordenação',
              reviewed_at: '2025-02-10',
              invited_email: 'mariana.silva@exemplo.com',
            },
            {
              title: 'Apoio no Galpão de Cestas Básicas',
              description: 'Ajudei a descarregar e embalar 200 cestas para a comunidade Vila Nova.',
              action_type: 'acao_social',
              points_claimed: 250,
              status: 'approved',
              reviewed_by: 'Equipe Coordenação',
              reviewed_at: '2025-02-18',
            },
            {
              title: 'Doação de 5 kits escolares completos',
              description: 'Doação de cadernos, mochilas e estojos para o início das aulas.',
              action_type: 'doacao',
              points_claimed: 200,
              status: 'pending',
              donation_value: 250,
            },
          ]

          for (const act of sampleActions) {
            const actRec = new Record(vaCol)
            actRec.set('volunteer_profile_id', vpRec.id)
            actRec.set('action_type', act.action_type)
            actRec.set('title', act.title)
            actRec.set('description', act.description)
            actRec.set('points_claimed', act.points_claimed)
            actRec.set('status', act.status)
            if (act.reviewed_by) actRec.set('reviewed_by', act.reviewed_by)
            if (act.reviewed_at) actRec.set('reviewed_at', act.reviewed_at)
            if (act.donation_value) actRec.set('donation_value', act.donation_value)
            if (act.invited_email) actRec.set('invited_email', act.invited_email)
            app.save(actRec)
          }
        }
      }
    }
  },
  (app) => {
    // down logic
  },
)
