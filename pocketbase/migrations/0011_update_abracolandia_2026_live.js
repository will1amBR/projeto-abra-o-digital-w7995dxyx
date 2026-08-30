migrate(
  (app) => {
    // 1. Atualizar site_settings: event_general_info para Abraçolândia 2026 (Hoje: 30/08/2026 acontecendo agora)
    try {
      const eventRec = app.findFirstRecordByData('site_settings', 'key', 'event_general_info')
      eventRec.set('value', {
        eventName: 'Abraçolândia 2026',
        edition: '13ª Edição',
        dateStr: 'Hoje, 30 de Agosto de 2026',
        timeStr: 'Das 10h às 22h (Em Andamento)',
        venue: 'Parque das Nações & Pavilhão Social',
        address: 'Av. das Festas, 1000 - São Paulo/SP',
        status: 'happening_now',
        statusBadge: 'ACONTECENDO AGORA',
        ticketPrice: 'R$ 25,00 (100% revertido)',
        kidsPolicy: 'Crianças até 10 anos não pagam acompanhadas de responsável',
        headline: 'A Abraçolândia 2026 está ACONTECENDO HOJE!',
        description:
          'Venha viver momentos inesquecíveis de diversão e solidariedade! Shows ao vivo, alta gastronomia, parque infantil e o tradicional Bingo Beneficente acontecendo agora mesmo.',
      })
      app.save(eventRec)
    } catch (_) {
      try {
        const settingsCol = app.findCollectionByNameOrId('site_settings')
        const rec = new Record(settingsCol)
        rec.set('key', 'event_general_info')
        rec.set('value', {
          eventName: 'Abraçolândia 2026',
          edition: '13ª Edição',
          dateStr: 'Hoje, 30 de Agosto de 2026',
          timeStr: 'Das 10h às 22h (Em Andamento)',
          venue: 'Parque das Nações & Pavilhão Social',
          address: 'Av. das Festas, 1000 - São Paulo/SP',
          status: 'happening_now',
          statusBadge: 'ACONTECENDO AGORA',
          ticketPrice: 'R$ 25,00 (100% revertido)',
          kidsPolicy: 'Crianças até 10 anos não pagam acompanhadas de responsável',
          headline: 'A Abraçolândia 2026 está ACONTECENDO HOJE!',
          description:
            'Venha viver momentos inesquecíveis de diversão e solidariedade! Shows ao vivo, alta gastronomia, parque infantil e o tradicional Bingo Beneficente acontecendo agora mesmo.',
        })
        app.save(rec)
      } catch (err) {
        console.log('Error creating event_general_info setting:', err)
      }
    }

    // 2. Atualizar banners da Abraçolândia para refletir Abraçolândia 2026 (Acontecendo Agora)
    try {
      const banners = app.findRecordsByFilter('banners', 'site = "abracolandia"', 'order', 10, 0)
      if (banners && banners.length > 0) {
        for (const b of banners) {
          if (b.get('title') && b.get('title').includes('2025')) {
            b.set('title', 'Abraçolândia 2026: Está Acontecendo Agora!')
            b.set('badge', 'ACONTECENDO AGORA • 30 de Agosto • 13ª Edição')
            b.set(
              'subtitle',
              'O maior festival beneficente está rolando hoje! Gastronomia deliciosa, shows ao vivo, mega área infantil e o tradicional Bingo Beneficente.',
            )
            app.save(b)
          }
        }
      }
    } catch (err) {
      console.log('Error updating banners:', err)
    }

    // 3. Atualizar banner institucional fallback / banners gerais se necessário
    try {
      const instBanners = app.findRecordsByFilter('banners', 'site = "abraco"', 'order', 10, 0)
      if (instBanners && instBanners.length > 0) {
        for (const b of instBanners) {
          if (b.get('title') === 'Acolher, incluir e transformar vidas') {
            b.set('title', 'FAÇA PARTE! VAMOS FAZER DA DIVERSÃO UMA BOA AÇÃO!')
            b.set('badge', 'PROJETO ABRAÇO • INSTITUCIONAL')
            b.set(
              'subtitle',
              'O Projeto Abraço é uma instituição que há mais de 20 anos mobiliza voluntários e transforma participação em solidariedade.',
            )
            app.save(b)
          }
        }
      }
    } catch (err) {
      console.log('Error updating institutional banners:', err)
    }

    // 4. Atualizar event_sections (seção geral) para Abraçolândia 2026
    try {
      const generalSection = app.findFirstRecordByData('event_sections', 'section_type', 'geral')
      generalSection.set('title', 'Abraçolândia 2026 — Estrutura e Acesso')
      generalSection.set(
        'content',
        '<p>A <strong>Abraçolândia 2026</strong> reúne mais de 40 mil m² de estrutura coberta, segurança privada 24h, brigadistas, ambulatório médico de apoio e acessibilidade total para cadeirantes e pessoas com mobilidade reduzida.</p><p><strong>Data:</strong> Hoje, 30 de Agosto de 2026 — Portões abertos das 10h às 22h.<br/><strong>Entrada Solidária:</strong> R$ 25,00 por pessoa (crianças até 10 anos acompanhadas não pagam).</p>',
      )
      app.save(generalSection)
    } catch (err) {
      console.log('Error updating event section geral:', err)
    }
  },
  (app) => {
    // Reversão
  },
)
