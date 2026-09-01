import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { AbracolandiaHeader, AbracolandiaFooter } from '@/components/layout/AbracolandiaLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import {
  getActiveTicketCategories,
  createTicketCheckout,
  getOrderWithTickets,
  formatCurrencyBRL,
} from '@/services/ticketService'
import { getSiteSettings } from '@/services/contentService'
import type { TicketCategory, TicketOrder, TicketItem } from '@/types/content'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { QRCodeSvg } from '@/components/tickets/QRCodeSvg'
import { toast } from '@/hooks/use-toast'
import {
  Ticket,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  QrCode,
  Download,
  Printer,
  ArrowRight,
  PartyPopper,
  Info,
  Calendar,
  MapPin,
  Clock,
  User,
  HeartHandshake,
  Check,
} from 'lucide-react'

export default function IngressosOnline() {
  const [searchParams] = useSearchParams()
  const orderIdFromUrl = searchParams.get('order_id')
  const statusFromUrl = searchParams.get('status')

  // Categories & Quantities
  const [categories, setCategories] = useState<TicketCategory[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [attendeeNames, setAttendeeNames] = useState<Record<string, string[]>>({})

  // Buyer Form
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerDocument, setBuyerDocument] = useState('')
  const [forceSimulate, setForceSimulate] = useState(false)

  // Flow State
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<TicketOrder | null>(null)
  const [completedTickets, setCompletedTickets] = useState<TicketItem[]>([])
  const [eventSettings, setEventSettings] = useState<any>({
    eventName: 'Abraçolândia 2027',
    dateStr: 'Em Breve em 2027',
    venue: 'Pavilhão de Eventos Vera Cruz & Social',
    timeStr: 'Data e Programação a Confirmar',
    statusBadge: 'VEM AÍ 2027',
  })

  // Load Categories, Settings & Completed Order if returning from Checkout
  useEffect(() => {
    async function init() {
      setLoading(true)
      try {
        const [cats, settingsMap] = await Promise.all([
          getActiveTicketCategories(),
          getSiteSettings(),
        ])
        setCategories(cats)
        if (settingsMap.event_general_info) {
          setEventSettings((prev: any) => ({
            ...prev,
            ...settingsMap.event_general_info,
          }))
        }

        // Initialize quantities to 0
        const initQ: Record<string, number> = {}
        const initA: Record<string, string[]> = {}
        cats.forEach((c) => {
          initQ[c.id] = 0
          initA[c.id] = []
        })
        setQuantities(initQ)
        setAttendeeNames(initA)

        // If order_id is present in URL, check order & load tickets
        if (orderIdFromUrl) {
          const { order, tickets } = await getOrderWithTickets(orderIdFromUrl)
          if (order) {
            setCompletedOrder(order)
            setCompletedTickets(tickets)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [orderIdFromUrl])

  // Quantity helpers
  const handleQuantityChange = (categoryId: string, delta: number) => {
    const cat = categories.find((c) => c.id === categoryId)
    if (!cat) return

    const current = quantities[categoryId] || 0
    const next = Math.max(0, Math.min(cat.available_quantity, current + delta))
    setQuantities((prev) => ({ ...prev, [categoryId]: next }))

    // Adjust attendee names array
    setAttendeeNames((prev) => {
      const names = [...(prev[categoryId] || [])]
      if (next > names.length) {
        while (names.length < next) names.push('')
      } else {
        names.length = next
      }
      return { ...prev, [categoryId]: names }
    })
  }

  const handleAttendeeNameChange = (categoryId: string, index: number, name: string) => {
    setAttendeeNames((prev) => {
      const names = [...(prev[categoryId] || [])]
      names[index] = name
      return { ...prev, [categoryId]: names }
    })
  }

  // Calculate totals
  const totalItemsCount = Object.values(quantities).reduce((acc, q) => acc + q, 0)
  const totalAmountCents = categories.reduce((acc, cat) => {
    const qty = quantities[cat.id] || 0
    return acc + cat.price_in_cents * qty
  }, 0)

  // Submit Checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      toast({
        variant: 'destructive',
        title: 'Dados obrigatórios incompletos',
        description: 'Por favor, informe seu nome completo, e-mail e telefone.',
      })
      return
    }

    if (totalItemsCount === 0 || totalAmountCents === 0) {
      toast({
        variant: 'destructive',
        title: 'Nenhum ingresso selecionado',
        description: 'Selecione pelo menos 1 ingresso para prosseguir com a compra.',
      })
      return
    }

    setSubmitting(true)
    try {
      const itemsPayload = categories
        .filter((cat) => (quantities[cat.id] || 0) > 0)
        .map((cat) => ({
          category_id: cat.id,
          quantity: quantities[cat.id],
          attendee_names: (attendeeNames[cat.id] || []).map((n) => n.trim() || buyerName),
        }))

      const result = await createTicketCheckout({
        customer_name: buyerName,
        customer_email: buyerEmail,
        customer_phone: buyerPhone,
        customer_document: buyerDocument,
        items: itemsPayload,
        simulate_mode: forceSimulate,
        success_url: `${window.location.origin}/abracolandia/ingressos?order_id={ORDER_ID}&status=success`,
        cancel_url: `${window.location.origin}/abracolandia/ingressos?status=cancelled`,
      })

      if (result.mode === 'stripe' && result.checkout_url) {
        // Redirect to real Stripe Checkout Gateway
        toast({
          title: 'Redirecionando para o Gateway Stripe...',
          description: 'Você será levado ao ambiente seguro para concluir o pagamento.',
        })
        window.location.href = result.checkout_url
        return
      }

      // Demo/Instant Mode Success
      if (result.order_id) {
        const { order, tickets } = await getOrderWithTickets(result.order_id)
        setCompletedOrder(order)
        setCompletedTickets(tickets)
        toast({
          title: 'Pagamento Confirmado!',
          description: 'Seus ingressos com QR Code foram emitidos com sucesso.',
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err: any) {
      console.error(err)
      toast({
        variant: 'destructive',
        title: 'Erro ao processar compra',
        description: err.message || 'Ocorreu um erro. Tente novamente em instantes.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handlePrintTickets = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <AbracolandiaHeader />

      <main className="flex-1 pb-20">
        {/* Hero Header */}
        <section className="bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 text-white py-14 sm:py-18 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-400 text-purple-950 font-black px-3 py-1 shadow-md text-xs">
                  🎟 Bilheteria Digital Oficial
                </Badge>
                <Badge className="bg-pink-500/80 text-white border-pink-300 text-xs">
                  QR Code Seguro & Instantâneo
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Ingressos {eventSettings.eventName || 'Abraçolândia 2027'}
              </h1>

              <p className="text-pink-100 text-base sm:text-lg leading-relaxed">
                Garanta sua entrada antecipada no maior festival beneficente da região com pagamento
                seguro e emissão imediata de QR Code por ingresso.{' '}
                <strong>100% da arrecadação líquida</strong> é destinada às famílias e instituições
                assistidas pelo Projeto Abraço.
              </p>

              {/* Event quick badges */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-pink-100">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>{eventSettings.dateStr || 'Em Breve em 2027'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                  <MapPin className="w-4 h-4 text-pink-300" />
                  <span>{eventSettings.venue || 'Pavilhão Social & Parque das Nações'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                  <Clock className="w-4 h-4 text-purple-300" />
                  <span>{eventSettings.timeStr || 'Em Breve: 10h às 22h'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            CASO 1: PEDIDO CONCLUÍDO COM SUCESSO (EXIBIR INGRESSOS)
            ========================================== */}
        {completedOrder && completedTickets.length > 0 ? (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-6">
            {/* Header de Sucesso */}
            <Card className="border-2 border-emerald-400 bg-white shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-emerald-500 text-white p-6 sm:p-8 text-center space-y-2">
                <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-emerald-600 shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">Ingressos Emitidos com Sucesso!</h2>
                <p className="text-emerald-100 text-sm max-w-lg mx-auto">
                  Obrigado por fazer parte dessa corrente do bem! Apresente o QR Code de cada
                  ingresso na portaria do evento para liberação de entrada.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onClick={handlePrintTickets}
                    className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold rounded-xl shadow-md text-xs sm:text-sm"
                  >
                    <Printer className="w-4 h-4 mr-2" /> Imprimir / Salvar PDF
                  </Button>
                  <Link to="/abracolandia">
                    <Button
                      variant="outline"
                      className="bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-700 text-xs sm:text-sm rounded-xl"
                    >
                      🎪 Voltar ao Hotsite
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Detalhes do Pedido */}
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block font-semibold">Comprador Titular:</span>
                    <strong className="text-slate-900 text-sm">
                      {completedOrder.customer_name}
                    </strong>
                    <div className="text-slate-500">{completedOrder.customer_email}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">Número do Pedido:</span>
                    <strong className="text-purple-950 font-mono text-sm">
                      #{completedOrder.id.slice(0, 8).toUpperCase()}
                    </strong>
                    <div className="text-slate-500">
                      Total: {formatCurrencyBRL(completedOrder.total_amount_cents)}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">Status do Pagamento:</span>
                    <Badge className="bg-emerald-600 text-white font-bold text-xs mt-0.5">
                      ✓ Pago & Confirmado
                    </Badge>
                  </div>
                </div>

                {/* Lista de Ingressos com QR Codes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-pink-600" /> Seus Ingressos Digitais (
                    {completedTickets.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedTickets.map((ticket, idx) => (
                      <div
                        key={ticket.id}
                        className="border-2 border-dashed border-purple-300 bg-gradient-to-br from-amber-50/50 via-white to-pink-50/40 rounded-3xl p-5 shadow-md flex flex-col justify-between relative overflow-hidden"
                      >
                        {/* Festive top strip */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400" />

                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between gap-2">
                            <Badge className="bg-purple-950 text-white text-[11px] font-bold">
                              Ingresso #{idx + 1}
                            </Badge>
                            <Badge
                              className={
                                ticket.status === 'used'
                                  ? 'bg-slate-400 text-white'
                                  : 'bg-emerald-600 text-white'
                              }
                            >
                              {ticket.status === 'used' ? 'Já Utilizado' : 'Válido para Entrada'}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="text-base font-black text-purple-950">
                              {ticket.expand?.category_id?.name || 'Ingresso Abraçolândia'}
                            </h4>
                            <p className="text-xs text-slate-600">
                              Participante: <strong>{ticket.attendee_name}</strong>
                            </p>
                          </div>

                          {/* QR Code Center */}
                          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200">
                            <QRCodeSvg value={ticket.ticket_code} size={150} />
                            <div className="text-center mt-2">
                              <span className="font-mono text-sm font-black tracking-widest text-slate-900 block bg-slate-100 px-3 py-1 rounded-lg">
                                {ticket.ticket_code}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Código de Leitura do Portão
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                          <span>📍 Pavilhão Vera Cruz</span>
                          <span>🔒 QR Único & Seguro</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <strong>Instruções de Acesso:</strong>
                  <p>
                    • Apresente o QR Code na tela do seu celular ou impresso na entrada do evento.
                  </p>
                  <p>
                    • Cada QR Code é único e será validado pelo time na portaria, permitindo 1 único
                    acesso.
                  </p>
                  <p>
                    • Dúvidas ou suporte: entre em contato pelo WhatsApp oficial do Projeto Abraço.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        ) : (
          /* ==========================================
              CASO 2: FORMULÁRIO DE SELEÇÃO & CHECKOUT
              ========================================== */
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
            {statusFromUrl === 'cancelled' && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-3 text-amber-900 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong>Pagamento não concluído.</strong> Você cancelou o processo anterior ou
                  ocorreu uma interrupção. Escolha seus ingressos abaixo para tentar novamente.
                </div>
              </div>
            )}

            <form onSubmit={handleCheckout}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Coluna Esquerda: Categorias de Ingresso (8 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                        1. Escolha a Categoria de Ingresso
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Selecione a quantidade desejada em cada uma das opções disponíveis.
                      </p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-3xl border">
                      Carregando lotes e categorias de ingressos...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {categories.map((cat) => {
                        const qty = quantities[cat.id] || 0
                        const isSoldOut = cat.available_quantity <= 0

                        return (
                          <Card
                            key={cat.id}
                            className={`border-2 transition rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md ${
                              qty > 0
                                ? 'border-pink-500 ring-2 ring-pink-500/20'
                                : 'border-amber-100 hover:border-pink-300'
                            } ${isSoldOut ? 'opacity-60 grayscale' : ''}`}
                          >
                            <CardContent className="p-5 sm:p-6 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className="inline-block w-3 h-3 rounded-full"
                                      style={{ backgroundColor: cat.badge_color || '#EC4899' }}
                                    />
                                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                                      {cat.name}
                                    </h3>
                                    {cat.available_quantity < 50 && !isSoldOut && (
                                      <Badge className="bg-amber-500 text-slate-950 text-[10px] font-bold">
                                        Últimos {cat.available_quantity} restantes!
                                      </Badge>
                                    )}
                                  </div>

                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {cat.description}
                                  </p>

                                  {cat.features && Array.isArray(cat.features) && (
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1.5 text-[11px] text-slate-500">
                                      {cat.features.map((feat, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-1.5">
                                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                          <span>{feat}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>

                                {/* Preço e Seletor de Quantidade */}
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                  <div className="text-left sm:text-right">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                      Valor Unitário
                                    </span>
                                    <span className="text-xl font-black text-purple-950">
                                      {formatCurrencyBRL(cat.price_in_cents)}
                                    </span>
                                  </div>

                                  {isSoldOut ? (
                                    <Badge variant="destructive" className="text-xs">
                                      Esgotado
                                    </Badge>
                                  ) : (
                                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        disabled={qty <= 0}
                                        onClick={() => handleQuantityChange(cat.id, -1)}
                                        className="h-8 w-8 p-0 rounded-xl hover:bg-white text-slate-700"
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </Button>
                                      <span className="w-8 text-center font-bold text-sm text-slate-900">
                                        {qty}
                                      </span>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        disabled={qty >= cat.available_quantity}
                                        onClick={() => handleQuantityChange(cat.id, 1)}
                                        className="h-8 w-8 p-0 rounded-xl bg-pink-600 hover:bg-pink-700 text-white shadow-xs"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Nomes dos Participantes se quantidade > 0 */}
                              {qty > 0 && (
                                <div className="pt-3 border-t border-slate-100 space-y-2 animate-in fade-in-50">
                                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                                    Identificação nos Ingressos (Opcional):
                                  </label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {Array.from({ length: qty }).map((_, idx) => (
                                      <Input
                                        key={idx}
                                        placeholder={`Nome do participante #${idx + 1}`}
                                        value={attendeeNames[cat.id]?.[idx] || ''}
                                        onChange={(e) =>
                                          handleAttendeeNameChange(cat.id, idx, e.target.value)
                                        }
                                        className="h-8 text-xs bg-slate-50"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}

                  {/* Informações sobre gratuidade infantil */}
                  <div className="p-4 bg-white rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-slate-600">
                    <Info className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Crianças de até 5 anos:</strong> Entrada gratuita acompanhadas de
                      responsável legal pagante. O ingresso infantil dá direito a vouchers de
                      brinquedos no parque.
                    </div>
                  </div>
                </div>

                {/* Coluna Direita: Dados do Comprador & Resumo do Pedido (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <Card className="border-2 border-purple-200 bg-white rounded-3xl shadow-lg sticky top-24">
                    <CardHeader className="p-6 pb-3">
                      <CardTitle className="text-lg font-black text-purple-950 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-pink-600" /> Resumo do Pedido
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Revise suas escolhas e preencha os dados para emissão dos QR Codes.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 pt-0 space-y-5">
                      {/* Itens Escolhidos */}
                      <div className="space-y-2.5">
                        {totalItemsCount === 0 ? (
                          <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                            Nenhum ingresso selecionado ainda. Clique no (+) ao lado das categorias.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                            {categories
                              .filter((c) => (quantities[c.id] || 0) > 0)
                              .map((cat) => (
                                <div
                                  key={cat.id}
                                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200"
                                >
                                  <div>
                                    <span className="font-bold text-slate-800">{cat.name}</span>
                                    <div className="text-[11px] text-slate-500">
                                      {quantities[cat.id]}x {formatCurrencyBRL(cat.price_in_cents)}
                                    </div>
                                  </div>
                                  <span className="font-black text-purple-950">
                                    {formatCurrencyBRL(cat.price_in_cents * quantities[cat.id])}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}

                        <Separator />

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 font-semibold">
                            Total ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'}):
                          </span>
                          <span className="text-2xl font-black text-pink-600">
                            {formatCurrencyBRL(totalAmountCents)}
                          </span>
                        </div>
                      </div>

                      {/* Formulário do Comprador */}
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-pink-600" /> 2. Dados do Comprador
                        </h4>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            Nome Completo *
                          </label>
                          <Input
                            required
                            placeholder="Seu nome completo"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            className="h-9 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            E-mail (onde receberá os ingressos) *
                          </label>
                          <Input
                            type="email"
                            required
                            placeholder="seuemail@exemplo.com"
                            value={buyerEmail}
                            onChange={(e) => setBuyerEmail(e.target.value)}
                            className="h-9 text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              WhatsApp / Celular *
                            </label>
                            <Input
                              required
                              placeholder="(11) 99999-9999"
                              value={buyerPhone}
                              onChange={(e) => setBuyerPhone(e.target.value)}
                              className="h-9 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              CPF / Documento
                            </label>
                            <Input
                              placeholder="000.000.000-00"
                              value={buyerDocument}
                              onChange={(e) => setBuyerDocument(e.target.value)}
                              className="h-9 text-xs"
                            />
                          </div>
                        </div>

                        {/* Switch de Modo de Demonstração */}
                        <div className="pt-2">
                          <label className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer text-[11px] text-amber-900">
                            <input
                              type="checkbox"
                              checked={forceSimulate}
                              onChange={(e) => setForceSimulate(e.target.checked)}
                              className="rounded border-amber-400 text-pink-600 focus:ring-pink-500"
                            />
                            <span>
                              <strong>Modo Demonstração / Teste Rápido:</strong> Confirmar e gerar
                              QRs instantaneamente sem gateway externo.
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Botão de Finalização */}
                      <Button
                        type="submit"
                        disabled={submitting || totalItemsCount === 0}
                        className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm h-12 rounded-2xl shadow-xl transition"
                      >
                        {submitting ? (
                          'Processando Pedido...'
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <CreditCard className="w-4 h-4" /> Finalizar Compra Segura
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>

                      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Ambiente 100% Seguro • Emissão Imediata</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </section>
        )}
      </main>

      <ColorStrip className="h-1.5" />
      <AbracolandiaFooter />
    </div>
  )
}
