migrate(
  (app) => {
    // 1. Atualizar site_settings: event_general_info para Abraçolândia 2027 (Vem aí em 2027)
    try {
      const settingRec = app.findFirstRecordByData('site_settings', 'key', 'event_general_info')
      settingRec.set('value', {
        eventName: 'Abraçolândia 2027',
        edition: '14ª Edição',
        dateStr: 'Em Breve em 2027',
        timeStr: 'Data e Programação a Confirmar',
        venue: 'Parque das Nações & Pavilhão Social',
        address: 'Av. das Festas, 1000 - São Paulo/SP',
        status: 'upcoming',
        statusBadge: 'VEM AÍ 2027',
        headline: 'Vem aí a Abraçolândia 2027!',
        description:
          'O maior festival beneficente da região está sendo preparado para 2027! Gastronomia deliciosa, shows ao vivo, mega área infantil e o tradicional Super Bingo. 100% da arrecadação revertida para causas sociais do Projeto Abraço.',
      })
      app.save(settingRec)
    } catch (_) {
      try {
        const settingsCol = app.findCollectionByNameOrId('site_settings')
        const newRec = new Record(settingsCol)
        newRec.set('key', 'event_general_info')
        newRec.set('value', {
          eventName: 'Abraçolândia 2027',
          edition: '14ª Edição',
          dateStr: 'Em Breve em 2027',
          timeStr: 'Data e Programação a Confirmar',
          venue: 'Parque das Nações & Pavilhão Social',
          address: 'Av. das Festas, 1000 - São Paulo/SP',
          status: 'upcoming',
          statusBadge: 'VEM AÍ 2027',
          headline: 'Vem aí a Abraçolândia 2027!',
          description:
            'O maior festival beneficente da região está sendo preparado para 2027! Gastronomia deliciosa, shows ao vivo, mega área infantil e o tradicional Super Bingo. 100% da arrecadação revertida para causas sociais do Projeto Abraço.',
        })
        app.save(newRec)
      } catch (_) {}
    }

    // 2. Atualizar banners da Abraçolândia para refletir Abraçolândia 2027 (Vem aí)
    try {
      const banners = app.findRecordsByFilter('banners', 'site = "abracolandia"', '', 50, 0)
      for (const b of banners) {
        if (
          b.get('order') === 1 ||
          (b.get('title') && (b.get('title').includes('2025') || b.get('title').includes('2026')))
        ) {
          b.set('title', 'Vem aí a Abraçolândia 2027!')
          b.set(
            'subtitle',
            'Prepare-se para mais uma grande edição de alegria e solidariedade! Gastronomia deliciosa, shows ao vivo, mega área infantil e o tradicional Bingo Beneficente.',
          )
          b.set('badge', 'VEM AÍ • 14ª Edição 2027')
          b.set('cta_text', 'Ver Informações da Festa')
          b.set('cta_link', '/abracolandia/a-festa')
          app.save(b)
        }
      }
    } catch (_) {}

    // 3. Atualizar event_sections (seção geral) para Abraçolândia 2027
    try {
      const generalSection = app.findFirstRecordByData('event_sections', 'section_type', 'geral')
      generalSection.set('title', 'Abraçolândia 2027 — Estrutura e Acesso')
      generalSection.set(
        'content',
        '<p>A <strong>Abraçolândia 2027</strong> reunirá mais de 40 mil m² de estrutura coberta, segurança privada 24h, brigadistas, ambulatório médico de apoio e acessibilidade total para cadeirantes e pessoas com mobilidade reduzida.</p><p><strong>Data:</strong> Edição 2027 em preparação — Acompanhe a divulgação oficial das datas e horários.<br/><strong>Entrada Solidária:</strong> Convites antecipados e bilheteria solidária com 100% da renda revertida para instituições assistidas.</p>',
      )
      app.save(generalSection)
    } catch (_) {}

    // 4. Atualizar bingo_games ativo para título 2027
    try {
      const bingoGames = app.findRecordsByFilter('bingo_games', '', '-created', 50, 0)
      for (const bg of bingoGames) {
        const currentTitle = bg.get('title') || ''
        if (currentTitle.includes('2025') || currentTitle.includes('2026')) {
          bg.set('title', currentTitle.replace('2025', '2027').replace('2026', '2027'))
          app.save(bg)
        }
      }
    } catch (_) {}

    // 5. Atualizar notícia futura se houver
    try {
      const newsItems = app.findRecordsByFilter('news', 'category = "Evento"', '-created', 50, 0)
      for (const n of newsItems) {
        if (
          n.get('slug') === 'lancamento-abracolandia-2025' ||
          n.get('slug') === 'lancamento-abracolandia-2026'
        ) {
          n.set('event_status', 'past')
          app.save(n)
        }
      }
    } catch (_) {}
  },
  (app) => {
    // Revert logic se necessário
  },
)
