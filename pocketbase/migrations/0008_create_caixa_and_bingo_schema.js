migrate(
  (app) => {
    // 1. event_cards (ID do cartão UID/QR, nome do titular, CPF, saldo em centavos, status)
    const eventCardsCol = new Collection({
      name: 'event_cards',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'card_uid', type: 'text', required: true },
        { name: 'holder_name', type: 'text', required: true },
        { name: 'cpf', type: 'text', required: true },
        { name: 'balance_cents', type: 'number', required: false },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['ativo', 'bloqueado'],
          maxSelect: 1,
        },
        { name: 'phone', type: 'text' },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_event_cards_uid ON event_cards (card_uid)',
        'CREATE INDEX idx_event_cards_cpf ON event_cards (cpf)',
        'CREATE INDEX idx_event_cards_status ON event_cards (status)',
      ],
    })
    app.save(eventCardsCol)

    // 2. consumables (Nome do item, preço em centavos, categoria, imagem)
    const consumablesCol = new Collection({
      name: 'consumables',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'price_cents', type: 'number', required: true },
        {
          name: 'category',
          type: 'select',
          required: true,
          values: ['comida', 'bebida', 'sobremesa', 'brinquedo', 'outro'],
          maxSelect: 1,
        },
        { name: 'image_url', type: 'text' },
        {
          name: 'image',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'description', type: 'text' },
        { name: 'active', type: 'bool' },
        { name: 'order', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_consumables_cat ON consumables (category)',
        'CREATE INDEX idx_consumables_active ON consumables (active)',
      ],
    })
    app.save(consumablesCol)

    const eventCardsId = app.findCollectionByNameOrId('event_cards').id
    const consumablesId = app.findCollectionByNameOrId('consumables').id

    // 3. consumable_transactions (Relacionamento entre cartão, itens, valor, tipo de transação, timestamp)
    const transactionsCol = new Collection({
      name: 'consumable_transactions',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        {
          name: 'card_id',
          type: 'relation',
          collectionId: eventCardsId,
          required: true,
          cascadeDelete: false,
          maxSelect: 1,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['recarga', 'venda', 'estorno'],
          maxSelect: 1,
        },
        { name: 'amount_cents', type: 'number', required: true },
        { name: 'previous_balance_cents', type: 'number' },
        { name: 'new_balance_cents', type: 'number' },
        { name: 'items_json', type: 'json' }, // array of items: [{ id, name, qty, price_cents, subtotal }]
        { name: 'payment_method', type: 'text' }, // PIX, Dinheiro, Cartão Crédito, Débito
        { name: 'operator_name', type: 'text' },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_ctx_card ON consumable_transactions (card_id)',
        'CREATE INDEX idx_ctx_type ON consumable_transactions (type)',
        'CREATE INDEX idx_ctx_created ON consumable_transactions (created DESC)',
      ],
    })
    app.save(transactionsCol)

    // 4. bingo_games (Sistema de Bingo Realtime: estado da partida, números sorteados, último número)
    const bingoCol = new Collection({
      name: 'bingo_games',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'drawn_numbers', type: 'json' }, // Array of numbers: [12, 45, 3, 72]
        { name: 'last_number', type: 'number' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['em_andamento', 'pausado', 'finalizado'],
          maxSelect: 1,
        },
        { name: 'round_prize', type: 'text' }, // ex: "Smart TV 50'' ou Carro 0km"
        { name: 'max_number', type: 'number' }, // 75 or 90 (standard 75)
        { name: 'draw_history', type: 'json' }, // Detailed history with timestamps [{ number, drawn_at, drawn_by }]
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_bingo_status ON bingo_games (status)'],
    })
    app.save(bingoCol)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('consumable_transactions'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('consumables'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('event_cards'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('bingo_games'))
    } catch (_) {}
  },
)
