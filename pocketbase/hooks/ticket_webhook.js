routerAdd('POST', '/backend/v1/tickets/webhook', (e) => {
  try {
    const rawBody = e.requestInfo().body || {}
    const stripeWebhookSecret =
      $secrets.get('STRIPE_WEBHOOK_SECRET') || $os.getenv('STRIPE_WEBHOOK_SECRET') || ''

    // Helper functions inline
    const generateCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let code = 'ABRA-'
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    const event = rawBody
    const eventType = event.type || ''

    if (eventType === 'checkout.session.completed') {
      const session = event.data?.object || {}
      const orderId = session.client_reference_id

      if (orderId) {
        let order = null
        try {
          order = $app.findRecordById('ticket_orders', orderId)
        } catch (_) {}

        if (order && order.getString('status') !== 'paid') {
          order.set('status', 'paid')
          order.set('payment_gateway_ref', session.id || order.getString('payment_gateway_ref'))
          order.set('payment_data', session)
          $app.save(order)

          // Generate Tickets for this order
          const items = order.get('items_summary') || []
          const ticketsCol = $app.findCollectionByNameOrId('tickets')
          const custName = order.getString('customer_name')
          const custDoc = order.getString('customer_document')

          for (const item of items) {
            // Decrease stock
            try {
              const cat = $app.findRecordById('ticket_categories', item.category_id)
              const currentAvail = cat.getInt('available_quantity')
              cat.set('available_quantity', Math.max(0, currentAvail - item.quantity))
              $app.save(cat)
            } catch (_) {}

            for (let i = 0; i < item.quantity; i++) {
              const tCode = generateCode()
              const attendee =
                (item.attendee_names && item.attendee_names[i]) || custName || 'Participante'

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
              ticket.set('attendee_document', custDoc || '')
              ticket.set('status', 'unused')
              $app.save(ticket)
            }
          }
        }
      }
    }

    return e.json(200, { received: true })
  } catch (err) {
    console.log('Webhook error:', err.message || err)
    return e.json(400, { error: err.message || 'Webhook processing failed' })
  }
})
