routerAdd('POST', '/backend/v1/tickets/checkout', (e) => {
  try {
    const body = e.requestInfo().body || {}
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_document,
      items, // array of { category_id, quantity, attendee_names? }
      success_url,
      cancel_url,
      simulate_mode, // optional boolean force demo
    } = body

    if (!customer_name || !customer_email || !customer_phone) {
      return e.json(400, {
        error: 'Nome, e-mail e telefone são obrigatórios para emissão do pedido.',
      })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return e.json(400, {
        error: 'Pelo menos um item deve ser selecionado.',
      })
    }

    // 1. Calculate total and validate availability
    let totalCents = 0
    const resolvedItems = []
    const categoriesCol = $app.findCollectionByNameOrId('ticket_categories')

    for (const item of items) {
      const qty = parseInt(item.quantity, 10) || 0
      if (qty <= 0) continue

      let catRecord = null
      try {
        catRecord = $app.findRecordById('ticket_categories', item.category_id)
      } catch (err) {
        return e.json(400, { error: `Categoria de ingresso não encontrada: ${item.category_id}` })
      }

      const available = catRecord.getInt('available_quantity')
      if (available < qty) {
        return e.json(400, {
          error: `Quantidade solicitada indisponível para "${catRecord.getString('name')}". Restam apenas ${available} disponíveis.`,
        })
      }

      const unitPrice = catRecord.getInt('price_in_cents')
      const itemSubtotal = unitPrice * qty
      totalCents += itemSubtotal

      resolvedItems.push({
        category_id: catRecord.id,
        category_name: catRecord.getString('name'),
        unit_price_cents: unitPrice,
        quantity: qty,
        subtotal_cents: itemSubtotal,
        attendee_names: Array.isArray(item.attendee_names) ? item.attendee_names : [],
      })
    }

    if (resolvedItems.length === 0 || totalCents <= 0) {
      return e.json(400, { error: 'O pedido deve conter itens válidos com valor maior que zero.' })
    }

    // 2. Check Stripe secrets
    const stripeSecretKey =
      $secrets.get('STRIPE_SECRET_KEY') || $os.getenv('STRIPE_SECRET_KEY') || ''
    const siteUrl = $os.getenv('SITE_URL') || ''

    // Helper functions inline
    const generateCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let code = 'ABRA-'
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    // If no Stripe Secret Key or simulate requested -> Demo Checkout / Instant Confirmation Mode
    if (!stripeSecretKey || simulate_mode === true) {
      // Create confirmed order directly
      const ordersCol = $app.findCollectionByNameOrId('ticket_orders')
      const ticketsCol = $app.findCollectionByNameOrId('tickets')

      const order = new Record(ordersCol)
      order.set('customer_name', customer_name)
      order.set('customer_email', customer_email)
      order.set('customer_phone', customer_phone)
      order.set('customer_document', customer_document || '')
      order.set('status', 'paid')
      order.set('total_amount_cents', totalCents)
      order.set('payment_method', 'demo_simulation')
      order.set('payment_gateway_ref', 'DEMO-' + Date.now())
      order.set('payment_data', {
        mode: 'demo_simulation',
        note: 'Pagamento concluído em modo de demonstração',
        paid_at: new Date().toISOString(),
      })
      order.set('items_summary', resolvedItems)
      $app.save(order)

      const generatedTickets = []

      // Create individual tickets & update inventory
      for (const item of resolvedItems) {
        // Decrease category stock
        try {
          const cat = $app.findRecordById('ticket_categories', item.category_id)
          const currentAvail = cat.getInt('available_quantity')
          cat.set('available_quantity', Math.max(0, currentAvail - item.quantity))
          $app.save(cat)
        } catch (_) {}

        for (let i = 0; i < item.quantity; i++) {
          const tCode = generateCode()
          const attendee = item.attendee_names[i] || customer_name

          const ticket = new Record(ticketsCol)
          ticket.set('order_id', order.id)
          ticket.set('category_id', item.category_id)
          ticket.set('ticket_code', tCode)
          ticket.set(
            'qr_payload',
            JSON.stringify({
              code: tCode,
              order_id: order.id,
              event: 'Abraçolândia',
              name: attendee,
              category: item.category_name,
            }),
          )
          ticket.set('attendee_name', attendee)
          ticket.set('attendee_document', customer_document || '')
          ticket.set('status', 'unused')
          $app.save(ticket)

          generatedTickets.push({
            id: ticket.id,
            ticket_code: tCode,
            category_id: item.category_id,
            category_name: item.category_name,
            attendee_name: attendee,
            status: 'unused',
          })
        }
      }

      return e.json(200, {
        mode: 'demo',
        status: 'paid',
        order_id: order.id,
        total_amount_cents: totalCents,
        tickets: generatedTickets,
        message: 'Pedido confirmado com sucesso em Modo de Demonstração!',
      })
    }

    // If Stripe Secret Key is present -> Create Stripe Checkout Session
    const ordersCol = $app.findCollectionByNameOrId('ticket_orders')
    const order = new Record(ordersCol)
    order.set('customer_name', customer_name)
    order.set('customer_email', customer_email)
    order.set('customer_phone', customer_phone)
    order.set('customer_document', customer_document || '')
    order.set('status', 'pending')
    order.set('total_amount_cents', totalCents)
    order.set('payment_method', 'stripe_checkout')
    order.set('items_summary', resolvedItems)
    $app.save(order)

    // Build Stripe checkout session line items
    const lineItems = resolvedItems.map((it) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: 'Abraçolândia - ' + it.category_name,
          description: 'Ingresso Oficial Abraçolândia / Projeto Abraço',
        },
        unit_amount: it.unit_price_cents,
      },
      quantity: it.quantity,
    }))

    const returnSuccessUrl =
      success_url ||
      `${siteUrl}/abracolandia/ingressos?order_id=${order.id}&session_id={CHECKOUT_SESSION_ID}`
    const returnCancelUrl =
      cancel_url || `${siteUrl}/abracolandia/ingressos?status=cancelled&order_id=${order.id}`

    // Call Stripe API
    const stripeRes = $http.send({
      url: 'https://api.stripe.com/v1/checkout/sessions',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + stripeSecretKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:
        'payment_method_types[0]=card' +
        '&customer_email=' +
        encodeURIComponent(customer_email) +
        '&client_reference_id=' +
        encodeURIComponent(order.id) +
        '&success_url=' +
        encodeURIComponent(returnSuccessUrl) +
        '&cancel_url=' +
        encodeURIComponent(returnCancelUrl) +
        '&mode=payment' +
        lineItems
          .map(
            (li, idx) =>
              `&line_items[${idx}][price_data][currency]=brl` +
              `&line_items[${idx}][price_data][unit_amount]=${li.price_data.unit_amount}` +
              `&line_items[${idx}][price_data][product_data][name]=${encodeURIComponent(li.price_data.product_data.name)}` +
              `&line_items[${idx}][quantity]=${li.quantity}`,
          )
          .join(''),
      timeout: 20,
    })

    if (stripeRes.statusCode >= 200 && stripeRes.statusCode < 300) {
      const sessionData = stripeRes.json
      order.set('payment_gateway_ref', sessionData.id)
      order.set('payment_data', sessionData)
      $app.save(order)

      return e.json(200, {
        mode: 'stripe',
        order_id: order.id,
        checkout_url: sessionData.url,
        session_id: sessionData.id,
      })
    } else {
      console.log('Stripe Error:', JSON.stringify(stripeRes.raw))
      return e.json(500, {
        error: 'Erro ao gerar sessão de pagamento no gateway Stripe.',
        details: stripeRes.json,
      })
    }
  } catch (err) {
    console.log('Checkout Error:', err.message || err)
    return e.json(500, { error: err.message || 'Erro interno ao processar checkout' })
  }
})
