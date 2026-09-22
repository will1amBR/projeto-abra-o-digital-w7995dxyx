import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import ColorStrip from '@/components/brand/ColorStrip'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Compass,
  Home,
  BookOpen,
  HeartHandshake,
  Newspaper,
  Users,
  Award,
  PartyPopper,
  Ticket,
  Tv,
  History,
  Lock,
  LayoutDashboard,
  CreditCard,
  QrCode,
  Dice5,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  UserCheck,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface DemoCardItem {
  title: string
  path: string
  description: string
  badge?: string
  icon: React.ComponentType<{ className?: string }>
  color: string // Tailwind color accent
  highlight?: boolean
}

interface DemoSection {
  id: string
  title: string
  subtitle: string
  color: string
  badge: string
  items: DemoCardItem[]
}

const DEMO_SECTIONS: DemoSection[] = [
  {
    id: 'institucional',
    title: 'Site Institucional',
    subtitle: 'Portal de comunicação oficial do Projeto Abraço, impacto e transparência social.',
    color: 'from-pink-500/10 to-rose-500/5 border-pink-200 text-pink-700',
    badge: 'Ambiente 1',
    items: [
      {
        title: 'Página Inicial (Home)',
        path: '/',
        description:
          'Banners em carrossel, chamadas de impacto, resumo de causas e métricas gerais.',
        icon: Home,
        color: '#ed0e58',
      },
      {
        title: 'Nossa História',
        path: '/nossa-historia',
        description:
          'Linha do tempo, trajetória de mais de 15 anos, missão, visão e pilares fundamentais.',
        icon: BookOpen,
        color: '#8d198f',
      },
      {
        title: 'Voluntariado',
        path: '/voluntariado',
        description:
          'Página pública de chamada, depoimentos de voluntários e formulário de adesão.',
        icon: HeartHandshake,
        color: '#2e3192',
      },
      {
        title: 'Notícias & Eventos',
        path: '/noticias',
        description:
          'Feed de artigos, avisos de campanhas do agasalho e cobertura de ações sociais.',
        icon: Newspaper,
        color: '#01abb7',
      },
      {
        title: 'Beneficiados',
        path: '/beneficiados',
        description:
          'Catálogo de instituições atendidas, comunidades parceiras e prestação de contas.',
        icon: Users,
        color: '#cce310',
      },
      {
        title: 'Patrocinadores & Apoiadores',
        path: '/patrocinadores',
        description:
          'Mural de empresas parceiras que financiam e apoiam as iniciativas do projeto.',
        icon: Award,
        color: '#f89c0e',
      },
    ],
  },
  {
    id: 'abracolandia',
    title: 'Hotsite Abraçolândia 2027',
    subtitle: 'Ambiente temático do maior evento anual beneficente: gastronomia, bingo e diversão.',
    color: 'from-fuchsia-500/10 to-purple-500/5 border-purple-200 text-purple-700',
    badge: 'Ambiente 2',
    items: [
      {
        title: 'Home Abraçolândia',
        path: '/abracolandia',
        description:
          'Apresentação imersiva da festa, contagem regressiva, atrações e acessos rápidos.',
        icon: PartyPopper,
        color: '#ed0e58',
      },
      {
        title: 'A Festa & Atrações',
        path: '/abracolandia/a-festa',
        description:
          'Programação de palcos, praça de alimentação, espaço kids e cronograma oficial.',
        icon: Sparkles,
        color: '#8d198f',
      },
      {
        title: 'Ingressos Online (Compra)',
        path: '/abracolandia/ingressos',
        description:
          'Fluxo completo de compra simulada, seleção de lotes e emissão instantânea de QR Code.',
        badge: 'Interativo',
        icon: Ticket,
        color: '#2e3192',
        highlight: true,
      },
      {
        title: 'Bingo — Telão Público',
        path: '/abracolandia/bingo',
        description:
          'Telão em tempo real que exibe as pedras cantadas para o público no evento ou celular.',
        badge: 'Tempo Real',
        icon: Tv,
        color: '#01abb7',
      },
      {
        title: 'Festas Anteriores',
        path: '/abracolandia/festas-anteriores',
        description:
          'Galeria fotográfica de edições passadas e histórico de impacto das arrecadações.',
        icon: History,
        color: '#f89c0e',
      },
    ],
  },
  {
    id: 'voluntario',
    title: 'Área do Voluntário & Gamificação',
    subtitle: 'Plataforma engajadora com sistema de missões, pontos, rankings e código de convite.',
    color: 'from-amber-500/10 to-yellow-500/5 border-amber-200 text-amber-700',
    badge: 'Engajamento',
    items: [
      {
        title: 'Área do Voluntário',
        path: '/area-do-voluntario',
        description:
          'Perfil completo com nível de engajamento, conquistas, missões e link de indicação de amigos.',
        badge: 'Gamificação Ativa',
        icon: HeartHandshake,
        color: '#ed0e58',
        highlight: true,
      },
      {
        title: 'Cadastro & Convites',
        path: '/voluntariado',
        description:
          'Fluxo que permite ao novo voluntário informar o código de indicação de outro participante.',
        icon: UserCheck,
        color: '#f89c0e',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Painel Administrativo & Operação',
    subtitle: 'Gestão completa do CMS, bilheteria, validação de ingressos, caixas PDV e bingo.',
    color: 'from-slate-800/10 to-blue-900/5 border-slate-300 text-slate-800',
    badge: 'Módulos Operacionais',
    items: [
      {
        title: 'Login Administrativo',
        path: '/admin/login',
        description:
          'Tela de autenticação restrita para gestores com preenchimento facilitado das credenciais.',
        icon: Lock,
        color: '#2e3192',
      },
      {
        title: 'Dashboard CMS Principal',
        path: '/admin',
        description:
          'Gestão de notícias, banners, beneficiados, voluntários, pedidos e assistente de IA.',
        badge: 'Protegido',
        icon: LayoutDashboard,
        color: '#8d198f',
        highlight: true,
      },
      {
        title: 'Caixa de Consumo & PDV',
        path: '/admin/caixa',
        description:
          'Sistema de cartões cashless do evento: check-in, recarga de saldo e vendas de fichas.',
        badge: 'Operação',
        icon: CreditCard,
        color: '#01abb7',
      },
      {
        title: 'Bingo — Painel da Equipe',
        path: '/admin/bingo',
        description:
          'Mesa de controle do sorteio: girar globo virtual, marcar pedra e disparar realtime ao telão.',
        badge: 'Sincronizado',
        icon: Dice5,
        color: '#ed0e58',
      },
      {
        title: 'Portaria & Validação de Ingressos',
        path: '/admin/validar-ingressos',
        description:
          'Leitor e validador de ingressos por QR Code ou código alfanumérico para controle de acesso.',
        badge: 'Portaria',
        icon: QrCode,
        color: '#f89c0e',
      },
    ],
  },
]

const DEMO_GUIDE_STEPS = [
  {
    step: 1,
    title: 'Explorar a Instituição',
    desc: 'Abra a Home institucional (/) e Nossa História (/nossa-historia) para apresentar o propósito, o slogan e os 15 anos de história.',
    target: '/',
    label: 'Ir para Home',
  },
  {
    step: 2,
    title: 'Comprar um Ingresso de Teste',
    desc: 'Acesse o fluxo de ingressos da Abraçolândia (/abracolandia/ingressos), escolha uma categoria e conclua o checkout simulado para obter o QR Code.',
    target: '/abracolandia/ingressos',
    label: 'Comprar Ingresso',
  },
  {
    step: 3,
    title: 'Validar o Ingresso na Portaria',
    desc: 'No módulo administrativo (/admin/validar-ingressos), cole o código do ingresso gerado para simular o check-in dos participantes na entrada do evento.',
    target: '/admin/validar-ingressos',
    label: 'Abrir Validador',
  },
  {
    step: 4,
    title: 'Check-in e Recarga no Caixa Cashless',
    desc: 'Abra o módulo Caixa (/admin/caixa), ative um cartão do participante por CPF/UID, faça uma recarga fictícia de saldo e realize vendas no PDV.',
    target: '/admin/caixa',
    label: 'Abrir Caixa PDV',
  },
  {
    step: 5,
    title: 'Sortear Pedras e Sincronizar o Bingo',
    desc: 'Abra o painel da equipe (/admin/bingo) em uma aba e o telão público (/abracolandia/bingo) em outra; sorteie um número e veja a sincronização ao vivo.',
    target: '/admin/bingo',
    label: 'Painel do Bingo',
  },
  {
    step: 6,
    title: 'Engajar com Gamificação de Voluntários',
    desc: 'Acesse a Área do Voluntário (/area-do-voluntario) para ver o sistema de pontos, missões sociais, ranking e o link de convite personalizado.',
    target: '/area-do-voluntario',
    label: 'Área do Voluntário',
  },
  {
    step: 7,
    title: 'Gerenciar no Painel CMS & IA',
    desc: 'Entre no Dashboard (/admin) para gerenciar o conteúdo das notícias, aprovar ações dos voluntários e experimentar o Assistente Inteligente integrado.',
    target: '/admin',
    label: 'Painel Geral CMS',
  },
]

export default function DemoPage() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPass, setCopiedPass] = useState(false)

  const handleCopy = (text: string, type: 'email' | 'pass') => {
    navigator.clipboard.writeText(text)
    if (type === 'email') {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      setCopiedPass(true)
      setTimeout(() => setCopiedPass(false), 2000)
    }
    toast({
      title: 'Copiado para a área de transferência!',
      description: text,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-pink-100 selection:text-pink-900">
      <InstitutionalHeader />

      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-14 sm:py-20 px-4 sm:px-6">
        {/* Subtle decorative glow circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ed0e58]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#2e3192]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-[#01abb7]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-pink-300">
            <Compass className="w-3.5 h-3.5 text-pink-400" />
            <span>Showcase & Tour de Apresentação</span>
            <span className="w-1 h-1 rounded-full bg-pink-400" />
            <span className="text-slate-300">Versão de Homologação</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Demonstração do Sistema{' '}
            <span className="bg-gradient-to-r from-[#ed0e58] via-[#f89c0e] to-[#cce310] bg-clip-text text-transparent">
              Projeto Abraço Digital
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal">
            Ambiente centralizado para apresentar todos os fluxos, módulos e funcionalidades
            desenvolvidos para o Projeto Abraço e a Abraçolândia. Utilize os atalhos e o roteiro
            guiado abaixo para conduzir uma demonstração completa a patrocinadores, diretoria e
            parceiros.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Atualizado: Março / 2026</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>4 Ambientes Integrados</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dados de Teste Ativos</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Color Strip Divider */}
      <ColorStrip height="h-[4px]" />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-14">
        {/* Credenciais de Demonstração (Card Discreto) */}
        <section aria-labelledby="creds-title">
          <Card className="border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-500 text-white">
                    <Lock className="w-4 h-4" />
                  </span>
                  <h2 id="creds-title" className="text-base sm:text-lg font-bold text-slate-900">
                    Credenciais de Demonstração (Acesso Administrativo)
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Utilize esta conta oficial com privilégios de{' '}
                  <strong className="text-slate-800">administrador</strong> para acessar o CMS, o
                  Caixa PDV, a Portaria e o Painel do Bingo.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-amber-200/90 shadow-xs">
                {/* Email */}
                <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
                  <div className="text-[11px]">
                    <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      E-mail:
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-xs">
                      william@korenambiental.com
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('william@korenambiental.com', 'email')}
                    className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    title="Copiar e-mail"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>

                {/* Senha */}
                <div className="flex items-center gap-2">
                  <div className="text-[11px]">
                    <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      Senha:
                    </span>
                    <span className="font-mono font-bold text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded text-xs">
                      Skip@Pass
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('Skip@Pass', 'pass')}
                    className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    title="Copiar senha"
                  >
                    {copiedPass ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>

                <Link to="/admin/login" className="ml-auto">
                  <Button
                    size="sm"
                    className="bg-[#2e3192] hover:bg-blue-900 text-white font-bold text-xs h-8 px-3"
                  >
                    Fazer Login <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        {/* Guia Rápido de Demonstração (Roteiro Sugerido) */}
        <section aria-labelledby="guide-title" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                Roteiro Sugerido
              </span>
              <h2 id="guide-title" className="text-xl sm:text-2xl font-black text-slate-900">
                Guia Rápido de Apresentação (Passo a Passo)
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Siga esta sequência lógica durante a demonstração para apresentar o sistema com
              fluidez e impacto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_GUIDE_STEPS.map((step) => (
              <Card
                key={step.step}
                className="relative border-slate-200 bg-white hover:border-pink-300 hover:shadow-md transition-all duration-200 rounded-2xl flex flex-col justify-between"
              >
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-pink-100 text-[#ed0e58] font-black text-xs flex items-center justify-center">
                      {step.step}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Etapa {step.step} de 7
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                  <Link to={step.target} className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold text-slate-700 hover:text-pink-600 hover:border-pink-300 justify-between group"
                    >
                      <span>{step.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 6-Color Strip Divider */}
        <ColorStrip height="h-[2px]" />

        {/* Grid de Cards de Atalho por Ambiente */}
        <section aria-labelledby="modules-title" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2e3192]">
              Mapa Completo da Aplicação
            </span>
            <h2 id="modules-title" className="text-2xl sm:text-3xl font-black text-slate-900">
              Atalhos por Ambiente & Módulo
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clique em qualquer card para ser direcionado instantaneamente à respectiva página do
              sistema.
            </p>
          </div>

          <div className="space-y-10">
            {DEMO_SECTIONS.map((section) => (
              <div key={section.id} className="space-y-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-200 pb-2.5">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`font-bold text-xs ${section.color}`}>
                      {section.badge}
                    </Badge>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        {section.title}
                      </h3>
                      <p className="text-xs text-slate-500">{section.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Section Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <Card
                        key={item.path}
                        className={`group relative border transition-all duration-200 rounded-2xl flex flex-col justify-between overflow-hidden ${
                          item.highlight
                            ? 'border-pink-300 shadow-sm bg-gradient-to-br from-pink-50/40 via-white to-white hover:shadow-md hover:border-pink-400'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <CardHeader className="p-5 pb-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                              style={{ backgroundColor: item.color }}
                            >
                              <IconComponent className="w-5 h-5 stroke-[2.2]" />
                            </div>

                            {item.badge && (
                              <Badge
                                className="text-[10px] font-bold"
                                style={{
                                  backgroundColor: `${item.color}15`,
                                  color: item.color,
                                  borderColor: `${item.color}40`,
                                }}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>

                          <div>
                            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                              {item.title}
                            </CardTitle>
                            <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                              {item.path}
                            </span>
                          </div>

                          <CardDescription className="text-xs text-slate-600 leading-relaxed pt-1">
                            {item.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="p-5 pt-0">
                          <Link to={item.path}>
                            <Button
                              className="w-full text-xs font-bold justify-between h-9 rounded-xl transition-all"
                              style={{
                                backgroundColor: item.highlight ? item.color : '#f1f5f9',
                                color: item.highlight ? '#ffffff' : '#1e293b',
                              }}
                            >
                              <span>Explorar Página</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Banner Informativo de Entrega */}
        <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40 text-xs font-bold">
              Pronto para Homologação
            </Badge>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Apresente o Projeto Abraço com Confiança
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Todos os módulos comunicam-se em tempo real com o backend Skip Cloud (PocketBase).
              Mudanças de banners, notícias, sorteios de bingo e recargas no caixa de consumo
              refletem instantaneamente nos telões e telas públicas.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/">
                <Button className="bg-[#ed0e58] hover:bg-pink-600 text-white font-bold text-xs h-9 rounded-xl">
                  Ir para o Início do Site
                </Button>
              </Link>
              <Link to="/admin">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-bold text-xs h-9 rounded-xl"
                >
                  Acessar Painel CMS
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  )
}
