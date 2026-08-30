migrate(
  (app) => {
    // 1. ticket_categories
    const ticketCategories = new Collection({
      name: 'ticket_categories',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'price_in_cents', type: 'number', required: true, min: 0 },
        { name: 'total_quantity', type: 'number', required: true, min: 0 },
        { name: 'available_quantity', type: 'number', required: true, min: 0 },
        { name: 'badge_color', type: 'text' },
        { name: 'active', type: 'bool' },
        { name: 'order', type: 'number' },
        { name: 'features', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_ticket_cat_active ON ticket_categories (active)',
        'CREATE INDEX idx_ticket_cat_order ON ticket_categories (order)',
      ],
    })
    app.save(ticketCategories)

    // 2. ticket_orders
    const ticketOrders = new Collection({
      name: 'ticket_orders',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'customer_name', type: 'text', required: true },
        { name: 'customer_email', type: 'email', required: true },
        { name: 'customer_phone', type: 'text', required: true },
        { name: 'customer_document', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pending', 'paid', 'cancelled'],
          maxSelect: 1,
        },
        { name: 'total_amount_cents', type: 'number', required: true, min: 0 },
        { name: 'payment_method', type: 'text' },
        { name: 'payment_gateway_ref', type: 'text' },
        { name: 'payment_data', type: 'json' },
        { name: 'items_summary', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_orders_status ON ticket_orders (status)',
        'CREATE INDEX idx_orders_email ON ticket_orders (customer_email)',
        'CREATE INDEX idx_orders_payref ON ticket_orders (payment_gateway_ref)',
      ],
    })
    app.save(ticketOrders)

    const catColId = app.findCollectionByNameOrId('ticket_categories').id
    const orderColId = app.findCollectionByNameOrId('ticket_orders').id

    // 3. tickets
    const tickets = new Collection({
      name: 'tickets',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'order_id',
          type: 'relation',
          required: true,
          collectionId: orderColId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'category_id',
          type: 'relation',
          required: true,
          collectionId: catColId,
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'ticket_code', type: 'text', required: true },
        { name: 'qr_payload', type: 'text', required: true },
        { name: 'attendee_name', type: 'text' },
        { name: 'attendee_document', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['unused', 'used', 'cancelled'],
          maxSelect: 1,
        },
        { name: 'used_at', type: 'text' },
        { name: 'validated_by', type: 'text' },
        { name: 'validation_notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_tickets_code ON tickets (ticket_code)',
        'CREATE INDEX idx_tickets_order ON tickets (order_id)',
        'CREATE INDEX idx_tickets_status ON tickets (status)',
      ],
    })
    app.save(tickets)
  },
  (app) => {
    const tryDelete = (name) => {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
    tryDelete('tickets')
    tryDelete('ticket_orders')
    tryDelete('ticket_categories')
  },
)
