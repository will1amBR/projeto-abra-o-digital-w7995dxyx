routerAdd(
  'POST',
  '/backend/v1/tickets/validate',
  (e) => {
    try {
      const body = e.requestInfo().body || {}
      const rawCode = (body.code || '').trim().toUpperCase()
      const confirmEntry = !!body.confirm_entry
      const staffUser = e.auth

      if (!rawCode) {
        return e.json(400, { error: 'Código do ingresso é obrigatório' })
      }

      // Try finding ticket by ticket_code or by ID
      let ticket = null
      try {
        ticket = $app.findFirstRecordByData('tickets', 'ticket_code', rawCode)
      } catch (_) {
        try {
          ticket = $app.findRecordById('tickets', rawCode)
        } catch (_) {}
      }

      if (!ticket) {
        return e.json(404, {
          status: 'not_found',
          error: 'Ingresso não encontrado ou inválido no sistema.',
        })
      }

      let order = null
      try {
        order = $app.findRecordById('ticket_orders', ticket.getString('order_id'))
      } catch (_) {}

      let category = null
      try {
        category = $app.findRecordById('ticket_categories', ticket.getString('category_id'))
      } catch (_) {}

      const ticketStatus = ticket.getString('status')
      const isAlreadyUsed = ticketStatus === 'used'
      const isCancelled = ticketStatus === 'cancelled'

      const ticketInfo = {
        id: ticket.id,
        ticket_code: ticket.getString('ticket_code'),
        status: ticketStatus,
        attendee_name: ticket.getString('attendee_name'),
        attendee_document: ticket.getString('attendee_document'),
        used_at: ticket.getString('used_at'),
        validated_by: ticket.getString('validated_by'),
        category: category
          ? {
              id: category.id,
              name: category.getString('name'),
              badge_color: category.getString('badge_color'),
              price_in_cents: category.getInt('price_in_cents'),
            }
          : null,
        order: order
          ? {
              id: order.id,
              customer_name: order.getString('customer_name'),
              customer_email: order.getString('customer_email'),
              customer_phone: order.getString('customer_phone'),
              order_status: order.getString('status'),
              created: order.getString('created'),
            }
          : null,
      }

      if (isCancelled) {
        return e.json(200, {
          status: 'cancelled',
          ticket: ticketInfo,
          message: 'Ingresso Cancelado! Entrada não permitida.',
        })
      }

      if (isAlreadyUsed) {
        return e.json(200, {
          status: 'already_used',
          ticket: ticketInfo,
          message: `Ingresso já utilizado anteriormente em ${ticket.getString('used_at')} por ${ticket.getString('validated_by') || 'Equipe de Validação'}.`,
        })
      }

      // If valid and staff confirms entry
      if (confirmEntry) {
        const nowIso = new Date().toISOString()
        const validatorName =
          staffUser?.getString('name') || staffUser?.getString('email') || 'Validador Oficial'

        ticket.set('status', 'used')
        ticket.set('used_at', nowIso)
        ticket.set('validated_by', validatorName)
        if (body.notes) {
          ticket.set('validation_notes', body.notes)
        }
        $app.save(ticket)

        ticketInfo.status = 'used'
        ticketInfo.used_at = nowIso
        ticketInfo.validated_by = validatorName

        return e.json(200, {
          status: 'validated_success',
          ticket: ticketInfo,
          message: 'Entrada confirmada com sucesso! Bom evento!',
        })
      }

      // If just checking/scanning
      return e.json(200, {
        status: 'valid',
        ticket: ticketInfo,
        message: 'Ingresso Válido! Pronto para entrada.',
      })
    } catch (err) {
      console.log('Validation error:', err.message || err)
      return e.json(500, { error: err.message || 'Erro na validação do ingresso' })
    }
  },
  $apis.requireAuth(),
)
