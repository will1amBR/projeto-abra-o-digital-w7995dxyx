import pb from '@/lib/pocketbase/client'

export interface EventCard {
  id: string
  card_uid: string
  holder_name: string
  cpf: string
  balance_cents: number
  status: 'ativo' | 'bloqueado'
  phone?: string
  notes?: string
  created: string
  updated: string
}

export interface ConsumableItem {
  id: string
  name: string
  price_cents: number
  category: 'comida' | 'bebida' | 'sobremesa' | 'brinquedo' | 'outro'
  image_url?: string
  image?: string
  description?: string
  active?: boolean
  order?: number
  created: string
  updated: string
}

export interface CartItem {
  item: ConsumableItem
  quantity: number
}

export interface ConsumableTransaction {
  id: string
  card_id: string
  type: 'recarga' | 'venda' | 'estorno'
  amount_cents: number
  previous_balance_cents: number
  new_balance_cents: number
  items_json?: {
    id: string
    name: string
    quantity: number
    price_cents: number
    subtotal_cents: number
  }[]
  payment_method?: string
  operator_name?: string
  notes?: string
  created: string
  updated: string
  expand?: {
    card_id?: EventCard
  }
}

/** Formata valor em reais (ex: 2500 -> R$ 25,00) */
export function formatCurrencyBRL(cents: number = 0): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/** Formata CPF no padrão 000.000.000-00 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

// ==========================================
// 1. CARDS / CHECK-IN / CONSULTA
// ==========================================

export async function getEventCards(query?: string): Promise<EventCard[]> {
  try {
    let filter = ''
    if (query && query.trim()) {
      const clean = query.trim().replace(/['"]/g, '')
      filter = `card_uid ~ "${clean}" || holder_name ~ "${clean}" || cpf ~ "${clean}"`
    }
    return await pb.collection('event_cards').getFullList<EventCard>({
      filter,
      sort: '-created',
    })
  } catch (error) {
    console.error('Erro ao buscar cartões:', error)
    return []
  }
}

export async function findCardByUidOrCpf(identifier: string): Promise<EventCard | null> {
  try {
    const clean = identifier.trim().replace(/['"]/g, '')
    const digits = clean.replace(/\D/g, '')

    // Tentar busca exata por card_uid
    try {
      const byUid = await pb
        .collection('event_cards')
        .getFirstListItem<EventCard>(`card_uid = "${clean}"`)
      if (byUid) return byUid
    } catch {
      /* intentionally ignored */
    }

    // Tentar busca por CPF formatado ou só dígitos
    if (digits.length >= 3) {
      try {
        const byCpf = await pb
          .collection('event_cards')
          .getFirstListItem<EventCard>(`cpf ~ "${digits}" || cpf ~ "${clean}"`)
        if (byCpf) return byCpf
      } catch {
        /* intentionally ignored */
      }
    }

    // Tentar busca por aproximação
    const results = await pb.collection('event_cards').getList<EventCard>(1, 1, {
      filter: `card_uid ~ "${clean}" || holder_name ~ "${clean}"`,
    })
    return results.items[0] || null
  } catch (error) {
    console.error('Erro ao buscar cartão por identificador:', error)
    return null
  }
}

export async function checkInCard(data: {
  card_uid: string
  holder_name: string
  cpf: string
  phone?: string
  initial_recharge_cents?: number
  payment_method?: string
  operator_name?: string
  notes?: string
}): Promise<{ card: EventCard; transaction?: ConsumableTransaction }> {
  const cleanUid = data.card_uid.trim().toUpperCase()
  const cleanCpf = formatCPF(data.cpf)

  // Verificar se UID já existe
  try {
    const existing = await pb.collection('event_cards').getFirstListItem(`card_uid = "${cleanUid}"`)
    if (existing) {
      throw new Error(
        `O código de cartão "${cleanUid}" já está vinculado a ${existing.holder_name}.`,
      )
    }
  } catch (e: any) {
    if (e.message && e.message.includes('já está vinculado')) throw e
  }

  const initialBalance = data.initial_recharge_cents || 0

  const card = await pb.collection('event_cards').create<EventCard>({
    card_uid: cleanUid,
    holder_name: data.holder_name.trim(),
    cpf: cleanCpf,
    phone: data.phone?.trim() || '',
    balance_cents: initialBalance,
    status: 'ativo',
    notes: data.notes || 'Check-in realizado',
  })

  let transaction: ConsumableTransaction | undefined

  if (initialBalance > 0) {
    transaction = await pb.collection('consumable_transactions').create<ConsumableTransaction>({
      card_id: card.id,
      type: 'recarga',
      amount_cents: initialBalance,
      previous_balance_cents: 0,
      new_balance_cents: initialBalance,
      payment_method: data.payment_method || 'PIX',
      operator_name: data.operator_name || 'Caixa Check-in',
      notes: 'Recarga inicial no Check-in',
    })
  }

  return { card, transaction }
}

export async function updateCardStatus(
  cardId: string,
  status: 'ativo' | 'bloqueado',
  notes?: string,
): Promise<EventCard> {
  return await pb.collection('event_cards').update<EventCard>(cardId, {
    status,
    ...(notes ? { notes } : {}),
  })
}

// ==========================================
// 2. RECARGA DE SALDO
// ==========================================

