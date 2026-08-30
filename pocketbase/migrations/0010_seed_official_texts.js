migrate(
  (app) => {
    const contentBlocksCol = app.findCollectionByNameOrId('content_blocks')
    const sponsorsCol = app.findCollectionByNameOrId('sponsors')
    const beneficiariesCol = app.findCollectionByNameOrId('beneficiaries')
    const pastEditionsCol = app.findCollectionByNameOrId('past_editions')
    const settingsCol = app.findCollectionByNameOrId('site_settings')

    // 1. Atualizar / Inserir content_blocks institucionais e do hotsite com textos oficiais verbatim
    const officialBlocks = [
      {
        slug: 'quem-somos',
        site: 'abraco',
        title: 'QUEM SOMOS?',
        subtitle: 'Um projeto feito de pessoas para pessoas.',
        body: '<p>O Projeto Abraço é uma organização não governamental, sem fins lucrativos, com atuação na área de assistência social. Há mais de 20 anos, um grupo de amigos realiza pequenas ações sociais e com o tempo, o pouco de cada um resultou em proporções maiores. Este grupo tinha um único objetivo, além de fazer da diversão uma boa ação, pois sempre dependeu do apoio e da alegria das pessoas, precisamos começar com muita alegria. E assim nasceu o Projeto Abraço.</p><p>Um projeto feito de pessoas para pessoas. O Projeto Abraço atua na realização de eventos e ações sociais que unem solidariedade, inclusão, cidadania e participação. Ao longo de sua trajetória, o projeto já beneficiou milhares de pessoas por meio de iniciativas direcionadas a instituições assistenciais e comunidades, buscando contribuir para diferentes necessidades e realidades. Sua atuação alcança crianças, jovens, adultos e idosos, por meio de ações educativas, assistenciais, culturais e recreativas. Mais do que promover uma ação pontual, o Projeto Abraço busca reunir pessoas dispostas a colaborar e transformar essa mobilização em benefícios para instituições e comunidades. É um trabalho construído coletivamente, com a participação de voluntários, parceiros, apoiadores e de todos aqueles que acreditam que pequenas atitudes podem ganhar uma dimensão muito maior quando realizadas em conjunto.</p>',
        order: 1,
      },
      {
        slug: 'o-que-fazemos',
        site: 'abraco',
        title: 'O QUE FAZEMOS?',
        subtitle: 'Alegria que se transforma em impacto social.',
        body: '<p>Promovemos eventos e ações sociais gerando, a fim de proporcionar um projeto de benfeitoria para instituições assistenciais e comunidades carentes em todo território nacional. Nosso trabalho beneficia crianças, jovens, adultos e idosos.</p><p>Alegria que se transforma em impacto social. O Projeto Abraço promove eventos e ações sociais com o objetivo de gerar recursos e viabilizar projetos de benfeitoria para instituições assistenciais e comunidades carentes. As iniciativas são desenvolvidas buscando atender necessidades reais das instituições e dos públicos beneficiados. A atuação do projeto envolve diferentes áreas, entre elas: assistência social; educação; cultura; esporte; saúde; lazer; atividades recreativas; ações de inclusão e cidadania. O trabalho beneficia pessoas de diferentes faixas etárias, incluindo crianças, jovens, adultos e idosos. A proposta é simples na origem, mas ampla em seu alcance: mobilizar pessoas, criar experiências positivas e transformar essa participação em ações capazes de contribuir para a vida de outras pessoas.</p>',
        order: 2,
      },
      {
        slug: 'abracolandia-institucional',
        site: 'abraco',
        title: 'A ABRAÇOLÂNDIA',
        subtitle: 'Diversão que se transforma em uma boa ação.',
        body: '<p>O Projeto Abraço atua desde 2005 na organização da Abraçolândia, um evento social, cultural e recreativo. Toda renda obtida através deste evento é integralmente revertida em instituições e/ou comunidades carentes, previamente selecionadas, em forma de projetos de benfeitorias.</p><p>Diversão que se transforma em uma boa ação. Desde 2005, o Projeto Abraço realiza a Abraçolândia, um evento social, cultural e recreativo que se tornou parte importante da história do projeto. A Abraçolândia reúne entretenimento, convivência e solidariedade em torno de um propósito comum. A renda obtida por meio do evento é integralmente revertida para instituições e/ou comunidades carentes previamente selecionadas, por meio de projetos de benfeitoria. Esse modelo permite que a participação no evento vá além da diversão. Quem participa, apoia ou colabora com a Abraçolândia também passa a fazer parte da corrente de solidariedade criada pelo Projeto Abraço. Por isso, a Abraçolândia representa de maneira muito clara a essência do projeto: divertir, reunir pessoas e transformar essa energia em uma boa ação.</p>',
        order: 3,
      },
      {
        slug: 'nossa-historia-linha-do-tempo',
        site: 'abraco',
        title: 'UMA HISTÓRIA CONSTRUÍDA AO LONGO DOS ANOS',
        subtitle: 'A trajetória do Projeto Abraço não começou hoje.',
        body: '<p>A trajetória do Projeto Abraço não começou hoje. Desde 2005, diferentes projetos, ações e edições foram realizados, acompanhando diferentes públicos e necessidades. Entre os projetos e ações registrados ao longo dessa história estão:</p><ul><li><strong>2005</strong> – Recreios do Abraço</li><li><strong>2006</strong> – O Mundo do Abraço</li><li><strong>2007</strong> – Delas e Feras</li><li><strong>2008</strong> – Abraçando a 3ª Idade</li><li><strong>2009</strong> – Mundo dos Carentes da Marambaia</li><li><strong>2010</strong> – Brincando nos Cuidados</li><li><strong>2011</strong> – Banda da Costa e Silva</li><li><strong>2012</strong> – Abraço na Comunidade do Inga</li><li><strong>2015</strong> – Huell Abraço Favorito</li><li><strong>2019</strong> – 2º Reino do Abraço – Carambola</li></ul><p>Essa história ajuda a mostrar que o Projeto Abraço não está baseado apenas na realização de um evento, mas em uma trajetória de mobilização social construída durante mais de duas décadas.</p>',
        order: 4,
      },
      {
        slug: 'quem-beneficia',
        site: 'abraco',
        title: 'QUEM O PROJETO ABRAÇO BENEFICIA',
        subtitle: 'Um abraço que alcança diferentes gerações',
        body: '<p>O trabalho desenvolvido pelo Projeto Abraço não é direcionado a apenas um público. As ações podem beneficiar: crianças, jovens, adultos e idosos, sempre por meio de instituições, projetos e comunidades selecionados para receber as iniciativas realizadas pelo projeto. Cada ação parte da ideia de que diferentes públicos possuem necessidades diferentes. Por isso, os projetos desenvolvidos ao longo dos anos transitam por áreas como assistência social, educação, cultura, saúde, esporte, lazer e convivência.</p>',
        order: 5,
      },
      {
        slug: 'voluntariado-institucional',
        site: 'abraco',
        title: 'VOLUNTARIADO',
        subtitle: 'Faça parte dessa história',
        body: '<p>O Projeto Abraço é feito por pessoas. Pessoas que doam tempo, trabalho, conhecimento, apoio e disposição para ajudar a transformar cada iniciativa em realidade. Ser voluntário é uma das formas de participar dessa corrente. Ao longo das ações e eventos, diferentes pessoas se unem em torno de um objetivo comum, contribuindo para que os projetos possam chegar às instituições e aos públicos beneficiados. Se você acredita que a diversão também pode se transformar em uma boa ação, venha fazer parte do Projeto Abraço. Cadastre-se como voluntário.</p>',
        order: 6,
      },
      {
        slug: 'empresas-parceiros',
        site: 'abraco',
        title: 'EMPRESAS E PARCEIROS',
        subtitle: 'Uma transformação construída em conjunto',
        body: '<p>A realização das ações do Projeto Abraço também depende da participação de empresas, patrocinadores, fornecedores e parceiros que acreditam no propósito do projeto. Essa colaboração ajuda a viabilizar eventos, estruturas, serviços e iniciativas que posteriormente se transformam em benefícios para as instituições selecionadas. Ao apoiar o Projeto Abraço, empresas e parceiros passam a integrar uma rede de pessoas e organizações mobilizadas em torno de uma finalidade social comum.</p>',
        order: 7,
      },
      {
        slug: 'nosso-proposito',
        site: 'abraco',
        title: 'NOSSO PROPÓSITO',
        subtitle: 'Faça da diversão uma boa ação',
        body: '<p>O Projeto Abraço acredita na capacidade das pessoas de transformar realidades quando se unem em torno de um propósito. Foi assim que pequenas ações realizadas por um grupo de amigos cresceram. Foi assim que nasceu uma história que já atravessa mais de duas décadas. E é assim que o projeto continua: reunindo pessoas, promovendo encontros e transformando participação em solidariedade. Porque um abraço pode representar acolhimento. Pode representar cuidado. Pode representar presença. E, quando muitas pessoas se unem, pode também representar transformação. Projeto Abraço. Faça da diversão uma boa ação.</p>',
        order: 8,
      },
      {
        slug: 'faca-parte-cta',
        site: 'abraco',
        title: 'FAÇA PARTE!',
        subtitle: 'VAMOS FAZER DA DIVERSÃO UMA BOA AÇÃO!',
        body: '<p>Você também pode fazer parte dessa história. Participe das ações. Seja voluntário. Acompanhe o Projeto Abraço. Apoie nossos projetos.</p><p>Acesse <strong>projetoabraco.org.br</strong> e siga-nos no Instagram <strong>@projetoabraco</strong>. Cadastre-se como voluntário e FAÇA PARTE!</p>',
        order: 9,
      },
      {
        slug: 'apresentacao-geral',
        site: 'abraco',
        title: 'PROJETO ABRAÇO',
        subtitle: 'Faça da diversão uma boa ação.',
        body: '<p>O Projeto Abraço é uma organização não governamental, sem fins lucrativos, que há mais de 20 anos desenvolve ações voltadas à assistência social, educação, cultura, esporte, saúde e lazer. Sua história nasceu da iniciativa de um grupo de amigos que começou realizando pequenas ações sociais. Com o passar do tempo, a participação de mais pessoas e a vontade de fazer a diferença fizeram com que essas iniciativas ganhassem novas proporções. O que começou com pequenos gestos se transformou em um projeto capaz de mobilizar voluntários, parceiros e apoiadores em torno de um mesmo propósito: transformar diversão, convivência e solidariedade em ações concretas para quem precisa. É dessa essência que nasce uma das frases que melhor traduz o Projeto Abraço: Faça da diversão uma boa ação.</p>',
        order: 0,
      },
      {
        slug: 'abracolandia-2025',
        site: 'abracolandia',
        title: 'ABRAÇOLÂNDIA 2025 – O Mágico Circo do Abraço',
        subtitle: 'Reunindo diversão e solidariedade em uma grande ação social.',
        body: '<p>Em 2025, a Abraçolândia ganhou o tema "O Mágico Circo do Abraço", mantendo a proposta de reunir diversão e solidariedade em uma grande ação social. Na edição, foram definidas como instituições beneficiadas: ABRACO, Casa Safira, Associação Ikoi no Sono, Maternidade Jesus, José e Maria, Kibô-no-Iê, Associação Kodomo no Sono, Lar Pequeno Leão. A seleção de diferentes instituições reforça uma característica importante do Projeto Abraço: a possibilidade de alcançar públicos e necessidades distintas por meio de uma mesma mobilização.</p>',
        order: 1,
      },
      {
        slug: 'abracolandia-2026',
        site: 'abracolandia',
        title: 'ABRAÇOLÂNDIA 2026',
        subtitle: 'A continuidade de uma história iniciada há mais de 20 anos.',
        body: '<p>O Projeto Abraço segue sua trajetória com uma nova edição da Abraçolândia em 2026. A construção de cada edição envolve uma rede de pessoas, empresas, parceiros e apoiadores que contribuem para tornar possível a realização do evento e, consequentemente, ampliar sua capacidade de gerar benefícios sociais. Mais do que colocar um evento de pé, cada nova Abraçolândia representa a continuidade de uma história iniciada há mais de 20 anos. Uma história construída por pessoas que acreditam que diversão e solidariedade podem caminhar juntas.</p>',
        order: 2,
      },
    ]

    for (const blk of officialBlocks) {
      try {
        const rec = app.findFirstRecordByData('content_blocks', 'slug', blk.slug)
        rec.set('title', blk.title)
        rec.set('subtitle', blk.subtitle)
        rec.set('body', blk.body)
        rec.set('site', blk.site)
        rec.set('order', blk.order)
        app.save(rec)
      } catch (_) {
        const newRec = new Record(contentBlocksCol)
        newRec.set('slug', blk.slug)
        newRec.set('title', blk.title)
        newRec.set('subtitle', blk.subtitle)
        newRec.set('body', blk.body)
        newRec.set('site', blk.site)
        newRec.set('order', blk.order)
        app.save(newRec)
      }
    }

    // 2. Atualizar / Inserir Parceiros Registrados Oficiais
    // Pipoll Travel, Talento Seguros, Questa, Grupo Curumim, Alfa Alimentos, Facintelli, Bazar Irmãos Kido, Ozz, Instituto i9c, Yamamura, Soneda e Sacolão Saúde, GlikSmart
    const officialSponsors = [
      {
        name: 'Pipoll Travel',
        slug: 'pipoll-travel',
        tier: 'Diamante',
        order: 1,
        featured: true,
        description:
          '<p>Empresa parceira oficial do Projeto Abraço, apoiando viagens, intercâmbios e logística solidária para ações assistenciais e realização da Abraçolândia.</p>',
      },
      {
        name: 'Talento Seguros',
        slug: 'talento-seguros',
        tier: 'Diamante',
        order: 2,
        featured: true,
        description:
          '<p>A Talento Seguros apoia as causas sociais e os eventos do Projeto Abraço, viabilizando infraestrutura e segurança para todas as edições.</p>',
      },
      {
        name: 'Questa',
        slug: 'questa',
        tier: 'Ouro',
        order: 3,
        featured: true,
        description:
          '<p>Parceira estratégica do Projeto Abraço na realização de projetos comunitários e campanhas de arrecadação.</p>',
      },
      {
        name: 'Grupo Curumim',
        slug: 'grupo-curumim',
        tier: 'Ouro',
        order: 4,
        featured: true,
        description:
          '<p>Apoio contínuo às iniciativas infantojuvenis e aos eventos culturais e recreativos do Projeto Abraço.</p>',
      },
      {
        name: 'Alfa Alimentos',
        slug: 'alfa-alimentos',
        tier: 'Ouro',
        order: 5,
        featured: true,
        description:
          '<p>Fornecimento e doação de itens essenciais e alimentos para as entidades assistenciais selecionadas.</p>',
      },
      {
        name: 'Facintelli',
        slug: 'facintelli',
        tier: 'Prata',
        order: 6,
        featured: false,
        description:
          '<p>Parceiro que colabora ativamente na estrutura e realização dos eventos beneficentes do Projeto Abraço.</p>',
      },
      {
        name: 'Bazar Irmãos Kido',
        slug: 'bazar-irmaos-kido',
        tier: 'Prata',
        order: 7,
        featured: false,
        description:
          '<p>Apoio histórico com suprimentos, utilidades e itens para as barracas da Abraçolândia e projetos assistenciais.</p>',
      },
      {
        name: 'Ozz',
        slug: 'ozz',
        tier: 'Prata',
        order: 8,
        featured: false,
        description:
          '<p>Empresa parceira na divulgação, design e infraestrutura dos eventos do Projeto Abraço.</p>',
      },
      {
        name: 'Instituto i9c',
        slug: 'instituto-i9c',
        tier: 'Bronze',
        order: 9,
        featured: false,
        description:
          '<p>Instituto parceiro no desenvolvimento comunitário, gestão de impacto social e projetos de capacitação.</p>',
      },
      {
        name: 'Yamamura',
        slug: 'yamamura',
        tier: 'Bronze',
        order: 10,
        featured: false,
        description:
          '<p>Apoio aos projetos de iluminação, reformas e benfeitorias em entidades assistenciais parceiras.</p>',
      },
      {
        name: 'Soneda',
        slug: 'soneda',
        tier: 'Bronze',
        order: 11,
        featured: false,
        description:
          '<p>Rede parceira apoiando ações de bem-estar, autocuidado e arrecadação de donativos.</p>',
      },
      {
        name: 'Sacolão Saúde',
        slug: 'sacolao-saude',
        tier: 'Apoiador',
        order: 12,
        featured: false,
        description:
          '<p>Fornecimento de frutas, legumes e alimentos frescos para alimentação dos voluntários e ações sociais.</p>',
      },
      {
        name: 'GlikSmart',
        slug: 'gliksmart',
        tier: 'Apoiador',
        order: 13,
        featured: false,
        description:
          '<p>Tecnologia e automação inteligente apoiando as operações digitais do Projeto Abraço.</p>',
      },
    ]

    for (const sp of officialSponsors) {
      try {
        const rec = app.findFirstRecordByData('sponsors', 'slug', sp.slug)
        rec.set('name', sp.name)
        rec.set('tier', sp.tier)
        rec.set('order', sp.order)
        rec.set('featured', sp.featured)
        rec.set('description', sp.description)
        rec.set('site', 'both')
        app.save(rec)
      } catch (_) {
        const newRec = new Record(sponsorsCol)
        newRec.set('name', sp.name)
        newRec.set('slug', sp.slug)
        newRec.set('tier', sp.tier)
        newRec.set('order', sp.order)
        newRec.set('featured', sp.featured)
        newRec.set('description', sp.description)
        newRec.set('site', 'both')
        app.save(newRec)
      }
    }

    // 3. Atualizar / Inserir Instituições Beneficiadas Oficiais (Abraçolândia 2025 e Geral)
    // ABRACO, Casa Safira, Associação Ikoi no Sono, Maternidade Jesus, José e Maria, Kibô-no-Iê, Associação Kodomo no Sono, Lar Pequeno Leão
    const officialBeneficiaries = [
      {
        title: 'ABRACO',
        slug: 'abraco-instituicao',
        type: 'Assistência Social & Acolhimento',
        recipient_name: 'ABRACO',
        location: 'São Paulo - SP',
        summary: 'Instituição assistencial beneficiada pelas ações e eventos do Projeto Abraço.',
        description:
          '<p>A ABRACO é uma das entidades assistenciais contempladas com projetos de benfeitoria viabilizados integralmente através dos recursos e da mobilização da Abraçolândia.</p>',
        site: 'both',
      },
      {
        title: 'Casa Safira',
        slug: 'casa-safira',
        type: 'Acolhimento Infantojuvenil',
        recipient_name: 'Casa Safira',
        location: 'São Paulo - SP',
        summary: 'Acolhimento, proteção e suporte educativo para crianças e jovens.',
        description:
          '<p>A Casa Safira recebeu projetos de benfeitoria e melhorias estruturais destinadas a garantir um ambiente seguro e acolhedor para as crianças e jovens atendidos.</p>',
        site: 'both',
      },
      {
        title: 'Associação Ikoi no Sono',
        slug: 'associacao-ikoi-no-sono',
        type: 'Assistência à 3ª Idade',
        recipient_name: 'Associação Ikoi no Sono',
        location: 'Guarulhos - SP',
        summary: 'Assistência integral e cuidados humanizados a idosos.',
        description:
          '<p>A Associação Ikoi no Sono é referência no atendimento a idosos, recebendo melhorias em suas instalações e suporte às suas atividades de convivência e saúde.</p>',
        site: 'both',
      },
      {
        title: 'Maternidade Jesus, José e Maria',
        slug: 'maternidade-jesus-jose-e-maria',
        type: 'Saúde Materno-Infantil',
        recipient_name: 'Hospital Maternidade JJM',
        location: 'Guarulhos - SP',
        summary: 'Atendimento humanizado 100% SUS a gestantes e recém-nascidos.',
        description:
          '<p>A Maternidade Jesus, José e Maria foi beneficiada com melhorias e aquisição de itens essenciais para atendimento de mães e bebês em situação de vulnerabilidade.</p>',
        site: 'both',
      },
      {
        title: 'Kibô-no-Iê',
        slug: 'kibo-no-ie',
        type: 'Pessoas com Deficiência Intelectual',
        recipient_name: 'Sociedade Beneficente Kibô-no-Iê',
        location: 'Itaquaquecetuba - SP',
        summary: 'Acolhimento e desenvolvimento de pessoas com deficiência intelectual.',
        description:
          '<p>A Kibô-no-Iê oferece moradia, oficinas e terapias para adultos com deficiência intelectual, contando com o apoio contínuo do Projeto Abraço para suas reformas e manutenção.</p>',
        site: 'both',
      },
      {
        title: 'Associação Kodomo no Sono',
        slug: 'associacao-kodomo-no-sono',
        type: 'Inclusão & Assistência',
        recipient_name: 'Associação Kodomo no Sono',
        location: 'Itaquaquecetuba - SP',
        summary: 'Atendimento e capacitação para pessoas com necessidades especiais.',
        description:
          '<p>A Kodomo no Sono atua no desenvolvimento e autonomia de pessoas com necessidades especiais, recebendo projetos de melhoria estrutural e apoio às atividades de lazer e saúde.</p>',
        site: 'both',
      },
      {
        title: 'Lar Pequeno Leão',
        slug: 'lar-pequeno-leao',
        type: 'Acolhimento Institucional Infantil',
        recipient_name: 'Lar Pequeno Leão',
        location: 'São Bernardo do Campo - SP',
        summary: 'Acolhimento para crianças e adolescentes em medida de proteção.',
        description:
          '<p>O Lar Pequeno Leão acolhe crianças e adolescentes garantindo moradia, educação, afeto e saúde, sendo beneficiado com reformas de quartos e espaços recreativos.</p>',
        site: 'both',
      },
    ]

    for (const ben of officialBeneficiaries) {
      try {
        const rec = app.findFirstRecordByData('beneficiaries', 'slug', ben.slug)
        rec.set('title', ben.title)
        rec.set('type', ben.type)
        rec.set('recipient_name', ben.recipient_name)
        rec.set('location', ben.location)
        rec.set('summary', ben.summary)
        rec.set('description', ben.description)
        rec.set('site', ben.site)
        app.save(rec)
      } catch (_) {
        const newRec = new Record(beneficiariesCol)
        newRec.set('title', ben.title)
        newRec.set('slug', ben.slug)
        newRec.set('type', ben.type)
        newRec.set('recipient_name', ben.recipient_name)
        newRec.set('location', ben.location)
        newRec.set('summary', ben.summary)
        newRec.set('description', ben.description)
        newRec.set('site', ben.site)
        app.save(newRec)
      }
    }

    // 4. Linha do Tempo Histórica / Edições Anteriores
    const timelineEditions = [
      {
        year: '2025',
        theme: 'O Mágico Circo do Abraço',
        slug: 'abracolandia-2025-circo',
        summary:
          'Em 2025, a Abraçolândia ganhou o tema "O Mágico Circo do Abraço", mantendo a proposta de reunir diversão e solidariedade em uma grande ação social.',
        description:
          '<p>Em 2025, a Abraçolândia ganhou o tema "O Mágico Circo do Abraço", mantendo a proposta de reunir diversão e solidariedade em uma grande ação social. Na edição, foram definidas como instituições beneficiadas: ABRACO, Casa Safira, Associação Ikoi no Sono, Maternidade Jesus, José e Maria, Kibô-no-Iê, Associação Kodomo no Sono, Lar Pequeno Leão.</p>',
      },
      {
        year: '2019',
        theme: '2º Reino do Abraço – Carambola',
        slug: 'reino-do-abraco-2019',
        summary: '2º Reino do Abraço – Carambola.',
        description:
          '<p>Edição histórica do Projeto Abraço promovendo lazer, diversão para toda a família e viabilizando projetos assistenciais.</p>',
      },
      {
        year: '2015',
        theme: 'Huell Abraço Favorito',
        slug: 'huell-abraco-favorito-2015',
        summary: 'Huell Abraço Favorito.',
        description:
          '<p>Ação solidária e edição especial do Projeto Abraço reunindo dezenas de voluntários e arrecadações.</p>',
      },
      {
        year: '2012',
        theme: 'Abraço na Comunidade do Inga',
        slug: 'abraco-na-comunidade-do-inga-2012',
        summary: 'Abraço na Comunidade do Inga.',
        description:
          '<p>Ação social direta na comunidade, levando assistência, cultura e recreação para centenas de famílias.</p>',
      },
      {
        year: '2011',
        theme: 'Banda da Costa e Silva',
        slug: 'banda-da-costa-e-silva-2011',
        summary: 'Banda da Costa e Silva.',
        description:
          '<p>Ação cultural e recreativa beneficente com participação ativa da comunidade e voluntários.</p>',
      },
      {
        year: '2010',
        theme: 'Brincando nos Cuidados',
        slug: 'brincando-nos-cuidados-2010',
        summary: 'Brincando nos Cuidados.',
        description:
          '<p>Projeto focado em assistência infantil, recreação e apoio a centros de cuidados infantis.</p>',
      },
      {
        year: '2009',
        theme: 'Mundo dos Carentes da Marambaia',
        slug: 'mundo-dos-carentes-da-marambaia-2009',
        summary: 'Mundo dos Carentes da Marambaia.',
        description:
          '<p>Ação solidária direcionada ao atendimento e doações a comunidades em extrema vulnerabilidade.</p>',
      },
      {
        year: '2008',
        theme: 'Abraçando a 3ª Idade',
        slug: 'abracando-a-3a-idade-2008',
        summary: 'Abraçando a 3ª Idade.',
        description:
          '<p>Ação voltada ao carinho, acolhimento, convivência e melhorias estruturais para lares de idosos.</p>',
      },
      {
        year: '2007',
        theme: 'Delas e Feras',
        slug: 'delas-e-feras-2007',
        summary: 'Delas e Feras.',
        description:
          '<p>Ação social e recreativa promovida pelo grupo de amigos pioneiro do Projeto Abraço.</p>',
      },
      {
        year: '2006',
        theme: 'O Mundo do Abraço',
        slug: 'o-mundo-do-abraco-2006',
        summary: 'O Mundo do Abraço.',
        description:
          '<p>Encontro de entretenimento e solidariedade para angariar recursos para ações comunitárias.</p>',
      },
      {
        year: '2005',
        theme: 'Recreios do Abraço',
        slug: 'recreios-do-abraco-2005',
        summary: 'Recreios do Abraço.',
        description:
          '<p>O marco inicial da história do Projeto Abraço, unindo diversão e solidariedade em prol do próximo.</p>',
      },
    ]

    for (const ed of timelineEditions) {
      try {
        const rec = app.findFirstRecordByData('past_editions', 'slug', ed.slug)
        rec.set('year', ed.year)
        rec.set('theme', ed.theme)
        rec.set('summary', ed.summary)
        rec.set('description', ed.description)
        app.save(rec)
      } catch (_) {
        const newRec = new Record(pastEditionsCol)
        newRec.set('year', ed.year)
        newRec.set('theme', ed.theme)
        newRec.set('slug', ed.slug)
        newRec.set('summary', ed.summary)
        newRec.set('description', ed.description)
        app.save(newRec)
      }
    }

    // 5. Configurações de Redes Sociais e Geral
    try {
      const socialRec = app.findFirstRecordByData('site_settings', 'key', 'social_links')
      socialRec.set('value', {
        instagram: 'https://instagram.com/projetoabraco',
        instagramHandle: '@projetoabraco',
        website: 'projetoabraco.org.br',
        facebook: 'https://facebook.com/projetoabraco',
        youtube: 'https://youtube.com/@projetoabraco',
        whatsapp: 'https://wa.me/5511999999999',
      })
      app.save(socialRec)
    } catch (_) {
      const newSoc = new Record(settingsCol)
      newSoc.set('key', 'social_links')
      newSoc.set('value', {
        instagram: 'https://instagram.com/projetoabraco',
        instagramHandle: '@projetoabraco',
        website: 'projetoabraco.org.br',
        facebook: 'https://facebook.com/projetoabraco',
        youtube: 'https://youtube.com/@projetoabraco',
        whatsapp: 'https://wa.me/5511999999999',
      })
      app.save(newSoc)
    }
  },
  (app) => {},
)
