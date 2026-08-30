migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // 1. Seed Admin User william@korenambiental.com
    try {
      const admin = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
      admin.set('role', 'admin')
      admin.set('name', 'William Admin')
      app.save(admin)
    } catch (_) {
      const record = new Record(users)
      record.setEmail('william@korenambiental.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'William Admin')
      record.set('role', 'admin')
      app.save(record)
    }

    // 2. Seed site settings (social links, general contact)
    const settingsCol = app.findCollectionByNameOrId('site_settings')
    const initialSettings = [
      {
        key: 'social_links',
        value: {
          instagram: 'https://instagram.com/projetoabracoficial',
          facebook: 'https://facebook.com/projetoabracoficial',
          youtube: 'https://youtube.com/@projetoabraco',
          whatsapp: 'https://wa.me/5511999998888',
          email: 'contato@projetoabraco.org.br',
          address: 'Rua da Solidariedade, 450 - São Paulo/SP',
          phone: '(11) 3234-5678',
        },
      },
      {
        key: 'event_general_info',
        value: {
          eventName: 'Abraçolândia 2025',
          edition: '12ª Edição',
          dateStr: '18 e 19 de Outubro de 2025',
          timeStr: 'A partir das 11h00',
          venue: 'Parque das Nações & Pavilhão Social',
          address: 'Av. das Festas, 1000 - São Paulo/SP',
          ticketPrice: 'R$ 25,00 (100% revertido)',
          kidsPolicy: 'Crianças até 10 anos não pagam acompanhadas de responsável',
        },
      },
    ]

    for (const item of initialSettings) {
      try {
        app.findFirstRecordByData('site_settings', 'key', item.key)
      } catch (_) {
        const rec = new Record(settingsCol)
        rec.set('key', item.key)
        rec.set('value', item.value)
        app.save(rec)
      }
    }

    // 3. Seed Banners
    const bannersCol = app.findCollectionByNameOrId('banners')
    const initialBanners = [
      {
        site: 'abraco',
        title: 'Acolher, incluir e transformar vidas',
        subtitle:
          'Uma rede de solidariedade e amor ao próximo que transforma vulnerabilidade em esperança e novas oportunidades.',
        cta_text: 'Quero Ser Voluntário',
        cta_link: '/voluntariado',
        badge: 'Projeto Abraço Institucional',
        image_url:
          'https://img.usecurling.com/p/1600/700?q=solidarity%20community%20charity%20hands',
        active: true,
        order: 1,
      },
      {
        site: 'abraco',
        title: 'Transparência em cada gesto de doação',
        subtitle:
          'Conheça o impacto direto das nossas ações comunitárias, entregas de cestas, reformas e atendimentos humanizados.',
        cta_text: 'Ver Nossas Ações',
        cta_link: '/beneficiados',
        badge: 'Ações que Transformam',
        image_url:
          'https://img.usecurling.com/p/1600/700?q=volunteers%20helping%20families%20boxes',
        active: true,
        order: 2,
      },
      {
        site: 'abracolandia',
        title: 'Abraçolândia 2025: A Maior Festa da Solidariedade!',
        subtitle:
          'Gastronomia deliciosa, shows ao vivo, mega área infantil e o tradicional Bingo Beneficente. 100% da renda revertida para causas sociais.',
        cta_text: 'Garantir Convites',
        cta_link: '/abracolandia/convites',
        badge: '18 & 19 de Outubro • 12ª Edição',
        image_url:
          'https://img.usecurling.com/p/1600/700?q=festival%20carnival%20celebration%20lights',
        active: true,
        order: 1,
      },
      {
        site: 'abracolandia',
        title: 'Venha viver dias de pura alegria e fazer o bem',
        subtitle:
          'Junte sua família e amigos no pavilhão de eventos para curtir música boa e ajudar centenas de famílias.',
        cta_text: 'Conheça as Atrações',
        cta_link: '/abracolandia/festa',
        badge: 'Programação Completa',
        image_url: 'https://img.usecurling.com/p/1600/700?q=concert%20stage%20festival%20joy',
        active: true,
        order: 2,
      },
    ]

    for (const b of initialBanners) {
      try {
        app.findFirstRecordByData('banners', 'title', b.title)
      } catch (_) {
        const rec = new Record(bannersCol)
        rec.set('site', b.site)
        rec.set('title', b.title)
        rec.set('subtitle', b.subtitle)
        rec.set('cta_text', b.cta_text)
        rec.set('cta_link', b.cta_link)
        rec.set('badge', b.badge)
        rec.set('image_url', b.image_url)
        rec.set('active', b.active)
        rec.set('order', b.order)
        app.save(rec)
      }
    }

    // 4. Seed Content Blocks (História, Missão, Valores, Sobre a Abraçolândia)
    const blocksCol = app.findCollectionByNameOrId('content_blocks')
    const initialBlocks = [
      {
        site: 'abraco',
        slug: 'nossa-historia-origens',
        title: 'Nossa História e Origens',
        subtitle:
          'Como o amor ao próximo transformou uma pequena iniciativa em um porto seguro comunitário',
        body: '<p>O <strong>Projeto Abraço</strong> nasceu há mais de 12 anos a partir do sonho compartilhado de um grupo de amigos e voluntários que se recusaram a aceitar a indiferença social. O que começou com a distribuição informal de sopas e agasalhos em noites frias de inverno logo se transformou em uma estrutura acolhedora e permanente de assistência integral.</p><p>Com o passar dos anos, ampliamos nosso raio de atendimento para incluir apoio psicossocial, doação regular de cestas de alimentos de alto valor nutricional, reformas de moradias em condições precárias, encaminhamento para o mercado de trabalho e oficinas educativas para jovens e crianças.</p><p>Hoje, o Projeto Abraço é referência de seriedade, empatia e transparência, impactando mais de 5.000 famílias todos os anos através do trabalho dedicado de mais de 350 voluntários ativos.</p>',
        image_url:
          'https://img.usecurling.com/p/1200/600?q=community%20story%20founding%20volunteers',
        order: 1,
      },
      {
        site: 'abraco',
        slug: 'missao-visao-valores',
        title: 'Missão, Visão e Nossos Pilares',
        subtitle: 'Princípios inegociáveis que norteiam cada decisão e cada abraço dado',
        body: '<p><strong>Nossa Missão:</strong> Acolher, incluir e transformar a realidade de famílias e indivíduos em situação de vulnerabilidade, promovendo dignidade, autonomia e esperança através de ações humanas e solidárias.</p><p><strong>Nossa Visão:</strong> Ser um porto seguro e catalisador de transformação comunitária, inspirando uma cultura perene de empatia, voluntariado e responsabilidade social coletiva.</p>',
        metadata: {
          pilares: [
            {
              nome: 'Inclusão',
              descricao:
                'Criamos espaços, projetos e oportunidades onde todas as pessoas se sintam integradas, acolhidas, ouvidas e respeitadas em sua integridade.',
            },
            {
              nome: 'Solidariedade',
              descricao:
                'Transformamos o sentimento de empatia em ações concretas, ágeis e eficientes que geram impacto real e imediato na vida de quem mais precisa.',
            },
            {
              nome: 'Transparência',
              descricao:
                'Garantimos que cada doação financeira, alimento arrecadado e esforço voluntário cheguem diretamente ao destino com prestação de contas aberta e auditável.',
            },
          ],
        },
        image_url: 'https://img.usecurling.com/p/1200/600?q=solidarity%20values%20empathy',
        order: 2,
      },
      {
        site: 'abraco',
        slug: 'disseminacao-voluntariado',
        title: 'A Cultura do Voluntariado',
        subtitle: 'Multiplicando o poder da solidariedade e capacitando agentes de transformação',
        body: '<p>Acreditamos que o voluntariado não é apenas doar tempo — é um exercício contínuo de cidadania, escuta ativa e humanização. Oferecemos capacitações regulares, mentorias e workshops para que qualquer pessoa, independente de sua formação ou disponibilidade, encontre uma forma significativa de contribuir.</p><p>Além das ações de campo, promovemos palestras em escolas, empresas e associações de bairro para conscientizar novas gerações sobre a urgência do engajamento cívico e do acolhimento fraterno.</p>',
        image_url: 'https://img.usecurling.com/p/1200/600?q=volunteers%20workshop%20hands',
        order: 3,
      },
      {
        site: 'abracolandia',
        slug: 'abracolandia-sobre',
        title: 'O que é a Abraçolândia?',
        subtitle:
          'O maior evento beneficente do Projeto Abraço: diversão, comunhão e impacto social',
        body: '<p>A <strong>Abraçolândia</strong> é o nosso grande encontro anual de celebração da vida e da fraternidade. Durante dois dias inesquecíveis, transformamos um mega pavilhão em um parque temático de solidariedade, reunindo milhares de famílias para desfrutar de alta gastronomia, música ao vivo com artistas consagrados, parque infantil seguro e o lendário Bingo Beneficente com grandes prêmios.</p><p><strong>100% do lucro líquido arrecadado</strong> com a venda de convites, praça de alimentação e cartelas de bingo é integralmente revertido para custear as ações socioassistenciais, obras comunitárias e projetos educativos do Projeto Abraço ao longo de todo o ano seguinte.</p>',
        image_url: 'https://img.usecurling.com/p/1200/600?q=festival%20crowd%20family%20joy',
        order: 1,
      },
    ]

    for (const bl of initialBlocks) {
      try {
        app.findFirstRecordByData('content_blocks', 'slug', bl.slug)
      } catch (_) {
        const rec = new Record(blocksCol)
        rec.set('site', bl.site)
        rec.set('slug', bl.slug)
        rec.set('title', bl.title)
        rec.set('subtitle', bl.subtitle)
        rec.set('body', bl.body)
        rec.set('image_url', bl.image_url)
        if (bl.metadata) rec.set('metadata', bl.metadata)
        rec.set('order', bl.order)
        app.save(rec)
      }
    }

    // 5. Seed News (Notícias com eventos futuros e passados)
    const newsCol = app.findCollectionByNameOrId('news')
    const initialNews = [
      {
        title: 'Lançamento Oficial da 12ª Edição da Abraçolândia com Grandes Atrações',
        slug: 'lancamento-abracolandia-2025',
        summary:
          'Confira as primeiras novidades, mapa da festa, novidades na praça gastronômica e como garantir seu convite solidário antecipado.',
        content:
          '<p>Estamos muito felizes em anunciar a 12ª edição da <strong>Abraçolândia</strong>! O festival beneficente deste ano promete ser o mais emocionante de nossa trajetória, contando com 3 palcos simultâneos, mais de 25 food trucks renomados, uma tirolesa infantil com monitores especializados e a ampliação do pavilhão coberto para acomodar mais de 10.000 pessoas confortavelmente.</p><p>Todos os recursos arrecadados serão direcionados para o fundo de manutenção de nossas 4 frentes de assistência e a conclusão do Centro Comunitário Sonho Infantil.</p>',
        category: 'Evento',
        is_event: true,
        event_status: 'upcoming',
        event_date: '18/10/2025',
        published_at: '15/05/2025',
        featured: true,
        image_url: 'https://img.usecurling.com/p/1000/600?q=festival%20event%20announcement',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        title: 'Campanha Inverno Sem Frio bate recorde histórico: 1.200 famílias acolhidas',
        slug: 'campanha-inverno-sem-frio-recorde',
        summary:
          'Graças à mobilização de doadores e empresas parceiras, entregamos mais de 2.400 cobertores e 1.200 cestas de alimentos reforçadas.',
        content:
          '<p>Durante os meses mais frios do ano, nossas equipes de voluntários percorreram 14 comunidades periféricas realizando a entrega porta a porta de kits de inverno completos, agasalhos térmicos, meias de lã e cestas de alimentos com alto valor calórico e nutritivo.</p><p>Agradecemos imensamente a cada voluntário que acordou de madrugada para preparar caldos quentes e distribuir afeto e acolhimento.</p>',
        category: 'Ação Social',
        is_event: false,
        event_status: 'past',
        event_date: '20/07/2024',
        published_at: '25/07/2024',
        featured: true,
        image_url:
          'https://img.usecurling.com/p/1000/600?q=volunteers%20blankets%20winter%20warmth',
      },
      {
        title:
          'Mutirão da Saúde Comunitária realiza 480 atendimentos médicos e odontológicos gratuitos',
        slug: 'mutirao-saude-comunitaria-sucesso',
        summary:
          'Profissionais voluntários de saúde uniram forças para oferecer consultas clínicas, exames preventivos, triagem odontológica e palestras de higiene.',
        content:
          '<p>Em parceria com faculdades de medicina e odontologia e clínicas privadas parceiras, o Projeto Abraço montou 8 consultórios temporários com estrutura completa. Foram realizados exames oftalmológicos com entrega gratuita de 140 óculos de grau sob medida para crianças e idosos.</p>',
        category: 'Ação Social',
        is_event: true,
        event_status: 'past',
        event_date: '14/09/2024',
        published_at: '18/09/2024',
        featured: false,
        image_url:
          'https://img.usecurling.com/p/1000/600?q=medical%20care%20doctor%20smile%20volunteer',
      },
      {
        title: 'Inscrições abertas para novos voluntários no 2º Semestre',
        slug: 'inscricoes-voluntarios-segundo-semestre',
        summary:
          'Venha somar suas habilidades nas equipes de logística, apoio a famílias, eventos, comunicação e pedagogia.',
        content:
          '<p>Se você deseja fazer a diferença no mundo e sentir o impacto transformador da solidariedade na prática, este é o momento. O Projeto Abraço abriu 80 novas vagas para voluntários em diferentes áreas de atuação. O treinamento inicial ocorre no primeiro sábado do próximo mês.</p>',
        category: 'Voluntariado',
        is_event: false,
        event_status: 'upcoming',
        event_date: '05/08/2025',
        published_at: '01/06/2025',
        featured: false,
        image_url: 'https://img.usecurling.com/p/1000/600?q=team%20volunteers%20meeting%20hands',
      },
      {
        title: 'Relatório Anual de Transparência e Prestação de Contas é publicado',
        slug: 'relatorio-transparencia-anual',
        summary:
          'Confira detalhadamente as receitas arrecadadas, despesas operacionais e métricas de impacto de todas as ações executadas.',
        content:
          '<p>A transparência é o nosso alicerce primordial. Disponibilizamos o balanço patrimonial completo e o relatório de auditoria externa de 2024, demonstrando que 93,4% de todos os recursos captados foram diretamente aplicados nas ações de assistência direta e projetos sociais das comunidades assistidas.</p>',
        category: 'Transparência',
        is_event: false,
        event_status: 'none',
        event_date: '',
        published_at: '10/01/2025',
        featured: false,
        image_url:
          'https://img.usecurling.com/p/1000/600?q=financial%20report%20transparency%20chart',
      },
    ]

    for (const n of initialNews) {
      try {
        app.findFirstRecordByData('news', 'slug', n.slug)
      } catch (_) {
        const rec = new Record(newsCol)
        rec.set('title', n.title)
        rec.set('slug', n.slug)
        rec.set('summary', n.summary)
        rec.set('content', n.content)
        rec.set('category', n.category)
        rec.set('is_event', n.is_event)
        rec.set('event_status', n.event_status)
        rec.set('event_date', n.event_date)
        rec.set('published_at', n.published_at)
        rec.set('featured', n.featured)
        rec.set('image_url', n.image_url)
        if (n.video_url) rec.set('video_url', n.video_url)
        app.save(rec)
      }
    }

    // 6. Seed Beneficiaries (Ações sociais de entrega, famílias, etc.)
    const benCol = app.findCollectionByNameOrId('beneficiaries')
    const initialBeneficiaries = [
      {
        site: 'both',
        title: 'Entrega de Cestas Básicas Nutritivas na Comunidade Esperança',
        slug: 'entrega-cestas-comunidade-esperanca',
        type: 'Cestas Básicas',
        recipient_name: 'Comunidade Esperança & Moradores da Vila Nova',
        quantity: '450 Cestas de Alimentos',
        location: 'Zona Leste, São Paulo',
        date: 'Maio de 2025',
        summary:
          'Distribuição mensal de cestas completas contendo grãos selecionados, leite, proteínas, legumes frescos da horta e produtos de higiene.',
        description:
          '<p>A entrega mensal do Projeto Abraço não é apenas a entrega de mantimentos, mas um dia de confraternização, triagem de necessidades urgentes e atendimento personalizado com assistentes sociais. Cada família cadastrada recebe orientação nutricional e encaminhamento para serviços públicos essenciais.</p>',
        image_url: 'https://img.usecurling.com/p/1000/600?q=food%20distribution%20charity%20boxes',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        impact_stats: {
          pessoas_beneficiadas: 1800,
          toneladas_alimentos: 6.5,
          familias_atendidas: 450,
        },
      },
      {
        site: 'abraco',
        title: 'Reforma Estrutural e Acolhimento do Lar São Francisco',
        slug: 'reforma-lar-sao-francisco',
        type: 'Reforma Comunitária',
        recipient_name: 'Lar de Idosos São Francisco',
        quantity: '1 Abrigo Totalmente Renovado',
        location: 'São Paulo/SP',
        date: 'Março de 2025',
        summary:
          'Substituição do telhado danificado por infiltrações, pintura antiderrapante, barras de apoio para acessibilidade e novo refeitório.',
        description:
          '<p>Com o auxílio de arquitetos e pedreiros voluntários, reformamos completamente as instalações do Lar São Francisco, garantindo que 42 idosos em vulnerabilidade residam com conforto térmico, segurança de locomoção e dignidade.</p>',
        image_url:
          'https://img.usecurling.com/p/1000/600?q=home%20renovation%20community%20elderly',
        impact_stats: {
          idosos_atendidos: 42,
          voluntarios_envolvidos: 35,
          dias_de_obra: 18,
        },
      },
      {
        site: 'abracolandia',
        title: 'Associação Viver Bem — Destinação dos Fundos da Abraçolândia',
        slug: 'associacao-viver-bem-abracolandia',
        type: 'Instituição Parceira',
        recipient_name: 'Associação Viver Bem (Apoio a Crianças com Deficiência)',
        quantity: 'Repasse Financeiro e Equipamentos de Fisioterapia',
        location: 'Região Metropolitana',
        date: 'Novembro de 2024',
        summary:
          'Graças à arrecadação da última Abraçolândia, financiamos 1 ano completo de atendimento multidisciplinar para 85 crianças especiais.',
        description:
          '<p>A verba repassada viabilizou a contratação de terapeutas ocupacionais, fonoaudiólogos e a aquisição de equipamentos de reabilitação motora infantis importados, ampliando em 70% a capacidade de atendimento da instituição.</p>',
        image_url:
          'https://img.usecurling.com/p/1000/600?q=children%20physical%20therapy%20smile%20support',
        impact_stats: {
          criancas_atendidas: 85,
          sessoes_terapia: 1400,
          equipamentos_adquiridos: 12,
        },
      },
      {
        site: 'abraco',
        title: 'Oficinas de Robótica e Alfabetização Digital para Jovens',
        slug: 'oficinas-robotica-digital',
        type: 'Educação e Inclusão Digital',
        recipient_name: 'Centro Juvenil Futuro Brilhante',
        quantity: '120 Jovens Capacitados',
        location: 'Comunidade Paraíso',
        date: 'Fevereiro de 2025',
        summary:
          'Montagem de laboratório de informática com computadores recondicionados e aulas práticas semanais de programação.',
        description:
          '<p>O projeto formou sua primeira turma de programadores juniores e alfabetização tecnológica básica para jovens e adolescentes, abrindo portas reais para o primeiro emprego e estágio em empresas de tecnologia parceiras.</p>',
        image_url:
          'https://img.usecurling.com/p/1000/600?q=young%20students%20coding%20computers%20classroom',
        impact_stats: {
          jovens_formados: 120,
          computadores_instalados: 25,
          contratados_primeiro_emprego: 18,
        },
      },
    ]

    for (const item of initialBeneficiaries) {
      try {
        app.findFirstRecordByData('beneficiaries', 'slug', item.slug)
      } catch (_) {
        const rec = new Record(benCol)
        rec.set('site', item.site)
        rec.set('title', item.title)
        rec.set('slug', item.slug)
        rec.set('type', item.type)
        rec.set('recipient_name', item.recipient_name)
        rec.set('quantity', item.quantity)
        rec.set('location', item.location)
        rec.set('date', item.date)
        rec.set('summary', item.summary)
        rec.set('description', item.description)
        rec.set('image_url', item.image_url)
        if (item.video_url) rec.set('video_url', item.video_url)
        if (item.impact_stats) rec.set('impact_stats', item.impact_stats)
        app.save(rec)
      }
    }

    // 7. Seed Sponsors (com categorias Diamante, Ouro, Prata, Bronze, Apoiador)
    const sponCol = app.findCollectionByNameOrId('sponsors')
    const initialSponsors = [
      {
        name: 'Koren Ambiental',
        slug: 'koren-ambiental',
        site: 'both',
        tier: 'Diamante',
        logo_url: 'https://img.usecurling.com/i?q=environment&color=059669',
        website: 'https://korenambiental.com',
        description:
          '<p>Empresa pioneira em sustentabilidade, engenharia ambiental e responsabilidade social corporativa. Patrocinadora master dos projetos estruturantes do Projeto Abraço e da Abraçolândia desde 2018.</p>',
        since_year: '2018',
        order: 1,
        featured: true,
      },
      {
        name: 'Banco Solidário Alfa',
        slug: 'banco-solidario-alfa',
        site: 'both',
        tier: 'Diamante',
        logo_url: 'https://img.usecurling.com/i?q=bank&color=1e40af',
        website: 'https://exemplo.com.br/banco-alfa',
        description:
          '<p>Instituição financeira comprometida com o fomento à economia circular, microcrédito comunitário e patrocínio master de eventos culturais beneficentes.</p>',
        since_year: '2020',
        order: 2,
        featured: true,
      },
      {
        name: 'Rede Farma Mais',
        slug: 'rede-farma-mais',
        site: 'abracolandia',
        tier: 'Ouro',
        logo_url: 'https://img.usecurling.com/i?q=pharmacy&color=dc2626',
        website: 'https://exemplo.com.br/farmamais',
        description:
          '<p>Doação contínua de medicamentos de primeira necessidade, kits de primeiros socorros para os mutirões e patrocínio oficial do espaço saúde na Abraçolândia.</p>',
        since_year: '2021',
        order: 3,
        featured: true,
      },
      {
        name: 'Construtora Horizonte',
        slug: 'construtora-horizonte',
        site: 'abraco',
        tier: 'Ouro',
        logo_url: 'https://img.usecurling.com/i?q=building&color=d97706',
        website: 'https://exemplo.com.br/horizonte',
        description:
          '<p>Fornecedora de materiais de construção, cimento e tintas para as reformas de moradias e abrigos comunitários assistidos pelo Projeto Abraço.</p>',
        since_year: '2019',
        order: 4,
        featured: false,
      },
      {
        name: 'Supermercados União',
        slug: 'supermercados-uniao',
        site: 'abracolandia',
        tier: 'Prata',
        logo_url: 'https://img.usecurling.com/i?q=shopping&color=16a34a',
        website: 'https://exemplo.com.br/uniao',
        description:
          '<p>Parceiro no abastecimento da praça de alimentação e arrecadação de alimentos em todas as suas 12 lojas da região.</p>',
        since_year: '2022',
        order: 5,
        featured: false,
      },
      {
        name: 'Transportes Rápido Brasil',
        slug: 'transportes-rapido-brasil',
        site: 'both',
        tier: 'Prata',
        logo_url: 'https://img.usecurling.com/i?q=truck&color=7c3aed',
        website: 'https://exemplo.com.br/rapido-brasil',
        description:
          '<p>Apoio logístico com frota de caminhões para transporte de donativos, palcos e estrutura pesada dos eventos.</p>',
        since_year: '2021',
        order: 6,
        featured: false,
      },
      {
        name: 'Gráfica Express & Sinalização',
        slug: 'grafica-express',
        site: 'abracolandia',
        tier: 'Bronze',
        logo_url: 'https://img.usecurling.com/i?q=printer&color=ea580c',
        website: 'https://exemplo.com.br/grafica-express',
        description:
          '<p>Impressão de cartelas de bingo, convites, banners e sinalização visual completa da Abraçolândia.</p>',
        since_year: '2023',
        order: 7,
        featured: false,
      },
      {
        name: 'Água Mineral da Serra',
        slug: 'agua-mineral-serra',
        site: 'both',
        tier: 'Bronze',
        logo_url: 'https://img.usecurling.com/i?q=water&color=0284c7',
        website: 'https://exemplo.com.br/agua-serra',
        description:
          '<p>Hidratação oficial e gratuita para todas as equipes de voluntários, atletas e visitantes do evento.</p>',
        since_year: '2022',
        order: 8,
        featured: false,
      },
    ]

    for (const s of initialSponsors) {
      try {
        app.findFirstRecordByData('sponsors', 'slug', s.slug)
      } catch (_) {
        const rec = new Record(sponCol)
        rec.set('name', s.name)
        rec.set('slug', s.slug)
        rec.set('site', s.site)
        rec.set('tier', s.tier)
        rec.set('logo_url', s.logo_url)
        rec.set('website', s.website)
        rec.set('description', s.description)
        rec.set('since_year', s.since_year)
        rec.set('order', s.order)
        rec.set('featured', s.featured)
        app.save(rec)
      }
    }

    // 8. Seed Volunteer Areas (Áreas de voluntariado com depoimentos)
    const volCol = app.findCollectionByNameOrId('volunteer_areas')
    const initialVolunteerAreas = [
      {
        site: 'both',
        title: 'Logística & Distribuição de Alimentos',
        slug: 'logistica-e-distribuicao',
        description:
          '<p>Auxiliar na triagem, montagem, conferência e entrega de cestas de alimentos e kits de higiene diretamente nas comunidades atendidas.</p>',
        requirements:
          'Disponibilidade aos sábados pela manhã, pontualidade e disposição física moderada.',
        time_commitment: '4 horas quinzenais',
        spots_available: 15,
        icon_name: 'Package',
        image_url: 'https://img.usecurling.com/p/800/500?q=volunteers%20boxes%20warehouse',
        testimonials: [
          {
            name: 'Mariana Silva',
            role: 'Voluntária há 3 anos',
            text: 'Participar da entrega de cestas me fez enxergar a força e a esperança das famílias. Cada sábado aqui recarrega minha alma.',
          },
        ],
      },
      {
        site: 'abracolandia',
        title: 'Coordenação do Bingo Beneficente',
        slug: 'bingo-beneficente-staff',
        description:
          '<p>Atendimento ao público, distribuição e conferência de cartelas, locução de rodadas extras e entrega dos prêmios aos ganhadores.</p>',
        requirements: 'Facilidade de comunicação, dinamismo e bom humor.',
        time_commitment: 'Durante os 2 dias da Abraçolândia (turnos de 4h)',
        spots_available: 20,
        icon_name: 'Award',
        image_url: 'https://img.usecurling.com/p/800/500?q=bingo%20game%20crowd%20excitement',
        testimonials: [
          {
            name: 'Carlos Alberto',
            role: 'Voluntário de Eventos',
            text: 'A energia da tenda do bingo é contagiante! As famílias se divertem demais sabendo que cada cartela apoia causas nobres.',
          },
        ],
      },
      {
        site: 'abracolandia',
        title: 'Espaço Kids & Recreação Infantil',
        slug: 'espaco-kids-recreacao',
        description:
          '<p>Monitores para brinquedos infláveis, pintura facial, oficinas de desenho, contação de histórias e brincadeiras tradicionais.</p>',
        requirements:
          'Gostar de crianças, paciência e energia; estudantes de pedagogia e educação física são muito bem-vindos!',
        time_commitment: 'Turnos de 3h no fim de semana do evento',
        spots_available: 25,
        icon_name: 'Smile',
        image_url: 'https://img.usecurling.com/p/800/500?q=children%20face%20painting%20fun',
        testimonials: [
          {
            name: 'Beatriz Costa',
            role: 'Monitora Kids',
            text: 'Ver o brilho nos olhos das crianças enquanto os pais curtem a festa em segurança não tem preço!',
          },
        ],
      },
      {
        site: 'abraco',
        title: 'Acolhimento & Atendimento Social',
        slug: 'acolhimento-e-atendimento-social',
        description:
          '<p>Escuta humanizada, triagem das demandas familiares urgentes, cadastro socioeconômico e direcionamento para programas sociais.</p>',
        requirements:
          'Sensibilidade humana, empatia e discrição; preferência para assistentes sociais e psicólogos.',
        time_commitment: '2 a 4 horas semanais',
        spots_available: 8,
        icon_name: 'HeartHandshake',
        image_url: 'https://img.usecurling.com/p/800/500?q=social%20care%20counseling%20smile',
        testimonials: [
          {
            name: 'Renata Mendonça',
            role: 'Psicóloga Voluntária',
            text: 'O Projeto Abraço me dá o espaço perfeito para exercer minha profissão com o mais puro sentido de amor ao próximo.',
          },
        ],
      },
      {
        site: 'both',
        title: 'Comunicação, Fotografia & Mídias',
        slug: 'comunicacao-e-midias',
        description:
          '<p>Cobertura fotográfica das ações, captação de vídeos, elaboração de matérias para o site e criação de conteúdo para redes sociais.</p>',
        requirements: 'Noções de fotografia, edição de vídeo ou redação publicitária/jornalística.',
        time_commitment: 'Flexível conforme as ações',
        spots_available: 6,
        icon_name: 'Camera',
        image_url: 'https://img.usecurling.com/p/800/500?q=photographer%20event%20camera',
        testimonials: [
          {
            name: 'Lucas Ferreira',
            role: 'Designer e Fotógrafo',
            text: 'Fotografar momentos de afeto e levar a mensagem do Abraço para milhares de pessoas na internet é gratificante demais.',
          },
        ],
      },
    ]

    for (const v of initialVolunteerAreas) {
      try {
        app.findFirstRecordByData('volunteer_areas', 'slug', v.slug)
      } catch (_) {
        const rec = new Record(volCol)
        rec.set('site', v.site)
        rec.set('title', v.title)
        rec.set('slug', v.slug)
        rec.set('description', v.description)
        rec.set('requirements', v.requirements)
        rec.set('time_commitment', v.time_commitment)
        rec.set('spots_available', v.spots_available)
        rec.set('icon_name', v.icon_name)
        rec.set('image_url', v.image_url)
        if (v.testimonials) rec.set('testimonials', v.testimonials)
        app.save(rec)
      }
    }

    // 9. Seed Event Sections (A Festa: Programação/Atrações, Gastronomia, Área Infantil, Bingo, Estacionamento)
    const esCol = app.findCollectionByNameOrId('event_sections')
    const initialSections = [
      {
        section_type: 'geral',
        title: 'A Maior Festa Solidária do Ano',
        subtitle: 'Informações gerais de datas, horários e ambiente seguro para toda a família',
        content:
          '<p>A Abraçolândia 2025 reúne mais de 40 mil m² de estrutura coberta, segurança privada 24h, brigadistas, ambulatório médico de apoio e acessibilidade total para cadeirantes e pessoas com mobilidade reduzida.</p><p><strong>Data:</strong> Sábado (18/10) das 11h às 23h e Domingo (19/10) das 11h às 21h.<br/><strong>Entrada Solidária:</strong> R$ 25,00 por pessoa (crianças até 10 anos acompanhadas não pagam).</p>',
        order: 1,
        image_url: 'https://img.usecurling.com/p/1000/600?q=festival%20event%20crowd%20fair',
      },
      {
        section_type: 'atracoes',
        title: 'Atrações & Shows Confirmados',
        subtitle: 'Mais de 16 horas de música ao vivo, dança e apresentações culturais',
        content:
          '<p>Dois palcos simultâneos recebendo grandes nomes da MPB, Sertanejo, Samba de Raiz, Pop Rock e apresentações folclóricas das comunidades.</p>',
        items: [
          {
            name: 'Grupo Raízes do Samba',
            genre: 'Samba & Pagode Tradicional',
            time: 'Sábado • 14h00 • Palco Principal',
            desc: 'Roda de samba acústica com clássicos inesquecíveis.',
          },
          {
            name: 'Banda Acústico 80',
            genre: 'Pop Rock Nacional e Internacional',
            time: 'Sábado • 19h00 • Palco Principal',
            desc: 'Os maiores sucessos que marcaram gerações em versões vibrantes.',
          },
          {
            name: 'Orquestra Jovem da Comunidade',
            genre: 'Música Instrumental & Clássica',
            time: 'Domingo • 12h00 • Palco Cultural',
            desc: '40 jovens talentos apresentando trilhas sonoras consagradas do cinema.',
          },
          {
            name: 'Trio Forró do Sertão',
            genre: 'Forró Pé de Serra',
            time: 'Domingo • 16h30 • Palco Cultural',
            desc: 'Muita animação, xote e baião para botar todo mundo pra dançar.',
          },
          {
            name: 'Dupla Vitor & Thiago',
            genre: 'Sertanejo Universitário',
            time: 'Domingo • 19h30 • Palco Principal',
            desc: 'Show de encerramento especial com grandes sucessos autorais.',
          },
        ],
        order: 2,
        image_url:
          'https://img.usecurling.com/p/1000/600?q=live%20band%20concert%20stage%20singers',
      },
      {
        section_type: 'gastronomia',
        title: 'Praça de Alimentação & Gastronomia',
        subtitle:
          'Mais de 25 opções culinárias entre pratos típicos, food trucks e sobremesas deliciosas',
        content:
          '<p>Uma verdadeira viagem de sabores com curadoria especial! Cada barraca e food truck contribui com percentual de suas vendas para o Projeto Abraço.</p>',
        items: [
          {
            name: 'Costela de Chão Tradicional do Abraço',
            category: 'Churrasco & Carnes Nobres',
            desc: 'Costela assada por 12 horas no fogo de chão com mandioca na manteiga de garrafa e vinagrete especial.',
          },
          {
            name: 'Espaço Italiano Nonna Maria',
            category: 'Massas Artesanais & Pizzas',
            desc: 'Lasanha à bolonhesa, nhoque artesanal ao sugo e pizzas individuais assadas em forno a lenha.',
          },
          {
            name: 'Cantinho Baiano & Nordestino',
            category: 'Pratos Típicos',
            desc: 'Acarajé feito na hora, vatapá, baião de dois caprichado e tapiocas recheadas.',
          },
          {
            name: 'Vila dos Burgers Gourmet',
            category: 'Hambúrgueres Artesanais',
            desc: 'Burgers 100% Angus com queijo derretido, bacon crocante e maionese defumada.',
          },
          {
            name: 'Doce Abraço (Sobremesas & Cafés)',
            category: 'Doces & Sobremesas',
            desc: 'Churros gourmet, fondue de morango com chocolate belga, bolos caseiros e cafés especiais.',
          },
        ],
        order: 3,
        image_url:
          'https://img.usecurling.com/p/1000/600?q=food%20truck%20barbecue%20tasty%20dishes',
      },
      {
        section_type: 'espaco_kids',
        title: 'Espaço Kids & Parque de Diversões',
        subtitle: 'Segurança e alegria garantida para a criançada com monitores treinados',
        content:
          '<p>O maior espaço infantil da região com circuito de brinquedos infláveis gigantes, touro mecânico infantil, cama elástica, tirolesa assistida, oficina de slime, pintura no rosto e teatro de fantoches com temas sobre amizade e preservação da natureza.</p><p>Todas as crianças recebem pulseira de identificação com telefone do responsável na entrada do espaço.</p>',
        items: [
          {
            name: 'Mega Tobogã Inflável Aventura',
            age: 'A partir de 4 anos',
            info: 'Monitores em tempo integral no topo e na base',
          },
          {
            name: 'Oficina de Criatividade & Artes',
            age: 'Livre',
            info: 'Pintura em tela, massinha e materiais recicláveis',
          },
          {
            name: 'Teatro de Bonecos "O Abraço Mágico"',
            age: 'Livre',
            info: 'Apresentações às 14h e 17h nos dois dias',
          },
          {
            name: 'Fliperamas & Jogos Retrô',
            age: 'A partir de 7 anos',
            info: 'Clássicos dos videogames liberados para pais e filhos',
          },
        ],
        order: 4,
        image_url: 'https://img.usecurling.com/p/1000/600?q=kids%20inflatable%20playground%20fun',
      },
      {
        section_type: 'bingo',
        title: 'O Lendário Bingo Beneficente',
        subtitle: 'Grandes prêmios, emoção e 100% da arrecadação destinada a famílias assistidas',
        content:
          '<p>O momento mais esperado da Abraçolândia! O bingo conta com sistema eletrônico de conferência, telões gigantes de alta definição e transmissão ao vivo no pavilhão para que ninguém perca nenhuma pedra sorteada.</p><p>As cartelas podem ser adquiridas antecipadamente nos pontos de venda ou durante o próprio evento.</p>',
        items: [
          {
            round: '1ª Rodada Especial',
            prize: 'Smart TV 65" 4K + Soundbar',
            time: 'Sábado às 17h00',
          },
          {
            round: '2ª Rodada Especial',
            prize: 'Geladeira Frost Free Inox + Micro-ondas',
            time: 'Sábado às 20h30',
          },
          {
            round: '3ª Rodada Especial',
            prize: 'Notebook Core i7 + Tablet Premium',
            time: 'Domingo às 15h30',
          },
          {
            round: 'Super Rodada Final (Rodada de Ouro)',
            prize: 'Carro 0km ou R$ 80.000,00 em barras de ouro',
            time: 'Domingo às 18h30',
          },
        ],
        order: 5,
        image_url: 'https://img.usecurling.com/p/1000/600?q=bingo%20balls%20lottery%20prize',
      },
      {
        section_type: 'estacionamento',
        title: 'Estacionamento & Transporte',
        subtitle: 'Comodidade, segurança e orientações para visitantes e credenciados',
        content:
          '<p>Contamos com estacionamento oficial fechado com seguro para mais de 1.500 veículos no próprio local do evento, além de bolsão exclusivo para motos e bicicletário gratuito monitorado.</p><p><strong>Vagas Especiais:</strong> Reservas sinalizadas para PCD, idosos e gestantes próximas à entrada principal.<br/><strong>Tarifa Solidária:</strong> R$ 20,00 por veículo para todo o período (revertido para a manutenção do projeto).<br/><strong>Transporte Público / Vans Gratuitas:</strong> Vans de integração saem a cada 15 minutos do Terminal Metropolitano Central direto para os portões da Abraçolândia.</p>',
        order: 6,
        image_url: 'https://img.usecurling.com/p/1000/600?q=parking%20lot%20cars%20transport',
      },
    ]

    for (const s of initialSections) {
      try {
        app.findFirstRecordByData('event_sections', 'section_type', s.section_type)
      } catch (_) {
        const rec = new Record(esCol)
        rec.set('section_type', s.section_type)
        rec.set('title', s.title)
        rec.set('subtitle', s.subtitle)
        rec.set('content', s.content)
        if (s.items) rec.set('items', s.items)
        rec.set('order', s.order)
        rec.set('image_url', s.image_url)
        app.save(rec)
      }
    }

    // 10. Seed Ticket Outlets / Convites (PDVs físicos e online)
    const tkCol = app.findCollectionByNameOrId('ticket_outlets')
    const initialTickets = [
      {
        name: 'Venda Online Oficial (Portal Sympla Abraço)',
        type: 'Online',
        city: 'Online / Todo o Brasil',
        address: 'https://site.projetoabraco.org.br/ingressos',
        phone: '(11) 99999-8888',
        opening_hours: '24 horas por dia (compra imediata)',
        url: 'https://site.projetoabraco.org.br/ingressos',
        price_info: 'Convite Individual: R$ 25,00 • Combo Família (4 pessoas): R$ 80,00',
        available: true,
        description:
          '<p>Receba seu ingresso diretamente no e-mail ou no celular via QR Code para entrada rápida sem filas.</p>',
      },
      {
        name: 'Sede Central do Projeto Abraço',
        type: 'Físico',
        city: 'São Paulo',
        address: 'Rua da Solidariedade, 450 - Bairro da Esperança',
        phone: '(11) 3234-5678',
        opening_hours: 'Segunda a Sexta das 08h às 18h | Sábados das 08h às 12h',
        price_info: 'Dinheiro, Pix, Cartão de Débito e Crédito em até 3x sem juros',
        available: true,
        description:
          '<p>Adquira seu convite físico e aproveite para conhecer nossa central de triagem de doações.</p>',
      },
      {
        name: 'Loja Rede Farma Mais - Unidade Centro',
        type: 'Físico',
        city: 'São Paulo',
        address: 'Av. Paulista, 1500 - Bela Vista',
        phone: '(11) 3888-1000',
        opening_hours: 'Segunda a Sábado das 07h às 22h | Domingos das 08h às 20h',
        price_info: 'R$ 25,00 (Venda no caixa principal)',
        available: true,
        description:
          '<p>Ponto de venda parceiro com facilidade de acesso ao lado da estação de metrô.</p>',
      },
      {
        name: 'Supermercados União - Unidade Sul',
        type: 'Físico',
        city: 'Santo André',
        address: 'Rua das Figueiras, 800 - Bairro Jardim',
        phone: '(11) 4433-2211',
        opening_hours: 'Todos os dias das 08h às 21h',
        price_info: 'R$ 25,00 • Aceita todos os cartões',
        available: true,
        description: '<p>Balcão de atendimento ao cliente / SAC na entrada do supermercado.</p>',
      },
      {
        name: 'Koren Ambiental - Recepção Corporativa',
        type: 'Físico',
        city: 'São Bernardo do Campo',
        address: 'Av. Kennedy, 1200 - Torre Empresarial, Sala 1402',
        phone: '(11) 4122-9900',
        opening_hours: 'Segunda a Sexta das 09h às 17h',
        price_info: 'R$ 25,00 • Pagamentos via Pix e Cartão',
        available: true,
        description:
          '<p>Ponto corporativo para colaboradores, fornecedores e público em geral.</p>',
      },
    ]

    for (const t of initialTickets) {
      try {
        app.findFirstRecordByData('ticket_outlets', 'name', t.name)
      } catch (_) {
        const rec = new Record(tkCol)
        rec.set('name', t.name)
        rec.set('type', t.type)
        rec.set('city', t.city)
        rec.set('address', t.address)
        rec.set('phone', t.phone)
        rec.set('opening_hours', t.opening_hours)
        rec.set('url', t.url)
        rec.set('price_info', t.price_info)
        rec.set('available', t.available)
        rec.set('description', t.description)
        app.save(rec)
      }
    }

    // 11. Seed Past Editions / Festas Anteriores
    const peCol = app.findCollectionByNameOrId('past_editions')
    const initialEditions = [
      {
        year: '2024',
        theme: 'Abraçolândia 2024: O Poder da União',
        slug: 'abracolandia-2024-o-poder-da-uniao',
        summary:
          'Edição recorde com mais de 12.000 visitantes e arrecadação histórica de R$ 320 mil totalmente revertidos para a construção do Centro Social.',
        description:
          '<p>A 11ª edição da Abraçolândia superou todas as expectativas. Foram dois dias de clima perfeito, famílias reunidas, mais de 3 toneladas de carne na praça de alimentação e uma super final de bingo com o sorteio de um automóvel 0km.</p><p>Com os recursos arrecadados, conseguimos manter as cestas básicas de 450 famílias por 8 meses ininterruptos e dar início às obras da nova brinquedoteca comunitária.</p>',
        raised_amount: 'R$ 320.000,00',
        attendance: '12.400 pessoas',
        benefited_families: '450 famílias',
        image_url: 'https://img.usecurling.com/p/1000/600?q=festival%20crowd%20happy%20celebration',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        gallery: [
          {
            url: 'https://img.usecurling.com/p/800/600?q=festival%20stage%20singers',
            caption: 'Show principal no sábado à noite',
          },
          {
            url: 'https://img.usecurling.com/p/800/600?q=children%20playing%20balloons',
            caption: 'Espaço Kids com recreadores voluntários',
          },
          {
            url: 'https://img.usecurling.com/p/800/600?q=food%20truck%20family%20eating',
            caption: 'Praça de Alimentação lotada de sorrisos',
          },
          {
            url: 'https://img.usecurling.com/p/800/600?q=bingo%20winner%20trophy%20key',
            caption: 'Ganhadora do carro 0km no Bingo de Ouro',
          },
        ],
      },
      {
        year: '2023',
        theme: 'Abraçolândia 2023: Construindo Novos Horizontes',
        slug: 'abracolandia-2023-construindo-novos-horizontes',
        summary:
          'A celebração dos 10 anos de fundação do Projeto Abraço em um festival memorável com grandes tributos musicais e solidariedade.',
        description:
          '<p>A edição comemorativa de 10 anos foi marcada pela emocionante homenagem aos 20 primeiros voluntários fundadores. O evento contou com uma exposição fotográfica histórica e shows de tributo ao pop rock dos anos 80 e 90.</p>',
        raised_amount: 'R$ 265.000,00',
        attendance: '9.800 pessoas',
        benefited_families: '380 famílias',
        image_url:
          'https://img.usecurling.com/p/1000/600?q=music%20concert%20festival%20stage%20lights',
        gallery: [
          {
            url: 'https://img.usecurling.com/p/800/600?q=volunteers%20group%20photo%20hug',
            caption: 'Foto oficial de voluntários e organizadores',
          },
          {
            url: 'https://img.usecurling.com/p/800/600?q=acoustic%20guitar%20concert',
            caption: 'Apresentação acústica emocionante',
          },
        ],
      },
      {
        year: '2022',
        theme: 'Abraçolândia 2022: O Grande Reencontro',
        slug: 'abracolandia-2022-o-grande-reencontro',
        summary:
          'O retorno presencial das grandes festas com emoção à flor da pele e renovação dos laços comunitários.',
        description:
          '<p>Após o período de restrições sanitárias, a edição de 2022 celebrou a resiliência e a vitória da vida, com participação em massa da comunidade local e doação emergencial para famílias afetadas pelas chuvas de verão.</p>',
        raised_amount: 'R$ 210.000,00',
        attendance: '8.200 pessoas',
        benefited_families: '320 famílias',
        image_url: 'https://img.usecurling.com/p/1000/600?q=community%20joy%20festival%20reunion',
        gallery: [
          {
            url: 'https://img.usecurling.com/p/800/600?q=families%20laughing%20food',
            caption: 'Reencontro de famílias e amigos',
          },
          {
            url: 'https://img.usecurling.com/p/800/600?q=bingo%20hall%20players',
            caption: 'Tenda do Bingo cheia em todas as rodadas',
          },
        ],
      },
    ]

    for (const p of initialEditions) {
      try {
        app.findFirstRecordByData('past_editions', 'year', p.year)
      } catch (_) {
        const rec = new Record(peCol)
        rec.set('year', p.year)
        rec.set('theme', p.theme)
        rec.set('slug', p.slug)
        rec.set('summary', p.summary)
        rec.set('description', p.description)
        rec.set('raised_amount', p.raised_amount)
        rec.set('attendance', p.attendance)
        rec.set('benefited_families', p.benefited_families)
        rec.set('image_url', p.image_url)
        if (p.video_url) rec.set('video_url', p.video_url)
        if (p.gallery) rec.set('gallery', p.gallery)
        app.save(rec)
      }
    }
  },
  (app) => {
    // down migration
  },
)