export async function rechargeCard(params: {
  cardId: string
  amount_cents: number
  payment_method: string
  operator_name?: string
  notes?: string
}): Promise<{ card: EventCard; transaction: ConsumableTransaction }> {
  if (params.amount_cents <= 0) {
    throw new Error('O valor de recarga deve ser maior que zero.')
  }

  const currentCard = await pb.collection('event_cards').getOne<EventCard>(params.cardId)
  if (currentCard.status !== 'ativo') {
    throw new Error('Este cartão está bloqueado para operações.')
  }

  const previousBalance = currentCard.balance_cents || 0
  const newBalance = previousBalance + params.amount_cents

  const updatedCard = await pb.collection('event_cards').update<EventCard>(params.cardId, {
    balance_cents: newBalance,
  })

  const transaction = await pb.collection('consumable_transactions').create<ConsumableTransaction>({
    card_id: params.cardId,
    type: 'recarga',
    amount_cents: params.amount_cents,
    previous_balance_cents: previousBalance,
    new_balance_cents: newBalance,
    payment_method: params.payment_method,
    operator_name: params.operator_name || 'Operador de Caixa',
    notes: params.notes || 'Recarga de saldo avulsa',
  })

  return { card: updatedCard, transaction }
}

// ==========================================
// 3. VENDA / DÉBITO PDV
// ==========================================

export async function getConsumables(category?: string): Promise<ConsumableItem[]> {
  try {
    let filter = 'active = true'
    if (category && category !== 'todos') {
      filter += ` && category = "${category}"`
    }
    return await pb.collection('consumables').getFullList<ConsumableItem>({
      filter,
      sort: 'order,name',
    })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
}

export async function processSale(params: {
  cardId: string
  cart: CartItem[]
  operator_name?: string
  notes?: string
}): Promise<{ card: EventCard; transaction: ConsumableTransaction }> {
  if (!params.cart || params.cart.length === 0) {
    throw new Error('O carrinho de compras está vazio.')
  }

  const totalCents = params.cart.reduce(
    (acc, item) => acc + item.item.price_cents * item.quantity,
    0,
  )

  const currentCard = await pb.collection('event_cards').getOne<EventCard>(params.cardId)
  if (currentCard.status !== 'ativo') {
    throw new Error('Cartão bloqueado. Não é possível realizar a cobrança.')
  }

  const currentBalance = currentCard.balance_cents || 0
  if (currentBalance < totalCents) {
    const faltam = totalCents - currentBalance
    throw new Error(
      `Saldo insuficiente! Saldo atual: ${formatCurrencyBRL(currentBalance)}. Total da compra: ${formatCurrencyBRL(totalCents)}. Faltam ${formatCurrencyBRL(faltam)}.`,
    )
  }

  const newBalance = currentBalance - totalCents

  const itemsSummary = params.cart.map((c) => ({
    id: c.item.id,
    name: c.item.name,
    quantity: c.quantity,
    price_cents: c.item.price_cents,
    subtotal_cents: c.item.price_cents * c.quantity,
  }))

  const updatedCard = await pb.collection('event_cards').update<EventCard>(params.cardId, {
    balance_cents: newBalance,
  })

  const transaction = await pb.collection('consumable_transactions').create<ConsumableTransaction>({
    card_id: params.cardId,
    type: 'venda',
    amount_cents: totalCents,
    previous_balance_cents: currentBalance,
    new_balance_cents: newBalance,
    items_json: itemsSummary,
    payment_method: 'Saldo Cartão',
    operator_name: params.operator_name || 'PDV Consumo',
    notes: params.notes || `Venda de ${params.cart.length} item(ns)`,
  })

  return { card: updatedCard, transaction }
}

// ==========================================
// 4. HISTÓRICO E RELATÓRIOS DE CONSUMO
// ==========================================

export async function getTransactions(params?: {
  cardId?: string
  type?: string
  limit?: number
}): Promise<ConsumableTransaction[]> {
  try {
    const filters: string[] = []
    if (params?.cardId) filters.push(`card_id = "${params.cardId}"`)
    if (params?.type && params.type !== 'todos') filters.push(`type = "${params.type}"`)

    return await pb.collection('consumable_transactions').getFullList<ConsumableTransaction>({
      filter: filters.join(' && '),
      sort: '-created',
      expand: 'card_id',
    })
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    return []
  }
}

export async function getCaixaStats(): Promise<{
  totalRechargedCents: number
  totalSoldCents: number
  totalCardsActive: number
  totalCardsBlocked: number
  totalTransactionsCount: number
}> {
  try {
    const [cards, txs] = await Promise.all([
      pb.collection('event_cards').getFullList<EventCard>(),
      pb.collection('consumable_transactions').getFullList<ConsumableTransaction>(),
    ])

    const totalRechargedCents = txs
      .filter((t) => t.type === 'recarga')
      .reduce((acc, t) => acc + (t.amount_cents || 0), 0)

    const totalSoldCents = txs
      .filter((t) => t.type === 'venda')
      .reduce((acc, t) => acc + (t.amount_cents || 0), 0)

    const totalCardsActive = cards.filter((c) => c.status === 'ativo').length
    const totalCardsBlocked = cards.filter((c) => c.status === 'bloqueado').length

    return {
      totalRechargedCents,
      totalSoldCents,
      totalCardsActive,
      totalCardsBlocked,
      totalTransactionsCount: txs.length,
    }
  } catch (error) {
    console.error('Erro ao calcular estatísticas do caixa:', error)
    return {
      totalRechargedCents: 0,
      totalSoldCents: 0,
      totalCardsActive: 0,
      totalCardsBlocked: 0,
      totalTransactionsCount: 0,
    }
  }
}
