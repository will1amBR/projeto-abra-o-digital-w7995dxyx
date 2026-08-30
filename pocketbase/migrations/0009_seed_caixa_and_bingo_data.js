migrate(
  (app) => {
    const cardsCol = app.findCollectionByNameOrId('event_cards')
    const consumablesCol = app.findCollectionByNameOrId('consumables')
    const bingoCol = app.findCollectionByNameOrId('bingo_games')
    const transactionsCol = app.findCollectionByNameOrId('consumable_transactions')

    // 1. Seed Consumables
    const sampleConsumables = [
      {
        name: 'Hambúrguer Artesanal',
        price_cents: 2800,
        category: 'comida',
        image_url: 'https://img.usecurling.com/p/400/400?q=burger%20gourmet',
        description: 'Pão brioche, blend 180g, queijo cheddar e bacon.',
        active: true,
        order: 1,
      },
      {
        name: 'Pastel Especial (Carne / Queijo)',
        price_cents: 1200,
        category: 'comida',
        image_url: 'https://img.usecurling.com/p/400/400?q=pastel%20empanada',
        description: 'Frito na hora, massa crocante recheada.',
        active: true,
        order: 2,
      },
      {
        name: 'Espetinho de Alcatra / Frango',
        price_cents: 1400,
        category: 'comida',
        image_url: 'https://img.usecurling.com/p/400/400?q=meat%20skewer%20bbq',
        description: 'Acompanha farofa temperada e vinagrete.',
        active: true,
        order: 3,
      },
      {
        name: 'Porção de Batata Frita',
        price_cents: 2000,
        category: 'comida',
        image_url: 'https://img.usecurling.com/p/400/400?q=french%20fries',
        description: 'Batata crocante com queijo ralado e orégano.',
        active: true,
        order: 4,
      },
      {
        name: 'Refrigerante Lata 350ml',
        price_cents: 700,
        category: 'bebida',
        image_url: 'https://img.usecurling.com/p/400/400?q=soda%20can',
        description: 'Coca-Cola, Guaraná, Fanta ou Sprite bem gelados.',
        active: true,
        order: 5,
      },
      {
        name: 'Água Mineral 500ml',
        price_cents: 500,
        category: 'bebida',
        image_url: 'https://img.usecurling.com/p/400/400?q=mineral%20water',
        description: 'Com ou sem gás.',
        active: true,
        order: 6,
      },
      {
        name: 'Suco Natural de Laranja 400ml',
        price_cents: 900,
        category: 'bebida',
        image_url: 'https://img.usecurling.com/p/400/400?q=orange%20juice',
        description: 'Suco 100% fruta espremido na hora.',
        active: true,
        order: 7,
      },
      {
        name: 'Chopp Artesanal Pilsen 400ml',
        price_cents: 1500,
        category: 'bebida',
        image_url: 'https://img.usecurling.com/p/400/400?q=craft%20beer%20glass',
        description: 'Chopp geladíssimo tirado na pressão.',
        active: true,
        order: 8,
      },
      {
        name: 'Churros Gourmet Recheado',
        price_cents: 1200,
        category: 'sobremesa',
        image_url: 'https://img.usecurling.com/p/400/400?q=churros%20chocolate',
        description: 'Doce de leite tradicional ou Nutella com confeitos.',
        active: true,
        order: 9,
      },
      {
        name: 'Açaí na Tigela 300ml',
        price_cents: 1600,
        category: 'sobremesa',
        image_url: 'https://img.usecurling.com/p/400/400?q=acai%20bowl',
        description: 'Açaí cremoso com banana, granola e leite ninho.',
        active: true,
        order: 10,
      },
      {
        name: 'Passaporte Espaço Kids (1h)',
        price_cents: 3000,
        category: 'brinquedo',
        image_url: 'https://img.usecurling.com/p/400/400?q=kids%20park%20inflatable',
        description: 'Acesso livre a todos os brinquedos infláveis e recreação.',
        active: true,
        order: 11,
      },
      {
        name: 'Cartela Extra do Bingo',
        price_cents: 1500,
        category: 'outro',
        image_url: 'https://img.usecurling.com/p/400/400?q=bingo%20card%20game',
        description: 'Cartela individual para a rodada principal de prêmios.',
        active: true,
        order: 12,
      },
    ]

    for (const item of sampleConsumables) {
      try {
        app.findFirstRecordByData('consumables', 'name', item.name)
      } catch (_) {
        const rec = new Record(consumablesCol)
        rec.set('name', item.name)
        rec.set('price_cents', item.price_cents)
        rec.set('category', item.category)
        rec.set('image_url', item.image_url)
        rec.set('description', item.description)
        rec.set('active', item.active)
        rec.set('order', item.order)
        app.save(rec)
      }
    }

    // 2. Seed Sample Event Cards & Initial Transactions
    const sampleCards = [
      {
        card_uid: 'CARD-1001',
        holder_name: 'Mariana Souza Ribeiro',
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321',
        balance_cents: 7500,
        status: 'ativo',
        notes: 'Check-in realizado na entrada principal',
      },
      {
        card_uid: 'CARD-1002',
        holder_name: 'Carlos Eduardo Mendes',
        cpf: '234.567.890-11',
        phone: '(11) 97654-3210',
        balance_cents: 12000,
        status: 'ativo',
        notes: 'Recarga PIX',
      },
      {
        card_uid: 'CARD-1003',
        holder_name: 'Fernanda Cristina Lima',
        cpf: '345.678.901-22',
        phone: '(11) 96543-2109',
        balance_cents: 3500,
        status: 'ativo',
        notes: 'Cartão familiar',
      },
      {
        card_uid: 'CARD-1004',
        holder_name: 'Roberto Albuquerque',
        cpf: '456.789.012-33',
        phone: '(11) 95432-1098',
        balance_cents: 0,
        status: 'bloqueado',
        notes: 'Cartão desativado por perda/substituição',
      },
    ]

    for (const c of sampleCards) {
      let savedCardRecord
      try {
        savedCardRecord = app.findFirstRecordByData('event_cards', 'card_uid', c.card_uid)
      } catch (_) {
        const rec = new Record(cardsCol)
        rec.set('card_uid', c.card_uid)
        rec.set('holder_name', c.holder_name)
        rec.set('cpf', c.cpf)
        rec.set('phone', c.phone)
        rec.set('balance_cents', c.balance_cents)
        rec.set('status', c.status)
        rec.set('notes', c.notes)
        app.save(rec)
        savedCardRecord = rec

        // Seed initial recharge transaction for active cards
        if (c.balance_cents > 0) {
          const txRec = new Record(transactionsCol)
          txRec.set('card_id', savedCardRecord.id)
          txRec.set('type', 'recarga')
          txRec.set('amount_cents', c.balance_cents)
          txRec.set('previous_balance_cents', 0)
          txRec.set('new_balance_cents', c.balance_cents)
          txRec.set('payment_method', 'PIX')
          txRec.set('operator_name', 'Caixa Central 01')
          txRec.set('notes', 'Recarga inicial de abertura do cartão')
          app.save(txRec)
        }
      }
    }

    // 3. Seed Initial Bingo Game
    try {
      app.findFirstRecordByData(
        'bingo_games',
        'title',
        'Super Bingo da Abraçolândia 2025 - Rodada Principal',
      )
    } catch (_) {
      const bingoRec = new Record(bingoCol)
      bingoRec.set('title', 'Super Bingo da Abraçolândia 2025 - Rodada Principal')
      bingoRec.set('status', 'em_andamento')
      bingoRec.set('round_prize', "Smart TV 55'' 4K + Fritadeira Air Fryer")
      bingoRec.set('max_number', 75)

      // Initial sample drawn numbers (e.g., 7, 22, 45, 59, 14, 68, 33)
      const initialNumbers = [7, 22, 45, 59, 14, 68, 33]
      bingoRec.set('drawn_numbers', initialNumbers)
      bingoRec.set('last_number', 33)
      bingoRec.set('draw_history', [
        {
          number: 7,
          drawn_at: new Date(Date.now() - 3600000).toISOString(),
          drawn_by: 'Equipe de Palco',
        },
        {
          number: 22,
          drawn_at: new Date(Date.now() - 3000000).toISOString(),
          drawn_by: 'Equipe de Palco',
        },
        {
          number: 45,
          drawn_at: new Date(Date.now() - 2400000).toISOString(),
          drawn_by: 'Equipe de Palco',
        },
        {
          number: 59,
          drawn_at: new Date(Date.now() - 1800000).toISOString(),
          drawn_by: 'Equipe de Palco',
        },
        {
          number: 14,
          drawn_at: new Date(Date.now() - 1200000).toISOString(),
          drawn_by: 'Equipe de Palco',
        },
        {
          number: 68,
          drawn_at: new Date(Date.now() - 600000).toISOString(),
          drawn_by: 'Equipe de Palco',
        },
        { number: 33, drawn_at: new Date().toISOString(), drawn_by: 'Equipe de Palco' },
      ])
      app.save(bingoRec)
    }
  },
  (app) => {
    // down migration
  },
)
