import pb from '@/lib/pocketbase/client'
import type {
  TicketCategory,
  TicketOrder,
  TicketItem,
  CheckoutRequestPayload,
  CheckoutResponsePayload,
  TicketValidationResponse,
} from '@/types/content'

/**
 * Fetch all active ticket categories sorted by order
 */
export async function getActiveTicketCategories(): Promise<TicketCategory[]> {
  try {
    const records = await pb.collection('ticket_categories').getFullList<TicketCategory>({
      filter: 'active = true',
      sort: 'order,price_in_cents',
    })
    return records
  } catch (error) {
    console.error('Error fetching active ticket categories:', error)
    return []
  }
}

/**
 * Fetch all ticket categories (admin view)
 */
export async function getAllTicketCategories(): Promise<TicketCategory[]> {
  try {
    const records = await pb.collection('ticket_categories').getFullList<TicketCategory>({
      sort: 'order,created',
    })
    return records
  } catch (error) {
    console.error('Error fetching all ticket categories:', error)
    return []
  }
}

/**
 * Fetch a single category by ID
 */
export async function getTicketCategoryById(id: string): Promise<TicketCategory | null> {
  try {
    const record = await pb.collection('ticket_categories').getOne<TicketCategory>(id)
    return record
  } catch (error) {
    console.error('Error fetching ticket category:', error)
    return null
  }
}

/**
 * Initiate checkout (Stripe or Demo fallback)
 */
export async function createTicketCheckout(
  payload: CheckoutRequestPayload,
): Promise<CheckoutResponsePayload> {
  const backendUrl = pb.baseUrl.endsWith('/') ? pb.baseUrl.slice(0, -1) : pb.baseUrl
  const response = await fetch(`${backendUrl}/backend/v1/tickets/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Falha ao processar o checkout de ingressos.')
  }

  return data
}

/**
 * Fetch order with tickets by order ID
 */
export async function getOrderWithTickets(orderId: string): Promise<{
  order: TicketOrder | null
  tickets: TicketItem[]
}> {
  try {
    const order = await pb.collection('ticket_orders').getOne<TicketOrder>(orderId)
    const tickets = await pb.collection('tickets').getFullList<TicketItem>({
      filter: `order_id = "${orderId}"`,
      expand: 'category_id',
      sort: 'created',
    })
    return { order, tickets }
  } catch (error) {
    console.error('Error fetching order with tickets:', error)
    return { order: null, tickets: [] }
  }
}

/**
 * Fetch a ticket by its unique ticket_code or ID
 */
export async function getTicketByCode(ticketCode: string): Promise<TicketItem | null> {
  try {
    const cleanCode = ticketCode.trim().toUpperCase()
    let record: TicketItem | null = null
    try {
      record = await pb
        .collection('tickets')
        .getFirstListItem<TicketItem>(`ticket_code = "${cleanCode}"`, {
          expand: 'order_id,category_id',
        })
    } catch (_) {
      record = await pb.collection('tickets').getOne<TicketItem>(cleanCode, {
        expand: 'order_id,category_id',
      })
    }
    return record
  } catch (error) {
    console.error('Error fetching ticket by code:', error)
    return null
  }
}

/**
 * Validate / scan ticket (Admin / Staff endpoint)
 */
export async function validateTicketApi(
  code: string,
  confirmEntry = false,
  notes = '',
): Promise<TicketValidationResponse> {
  const backendUrl = pb.baseUrl.endsWith('/') ? pb.baseUrl.slice(0, -1) : pb.baseUrl
  const token = pb.authStore.token

  const response = await fetch(`${backendUrl}/backend/v1/tickets/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
    body: JSON.stringify({
      code: code.trim().toUpperCase(),
      confirm_entry: confirmEntry,
      notes,
    }),
  })

  const data = await response.json()
  if (!response.ok && !data.status) {
    throw new Error(data.error || 'Erro na validação do ingresso.')
  }

  return data
}

/**
 * List all tickets with relations (for Admin view)
 */
export async function getAllTickets(limit = 200): Promise<TicketItem[]> {
  try {
    const records = await pb.collection('tickets').getList<TicketItem>(1, limit, {
      sort: '-created',
      expand: 'order_id,category_id',
    })
    return records.items
  } catch (error) {
    console.error('Error fetching all tickets:', error)
    return []
  }
}

/**
 * List all orders (for Admin view)
 */
export async function getAllOrders(limit = 200): Promise<TicketOrder[]> {
  try {
    const records = await pb.collection('ticket_orders').getList<TicketOrder>(1, limit, {
      sort: '-created',
    })
    return records.items
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return []
  }
}

/**
 * Helper to format BRL currency from cents
 */
export function formatCurrencyBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}
