migrate(
  (app) => {
    // Atualizar ou semear dados com logos das empresas parceiras
    const sponsorLogos = [
      {
        name: 'Koren Ambiental',
        slug: 'koren-ambiental',
        tier: 'Diamante',
        logo_url: 'https://img.usecurling.com/i?q=environment&color=059669',
        website: 'https://korenambiental.com',
        since_year: '2018',
        description:
          '<p>Empresa pioneira em sustentabilidade, engenharia ambiental e responsabilidade social corporativa. Patrocinadora master dos projetos estruturantes do Projeto Abraço e da Abraçolândia desde 2018.</p>',
      },
      {
        name: 'Pipoll Travel',
        slug: 'pipoll-travel',
        tier: 'Diamante',
        logo_url: 'https://img.usecurling.com/i?q=travel&color=2e3192',
        website: 'https://pipolltravel.com.br',
        since_year: '2019',
        description:
          '<p>Empresa parceira oficial do Projeto Abraço, apoiando viagens, intercâmbios e logística solidária para ações assistenciais e realização da Abraçolândia.</p>',
      },
      {
        name: 'Banco Solidário Alfa',
        slug: 'banco-solidario-alfa',
        tier: 'Diamante',
        logo_url: 'https://img.usecurling.com/i?q=bank&color=1e40af',
        website: 'https://bancoalfa.com.br',
        since_year: '2020',
        description:
          '<p>Instituição financeira comprometida com o fomento à economia circular, microcrédito comunitário e patrocínio master de eventos culturais beneficentes.</p>',
      },
      {
        name: 'Talento Seguros',
        slug: 'talento-seguros',
        tier: 'Diamante',
        logo_url: 'https://img.usecurling.com/i?q=insurance&color=8d198f',
        website: 'https://talentoseguros.com.br',
        since_year: '2019',
        description:
          '<p>A Talento Seguros apoia as causas sociais e os eventos do Projeto Abraço, viabilizando infraestrutura e segurança para todas as edições.</p>',
      },
      {
        name: 'Questa',
        slug: 'questa',
        tier: 'Ouro',
        logo_url: 'https://img.usecurling.com/i?q=consulting&color=f89c0e',
        website: 'https://questa.com.br',
        since_year: '2020',
        description:
          '<p>Parceira estratégica do Projeto Abraço na realização de projetos comunitários e campanhas de arrecadação.</p>',
      },
      {
        name: 'Grupo Curumim',
        slug: 'grupo-curumim',
        tier: 'Ouro',
        logo_url: 'https://img.usecurling.com/i?q=childhood&color=ed0e58',
        website: 'https://grupocurumim.com.br',
        since_year: '2021',
        description:
          '<p>Apoio contínuo às iniciativas infantojuvenis e aos eventos culturais e recreativos do Projeto Abraço.</p>',
      },
      {
        name: 'Alfa Alimentos',
        slug: 'alfa-alimentos',
        tier: 'Ouro',
        logo_url: 'https://img.usecurling.com/i?q=food&color=01abb7',
        website: 'https://alfaalimentos.com.br',
        since_year: '2020',
        description:
          '<p>Fornecimento e doação de itens essenciais e alimentos para as entidades assistenciais selecionadas.</p>',
      },
      {
        name: 'Rede Farma Mais',
        slug: 'rede-farma-mais',
        tier: 'Ouro',
        logo_url: 'https://img.usecurling.com/i?q=pharmacy&color=dc2626',
        website: 'https://farmamais.com.br',
        since_year: '2021',
        description:
          '<p>Doação contínua de medicamentos de primeira necessidade, kits de primeiros socorros para os mutirões e patrocínio oficial do espaço saúde na Abraçolândia.</p>',
      },
      {
        name: 'Construtora Horizonte',
        slug: 'construtora-horizonte',
        tier: 'Ouro',
        logo_url: 'https://img.usecurling.com/i?q=building&color=d97706',
        website: 'https://construtorahorizonte.com.br',
        since_year: '2019',
        description:
          '<p>Fornecedora de materiais de construção, cimento e tintas para as reformas de moradias e abrigos comunitários assistidos pelo Projeto Abraço.</p>',
      },
      {
        name: 'Facintelli',
        slug: 'facintelli',
        tier: 'Prata',
        logo_url: 'https://img.usecurling.com/i?q=enterprise&color=2e3192',
        website: 'https://facintelli.com.br',
        since_year: '2021',
        description:
          '<p>Parceiro que colabora ativamente na estrutura e realização dos eventos beneficentes do Projeto Abraço.</p>',
      },
      {
        name: 'Bazar Irmãos Kido',
        slug: 'bazar-irmaos-kido',
        tier: 'Prata',
        logo_url: 'https://img.usecurling.com/i?q=store&color=8d198f',
        website: 'https://irmaoskido.com.br',
        since_year: '2018',
        description:
          '<p>Apoio histórico com suprimentos, utilidades e itens para as barracas da Abraçolândia e projetos assistenciais.</p>',
      },
      {
        name: 'Ozz',
        slug: 'ozz',
        tier: 'Prata',
        logo_url: 'https://img.usecurling.com/i?q=creative&color=01abb7',
        website: 'https://ozzdesign.com.br',
        since_year: '2022',
        description:
          '<p>Empresa parceira na divulgação, design e infraestrutura dos eventos do Projeto Abraço.</p>',
      },
      {
        name: 'Supermercados União',
        slug: 'supermercados-uniao',
        tier: 'Prata',
        logo_url: 'https://img.usecurling.com/i?q=shopping&color=16a34a',
        website: 'https://supermercadosuniao.com.br',
        since_year: '2022',
        description:
          '<p>Parceiro no abastecimento da praça de alimentação e arrecadação de alimentos em todas as suas lojas da região.</p>',
      },
      {
        name: 'Transportes Rápido Brasil',
        slug: 'transportes-rapido-brasil',
        tier: 'Prata',
        logo_url: 'https://img.usecurling.com/i?q=truck&color=7c3aed',
        website: 'https://rapidobrasil.com.br',
        since_year: '2021',
        description:
          '<p>Apoio logístico com frota de caminhões para transporte de donativos, palcos e estrutura pesada dos eventos.</p>',
      },
      {
        name: 'Instituto i9c',
        slug: 'instituto-i9c',
        tier: 'Bronze',
        logo_url: 'https://img.usecurling.com/i?q=innovation&color=ed0e58',
        website: 'https://i9c.org.br',
        since_year: '2022',
        description:
          '<p>Instituto parceiro no desenvolvimento comunitário, gestão de impacto social e projetos de capacitação.</p>',
      },
      {
        name: 'Yamamura',
        slug: 'yamamura',
        tier: 'Bronze',
        logo_url: 'https://img.usecurling.com/i?q=lighting&color=f89c0e',
        website: 'https://yamamura.com.br',
        since_year: '2021',
        description:
          '<p>Apoio aos projetos de iluminação, reformas e benfeitorias em entidades assistenciais parceiras.</p>',
      },
      {
        name: 'Soneda',
        slug: 'soneda',
        tier: 'Bronze',
        logo_url: 'https://img.usecurling.com/i?q=beauty&color=8d198f',
        website: 'https://soneda.com.br',
        since_year: '2022',
        description:
          '<p>Rede parceira apoiando ações de bem-estar, autocuidado e arrecadação de donativos.</p>',
      },
      {
        name: 'Gráfica Express & Sinalização',
        slug: 'grafica-express',
        tier: 'Bronze',
        logo_url: 'https://img.usecurling.com/i?q=printer&color=ea580c',
        website: 'https://graficaexpress.com.br',
        since_year: '2023',
        description:
          '<p>Impressão de cartelas de bingo, convites, banners e sinalização visual completa da Abraçolândia.</p>',
      },
      {
        name: 'Água Mineral da Serra',
        slug: 'agua-mineral-serra',
        tier: 'Bronze',
        logo_url: 'https://img.usecurling.com/i?q=water&color=0284c7',
        website: 'https://aguadaserra.com.br',
        since_year: '2022',
        description:
          '<p>Hidratação oficial e gratuita para todas as equipes de voluntários, atletas e visitantes do evento.</p>',
      },
      {
        name: 'Sacolão Saúde',
        slug: 'sacolao-saude',
        tier: 'Apoiador',
        logo_url: 'https://img.usecurling.com/i?q=grocery&color=16a34a',
        website: 'https://sacolaosaude.com.br',
        since_year: '2023',
        description:
          '<p>Fornecimento de frutas, legumes e alimentos frescos para alimentação dos voluntários e ações sociais.</p>',
      },
      {
        name: 'GlikSmart',
        slug: 'gliksmart',
        tier: 'Apoiador',
        logo_url: 'https://img.usecurling.com/i?q=technology&color=2e3192',
        website: 'https://gliksmart.com.br',
        since_year: '2023',
        description:
          '<p>Tecnologia e automação inteligente apoiando as operações digitais do Projeto Abraço.</p>',
      },
    ]

    const sponsorsCol = app.findCollectionByNameOrId('sponsors')

    for (let i = 0; i < sponsorLogos.length; i++) {
      const data = sponsorLogos[i]
      try {
        const record = app.findFirstRecordByData('sponsors', 'slug', data.slug)
        record.set('logo_url', data.logo_url)
        if (data.website && !record.get('website')) record.set('website', data.website)
        if (data.since_year && !record.get('since_year')) record.set('since_year', data.since_year)
        app.save(record)
      } catch (_) {
        const record = new Record(sponsorsCol)
        record.set('name', data.name)
        record.set('slug', data.slug)
        record.set('tier', data.tier)
        record.set('site', 'both')
        record.set('logo_url', data.logo_url)
        record.set('website', data.website)
        record.set('since_year', data.since_year)
        record.set('description', data.description)
        record.set('order', i + 1)
        record.set('featured', data.tier === 'Diamante' || data.tier === 'Ouro')
        app.save(record)
      }
    }
  },
  (app) => {
    // down migration
  },
)
