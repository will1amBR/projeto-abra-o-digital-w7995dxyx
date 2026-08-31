import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  EventCard,
  ConsumableItem,
  CartItem,
  ConsumableTransaction,
  formatCurrencyBRL,
  formatCPF,
  getEventCards,
  findCardByUidOrCpf,
  checkInCard,
  rechargeCard,
  getConsumables,
  processSale,
  getTransactions,
  getCaixaStats,
  updateCardStatus,
} from '@/services/caixaService'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import AdminLayout from '@/components/layout/AdminLayout'
import {
  CreditCard,
  QrCode,
  DollarSign,
  ShoppingCart,
  UserCheck,
  History,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  ArrowRight,
  Lock,
  Unlock,
  Receipt,
  Store,
  Sparkles,
  ArrowLeft,
  Filter,
} from 'lucide-react'

export default function AdminCaixa() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<
    'pdv' | 'recarga' | 'checkin' | 'historico' | 'cartoes'
  >('pdv')
  const [loading, setLoading] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    totalRechargedCents: 0,
    totalSoldCents: 0,
    totalCardsActive: 0,
    totalCardsBlocked: 0,
    totalTransactionsCount: 0,
  })

  // ==========================================
  // TAB 1: VENDA (PDV)
  // ==========================================
  const [pdvSearchInput, setPdvSearchInput] = useState('')
  const [pdvActiveCard, setPdvActiveCard] = useState<EventCard | null>(null)
  const [consumablesList, setConsumablesList] = useState<ConsumableItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isProcessingSale, setIsProcessingSale] = useState(false)
  const [lastSaleReceipt, setLastSaleReceipt] = useState<{
    card: EventCard
    transaction: ConsumableTransaction
  } | null>(null)

  // ==========================================
  // TAB 2: RECARGA
  // ==========================================
  const [rechargeSearchInput, setRechargeSearchInput] = useState('')
  const [rechargeCardTarget, setRechargeCardTarget] = useState<EventCard | null>(null)
  const [rechargeAmountCents, setRechargeAmountCents] = useState<number>(5000) // R$ 50,00 default
  const [customRechargeInput, setCustomRechargeInput] = useState<string>('50,00')
  const [rechargeMethod, setRechargeMethod] = useState<string>('PIX')
  const [isProcessingRecharge, setIsProcessingRecharge] = useState(false)

  // ==========================================
  // TAB 3: CHECK-IN
  // ==========================================
  const [checkinUid, setCheckinUid] = useState('')
  const [checkinName, setCheckinName] = useState('')
  const [checkinCpf, setCheckinCpf] = useState('')
  const [checkinPhone, setCheckinPhone] = useState('')
  const [checkinInitialRecharge, setCheckinInitialRecharge] = useState<number>(0)
  const [checkinMethod, setCheckinMethod] = useState<string>('PIX')
  const [checkinNotes, setCheckinNotes] = useState('')
  const [isProcessingCheckin, setIsProcessingCheckin] = useState(false)

  // ==========================================
  // TAB 4: HISTÓRICO & RELATÓRIOS
  // ==========================================
  const [transactionsList, setTransactionsList] = useState<ConsumableTransaction[]>([])
  const [historyFilterType, setHistoryFilterType] = useState<string>('todos')
  const [historySearchQuery, setHistorySearchQuery] = useState('')

  // ==========================================
  // TAB 5: TODOS OS CARTÕES
  // ==========================================
  const [allCardsList, setAllCardsList] = useState<EventCard[]>([])
  const [cardsSearchQuery, setCardsSearchQuery] = useState('')

  // Load initial data
  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, consumablesData, txData, cardsData] = await Promise.all([
        getCaixaStats(),
        getConsumables(),
        getTransactions(),
        getEventCards(),
      ])
      setStats(statsData)
      setConsumablesList(consumablesData)
      setTransactionsList(txData)
      setAllCardsList(cardsData)
    } catch (err) {
      console.error(err)
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar dados do Caixa',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Auto-generate random card UID helper
  const handleGenerateRandomCardUid = () => {
    const random = Math.floor(1000 + Math.random() * 9000)
    setCheckinUid(`ABRA-${random}`)
  }

  // ------------------------------------------
  // PDV Actions
  // ------------------------------------------
  const handleSearchPdvCard = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!pdvSearchInput.trim()) return
    const card = await findCardByUidOrCpf(pdvSearchInput)
    if (!card) {
      toast({
        variant: 'destructive',
        title: 'Cartão não encontrado',
        description: `Nenhum cartão ativo encontrado para "${pdvSearchInput}".`,
      })
      setPdvActiveCard(null)
      return
    }
    setPdvActiveCard(card)
    toast({
      title: 'Cartão identificado!',
      description: `Titular: ${card.holder_name} • Saldo: ${formatCurrencyBRL(card.balance_cents)}`,
    })
  }

  const handleAddToCart = (item: ConsumableItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id)
      if (existing) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const handleUpdateCartQty = (itemId: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((c) => {
            if (c.item.id === itemId) {
              const newQty = c.quantity + delta
              return newQty > 0 ? { ...c, quantity: newQty } : null
            }
            return c
          })
          .filter(Boolean) as CartItem[],
    )
  }

  const handleClearCart = () => setCart([])

  const totalCartCents = cart.reduce((acc, c) => acc + c.item.price_cents * c.quantity, 0)

  const handleExecuteSale = async () => {
    if (!pdvActiveCard) {
      toast({
        variant: 'destructive',
        title: 'Selecione ou bipe um Cartão antes de finalizar a venda.',
      })
      return
    }
    if (cart.length === 0) {
      toast({
        variant: 'destructive',
        title: 'O carrinho está vazio.',
      })
      return
    }

    setIsProcessingSale(true)
    try {
      const result = await processSale({
        cardId: pdvActiveCard.id,
        cart,
        operator_name: user?.name || 'Operador PDV',
      })
      setPdvActiveCard(result.card)
      setLastSaleReceipt(result)
      setCart([])
      toast({
        title: '✅ Venda Concluída com Sucesso!',
        description: `Debitado: ${formatCurrencyBRL(result.transaction.amount_cents)} • Novo Saldo: ${formatCurrencyBRL(result.card.balance_cents)}`,
      })
      loadData()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Não foi possível debitar',
        description: err.message,
      })
    } finally {
      setIsProcessingSale(false)
    }
  }

  // ------------------------------------------
  // Recarga Actions
  // ------------------------------------------
  const handleSearchRechargeCard = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!rechargeSearchInput.trim()) return
    const card = await findCardByUidOrCpf(rechargeSearchInput)
    if (!card) {
      toast({
        variant: 'destructive',
        title: 'Cartão não encontrado',
        description: `Nenhum cartão cadastrado para "${rechargeSearchInput}".`,
      })
      setRechargeCardTarget(null)
      return
    }
    setRechargeCardTarget(card)
    toast({
      title: 'Cartão localizado!',
      description: `${card.holder_name} • Saldo atual: ${formatCurrencyBRL(card.balance_cents)}`,
    })
  }

  const handleSetPredefinedAmount = (cents: number, display: string) => {
    setRechargeAmountCents(cents)
    setCustomRechargeInput(display)
  }

  const handleCustomAmountChange = (val: string) => {
    setCustomRechargeInput(val)
    const cleaned = val.replace(/\D/g, '')
    const cents = parseInt(cleaned || '0', 10)
    setRechargeAmountCents(cents)
  }

  const handleExecuteRecharge = async () => {
    if (!rechargeCardTarget) {
      toast({
        variant: 'destructive',
        title: 'Selecione um cartão para recarregar.',
      })
      return
    }
    if (rechargeAmountCents <= 0) {
      toast({
        variant: 'destructive',
        title: 'Informe um valor válido para recarga.',
      })
      return
    }

    setIsProcessingRecharge(true)
    try {
      const result = await rechargeCard({
        cardId: rechargeCardTarget.id,
        amount_cents: rechargeAmountCents,
        payment_method: rechargeMethod,
        operator_name: user?.name || 'Operador Caixa',
      })
      setRechargeCardTarget(result.card)
      toast({
        title: '💰 Recarga Efetuada com Sucesso!',
        description: `Adicionado ${formatCurrencyBRL(rechargeAmountCents)} ao cartão de ${result.card.holder_name}. Novo Saldo: ${formatCurrencyBRL(result.card.balance_cents)}`,
      })
      loadData()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao recarregar',
        description: err.message,
      })
    } finally {
      setIsProcessingRecharge(false)
    }
  }

  // ------------------------------------------
  // Check-in Actions
  // ------------------------------------------
  const handleExecuteCheckin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkinUid.trim()) {
      toast({ variant: 'destructive', title: 'Informe ou gere o código/UID do cartão.' })
      return
    }
    if (!checkinName.trim()) {
      toast({ variant: 'destructive', title: 'Informe o nome completo do titular.' })
      return
    }
    if (!checkinCpf.trim()) {
      toast({ variant: 'destructive', title: 'Informe o CPF do titular.' })
      return
    }

    setIsProcessingCheckin(true)
    try {
      const result = await checkInCard({
        card_uid: checkinUid,
        holder_name: checkinName,
        cpf: checkinCpf,
        phone: checkinPhone,
        initial_recharge_cents: checkinInitialRecharge,
        payment_method: checkinMethod,
        operator_name: user?.name || 'Operador Check-in',
        notes: checkinNotes,
      })

      toast({
        title: '🎉 Cartão Vinculado com Sucesso!',
        description: `Cartão ${result.card.card_uid} ativado para ${result.card.holder_name}. Saldo: ${formatCurrencyBRL(result.card.balance_cents)}`,
      })

      // Limpar formulário
      setCheckinUid('')
      setCheckinName('')
      setCheckinCpf('')
      setCheckinPhone('')
      setCheckinInitialRecharge(0)
      setCheckinNotes('')

      loadData()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no Check-in',
        description: err.message,
      })
    } finally {
      setIsProcessingCheckin(false)
    }
  }

  // ------------------------------------------
  // Bloquear / Desbloquear Cartão
  // ------------------------------------------
  const handleToggleCardStatus = async (card: EventCard) => {
    const newStatus = card.status === 'ativo' ? 'bloqueado' : 'ativo'
    const confirmMsg =
      newStatus === 'bloqueado'
        ? `Tem certeza que deseja BLOQUEAR o cartão de ${card.holder_name}?`
        : `Deseja REATIVAR o cartão de ${card.holder_name}?`

    if (!window.confirm(confirmMsg)) return

    try {
      await updateCardStatus(card.id, newStatus)
      toast({
        title: newStatus === 'bloqueado' ? 'Cartão Bloqueado' : 'Cartão Reativado',
      })
      loadData()
      if (pdvActiveCard?.id === card.id) {
        setPdvActiveCard((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
      if (rechargeCardTarget?.id === card.id) {
        setRechargeCardTarget((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar status',
        description: err.message,
      })
    }
  }

  // ------------------------------------------
  // Exportar Relatório CSV
  // ------------------------------------------
  const handleExportCsv = () => {
    if (transactionsList.length === 0) {
      toast({ title: 'Nenhuma transação disponível para exportar.' })
      return
    }

    const headers = [
      'Data_Hora',
      'Tipo',
      'Codigo_Cartao',
      'Nome_Titular',
      'CPF',
      'Valor_R$',
      'Saldo_Anterior_R$',
      'Novo_Saldo_R$',
      'Metodo_Pagamento',
      'Operador',
      'Descricao_Itens',
    ]

    const rows = transactionsList.map((t) => [
      new Date(t.created).toLocaleString('pt-BR'),
      t.type.toUpperCase(),
      t.expand?.card_id?.card_uid || '',
      t.expand?.card_id?.holder_name || '',
      t.expand?.card_id?.cpf || '',
      (t.amount_cents / 100).toFixed(2),
      (t.previous_balance_cents / 100).toFixed(2),
      (t.new_balance_cents / 100).toFixed(2),
      t.payment_method || '',
      t.operator_name || '',
      t.items_json
        ? t.items_json.map((i) => `${i.quantity}x ${i.name}`).join(' | ')
        : t.notes || '',
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers.join(','),
        ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
      ].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `relatorio_caixa_abracolandia_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({
      title: 'Relatório CSV Exportado!',
      description: 'Download das movimentações financeiras concluído.',
    })
  }

  return (
    <AdminLayout title="Sistema de Caixa & Consumo" activeNav="caixa">
      {/* Action bar */}
      <div className="bg-slate-900 text-white px-4 lg:px-8 py-3 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-orange-500 flex items-center justify-center text-white shadow-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
                  Sistema de Caixa • Abraçolândia
                </h1>
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold">ONLINE</Badge>
              </div>
              <p className="text-xs text-slate-400">
                Check-in de Cartões, Recargas Pré-pagas, PDV de Consumo & Histórico
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/bingo')}
              className="text-xs bg-purple-950 text-purple-200 border-purple-800 hover:bg-purple-900"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" /> Ir ao Bingo Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="text-xs bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />{' '}
              Atualizar
            </Button>
            <Button
              size="sm"
              onClick={handleExportCsv}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Exportar CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-6 flex-1 space-y-6">
        {/* Metric Cards Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Recarregado
              </span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatCurrencyBRL(stats.totalRechargedCents)}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              Saldo pré-pago inserido
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Consumo Debitado (PDV)
              </span>
              <ShoppingCart className="w-4 h-4 text-pink-600" />
            </div>
            <div className="text-2xl font-black text-pink-600 mt-1">
              {formatCurrencyBRL(stats.totalSoldCents)}
            </div>
            <span className="text-[11px] text-pink-700 font-medium">
              Vendas nos pontos da festa
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cartões Ativos
              </span>
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalCardsActive}</div>
            <span className="text-[11px] text-blue-700 font-medium">
              {stats.totalCardsBlocked} bloqueados / inativos
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Transações
              </span>
              <History className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-950 mt-1">
              {stats.totalTransactionsCount}
            </div>
            <span className="text-[11px] text-purple-700 font-medium">Recargas + Vendas</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(val: any) => setActiveTab(val)}
            className="w-full"
          >
            <div className="bg-slate-50 border-b border-slate-200 p-2 overflow-x-auto">
              <TabsList className="bg-white border border-slate-200 p-1 rounded-xl flex w-max min-w-full justify-start h-auto gap-1">
                <TabsTrigger
                  value="pdv"
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white font-extrabold text-xs px-4 py-2 rounded-lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-1.5" /> 1. Venda Rápida (PDV)
                </TabsTrigger>
                <TabsTrigger
                  value="recarga"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white font-extrabold text-xs px-4 py-2 rounded-lg"
                >
                  <DollarSign className="w-4 h-4 mr-1.5" /> 2. Recarga de Saldo
                </TabsTrigger>
                <TabsTrigger
                  value="checkin"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-extrabold text-xs px-4 py-2 rounded-lg"
                >
                  <UserCheck className="w-4 h-4 mr-1.5" /> 3. Check-in de Cartão
                </TabsTrigger>
                <TabsTrigger
                  value="historico"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white font-extrabold text-xs px-4 py-2 rounded-lg"
                >
                  <History className="w-4 h-4 mr-1.5" /> 4. Histórico & Relatórios
                </TabsTrigger>
                <TabsTrigger
                  value="cartoes"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white font-extrabold text-xs px-4 py-2 rounded-lg"
                >
                  <CreditCard className="w-4 h-4 mr-1.5" /> 5. Gestão de Cartões (
                  {allCardsList.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ========================================================================= */}
            {/* 1. ABA DE VENDA (PDV)                                                    */}
            {/* ========================================================================= */}
            <TabsContent value="pdv" className="p-4 lg:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Col: Catálogo de Produtos (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Categorias Filter */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-1">
                    {[
                      { id: 'todos', label: 'Todos os Itens' },
                      { id: 'comida', label: '🍔 Comidas' },
                      { id: 'bebida', label: '🥤 Bebidas' },
                      { id: 'sobremesa', label: '🍦 Doces' },
                      { id: 'brinquedo', label: '🎈 Espaço Kids' },
                      { id: 'outro', label: '🎟 Outros' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                          selectedCategory === cat.id
                            ? 'bg-pink-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Grid de Itens */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {consumablesList
                      .filter(
                        (i) => selectedCategory === 'todos' || i.category === selectedCategory,
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleAddToCart(item)}
                          className="bg-white border border-slate-200 rounded-2xl p-3 hover:border-pink-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group active:scale-95"
                        >
                          <div className="space-y-2">
                            <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-100 relative">
                              <img
                                src={
                                  item.image_url ||
                                  `https://img.usecurling.com/p/300/300?q=${encodeURIComponent(item.name)}`
                                }
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                              <Badge className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] backdrop-blur-xs">
                                {item.category}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                            <span className="text-xs font-black text-pink-600">
                              {formatCurrencyBRL(item.price_cents)}
                            </span>
                            <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs group-hover:bg-pink-600 group-hover:text-white transition">
                              +
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Right Col: Carrinho & Leitura de Cartão (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Identificação do Cartão */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" /> Cartão do Cliente
                      </span>
                      {pdvActiveCard && (
                        <Badge
                          className={
                            pdvActiveCard.status === 'ativo'
                              ? 'bg-emerald-600 text-white text-[10px]'
                              : 'bg-red-600 text-white text-[10px]'
                          }
                        >
                          {pdvActiveCard.status === 'ativo' ? 'Ativo' : 'Bloqueado'}
                        </Badge>
                      )}
                    </div>

                    <form onSubmit={handleSearchPdvCard} className="flex gap-2">
                      <Input
                        placeholder="Bipe o QR / Digite UID ou CPF..."
                        value={pdvSearchInput}
                        onChange={(e) => setPdvSearchInput(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white text-xs h-9"
                      />
                      <Button
                        type="submit"
                        className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs h-9 px-3 shrink-0"
                      >
                        <Search className="w-3.5 h-3.5 mr-1" /> Buscar
                      </Button>
                    </form>

                    {pdvActiveCard ? (
                      <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-extrabold text-white text-sm">
                              {pdvActiveCard.holder_name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              UID:{' '}
                              <strong className="text-amber-400">{pdvActiveCard.card_uid}</strong> •
                              CPF: {pdvActiveCard.cpf}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              Saldo Atual
                            </span>
                            <span
                              className={`text-base font-black ${
                                pdvActiveCard.balance_cents >= totalCartCents
                                  ? 'text-emerald-400'
                                  : 'text-red-400'
                              }`}
                            >
                              {formatCurrencyBRL(pdvActiveCard.balance_cents)}
                            </span>
                          </div>
                        </div>

                        {pdvActiveCard.balance_cents < totalCartCents && (
                          <div className="text-[11px] bg-red-950/80 text-red-200 p-2 rounded-lg border border-red-800 flex items-center justify-between">
                            <span>
                              ⚠️ Saldo insuficiente! Faltam{' '}
                              <strong>
                                {formatCurrencyBRL(totalCartCents - pdvActiveCard.balance_cents)}
                              </strong>
                            </span>
                            <Button
                              size="sm"
                              onClick={() => {
                                setRechargeSearchInput(pdvActiveCard.card_uid)
                                setRechargeCardTarget(pdvActiveCard)
                                setActiveTab('recarga')
                              }}
                              className="h-6 text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold ml-2"
                            >
                              Recarregar Agora
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                        Nenhum cartão selecionado. Bip o código do cliente ou digite o UID para
                        vincular o débito.
                      </div>
                    )}
                  </div>

                  {/* Resumo do Pedido / Carrinho */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <ShoppingCart className="w-4 h-4 text-pink-600" /> Carrinho ({cart.length}{' '}
                        itens)
                      </h3>
                      {cart.length > 0 && (
                        <button
                          onClick={handleClearCart}
                          className="text-[11px] text-red-600 hover:underline font-semibold"
                        >
                          Limpar Carrinho
                        </button>
                      )}
                    </div>

                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400">
                        O carrinho está vazio. Clique nos produtos ao lado para adicionar.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
                        {cart.map((c) => (
                          <div
                            key={c.item.id}
                            className="pt-2 first:pt-0 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-slate-800 truncate">{c.item.name}</div>
                              <div className="text-[11px] text-slate-500">
                                {formatCurrencyBRL(c.item.price_cents)} un.
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleUpdateCartQty(c.item.id, -1)}
                                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-bold text-slate-900">
                                {c.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateCartQty(c.item.id, 1)}
                                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="w-16 text-right font-black text-slate-900 shrink-0">
                              {formatCurrencyBRL(c.item.price_cents * c.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Totais */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-slate-600">Total da Venda:</span>
                        <span className="text-xl font-black text-pink-600">
                          {formatCurrencyBRL(totalCartCents)}
                        </span>
                      </div>

                      <Button
                        onClick={handleExecuteSale}
                        disabled={
                          isProcessingSale ||
                          cart.length === 0 ||
                          !pdvActiveCard ||
                          pdvActiveCard.balance_cents < totalCartCents ||
                          pdvActiveCard.status !== 'ativo'
                        }
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm h-12 rounded-xl shadow-md disabled:opacity-50"
                      >
                        {isProcessingSale ? (
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Confirmar e Debitar do Cartão
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ========================================================================= */}
            {/* 2. ABA DE RECARGA DE SALDO                                               */}
            {/* ========================================================================= */}
            <TabsContent value="recarga" className="p-4 lg:p-6 space-y-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* 1. Buscar Cartão */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> 1. Identificar Cartão do Evento
                  </h3>
                  <form onSubmit={handleSearchRechargeCard} className="flex gap-2">
                    <Input
                      placeholder="Bipe o código do cartão ou digite o CPF / UID..."
                      value={rechargeSearchInput}
                      onChange={(e) => setRechargeSearchInput(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white text-xs h-10"
                    />
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 px-4 shrink-0"
                    >
                      <Search className="w-4 h-4 mr-1.5" /> Localizar Cartão
                    </Button>
                  </form>

                  {rechargeCardTarget && (
                    <div className="bg-purple-950/60 border border-purple-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-base font-extrabold text-white">
                          {rechargeCardTarget.holder_name}
                        </div>
                        <div className="text-xs text-purple-300">
                          UID:{' '}
                          <strong className="text-amber-400">{rechargeCardTarget.card_uid}</strong>{' '}
                          • CPF: {rechargeCardTarget.cpf}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-purple-300 uppercase block font-bold">
                          Saldo Disponível
                        </span>
                        <span className="text-xl font-black text-emerald-400">
                          {formatCurrencyBRL(rechargeCardTarget.balance_cents)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Escolher Valor e Forma de Pagamento */}
                {rechargeCardTarget && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        2. Selecione o Valor da Recarga
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { cents: 2000, label: 'R$ 20,00', display: '20,00' },
                          { cents: 5000, label: 'R$ 50,00', display: '50,00' },
                          { cents: 10000, label: 'R$ 100,00', display: '100,00' },
                          { cents: 20000, label: 'R$ 200,00', display: '200,00' },
                        ].map((btn) => (
                          <button
                            key={btn.cents}
                            type="button"
                            onClick={() => handleSetPredefinedAmount(btn.cents, btn.display)}
                            className={`p-3 rounded-xl border text-center font-black transition ${
                              rechargeAmountCents === btn.cents
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-purple-50'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3">
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                          Ou digite outro valor (R$):
                        </label>
                        <Input
                          placeholder="Ex: 75,00"
                          value={customRechargeInput}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          className="text-lg font-black text-purple-950"
                        />
                      </div>
                    </div>

                    {/* Forma de Pagamento */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        3. Forma de Pagamento do Cliente
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['PIX', 'Dinheiro', 'Cartão Débito', 'Cartão Crédito'].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setRechargeMethod(method)}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                              rechargeMethod === method
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Resumo Final da Recarga */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">Novo saldo previsto:</span>
                        <span className="text-lg font-black text-emerald-600">
                          {formatCurrencyBRL(
                            (rechargeCardTarget.balance_cents || 0) + rechargeAmountCents,
                          )}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Valor da Recarga:</span>
                        <span className="text-xl font-black text-purple-900">
                          {formatCurrencyBRL(rechargeAmountCents)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleExecuteRecharge}
                      disabled={isProcessingRecharge || rechargeAmountCents <= 0}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm h-12 rounded-xl shadow-md"
                    >
                      {isProcessingRecharge ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <DollarSign className="w-4 h-4 mr-2" />
                      )}
                      Confirmar Pagamento e Inserir Saldo
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ========================================================================= */}
            {/* 3. ABA DE CHECK-IN (VINCULAR CARTÃO)                                     */}
            {/* ========================================================================= */}
            <TabsContent value="checkin" className="p-4 lg:p-6 space-y-6">
              <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-600" /> Check-in & Entrega de Cartão
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Vincule um cartão físico (código de barras, QR Code ou RFID) aos dados do
                    visitante do evento.
                  </p>
                </div>

                <form onSubmit={handleExecuteCheckin} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Código / UID do Cartão *
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateRandomCardUid}
                        className="text-[11px] text-blue-600 hover:underline font-bold"
                      >
                        + Gerar Código Automático
                      </button>
                    </div>
                    <Input
                      placeholder="Ex: ABRA-1045 ou passe o leitor de código de barras"
                      value={checkinUid}
                      onChange={(e) => setCheckinUid(e.target.value.toUpperCase())}
                      className="font-mono font-bold text-slate-900"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nome Completo do Titular *
                      </label>
                      <Input
                        placeholder="Ex: Maria Silva"
                        value={checkinName}
                        onChange={(e) => setCheckinName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        CPF do Titular *
                      </label>
                      <Input
                        placeholder="000.000.000-00"
                        value={checkinCpf}
                        onChange={(e) => setCheckinCpf(formatCPF(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Telefone / WhatsApp (Opcional)
                      </label>
                      <Input
                        placeholder="(11) 99999-9999"
                        value={checkinPhone}
                        onChange={(e) => setCheckinPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Recarga Inicial (Opcional - R$)
                      </label>
                      <Input
                        placeholder="0,00"
                        type="number"
                        min="0"
                        step="5"
                        onChange={(e) => {
                          const val = parseFloat(e.target.value || '0')
                          setCheckinInitialRecharge(Math.round(val * 100))
                        }}
                      />
                    </div>
                  </div>

                  {checkinInitialRecharge > 0 && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Forma de Pagamento da Recarga Inicial
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['PIX', 'Dinheiro', 'Cartão'].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setCheckinMethod(m)}
                            className={`p-2 rounded-lg border text-xs font-bold transition ${
                              checkinMethod === m
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Observações
                    </label>
                    <Input
                      placeholder="Ex: Entrada VIP, convidado da mesa 4, etc."
                      value={checkinNotes}
                      onChange={(e) => setCheckinNotes(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessingCheckin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm h-12 rounded-xl shadow-md"
                  >
                    {isProcessingCheckin ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <UserCheck className="w-4 h-4 mr-2" />
                    )}
                    Concluir Check-in e Ativar Cartão
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* ========================================================================= */}
            {/* 4. ABA DE HISTÓRICO & RELATÓRIOS                                         */}
            {/* ========================================================================= */}
            <TabsContent value="historico" className="p-4 lg:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Histórico de Transações do Evento
                  </h3>
                  <p className="text-xs text-slate-500">
                    Consulte movimentações correlacionadas por CPF, titular, tipo e horário.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <Input
                      placeholder="Filtrar por nome, CPF ou cartão..."
                      value={historySearchQuery}
                      onChange={(e) => setHistorySearchQuery(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleExportCsv}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs shrink-0"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> CSV
                  </Button>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Data/Hora</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Cartão / Titular</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Saldo Resultante</th>
                      <th className="p-3">Detalhes / Itens</th>
                      <th className="p-3">Operador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {transactionsList
                      .filter((t) => {
                        if (!historySearchQuery) return true
                        const q = historySearchQuery.toLowerCase()
                        const cardName = t.expand?.card_id?.holder_name?.toLowerCase() || ''
                        const cardUid = t.expand?.card_id?.card_uid?.toLowerCase() || ''
                        const cardCpf = t.expand?.card_id?.cpf?.toLowerCase() || ''
                        return cardName.includes(q) || cardUid.includes(q) || cardCpf.includes(q)
                      })
                      .map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                          <td className="p-3 text-[11px] text-slate-500 whitespace-nowrap">
                            {new Date(tx.created).toLocaleString('pt-BR')}
                          </td>
                          <td className="p-3">
                            <Badge
                              className={
                                tx.type === 'recarga'
                                  ? 'bg-emerald-600 text-white text-[10px]'
                                  : tx.type === 'venda'
                                    ? 'bg-pink-600 text-white text-[10px]'
                                    : 'bg-amber-500 text-white text-[10px]'
                              }
                            >
                              {tx.type === 'recarga'
                                ? '📥 Recarga'
                                : tx.type === 'venda'
                                  ? '🛒 Venda'
                                  : 'Estorno'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900">
                              {tx.expand?.card_id?.holder_name || 'Cartão Avulso'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              UID: {tx.expand?.card_id?.card_uid} • CPF: {tx.expand?.card_id?.cpf}
                            </div>
                          </td>
                          <td
                            className={`p-3 font-black ${
                              tx.type === 'recarga' ? 'text-emerald-600' : 'text-pink-600'
                            }`}
                          >
                            {tx.type === 'recarga' ? '+' : '-'} {formatCurrencyBRL(tx.amount_cents)}
                          </td>
                          <td className="p-3 font-bold text-slate-900">
                            {formatCurrencyBRL(tx.new_balance_cents)}
                          </td>
                          <td className="p-3 max-w-xs truncate text-[11px] text-slate-600">
                            {tx.items_json && tx.items_json.length > 0
                              ? tx.items_json.map((i) => `${i.quantity}x ${i.name}`).join(', ')
                              : tx.notes || tx.payment_method || '---'}
                          </td>
                          <td className="p-3 text-[11px] text-slate-500">
                            {tx.operator_name || 'Caixa'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* ========================================================================= */}
            {/* 5. ABA DE TODOS OS CARTÕES                                               */}
            {/* ========================================================================= */}
            <TabsContent value="cartoes" className="p-4 lg:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Gestão Geral de Cartões Cadastrados
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bloqueie, consulte saldos ou gerencie os cartões do evento.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <Input
                    placeholder="Buscar titular, CPF ou UID..."
                    value={cardsSearchQuery}
                    onChange={(e) => setCardsSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCardsList
                  .filter((c) => {
                    if (!cardsSearchQuery) return true
                    const q = cardsSearchQuery.toLowerCase()
                    return (
                      c.holder_name.toLowerCase().includes(q) ||
                      c.card_uid.toLowerCase().includes(q) ||
                      c.cpf.includes(q)
                    )
                  })
                  .map((card) => (
                    <div
                      key={card.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xs hover:border-slate-300 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            className={
                              card.status === 'ativo'
                                ? 'bg-emerald-600 text-white text-[10px]'
                                : 'bg-red-600 text-white text-[10px]'
                            }
                          >
                            {card.status === 'ativo' ? '🟢 Ativo' : '🔴 Bloqueado'}
                          </Badge>
                          <span className="font-mono text-xs font-bold text-slate-500">
                            {card.card_uid}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            {card.holder_name}
                          </h4>
                          <p className="text-xs text-slate-500">CPF: {card.cpf}</p>
                          {card.phone && (
                            <p className="text-[11px] text-slate-400">Tel: {card.phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Saldo em Conta
                          </span>
                          <span className="text-lg font-black text-slate-900">
                            {formatCurrencyBRL(card.balance_cents)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPdvSearchInput(card.card_uid)
                              setPdvActiveCard(card)
                              setActiveTab('pdv')
                            }}
                            className="text-[11px] h-8 px-2.5 text-pink-700 border-pink-200 hover:bg-pink-50"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 mr-1" /> PDV
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleCardStatus(card)}
                            className={`text-[11px] h-8 px-2.5 ${
                              card.status === 'ativo'
                                ? 'text-red-600 border-red-200 hover:bg-red-50'
                                : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            {card.status === 'ativo' ? (
                              <>
                                <Lock className="w-3.5 h-3.5 mr-1" /> Bloquear
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3.5 h-3.5 mr-1" /> Reativar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AdminLayout>
  )
}
