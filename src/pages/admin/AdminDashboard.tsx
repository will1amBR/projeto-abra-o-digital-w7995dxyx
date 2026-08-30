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
} from 'lucide-react'

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

  function getCollectionModalConfig(collection: string, item: any | null) {
    switch (collection) {
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
              placeholder: 'Ex: 18/10/2025',
            },
            {
              name: 'published_at',
              label: 'Data de Publicação',
              type: 'text',
              placeholder: 'Ex: 20/05/2025',
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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight">CMS Projeto Abraço</h1>
                <Badge className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0">
                  ADMIN
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Gestão Integrada • Website Institucional & Hotsite Abraçolândia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Ver Site Abraço
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/abracolandia')}
              className="text-xs bg-pink-950/60 text-pink-200 border-pink-800 hover:bg-pink-900 hover:text-white"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-pink-400" /> Ver Abraçolândia
            </Button>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div className="text-right hidden md:block">
              <div className="text-xs font-semibold text-slate-200">
                {user?.name || user?.email}
              </div>
              <div className="text-[10px] text-slate-400">{user?.email}</div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                logout()
                navigate('/admin/login')
              }}
              className="text-xs h-8 px-2.5"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sair
            </Button>
          </div>
        </div>
      </header>

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
                      <TabsTrigger value="voluntariado" className="text-xs py-1.5">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-green-500" /> Voluntariado (
                        {volunteerAreas.length})
                      </TabsTrigger>
                      <TabsTrigger value="festa" className="text-xs py-1.5">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-pink-500" /> Abraçolândia (
                        {eventSections.length})
                      </TabsTrigger>
                      <TabsTrigger value="convites" className="text-xs py-1.5">
                        <Ticket className="w-3.5 h-3.5 mr-1.5 text-purple-500" /> Convites & PDVs (
                        {ticketOutlets.length})
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
                          <h4 className="font-bold text-sm text-slate-800">
                            Informações Rápidas da Festa
                          </h4>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">
                              Nome da Edição
                            </label>
                            <Input
                              value={settingsData.event_general_info?.eventName || ''}
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
                              Data e Horário
                            </label>
                            <Input
                              value={settingsData.event_general_info?.dateStr || ''}
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
                              Local do Pavilhão
                            </label>
                            <Input
                              value={settingsData.event_general_info?.venue || ''}
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
    </div>
  )
}
