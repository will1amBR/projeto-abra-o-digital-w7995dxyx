import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GenericContentModal } from '@/components/admin/GenericContentModal'
import { AdminAiAssistant } from '@/components/admin/AdminAiAssistant'
import { getImageSrc } from '@/services/contentService'
import { reviewVolunteerAction } from '@/services/gamificationService'
import { formatCurrencyBRL } from '@/services/ticketService'
import { toast } from '@/hooks/use-toast'
import {
  HeartHandshake,
  Sparkles,
  LayoutGrid,
  Newspaper,
  Users,
  Award,
  Calendar,
  Ticket,
  Clock,
  Settings,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  LogOut,
  Image as ImageIcon,
  CheckCircle2,
  HelpCircle,
  Search,
  Target,
  Trophy,
  Check,
  XCircle,
  Gift,
  Flame,
  ShieldCheck,
  MessageSquare,
  QrCode,
  ScanLine,
  Download,
  FileSpreadsheet,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Dice5,
} from 'lucide-react'
import AbracoLogo from '@/components/brand/AbracoLogo'
import AdminLayout from '@/components/layout/AdminLayout'

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('noticias')
  const [searchTerm, setSearchTerm] = useState('')

  // Collections state
  const [news, setNews] = useState<any[]>([])
  const [beneficiaries, setBeneficiaries] = useState<any[]>([])
  const [sponsors, setSponsors] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [volunteerAreas, setVolunteerAreas] = useState<any[]>([])
  const [eventSections, setEventSections] = useState<any[]>([])
  const [ticketOutlets, setTicketOutlets] = useState<any[]>([])
  const [pastEditions, setPastEditions] = useState<any[]>([])
  const [contentBlocks, setContentBlocks] = useState<any[]>([])
  const [inscriptions, setInscriptions] = useState<any[]>([])
  const [settingsData, setSettingsData] = useState<any>({})

  // Gamification states in CMS
  const [volunteerProfiles, setVolunteerProfiles] = useState<any[]>([])
  const [missions, setMissions] = useState<any[]>([])
  const [badges, setBadges] = useState<any[]>([])
  const [volunteerActions, setVolunteerActions] = useState<any[]>([])
  const [reviewingActionId, setReviewingActionId] = useState<string | null>(null)
  const [reviewFeedback, setReviewFeedback] = useState('')

  // Ingressos Online states in CMS
  const [ticketCategories, setTicketCategories] = useState<any[]>([])
  const [ticketOrders, setTicketOrders] = useState<any[]>([])
  const [ticketsList, setTicketsList] = useState<any[]>([])

  const [loading, setLoading] = useState(false)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    collection: string
    title: string
    item: any | null
    fields: any[]
  }>({
    collection: '',
    title: '',
    item: null,
    fields: [],
  })

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [
        newsData,
        benData,
        sponData,
        banData,
        volData,
        secData,
        tktData,
        pastData,
        blocksData,
        inscData,
        settingsRecords,
        vpData,
        vmData,
        vbData,
        vaData,
        tcatData,
        tordData,
        tktListData,
      ] = await Promise.all([
        pb.collection('news').getFullList({ sort: '-created' }),
        pb.collection('beneficiaries').getFullList({ sort: '-created' }),
        pb.collection('sponsors').getFullList({ sort: 'order,created' }),
        pb.collection('banners').getFullList({ sort: 'site,order' }),
        pb.collection('volunteer_areas').getFullList({ sort: 'site,created' }),
        pb.collection('event_sections').getFullList({ sort: 'order' }),
        pb.collection('ticket_outlets').getFullList({ sort: 'type,name' }),
        pb.collection('past_editions').getFullList({ sort: '-year' }),
        pb.collection('content_blocks').getFullList({ sort: 'site,order' }),
        pb
          .collection('volunteer_inscriptions')
          .getFullList({ sort: '-created' })
          .catch(() => []),
        pb
          .collection('site_settings')
          .getFullList()
          .catch(() => []),
        pb
          .collection('volunteer_profiles')
          .getFullList({ sort: '-points,-created' })
          .catch(() => []),
        pb
          .collection('volunteer_missions')
          .getFullList({ sort: 'order,created' })
          .catch(() => []),
        pb
          .collection('volunteer_badges')
          .getFullList({ sort: 'points_required,name' })
          .catch(() => []),
        pb
          .collection('volunteer_actions')
          .getFullList({ sort: '-created', expand: 'volunteer_profile_id,mission_id' })
          .catch(() => []),
        pb
          .collection('ticket_categories')
          .getFullList({ sort: 'order,price_in_cents' })
          .catch(() => []),
        pb
          .collection('ticket_orders')
          .getFullList({ sort: '-created' })
          .catch(() => []),
        pb
          .collection('tickets')
          .getFullList({ sort: '-created', expand: 'order_id,category_id' })
          .catch(() => []),
      ])

      setNews(newsData)
      setBeneficiaries(benData)
      setSponsors(sponData)
      setBanners(banData)
      setVolunteerAreas(volData)
      setEventSections(secData)
      setTicketOutlets(tktData)
      setPastEditions(pastData)
      setContentBlocks(blocksData)
      setInscriptions(inscData)
      setVolunteerProfiles(vpData)
      setMissions(vmData)
      setBadges(vbData)
      setVolunteerActions(vaData)
      setTicketCategories(tcatData)
      setTicketOrders(tordData)
      setTicketsList(tktListData)

      const sMap: any = {}
      for (const s of settingsRecords) sMap[s.key] = s.value
      setSettingsData(sMap)
    } catch (err) {
      console.error('Error fetching admin data:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar dados',
        description: 'Verifique sua conexão ou permissões.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const handleOpenCreate = (collection: string) => {
    const config = getCollectionModalConfig(collection, null)
    setModalConfig(config)
    setModalOpen(true)
  }

  const handleOpenEdit = (collection: string, item: any) => {
    const config = getCollectionModalConfig(collection, item)
    setModalConfig(config)
    setModalOpen(true)
  }

  const handleDeleteItem = async (collection: string, id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir permanentemente este registro?')) return
    try {
      await pb.collection(collection).delete(id)
      toast({ title: 'Item excluído com sucesso!' })
      loadAllData()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: err.message,
      })
    }
  }

  const handleSaveModal = async (data: Record<string, any>, fileObj?: File | null) => {
    const colName = modalConfig.collection
    const isEdit = !!modalConfig.item?.id

    // Use FormData if a file is present
    let payload: any = { ...data }
    if (fileObj) {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (typeof v === 'object' && v !== null && !(v instanceof File)) {
          formData.append(k, JSON.stringify(v))
        } else {
          formData.append(k, v)
        }
      })
      // Detect file field name
      const fileField = colName === 'sponsors' ? 'logo' : 'image'
      formData.append(fileField, fileObj)
      payload = formData
    }

    if (isEdit) {
      await pb.collection(colName).update(modalConfig.item.id, payload)
    } else {
      await pb.collection(colName).create(payload)
    }
    loadAllData()
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Social links
      const socialRec = await pb
        .collection('site_settings')
        .getFirstListItem('key="social_links"')
        .catch(() => null)
      if (socialRec) {
        await pb
          .collection('site_settings')
          .update(socialRec.id, { value: settingsData.social_links })
      } else {
        await pb
          .collection('site_settings')
          .create({ key: 'social_links', value: settingsData.social_links })
      }

      // Event Info
      const eventRec = await pb
        .collection('site_settings')
        .getFirstListItem('key="event_general_info"')
        .catch(() => null)
      if (eventRec) {
        await pb
          .collection('site_settings')
          .update(eventRec.id, { value: settingsData.event_general_info })
      } else {
        await pb
          .collection('site_settings')
          .create({ key: 'event_general_info', value: settingsData.event_general_info })
      }

      toast({ title: 'Configurações atualizadas com sucesso!' })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar configurações',
        description: err.message,
      })
    }
  }

  const handleReviewAction = async (actionId: string, decision: 'approved' | 'rejected') => {
    try {
      await reviewVolunteerAction(
        actionId,
        decision,
        user?.name || 'Administrador CMS',
        reviewFeedback,
      )
      toast({
        title: decision === 'approved' ? 'Ação Aprovada!' : 'Ação Rejeitada',
        description:
          decision === 'approved'
            ? 'Os pontos foram creditados no perfil do voluntário com sucesso.'
            : 'O voluntário verá o status como não aprovado.',
      })
      setReviewingActionId(null)
      setReviewFeedback('')
      loadAllData()
    } catch (err: any) {
      console.error(err)
      toast({
        variant: 'destructive',
        title: 'Erro ao revisar ação',
        description: err.message,
      })
    }
  }

  function getCollectionModalConfig(collection: string, item: any | null) {
    switch (collection) {
      case 'volunteer_missions':
        return {
          collection: 'volunteer_missions',
          title: item ? 'Editar Missão de Voluntariado' : 'Criar Nova Missão Gamificada',
          item,
          fields: [
            { name: 'title', label: 'Título da Missão', type: 'text', required: true },
            {
              name: 'category',
              label: 'Categoria',
              type: 'select',
              required: true,
              options: [
                { label: 'Indicação de Amigos', value: 'Indicação' },
                { label: 'Doação / Arrecadação', value: 'Doação' },
                { label: 'Ação Social / Presencial', value: 'Ação Social' },
                { label: 'Divulgação em Redes', value: 'Divulgação' },
                { label: 'Especial / Desafio Épico', value: 'Especial' },
              ],
            },
            {
              name: 'difficulty',
              label: 'Dificuldade',
              type: 'select',
              required: true,
              options: [
                { label: 'Fácil', value: 'Fácil' },
                { label: 'Médio', value: 'Médio' },
                { label: 'Avançado', value: 'Avançado' },
                { label: 'Épico', value: 'Épico' },
              ],
            },
            {
              name: 'points_reward',
              label: 'Pontos de Recompensa (Número)',
              type: 'number',
              required: true,
            },
            {
              name: 'icon_name',
              label: 'Ícone (HeartHandshake, Users, Gift, Sparkles, PartyPopper)',
              type: 'text',
            },
            {
              name: 'description',
              label: 'Descrição Detalhada da Missão (HTML)',
              type: 'editor',
              required: true,
            },
            {
              name: 'instructions',
              label: 'Instruções de Comprovação para o Voluntário',
              type: 'textarea',
            },
            { name: 'active', label: 'Missão Ativa para os Voluntários', type: 'bool' },
            { name: 'order', label: 'Ordem de Exibição', type: 'number' },
          ],
        }

      case 'volunteer_badges':
        return {
          collection: 'volunteer_badges',
          title: item ? 'Editar Medalha' : 'Criar Nova Medalha / Conquista',
          item,
          fields: [
            { name: 'name', label: 'Nome da Medalha', type: 'text', required: true },
            {
              name: 'description',
              label: 'Descrição / Requisito',
              type: 'textarea',
              required: true,
            },
            {
              name: 'category',
              label: 'Categoria',
              type: 'select',
              required: true,
              options: [
                { label: 'Geral', value: 'Geral' },
                { label: 'Indicações', value: 'Indicações' },
                { label: 'Doações', value: 'Doações' },
                { label: 'Presença', value: 'Presença' },
                { label: 'Destaque', value: 'Destaque' },
              ],
            },
            {
              name: 'rarity',
              label: 'Raridade',
              type: 'select',
              required: true,
              options: [
                { label: 'Comum', value: 'Comum' },
                { label: 'Raro', value: 'Raro' },
                { label: 'Lendário', value: 'Lendário' },
                { label: 'Mestre', value: 'Mestre' },
              ],
            },
            {
              name: 'points_required',
              label: 'Pontos Necessários para Desbloqueio Automático',
              type: 'number',
              required: true,
            },
            {
              name: 'icon_name',
              label: 'Ícone (HeartHandshake, Users, Gift, ShieldCheck, Sparkles, PartyPopper)',
              type: 'text',
              required: true,
            },
          ],
        }

      case 'banners':
        return {
          collection: 'banners',
          title: item ? 'Editar Banner Principal' : 'Novo Banner de Destaque',
          item,
          fields: [
            {
              name: 'site',
              label: 'Ambiente / Destino',
              type: 'select',
              required: true,
              options: [
                { label: 'Website Institucional (Projeto Abraço)', value: 'abraco' },
                { label: 'Hotsite Abraçolândia', value: 'abracolandia' },
              ],
            },
            { name: 'title', label: 'Título Principal', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtítulo / Descrição Curta', type: 'textarea' },
            {
              name: 'badge',
              label: 'Tag / Destaque Superior',
              type: 'text',
              placeholder: 'Ex: 12ª Edição • Outubro',
            },
            {
              name: 'cta_text',
              label: 'Texto do Botão',
              type: 'text',
              placeholder: 'Ex: Quero Participar',
            },
            {
              name: 'cta_link',
              label: 'Link do Botão',
              type: 'text',
              placeholder: 'Ex: /voluntariado',
            },
            { name: 'image_url', label: 'URL da Imagem (Externa)', type: 'text' },
            { name: 'image', label: 'Ou Upload de Imagem', type: 'file' },
            { name: 'active', label: 'Banner Ativo no Site', type: 'bool' },
            { name: 'order', label: 'Ordem de Exibição (Número)', type: 'number' },
          ],
        }

      case 'news':
        return {
          collection: 'news',
          title: item ? 'Editar Notícia / Evento' : 'Publicar Nova Notícia',
          item,
          fields: [
            { name: 'title', label: 'Título da Notícia', type: 'text', required: true },
            {
              name: 'slug',
              label: 'Slug / URL amigável',
              type: 'text',
              required: true,
              placeholder: 'exemplo-titulo-noticia',
            },
            {
              name: 'category',
              label: 'Categoria',
              type: 'select',
              required: true,
              options: [
                { label: 'Geral', value: 'Geral' },
                { label: 'Evento', value: 'Evento' },
                { label: 'Ação Social', value: 'Ação Social' },
                { label: 'Voluntariado', value: 'Voluntariado' },
                { label: 'Transparência', value: 'Transparência' },
              ],
            },
            { name: 'summary', label: 'Resumo / Prévia', type: 'textarea', required: true },
            { name: 'content', label: 'Conteúdo Completo (HTML)', type: 'editor', required: true },
            { name: 'is_event', label: 'Esta publicação é sobre um Evento?', type: 'bool' },
            {
              name: 'event_status',
              label: 'Status do Evento (se aplicável)',
              type: 'select',
              options: [
                { label: 'Evento Futuro (Próximo)', value: 'upcoming' },
                { label: 'Evento Passado (Cobertura)', value: 'past' },
                { label: 'Nenhum / Não se aplica', value: 'none' },
              ],
            },
            {
              name: 'event_date',
              label: 'Data do Evento (Texto)',
              type: 'text',
              placeholder: 'Ex: 18/10/2027',
            },
            {
              name: 'published_at',
              label: 'Data de Publicação',
              type: 'text',
              placeholder: 'Ex: 20/05/2027',
            },
            { name: 'featured', label: 'Destaque na Página Inicial', type: 'bool' },
            { name: 'image_url', label: 'URL da Imagem de Capa', type: 'text' },
            { name: 'image', label: 'Ou Upload de Imagem de Capa', type: 'file' },
            { name: 'video_url', label: 'URL de Vídeo (YouTube/Vimeo)', type: 'text' },
          ],
        }

      case 'beneficiaries':
        return {
          collection: 'beneficiaries',
          title: item ? 'Editar Ação / Beneficiado' : 'Cadastrar Benefício / Ação Social',
          item,
          fields: [
            {
              name: 'site',
              label: 'Exibir em qual ambiente?',
              type: 'select',
              required: true,
              options: [
                { label: 'Ambos os ambientes', value: 'both' },
                { label: 'Apenas Projeto Abraço (Institucional)', value: 'abraco' },
                { label: 'Apenas Abraçolândia (Hotsite)', value: 'abracolandia' },
              ],
            },
            { name: 'title', label: 'Título da Ação / Projeto', type: 'text', required: true },
            { name: 'slug', label: 'Slug / URL amigável', type: 'text', required: true },
            {
              name: 'type',
              label: 'Tipo de Benefício',
              type: 'text',
              required: true,
              placeholder: 'Ex: Cestas Básicas, Reforma Comunitária, Atendimento Odontológico',
            },
            { name: 'recipient_name', label: 'Nome do Beneficiado / Comunidade', type: 'text' },
            {
              name: 'quantity',
              label: 'Quantidade / Volume Entregue',
              type: 'text',
              placeholder: 'Ex: 450 Cestas, 120 Famílias',
            },
            { name: 'location', label: 'Local / Bairro / Cidade', type: 'text' },
            { name: 'date', label: 'Data da Ação', type: 'text' },
            { name: 'summary', label: 'Resumo Curto', type: 'textarea' },
            {
              name: 'description',
              label: 'Relatório Completo da Ação (HTML)',
              type: 'editor',
              required: true,
            },
            { name: 'image_url', label: 'URL da Imagem Principal', type: 'text' },
            { name: 'image', label: 'Ou Upload de Foto da Ação', type: 'file' },
            { name: 'video_url', label: 'Vídeo da Ação (YouTube)', type: 'text' },
          ],
        }

      case 'sponsors':
        return {
          collection: 'sponsors',
          title: item ? 'Editar Patrocinador' : 'Cadastrar Novo Patrocinador',
          item,
          fields: [
            { name: 'name', label: 'Nome da Empresa / Parceiro', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text', required: true },
            {
              name: 'site',
              label: 'Ambiente',
              type: 'select',
              required: true,
              options: [
                { label: 'Ambos os ambientes', value: 'both' },
                { label: 'Projeto Abraço Institucional', value: 'abraco' },
                { label: 'Hotsite Abraçolândia', value: 'abracolandia' },
              ],
            },
            {
              name: 'tier',
              label: 'Categoria / Cota de Patrocínio',
              type: 'select',
              required: true,
              options: [
                { label: '💎 Diamante (Master)', value: 'Diamante' },
                { label: '🥇 Ouro', value: 'Ouro' },
                { label: '🥈 Prata', value: 'Prata' },
                { label: '🥉 Bronze', value: 'Bronze' },
                { label: '🤝 Apoiador Institucional', value: 'Apoiador' },
              ],
            },
            { name: 'website', label: 'Link do Site Oficial', type: 'text' },
            {
              name: 'since_year',
              label: 'Parceiro Desde (Ano)',
              type: 'text',
              placeholder: 'Ex: 2019',
            },
            {
              name: 'description',
              label: 'Sobre o Patrocinador / Descrição (HTML)',
              type: 'editor',
              required: true,
            },
            { name: 'logo_url', label: 'URL do Logotipo', type: 'text' },
            { name: 'logo', label: 'Ou Upload do Logotipo', type: 'file' },
            { name: 'order', label: 'Ordem de Exibição', type: 'number' },
            { name: 'featured', label: 'Destaque na Página Inicial', type: 'bool' },
          ],
        }

      case 'volunteer_areas':
        return {
          collection: 'volunteer_areas',
          title: item ? 'Editar Área de Voluntariado' : 'Criar Área de Atuação Voluntária',
          item,
          fields: [
            {
              name: 'site',
              label: 'Ambiente',
              type: 'select',
              required: true,
              options: [
                { label: 'Ambos os ambientes', value: 'both' },
                { label: 'Projeto Abraço Institucional', value: 'abraco' },
                { label: 'Abraçolândia (Eventos)', value: 'abracolandia' },
              ],
            },
            { name: 'title', label: 'Título da Área', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text', required: true },
            {
              name: 'description',
              label: 'Descrição das Atividades (HTML)',
              type: 'editor',
              required: true,
            },
            { name: 'requirements', label: 'Requisitos / Perfil Desejado', type: 'textarea' },
            {
              name: 'time_commitment',
              label: 'Dedicação / Carga Horária',
              type: 'text',
              placeholder: 'Ex: 4h quinzenais',
            },
            { name: 'spots_available', label: 'Vagas Disponíveis (Número)', type: 'number' },
            { name: 'image_url', label: 'URL de Imagem Ilustrativa', type: 'text' },
          ],
        }

      case 'ticket_outlets':
        return {
          collection: 'ticket_outlets',
          title: item ? 'Editar Ponto de Venda' : 'Cadastrar Ponto de Venda de Convites',
          item,
          fields: [
            { name: 'name', label: 'Nome do Local / Canal de Venda', type: 'text', required: true },
            {
              name: 'type',
              label: 'Tipo de Ponto',
              type: 'select',
              required: true,
              options: [
                { label: 'Físico (Loja / Sede / Ponto Parceiro)', value: 'Físico' },
                { label: 'Online (Portal / Sympla / WhatsApp)', value: 'Online' },
              ],
            },
            { name: 'city', label: 'Cidade / Região', type: 'text', required: true },
            { name: 'address', label: 'Endereço Completo', type: 'text' },
            { name: 'phone', label: 'Telefone / WhatsApp para Dúvidas', type: 'text' },
            { name: 'opening_hours', label: 'Horário de Funcionamento', type: 'text' },
            { name: 'url', label: 'Link para Compra Online (se houver)', type: 'text' },
            { name: 'price_info', label: 'Valores e Formas de Pagamento', type: 'text' },
            { name: 'available', label: 'Convites Disponíveis no Momento', type: 'bool' },
            {
              name: 'description',
              label: 'Instruções / Detalhes (HTML)',
              type: 'editor',
              required: true,
            },
          ],
        }

      case 'past_editions':
        return {
          collection: 'past_editions',
          title: item ? 'Editar Festa Anterior' : 'Adicionar Edição Anterior da Abraçolândia',
          item,
          fields: [
            {
              name: 'year',
              label: 'Ano da Edição',
              type: 'text',
              required: true,
              placeholder: 'Ex: 2024',
            },
            { name: 'theme', label: 'Tema / Título da Edição', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text', required: true },
            {
              name: 'raised_amount',
              label: 'Total Arrecadado (R$)',
              type: 'text',
              placeholder: 'Ex: R$ 320.000,00',
            },
            {
              name: 'attendance',
              label: 'Público Presente',
              type: 'text',
              placeholder: 'Ex: 12.000 pessoas',
            },
            {
              name: 'benefited_families',
              label: 'Famílias Ajudadas com o Lucro',
              type: 'text',
              placeholder: 'Ex: 450 famílias',
            },
            { name: 'summary', label: 'Resumo / Destaque', type: 'textarea' },
            {
              name: 'description',
              label: 'História & Cobertura da Festa (HTML)',
              type: 'editor',
              required: true,
            },
            { name: 'image_url', label: 'URL da Imagem de Capa', type: 'text' },
            { name: 'image', label: 'Ou Upload de Foto', type: 'file' },
            { name: 'video_url', label: 'Vídeo da Cobertura (YouTube)', type: 'text' },
          ],
        }

      case 'event_sections':
        return {
          collection: 'event_sections',
          title: item ? 'Editar Seção da Festa' : 'Editar Seção da Abraçolândia',
          item,
          fields: [
            {
              name: 'section_type',
              label: 'Tipo de Seção',
              type: 'select',
              required: true,
              options: [
                { label: 'Geral (Data, Horário, Local)', value: 'geral' },
                { label: 'Atrações & Shows', value: 'atracoes' },
                { label: 'Gastronomia & Food Trucks', value: 'gastronomia' },
                { label: 'Espaço Kids & Brinquedos', value: 'espaco_kids' },
                { label: 'Bingo Beneficente & Prêmios', value: 'bingo' },
                { label: 'Estacionamento & Transporte', value: 'estacionamento' },
              ],
            },
            { name: 'title', label: 'Título da Seção', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtítulo', type: 'text' },
            { name: 'content', label: 'Texto Informativo (HTML)', type: 'editor', required: true },
            { name: 'image_url', label: 'URL da Imagem Ilustrativa', type: 'text' },
            { name: 'image', label: 'Ou Upload de Imagem', type: 'file' },
            { name: 'order', label: 'Ordem de Exibição', type: 'number' },
          ],
        }

      case 'ticket_categories':
        return {
          collection: 'ticket_categories',
          title: item ? 'Editar Categoria de Ingresso' : 'Criar Nova Categoria de Ingresso',
          item,
          fields: [
            { name: 'name', label: 'Nome da Categoria', type: 'text', required: true },
            { name: 'description', label: 'Descrição / Detalhes', type: 'textarea' },
            {
              name: 'price_in_cents',
              label: 'Preço em Centavos (ex: 2500 para R$ 25,00)',
              type: 'number',
              required: true,
            },
            {
              name: 'total_quantity',
              label: 'Cota / Estoque Total de Ingressos',
              type: 'number',
              required: true,
            },
            {
              name: 'available_quantity',
              label: 'Quantidade Disponível Restante',
              type: 'number',
              required: true,
            },
            {
              name: 'badge_color',
              label: 'Cor de Destaque HEX (ex: #EC4899, #10B981, #8B5CF6)',
              type: 'text',
            },
            { name: 'active', label: 'Categoria Ativa para Venda Online', type: 'bool' },
            { name: 'order', label: 'Ordem de Exibição (Número)', type: 'number' },
          ],
        }

      case 'content_blocks':
        return {
          collection: 'content_blocks',
          title: item ? 'Editar Página / Bloco de Texto' : 'Novo Bloco de Conteúdo',
          item,
          fields: [
            {
              name: 'site',
              label: 'Ambiente',
              type: 'select',
              required: true,
              options: [
                { label: 'Projeto Abraço Institucional', value: 'abraco' },
                { label: 'Abraçolândia Hotsite', value: 'abracolandia' },
                { label: 'Ambos', value: 'both' },
              ],
            },
            { name: 'slug', label: 'Identificador / Slug', type: 'text', required: true },
            { name: 'title', label: 'Título da Seção / Página', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtítulo', type: 'text' },
            { name: 'body', label: 'Texto Completo (HTML)', type: 'editor', required: true },
            { name: 'image_url', label: 'URL da Imagem Ilustrativa', type: 'text' },
            { name: 'image', label: 'Ou Upload de Foto', type: 'file' },
            { name: 'order', label: 'Ordem de Exibição', type: 'number' },
          ],
        }

      default:
        return { collection, title: 'Item', item, fields: [] }
    }
  }

  return (
    <AdminLayout title="Painel de Controle CMS" activeNav="cms">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 flex-1">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left / Center: CMS Content Tabs (2 cols) */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="p-4 sm:p-6 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <LayoutGrid className="w-5 h-5 text-blue-600" /> Central de Gerenciamento de
                      Conteúdo
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Crie, edite e organize todos os textos, mídias e seções de ambos os ambientes
                      digitais.
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <Input
                      placeholder="Filtrar itens listados..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 pt-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="overflow-x-auto pb-2 border-b border-slate-100">
                    <TabsList className="bg-slate-100 p-1 flex w-max min-w-full justify-start h-auto">
                      <TabsTrigger value="noticias" className="text-xs py-1.5">
                        <Newspaper className="w-3.5 h-3.5 mr-1.5" /> Notícias ({news.length})
                      </TabsTrigger>
                      <TabsTrigger value="beneficiados" className="text-xs py-1.5">
                        <HeartHandshake className="w-3.5 h-3.5 mr-1.5 text-red-500" /> Beneficiados
                        ({beneficiaries.length})
                      </TabsTrigger>
                      <TabsTrigger value="patrocinadores" className="text-xs py-1.5">
                        <Award className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Patrocinadores (
                        {sponsors.length})
                      </TabsTrigger>
                      <TabsTrigger value="banners" className="text-xs py-1.5">
                        <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Banners (
                        {banners.length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="gamificacao"
                        className="text-xs py-1.5 bg-amber-500/10 text-amber-900 border border-amber-300 font-bold"
                      >
                        <Trophy className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> Gamificação & Ações
                        ({volunteerActions.filter((a) => a.status === 'pending').length} pendentes)
                      </TabsTrigger>
                      <TabsTrigger value="voluntariado" className="text-xs py-1.5">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Voluntariado (
                        {volunteerAreas.length} áreas / {inscriptions.length} insc.)
                      </TabsTrigger>{' '}
                      <TabsTrigger value="festa" className="text-xs py-1.5">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-pink-500" /> Abraçolândia (
                        {eventSections.length})
                      </TabsTrigger>
                      <TabsTrigger value="convites" className="text-xs py-1.5">
                        <Ticket className="w-3.5 h-3.5 mr-1.5 text-purple-500" /> Convites & PDVs (
                        {ticketOutlets.length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="ingressos_online"
                        className="text-xs py-1.5 bg-pink-500/10 text-pink-900 border border-pink-300 font-bold"
                      >
                        <QrCode className="w-3.5 h-3.5 mr-1.5 text-pink-600" /> Ingressos & Vendas (
                        {ticketsList.length} emitidos)
                      </TabsTrigger>
                      <TabsTrigger value="anteriores" className="text-xs py-1.5">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> Festas Anteriores (
                        {pastEditions.length})
                      </TabsTrigger>
                      <TabsTrigger value="paginas" className="text-xs py-1.5">
                        <LayoutGrid className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Páginas &
                        História ({contentBlocks.length})
                      </TabsTrigger>
                      <TabsTrigger value="configuracoes" className="text-xs py-1.5">
                        <Settings className="w-3.5 h-3.5 mr-1.5 text-slate-600" /> Redes & Geral
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* 1. NOTÍCIAS */}
                  <TabsContent value="noticias" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Notícias e Cobertura de Eventos
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleOpenCreate('news')}
                        className="bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Nova Notícia
                      </Button>
                    </div>
                    <div className="space-y-2.5">
                      {news
                        .filter(
                          (n) =>
                            !searchTerm || n.title.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 hover:bg-slate-100/80 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={getImageSrc(item, 'news')}
                                alt={item.title}
                                className="w-14 h-12 rounded object-cover border border-slate-200 shrink-0 bg-slate-200"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] bg-white text-blue-700 font-semibold border-blue-200"
                                  >
                                    {item.category}
                                  </Badge>
                                  {item.featured && (
                                    <Badge className="bg-amber-500 text-[10px] text-white">
                                      Destaque
                                    </Badge>
                                  )}
                                  {item.is_event && (
                                    <Badge className="bg-purple-600 text-[10px] text-white">
                                      Evento
                                    </Badge>
                                  )}
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm truncate mt-0.5">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">{item.summary}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEdit('news', item)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3.5 h-3.5 text-blue-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteItem('news', item.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  {/* 2. BENEFICIADOS */}
                  <TabsContent value="beneficiados" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Ações Sociais e Beneficiados
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleOpenCreate('beneficiaries')}
                        className="bg-red-600 hover:bg-red-700 text-xs text-white"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Nova Ação / Beneficiado
                      </Button>
                    </div>
                    <div className="space-y-2.5">
                      {beneficiaries
                        .filter(
                          (b) =>
                            !searchTerm ||
                            b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            b.type.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 hover:bg-slate-100/80 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={getImageSrc(item, 'beneficiaries')}
                                alt={item.title}
                                className="w-14 h-12 rounded object-cover border border-slate-200 shrink-0 bg-slate-200"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-red-100 text-red-800 text-[10px] font-semibold border-red-200">
                                    {item.type}
                                  </Badge>
                                  <Badge variant="outline" className="text-[10px]">
                                    {item.site === 'both' ? 'Abraço + Abraçolândia' : item.site}
                                  </Badge>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm truncate mt-0.5">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">
                                  {item.quantity} • {item.recipient_name || item.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEdit('beneficiaries', item)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3.5 h-3.5 text-blue-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteItem('beneficiaries', item.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  {/* 3. PATROCINADORES */}
                  <TabsContent value="patrocinadores" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Patrocinadores e Empresas Parceiras
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleOpenCreate('sponsors')}
                        className="bg-amber-600 hover:bg-amber-700 text-xs text-white"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Novo Patrocinador
                      </Button>
                    </div>
                    <div className="space-y-2.5">
                      {sponsors
                        .filter(
                          (s) =>
                            !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 hover:bg-slate-100/80 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={getImageSrc(item, 'sponsors')}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-contain p-1 border border-slate-200 bg-white shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={
                                      item.tier === 'Diamante'
                                        ? 'bg-cyan-600 text-white'
                                        : item.tier === 'Ouro'
                                          ? 'bg-amber-500 text-white'
                                          : item.tier === 'Prata'
                                            ? 'bg-slate-400 text-white'
                                            : 'bg-orange-600 text-white'
                                    }
                                  >
                                    {item.tier}
                                  </Badge>
                                  <span className="text-xs text-slate-500">
                                    Parceiro desde {item.since_year || '2020'}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm truncate mt-0.5">
                                  {item.name}
                                </h4>
                                <a
                                  href={item.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-blue-600 hover:underline truncate block"
                                >
                                  {item.website}
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEdit('sponsors', item)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3.5 h-3.5 text-blue-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteItem('sponsors', item.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  {/* 4. BANNERS */}
                  <TabsContent value="banners" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Banners das Páginas Principais
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleOpenCreate('banners')}
                        className="bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Novo Banner
                      </Button>
                    </div>
                    <div className="space-y-2.5">
                      {banners.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={getImageSrc(item, 'banners')}
                              alt={item.title}
                              className="w-20 h-12 rounded object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={item.site === 'abraco' ? 'default' : 'secondary'}
                                  className="text-[10px]"
                                >
                                  {item.site === 'abraco' ? 'Institucional' : 'Abraçolândia'}
                                </Badge>
                                {item.active ? (
                                  <Badge className="bg-green-600 text-[10px]">Ativo</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px]">
                                    Inativo
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-semibold text-slate-800 text-sm truncate mt-0.5">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEdit('banners', item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3.5 h-3.5 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteItem('banners', item.id)}
                              className="h-8 w-8 p-0 text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* 5. VOLUNTARIADO */}
                  <TabsContent value="voluntariado" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Áreas de Voluntariado Cadastradas
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleOpenCreate('volunteer_areas')}
                        className="bg-green-600 hover:bg-green-700 text-xs text-white"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Nova Área
                      </Button>
                    </div>
                    <div className="space-y-2.5">
                      {volunteerAreas.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800 text-[10px]">
                                {item.site === 'both' ? 'Geral + Festa' : item.site}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {item.spots_available || 0} vagas abertas
                              </span>
                            </div>
                            <h4 className="font-semibold text-slate-800 text-sm mt-0.5">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">
                              {item.time_commitment} • {item.requirements}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEdit('volunteer_areas', item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3.5 h-3.5 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteItem('volunteer_areas', item.id)}
                              className="h-8 w-8 p-0 text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Inscrições Recebidas */}
                    <div className="pt-6 border-t border-slate-200">
                      <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" /> Inscrições Recebidas de
                        Voluntários ({inscriptions.length})
                      </h4>
                      {inscriptions.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">
                          Nenhum formulário recebido recentemente.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {inscriptions.map((ins) => (
                            <div
                              key={ins.id}
                              className="p-3 bg-white border border-slate-200 rounded-md text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-sm">{ins.name}</span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] bg-green-50 text-green-700"
                                >
                                  {ins.area_interest}
                                </Badge>
                              </div>
                              <div className="text-slate-600">
                                <strong>E-mail:</strong> {ins.email} | <strong>Tel:</strong>{' '}
                                {ins.phone} | <strong>Ambiente:</strong> {ins.environment}
                              </div>
                              {ins.message && (
                                <p className="text-slate-500 italic bg-slate-50 p-1.5 rounded">
                                  "{ins.message}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* 6. A FESTA (ABRAÇOLÂNDIA) */}
                  <TabsContent value="festa" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Seções Temáticas da Abraçolândia
                      </h3>
                    </div>
                    <div className="space-y-2.5">
                      {eventSections.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <Badge className="bg-pink-100 text-pink-800 text-[10px] uppercase font-bold">
                              {item.section_type}
                            </Badge>
                            <h4 className="font-semibold text-slate-800 text-sm mt-0.5">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEdit('event_sections', item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3.5 h-3.5 text-blue-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* 7. CONVITES & PDVs */}
                  <TabsContent value="convites" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Pontos de Venda e Convites
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleOpenCreate('ticket_outlets')}
                        className="bg-purple-600 hover:bg-purple-700 text-xs text-white"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Novo Ponto de Venda
                      </Button>
                    </div>
                    <div className="space-y-2.5">
                      {ticketOutlets.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge
                                className={
                                  item.type === 'Online'
                                    ? 'bg-blue-600 text-white text-[10px]'
                                    : 'bg-purple-600 text-white text-[10px]'
                                }
                              >
                                {item.type}
                              </Badge>
                              <span className="text-xs font-semibold text-slate-700">
                                {item.city}
                              </span>
                            </div>
                            <h4 className="font-semibold text-slate-800 text-sm mt-0.5">
                              {item.name}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">
                              {item.address || item.url} • {item.phone}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEdit('ticket_outlets', item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3.5 h-3.5 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteItem('ticket_outlets', item.id)}
                              className="h-8 w-8 p-0 text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* INGRESSOS ONLINE & BILHETERIA DIGITAL */}
                  <TabsContent value="ingressos_online" className="space-y-6 pt-4">
                    {/* Header stats row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
                        <div className="text-xs text-pink-800 font-bold uppercase">
                          Arrecadação Total (Vendas)
                        </div>
                        <div className="text-2xl font-black text-pink-950 mt-1">
                          {formatCurrencyBRL(
                            ticketOrders
                              .filter((o) => o.status === 'paid')
                              .reduce((acc, o) => acc + (o.total_amount_cents || 0), 0),
                          )}
                        </div>
                        <span className="text-[11px] text-pink-700">
                          {ticketOrders.filter((o) => o.status === 'paid').length} pedidos
                          confirmados
                        </span>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                        <div className="text-xs text-purple-800 font-bold uppercase">
                          Ingressos Emitidos
                        </div>
                        <div className="text-2xl font-black text-purple-950 mt-1">
                          {ticketsList.length}
                        </div>
                        <span className="text-[11px] text-purple-700">QRs únicos gerados</span>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                        <div className="text-xs text-emerald-800 font-bold uppercase">
                          Entradas Validadas
                        </div>
                        <div className="text-2xl font-black text-emerald-950 mt-1">
                          {ticketsList.filter((t) => t.status === 'used').length}
                        </div>
                        <span className="text-[11px] text-emerald-700">
                          {ticketsList.length > 0
                            ? Math.round(
                                (ticketsList.filter((t) => t.status === 'used').length /
                                  ticketsList.length) *
                                  100,
                              )
                            : 0}
                          % do total de participantes
                        </span>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <div className="text-xs text-amber-800 font-bold uppercase">
                          Estoque Restante
                        </div>
                        <div className="text-2xl font-black text-amber-950 mt-1">
                          {ticketCategories.reduce(
                            (acc, c) => acc + (c.available_quantity || 0),
                            0,
                          )}
                        </div>
                        <span className="text-[11px] text-amber-700">
                          em {ticketCategories.length} categorias
                        </span>
                      </div>
                    </div>

                    {/* Quick Access to Portaria Scanner & CSV Export */}
                    <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                      <div>
                        <h4 className="font-bold text-sm flex items-center gap-2">
                          <ScanLine className="w-4 h-4 text-pink-400" /> Sistema de Portaria &
                          Controle de Acesso
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Use seu celular ou webcam para bipar e liberar entradas na portaria do
                          evento.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            // Export CSV of tickets
                            if (ticketsList.length === 0) {
                              toast({
                                title: 'Nenhum ingresso emitido para exportar.',
                              })
                              return
                            }
                            const headers = [
                              'Codigo_Ingresso',
                              'Categoria',
                              'Participante',
                              'Documento',
                              'Status',
                              'Comprador_Nome',
                              'Comprador_Email',
                              'Comprador_Telefone',
                              'Data_Uso',
                              'Validado_Por',
                            ]
                            const rows = ticketsList.map((t) => [
                              t.ticket_code,
                              t.expand?.category_id?.name || 'Geral',
                              t.attendee_name || '',
                              t.attendee_document || '',
                              t.status === 'used' ? 'UTILIZADO' : 'NAO_UTILIZADO',
                              t.expand?.order_id?.customer_name || '',
                              t.expand?.order_id?.customer_email || '',
                              t.expand?.order_id?.customer_phone || '',
                              t.used_at || '',
                              t.validated_by || '',
                            ])
                            const csvContent =
                              'data:text/csv;charset=utf-8,' +
                              [
                                headers.join(','),
                                ...rows.map((e) =>
                                  e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','),
                                ),
                              ].join('\n')
                            const encodedUri = encodeURI(csvContent)
                            const link = document.createElement('a')
                            link.setAttribute('href', encodedUri)
                            link.setAttribute(
                              'download',
                              `ingressos_abracolandia_${Date.now()}.csv`,
                            )
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                            toast({
                              title: 'Exportação Concluída!',
                              description: 'Arquivo CSV com todos os participantes gerado.',
                            })
                          }}
                          className="bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white text-xs font-bold h-9 rounded-xl border border-slate-700"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />{' '}
                          Exportar CSV
                        </Button>
                        <Button
                          onClick={() => navigate('/admin/validar-ingressos')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 rounded-xl shadow-md"
                        >
                          <ScanLine className="w-3.5 h-3.5 mr-1.5" /> Abrir Leitor de Entrada
                        </Button>
                      </div>
                    </div>

                    {/* Sub-Tabs: Categorias de Ingresso, Pedidos Recebidos, Ingressos Emitidos */}
                    <Tabs defaultValue="categorias_tkt" className="space-y-4">
                      <div className="border-b border-slate-200 pb-2">
                        <TabsList className="bg-slate-100 p-1 rounded-lg">
                          <TabsTrigger value="categorias_tkt" className="text-xs font-bold">
                            <Ticket className="w-3.5 h-3.5 mr-1 text-pink-600" /> Lotes & Categorias
                            ({ticketCategories.length})
                          </TabsTrigger>
                          <TabsTrigger value="pedidos_tkt" className="text-xs font-bold">
                            <ShoppingBag className="w-3.5 h-3.5 mr-1 text-purple-600" /> Pedidos
                            Realizados ({ticketOrders.length})
                          </TabsTrigger>
                          <TabsTrigger value="emitidos_tkt" className="text-xs font-bold">
                            <QrCode className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Ingressos & QRs
                            ({ticketsList.length})
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      {/* 1. Categorias de Ingressos */}
                      <TabsContent value="categorias_tkt" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              Categorias e Lotes de Ingressos
                            </h4>
                            <p className="text-xs text-slate-500">
                              Configure preços, estoques e benefícios de cada tipo de ingresso.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleOpenCreate('ticket_categories')}
                            className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> Nova Categoria
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {ticketCategories.map((cat) => (
                            <div
                              key={cat.id}
                              className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 hover:border-pink-300 transition"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: cat.badge_color || '#EC4899' }}
                                    />
                                    <span className="font-bold text-slate-900 text-sm">
                                      {cat.name}
                                    </span>
                                  </div>
                                  <Badge className="bg-purple-950 text-white font-mono text-xs">
                                    {formatCurrencyBRL(cat.price_in_cents)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {cat.description}
                                </p>
                                <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg text-slate-600">
                                  <span>
                                    Disponíveis:{' '}
                                    <strong className="text-pink-600">
                                      {cat.available_quantity}
                                    </strong>{' '}
                                    de {cat.total_quantity}
                                  </span>
                                  <span>{cat.active ? '🟢 Venda Ativa' : '🔴 Desativado'}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleOpenEdit('ticket_categories', cat)}
                                  className="h-7 w-7 p-0"
                                >
                                  <Edit className="w-3.5 h-3.5 text-blue-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteItem('ticket_categories', cat.id)}
                                  className="h-7 w-7 p-0 text-red-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      {/* 2. Pedidos Realizados */}
                      <TabsContent value="pedidos_tkt" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              Pedidos Recebidos pela Bilheteria
                            </h4>
                            <p className="text-xs text-slate-500">
                              Histórico de compras online e confirmações de pagamento.
                            </p>
                          </div>
                        </div>

                        {ticketOrders.length === 0 ? (
                          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                            Nenhum pedido registrado ainda.
                          </div>
                        ) : (
                          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                <tr>
                                  <th className="p-3">Pedido #</th>
                                  <th className="p-3">Comprador</th>
                                  <th className="p-3">Contato</th>
                                  <th className="p-3">Valor Total</th>
                                  <th className="p-3">Status</th>
                                  <th className="p-3">Método</th>
                                  <th className="p-3">Data</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {ticketOrders.map((ord) => (
                                  <tr key={ord.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-mono font-bold text-purple-950">
                                      #{ord.id.slice(0, 8).toUpperCase()}
                                    </td>
                                    <td className="p-3">
                                      <div className="font-bold text-slate-900">
                                        {ord.customer_name}
                                      </div>
                                      <div className="text-[11px] text-slate-400">
                                        Doc: {ord.customer_document || '---'}
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <div>{ord.customer_email}</div>
                                      <div className="text-slate-400">{ord.customer_phone}</div>
                                    </td>
                                    <td className="p-3 font-bold text-pink-600">
                                      {formatCurrencyBRL(ord.total_amount_cents || 0)}
                                    </td>
                                    <td className="p-3">
                                      <Badge
                                        className={
                                          ord.status === 'paid'
                                            ? 'bg-emerald-600 text-white text-[10px]'
                                            : ord.status === 'pending'
                                              ? 'bg-amber-500 text-white text-[10px]'
                                              : 'bg-red-500 text-white text-[10px]'
                                        }
                                      >
                                        {ord.status === 'paid'
                                          ? '✓ Pago'
                                          : ord.status === 'pending'
                                            ? 'Pendente'
                                            : 'Cancelado'}
                                      </Badge>
                                    </td>
                                    <td className="p-3 text-[11px] font-mono text-slate-500">
                                      {ord.payment_method || 'Online'}
                                    </td>
                                    <td className="p-3 text-[11px] text-slate-500">
                                      {new Date(ord.created).toLocaleDateString('pt-BR')}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </TabsContent>

                      {/* 3. Ingressos Individuais Emitidos */}
                      <TabsContent value="emitidos_tkt" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              Ingressos com QR Code Gerados
                            </h4>
                            <p className="text-xs text-slate-500">
                              Lista de ingressos válidos e histórico de check-in na portaria.
                            </p>
                          </div>
                        </div>

                        {ticketsList.length === 0 ? (
                          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                            Nenhum ingresso emitido ainda.
                          </div>
                        ) : (
                          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                <tr>
                                  <th className="p-3">Código Ingresso</th>
                                  <th className="p-3">Categoria</th>
                                  <th className="p-3">Participante</th>
                                  <th className="p-3">Status</th>
                                  <th className="p-3">Utilizado em</th>
                                  <th className="p-3">Validado Por</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {ticketsList.map((tkt) => (
                                  <tr key={tkt.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-mono font-bold text-slate-900">
                                      {tkt.ticket_code}
                                    </td>
                                    <td className="p-3 font-semibold text-purple-900">
                                      {tkt.expand?.category_id?.name || 'Ingresso'}
                                    </td>
                                    <td className="p-3 font-bold text-slate-800">
                                      {tkt.attendee_name || 'Participante'}
                                    </td>
                                    <td className="p-3">
                                      <Badge
                                        className={
                                          tkt.status === 'used'
                                            ? 'bg-slate-500 text-white text-[10px]'
                                            : 'bg-emerald-600 text-white text-[10px]'
                                        }
                                      >
                                        {tkt.status === 'used' ? 'Já Utilizado' : 'Disponível'}
                                      </Badge>
                                    </td>
                                    <td className="p-3 text-[11px] text-slate-500">
                                      {tkt.used_at
                                        ? new Date(tkt.used_at).toLocaleString('pt-BR')
                                        : '---'}
                                    </td>
                                    <td className="p-3 text-[11px] text-slate-500">
                                      {tkt.validated_by || '---'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  {/* 8. FESTAS ANTERIORES */}
                  <TabsContent value="anteriores" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Histórico de Edições da Abraçolândia
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleOpenCreate('past_editions')}
                        className="bg-orange-600 hover:bg-orange-700 text-xs text-white"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Edição
                      </Button>
                    </div>
                    <div className="space-y-2.5">
                      {pastEditions.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={getImageSrc(item, 'past_editions')}
                              alt={item.theme}
                              className="w-14 h-12 rounded object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <Badge className="bg-orange-100 text-orange-800 text-[10px]">
                                Edição {item.year}
                              </Badge>
                              <h4 className="font-semibold text-slate-800 text-sm truncate mt-0.5">
                                {item.theme}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                Arrecadação: {item.raised_amount} • {item.attendance}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEdit('past_editions', item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3.5 h-3.5 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteItem('past_editions', item.id)}
                              className="h-8 w-8 p-0 text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* 9. PÁGINAS INSTITUCIONAIS */}
                  <TabsContent value="paginas" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Blocos de Texto & Nossa História
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleOpenCreate('content_blocks')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-xs text-white"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Novo Bloco
                      </Button>
                    </div>
                    <div className="space-y-2.5">
                      {contentBlocks.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] font-mono">
                                {item.slug}
                              </Badge>
                              <span className="text-xs text-slate-400">({item.site})</span>
                            </div>
                            <h4 className="font-semibold text-slate-800 text-sm mt-0.5">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEdit('content_blocks', item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3.5 h-3.5 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteItem('content_blocks', item.id)}
                              className="h-8 w-8 p-0 text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* GAMIFICAÇÃO & GESTÃO DE VOLUNTÁRIOS */}
                  <TabsContent value="gamificacao" className="space-y-6 pt-4">
                    {/* Header stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="text-xs text-amber-800 font-bold uppercase">
                          Ações Pendentes de Análise
                        </div>
                        <div className="text-2xl font-black text-amber-900 mt-1">
                          {volunteerActions.filter((a) => a.status === 'pending').length}
                        </div>
                        <span className="text-[11px] text-amber-700">Aguardando aprovação</span>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="text-xs text-blue-800 font-bold uppercase">
                          Voluntários Cadastrados
                        </div>
                        <div className="text-2xl font-black text-blue-900 mt-1">
                          {volunteerProfiles.length}
                        </div>
                        <span className="text-[11px] text-blue-700">Com perfil e código ativo</span>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <div className="text-xs text-emerald-800 font-bold uppercase">
                          Missões Ativas
                        </div>
                        <div className="text-2xl font-black text-emerald-900 mt-1">
                          {missions.filter((m) => m.active).length}
                        </div>
                        <span className="text-[11px] text-emerald-700">Disponíveis no site</span>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                        <div className="text-xs text-purple-800 font-bold uppercase">
                          Medalhas / Badges
                        </div>
                        <div className="text-2xl font-black text-purple-900 mt-1">
                          {badges.length}
                        </div>
                        <span className="text-[11px] text-purple-700">Conquistas configuradas</span>
                      </div>
                    </div>

                    {/* Sub-Tabs: Ações Pendentes, Missões, Medalhas, Ranking Geral */}
                    <Tabs defaultValue="pendentes" className="space-y-4">
                      <div className="border-b border-slate-200 pb-2">
                        <TabsList className="bg-slate-100 p-1 rounded-lg">
                          <TabsTrigger value="pendentes" className="text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Aprovação de Ações
                            ({volunteerActions.filter((a) => a.status === 'pending').length})
                          </TabsTrigger>
                          <TabsTrigger value="missoes_cms" className="text-xs font-bold">
                            <Target className="w-3.5 h-3.5 mr-1 text-blue-600" /> Gestão de Missões
                            ({missions.length})
                          </TabsTrigger>
                          <TabsTrigger value="badges_cms" className="text-xs font-bold">
                            <Award className="w-3.5 h-3.5 mr-1 text-purple-600" /> Medalhas (
                            {badges.length})
                          </TabsTrigger>
                          <TabsTrigger value="ranking_cms" className="text-xs font-bold">
                            <Trophy className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Ranking &
                            Perfis ({volunteerProfiles.length})
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      {/* 1. Sub-Tab: Aprovação de Ações */}
                      <TabsContent value="pendentes" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              Comprovações de Boas Ações, Doações e Indicações
                            </h4>
                            <p className="text-xs text-slate-500">
                              Ao aprovar, a pontuação é calculada e creditada automaticamente no
                              perfil do voluntário.
                            </p>
                          </div>
                        </div>

                        {volunteerActions.length === 0 ? (
                          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                            Nenhum registro de ação encontrado.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {volunteerActions.map((act) => (
                              <div
                                key={act.id}
                                className={`p-4 rounded-xl border bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                  act.status === 'pending'
                                    ? 'border-amber-300 bg-amber-50/20'
                                    : 'border-slate-200'
                                }`}
                              >
                                <div className="space-y-1.5 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge
                                      className={
                                        act.status === 'approved'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : act.status === 'rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-amber-100 text-amber-800 font-bold'
                                      }
                                    >
                                      {act.status === 'approved'
                                        ? '✓ Aprovado'
                                        : act.status === 'rejected'
                                          ? '✗ Rejeitado'
                                          : '⏳ Pendente de Aprovação'}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px]">
                                      {act.action_type.toUpperCase()}
                                    </Badge>
                                    <span className="text-xs font-semibold text-amber-700">
                                      +{act.points_claimed} pts
                                    </span>
                                  </div>

                                  <h5 className="font-bold text-slate-900 text-sm">{act.title}</h5>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {act.description}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                                    <span>
                                      <strong>Voluntário:</strong>{' '}
                                      {act.expand?.volunteer_profile_id?.display_name ||
                                        'Perfil #' + act.volunteer_profile_id}
                                    </span>
                                    {act.invited_email && (
                                      <span>
                                        <strong>Indicado:</strong> {act.invited_email}
                                      </span>
                                    )}
                                    {act.donation_value > 0 && (
                                      <span>
                                        <strong>Valor:</strong> R$ {act.donation_value}
                                      </span>
                                    )}
                                    {act.proof_url && (
                                      <a
                                        href={act.proof_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline font-semibold flex items-center gap-1"
                                      >
                                        Link do Comprovante <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>

                                  {act.admin_feedback && (
                                    <p className="text-xs bg-slate-50 p-2 rounded border border-slate-100 text-slate-600 italic">
                                      Feedback salvo: "{act.admin_feedback}" (por {act.reviewed_by})
                                    </p>
                                  )}
                                </div>

                                {/* Decision buttons */}
                                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                                  {act.status === 'pending' ? (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => handleReviewAction(act.id, 'approved')}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8"
                                      >
                                        <Check className="w-3.5 h-3.5 mr-1" /> Aprovar & Pontuar
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReviewAction(act.id, 'rejected')}
                                        className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 text-xs h-8"
                                      >
                                        <XCircle className="w-3.5 h-3.5 mr-1" /> Rejeitar
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        handleReviewAction(
                                          act.id,
                                          act.status === 'approved' ? 'rejected' : 'approved',
                                        )
                                      }
                                      className="text-xs text-slate-500 hover:text-slate-900 h-8"
                                    >
                                      Alternar Status
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      {/* 2. Sub-Tab: Missões */}
                      <TabsContent value="missoes_cms" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              Missões Gamificadas
                            </h4>
                            <p className="text-xs text-slate-500">
                              Adicione novos desafios para os voluntários cumprirem no site.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleOpenCreate('volunteer_missions')}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> Nova Missão
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {missions.map((m) => (
                            <div
                              key={m.id}
                              className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Badge className="bg-blue-100 text-blue-800 text-[10px]">
                                    {m.category}
                                  </Badge>
                                  <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px]">
                                    +{m.points_reward} pts
                                  </Badge>
                                </div>
                                <h5 className="font-bold text-slate-900 text-sm">{m.title}</h5>
                                <div
                                  className="text-xs text-slate-500 line-clamp-2"
                                  dangerouslySetInnerHTML={{ __html: m.description }}
                                />
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <span className="text-[11px] text-slate-400">
                                  {m.active ? '🟢 Ativa' : '🔴 Inativa'}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleOpenEdit('volunteer_missions', m)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteItem('volunteer_missions', m.id)}
                                    className="h-7 w-7 p-0 text-red-500"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      {/* 3. Sub-Tab: Medalhas */}
                      <TabsContent value="badges_cms" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              Medalhas & Conquistas
                            </h4>
                            <p className="text-xs text-slate-500">
                              Gerencie as honrarias que os voluntários podem desbloquear.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleOpenCreate('volunteer_badges')}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> Nova Medalha
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {badges.map((b) => (
                            <div
                              key={b.id}
                              className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <Badge className="bg-purple-100 text-purple-800 text-[10px]">
                                    {b.rarity}
                                  </Badge>
                                  <span className="text-xs font-bold text-amber-600">
                                    {b.points_required} pts
                                  </span>
                                </div>
                                <h5 className="font-bold text-slate-900 text-sm">{b.name}</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  {b.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleOpenEdit('volunteer_badges', b)}
                                  className="h-7 w-7 p-0"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteItem('volunteer_badges', b.id)}
                                  className="h-7 w-7 p-0 text-red-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      {/* 4. Sub-Tab: Ranking & Voluntários */}
                      <TabsContent value="ranking_cms" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              Todos os Perfis de Voluntários Registrados
                            </h4>
                            <p className="text-xs text-slate-500">
                              Acompanhe códigos de indicação e pontuações individuais.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                              <tr>
                                <th className="p-3">Posição</th>
                                <th className="p-3">Nome / Cidade</th>
                                <th className="p-3">Código Convite</th>
                                <th className="p-3">Pontos</th>
                                <th className="p-3">Nível</th>
                                <th className="p-3">Ações Concluídas</th>
                                <th className="p-3">Indicados</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {volunteerProfiles.map((p, idx) => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                  <td className="p-3 font-bold text-slate-900">#{idx + 1}</td>
                                  <td className="p-3">
                                    <div className="font-bold text-slate-900">{p.display_name}</div>
                                    <div className="text-[11px] text-slate-400">{p.city}</div>
                                  </td>
                                  <td className="p-3 font-mono font-bold text-blue-700">
                                    {p.referral_code}
                                  </td>
                                  <td className="p-3 font-extrabold text-amber-600 text-sm">
                                    {p.points}
                                  </td>
                                  <td className="p-3 font-semibold text-slate-600">
                                    {p.level_name || 'Iniciante'}
                                  </td>
                                  <td className="p-3">{p.total_actions_completed || 0}</td>
                                  <td className="p-3 font-bold text-emerald-700">
                                    {p.total_volunteers_invited || 0}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  {/* 10. CONFIGURAÇÕES & REDES */}
                  <TabsContent value="configuracoes" className="space-y-4 pt-4">
                    <form onSubmit={handleSaveSettings} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <h4 className="font-bold text-sm text-slate-800">
                            Links de Redes Sociais & Contato
                          </h4>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">
                              Instagram
                            </label>
                            <Input
                              value={settingsData.social_links?.instagram || ''}
                              onChange={(e) =>
                                setSettingsData({
                                  ...settingsData,
                                  social_links: {
                                    ...settingsData.social_links,
                                    instagram: e.target.value,
                                  },
                                })
                              }
                              className="text-xs mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Facebook</label>
                            <Input
                              value={settingsData.social_links?.facebook || ''}
                              onChange={(e) =>
                                setSettingsData({
                                  ...settingsData,
                                  social_links: {
                                    ...settingsData.social_links,
                                    facebook: e.target.value,
                                  },
                                })
                              }
                              className="text-xs mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">YouTube</label>
                            <Input
                              value={settingsData.social_links?.youtube || ''}
                              onChange={(e) =>
                                setSettingsData({
                                  ...settingsData,
                                  social_links: {
                                    ...settingsData.social_links,
                                    youtube: e.target.value,
                                  },
                                })
                              }
                              className="text-xs mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">
                              WhatsApp Oficial
                            </label>
                            <Input
                              value={settingsData.social_links?.whatsapp || ''}
                              onChange={(e) =>
                                setSettingsData({
                                  ...settingsData,
                                  social_links: {
                                    ...settingsData.social_links,
                                    whatsapp: e.target.value,
                                  },
                                })
                              }
                              className="text-xs mt-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <h4 className="font-bold text-sm text-slate-800 flex items-center justify-between">
                            <span>Informações & Status da Abraçolândia</span>
                            <span className="text-[10px] font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
                              Editável em tempo real
                            </span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-slate-600">
                                Nome do Evento
                              </label>
                              <Input
                                value={settingsData.event_general_info?.eventName || ''}
                                placeholder="Ex: Abraçolândia 2027"
                                onChange={(e) =>
                                  setSettingsData({
                                    ...settingsData,
                                    event_general_info: {
                                      ...settingsData.event_general_info,
                                      eventName: e.target.value,
                                    },
                                  })
                                }
                                className="text-xs mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-600">
                                Edição / Badge de Status
                              </label>
                              <Input
                                value={settingsData.event_general_info?.statusBadge || ''}
                                placeholder="Ex: VEM AÍ 2027"
                                onChange={(e) =>
                                  setSettingsData({
                                    ...settingsData,
                                    event_general_info: {
                                      ...settingsData.event_general_info,
                                      statusBadge: e.target.value,
                                    },
                                  })
                                }
                                className="text-xs mt-1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-slate-600">
                                Data do Evento
                              </label>
                              <Input
                                value={settingsData.event_general_info?.dateStr || ''}
                                placeholder="Ex: Em Breve em 2027"
                                onChange={(e) =>
                                  setSettingsData({
                                    ...settingsData,
                                    event_general_info: {
                                      ...settingsData.event_general_info,
                                      dateStr: e.target.value,
                                    },
                                  })
                                }
                                className="text-xs mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-600">
                                Horários de Funcionamento
                              </label>
                              <Input
                                value={settingsData.event_general_info?.timeStr || ''}
                                placeholder="Ex: Data e Programação a Confirmar"
                                onChange={(e) =>
                                  setSettingsData({
                                    ...settingsData,
                                    event_general_info: {
                                      ...settingsData.event_general_info,
                                      timeStr: e.target.value,
                                    },
                                  })
                                }
                                className="text-xs mt-1"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-600">
                              Local / Pavilhão
                            </label>
                            <Input
                              value={settingsData.event_general_info?.venue || ''}
                              placeholder="Ex: Parque das Nações & Pavilhão Social"
                              onChange={(e) =>
                                setSettingsData({
                                  ...settingsData,
                                  event_general_info: {
                                    ...settingsData.event_general_info,
                                    venue: e.target.value,
                                  },
                                })
                              }
                              className="text-xs mt-1"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-600">
                              Endereço Completo
                            </label>
                            <Input
                              value={settingsData.event_general_info?.address || ''}
                              placeholder="Ex: Av. das Festas, 1000 - São Paulo/SP"
                              onChange={(e) =>
                                setSettingsData({
                                  ...settingsData,
                                  event_general_info: {
                                    ...settingsData.event_general_info,
                                    address: e.target.value,
                                  },
                                })
                              }
                              className="text-xs mt-1"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-600">
                              Título em Destaque na Home
                            </label>
                            <Input
                              value={settingsData.event_general_info?.headline || ''}
                              placeholder="Ex: Vem aí a Abraçolândia 2027!"
                              onChange={(e) =>
                                setSettingsData({
                                  ...settingsData,
                                  event_general_info: {
                                    ...settingsData.event_general_info,
                                    headline: e.target.value,
                                  },
                                })
                              }
                              className="text-xs mt-1"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-600">
                              Descrição do Destaque da Festa
                            </label>
                            <Input
                              value={settingsData.event_general_info?.description || ''}
                              placeholder="Texto de resumo do evento..."
                              onChange={(e) =>
                                setSettingsData({
                                  ...settingsData,
                                  event_general_info: {
                                    ...settingsData.event_general_info,
                                    description: e.target.value,
                                  },
                                })
                              }
                              className="text-xs mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      >
                        Salvar Todas as Configurações
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: AI Assistant (Guia Abraço) */}
          <div className="space-y-6">
            <AdminAiAssistant />

            {/* Quick CMS Tips */}
            <Card className="border-slate-200 bg-white">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dicas de Gestão
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-xs text-slate-600 space-y-2">
                <p>
                  • As alterações salvas aqui são refletidas imediatamente nos dois sites públicos
                  (Website Institucional e Hotsite Abraçolândia).
                </p>
                <p>
                  • Você pode fazer upload de fotos diretamente ou fornecer URLs de imagens/vídeos
                  do YouTube.
                </p>
                <p>
                  • Use o <strong>Guia Abraço</strong> acima para criar rascunhos de legendas para
                  Instagram, e-mails de agradecimento a doadores e notícias.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reusable Editor Modal */}
      {modalOpen && (
        <GenericContentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveModal}
          title={modalConfig.title}
          initialData={modalConfig.item || {}}
          fields={modalConfig.fields}
        />
      )}
    </AdminLayout>
  )
}
