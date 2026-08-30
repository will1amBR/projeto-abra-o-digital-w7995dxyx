migrate(
  (app) => {
    const categoriesCol = app.findCollectionByNameOrId('ticket_categories')

    const seedCategories = [
      {
        name: 'Ingresso Solidário (Adulto)',
        description:
          'Entrada individual para 1 dia de festa na Abraçolândia. Acesso a todos os shows, praça gastronômica, bingo beneficente e área geral.',
        price_in_cents: 2500, // R$ 25,00
        total_quantity: 2000,
        available_quantity: 1980,
        badge_color: '#EC4899', // Pink
        active: true,
        order: 1,
        features: [
          'Acesso a toda a programação e shows musicais',
          'Acesso à Praça Gastronômica e Food Trucks',
          'Participação no Super Bingo Beneficente',
          '100% da renda revertida para famílias assistidas',
        ],
      },
      {
        name: 'Ingresso Infantil Solidário (Até 12 anos)',
        description:
          'Acesso especial infantil com pulseira de identificação e direito a voucher de 2 brinquedos no Mega Parque Kids.',
        price_in_cents: 1500, // R$ 15,00
        total_quantity: 1000,
        available_quantity: 985,
        badge_color: '#10B981', // Emerald
        active: true,
        order: 2,
        features: [
          'Voucher para 2 atrações do Espaço Kids',
          'Pulseira de identificação e segurança infantil',
          'Acesso ao show dos palhaços e personagens',
          'Crianças até 5 anos acompanhadas têm entrada franca',
        ],
      },
      {
        name: 'Passaporte VIP Família & Amigos (4 Pessoas)',
        description:
          'Combo exclusivo para 4 pessoas com kit Abraçolândia, acesso ao Lounge Coberto VIP com vista privilegiada do palco e 4 cartelas de bingo.',
        price_in_cents: 12000, // R$ 120,00
        total_quantity: 250,
        available_quantity: 242,
        badge_color: '#8B5CF6', // Purple
        active: true,
        order: 3,
        features: [
          'Entrada válida para 4 participantes',
          'Acesso exclusivo ao Lounge VIP Coberto',
          '4 Cartelas para a rodada especial do Bingo',
          'Estacionamento solidário com vaga garantida',
        ],
      },
      {
        name: 'Ingresso Apoiador Benfeitor (Doação Especial)',
        description:
          'Ingresso individual + doação equivalente a 1 cesta de alimentos completa para famílias em vulnerabilidade extrema.',
        price_in_cents: 8000, // R$ 80,00
        total_quantity: 500,
        available_quantity: 490,
        badge_color: '#F59E0B', // Amber
        active: true,
        order: 4,
        features: [
          'Entrada individual para o evento',
          'Cesta de alimentos doada em seu nome',
          'Certificado digital "Amigo da Abraçolândia"',
          'Homenagem no painel de doadores do evento',
        ],
      },
    ]

    for (const cat of seedCategories) {
      try {
        app.findFirstRecordByData('ticket_categories', 'name', cat.name)
      } catch (_) {
        const record = new Record(categoriesCol)
        record.set('name', cat.name)
        record.set('description', cat.description)
        record.set('price_in_cents', cat.price_in_cents)
        record.set('total_quantity', cat.total_quantity)
        record.set('available_quantity', cat.available_quantity)
        record.set('badge_color', cat.badge_color)
        record.set('active', cat.active)
        record.set('order', cat.order)
        record.set('features', cat.features)
        app.save(record)
      }
    }
  },
  (app) => {
    // Revert seed
    try {
      const records = app.findRecordsByFilter('ticket_categories', '', '', 100, 0)
      for (const rec of records) {
        app.delete(rec)
      }
    } catch (_) {}
  },
)
