import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { useAuth } from '@/contexts/AuthContext'
import {
  calculateLevelInfo,
  VOLUNTEER_LEVELS,
  getVolunteerMissions,
  getVolunteerBadges,
  getEarnedBadges,
  getVolunteerActions,
  getVolunteerLeaderboard,
  submitVolunteerAction,
} from '@/services/gamificationService'
import type {
  VolunteerMission,
  VolunteerBadge,
  VolunteerEarnedBadge,
  VolunteerAction,
  VolunteerProfile,
} from '@/types/content'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import {
  Trophy,
  Award,
  Sparkles,
  Users,
  HeartHandshake,
  Gift,
  Share2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Copy,
  ExternalLink,
  Target,
  Flame,
  ShieldCheck,
  Send,
  PlusCircle,
  AlertCircle,
  LogIn,
  UserPlus,
  HelpCircle,
  ArrowRight,
  Medal,
  Star,
  Check,
  Crown,
  Heart,
  Smile,
  Info,
  PartyPopper,
} from 'lucide-react'

export default function AreaDoVoluntario() {
  const [searchParams] = useSearchParams()
  const referralFromUrl = searchParams.get('ref') || ''

  const {
    user,
    volunteerProfile,
    login,
    registerVolunteer,
    logout,
    refreshVolunteerProfile,
    isLoading: authLoading,
  } = useAuth()

  // Gamification state
  const [missions, setMissions] = useState<VolunteerMission[]>([])
  const [badges, setBadges] = useState<VolunteerBadge[]>([])
  const [earnedBadges, setEarnedBadges] = useState<VolunteerEarnedBadge[]>([])
  const [actionsHistory, setActionsHistory] = useState<VolunteerAction[]>([])
  const [leaderboard, setLeaderboard] = useState<VolunteerProfile[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Auth UI state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [authCity, setAuthCity] = useState('')
  const [authRefCode, setAuthRefCode] = useState(referralFromUrl)
  const [authSubmitting, setAuthSubmitting] = useState(false)

  // Action Submission Modal state
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [selectedMission, setSelectedMission] = useState<VolunteerMission | null>(null)
  const [actionType, setActionType] = useState<
    'indicacao' | 'doacao' | 'acao_social' | 'divulgacao' | 'outro'
  >('acao_social')
  const [actionTitle, setActionTitle] = useState('')
  const [actionDescription, setActionDescription] = useState('')
  const [actionProofUrl, setActionProofUrl] = useState('')
  const [actionDonationValue, setActionDonationValue] = useState<number | undefined>(undefined)
  const [actionInvitedEmail, setActionInvitedEmail] = useState('')
  const [actionPointsClaimed, setActionPointsClaimed] = useState<number>(100)
  const [actionSubmitting, setActionSubmitting] = useState(false)
  const [actionProofFile, setActionProofFile] = useState<File | null>(null)

  // Link copy feedback
  const [copiedLink, setCopiedLink] = useState(false)

  // Load all gamification records
  const loadGamificationData = async () => {
    setLoadingData(true)
    try {
      const [missionsData, badgesData, rankingData] = await Promise.all([
        getVolunteerMissions(true),
        getVolunteerBadges(),
        getVolunteerLeaderboard(10),
      ])
      setMissions(missionsData)
      setBadges(badgesData)
      setLeaderboard(rankingData)

      if (volunteerProfile?.id) {
        const [earned, actions] = await Promise.all([
          getEarnedBadges(volunteerProfile.id),
          getVolunteerActions(volunteerProfile.id),
        ])
        setEarnedBadges(earned)
        setActionsHistory(actions)
      }
    } catch (err) {
      console.error('Error loading gamification data:', err)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    loadGamificationData()
  }, [volunteerProfile?.id])

  // Sync ref code from URL if present
  useEffect(() => {
    if (referralFromUrl) {
      setAuthRefCode(referralFromUrl)
      setAuthMode('register')
    }
  }, [referralFromUrl])

  // Handle Login / Register
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthSubmitting(true)
    try {
      if (authMode === 'login') {
        await login(authEmail, authPassword)
        toast({
          title: 'Bem-vindo de volta!',
          description: 'Login realizado com sucesso. Acompanhe seus pontos e missões!',
        })
      } else {
        if (!authName || !authEmail || !authPassword) {
          toast({
            variant: 'destructive',
            title: 'Preencha os campos obrigatórios',
            description: 'Nome, e-mail e senha são necessários para o cadastro.',
          })
          return
        }
        await registerVolunteer({
          email: authEmail,
          password: authPassword,
          name: authName,
          phone: authPhone,
          city: authCity,
          referred_by_code: authRefCode,
        })
        toast({
          title: '🎉 Cadastro realizado com sucesso!',
          description: 'Você ganhou +100 pontos de boas-vindas e a medalha Primeiro Abraço!',
        })
      }
      loadGamificationData()
    } catch (err: any) {
      console.error('Auth error:', err)
      toast({
        variant: 'destructive',
        title: authMode === 'login' ? 'Falha no login' : 'Falha no cadastro',
        description:
          err.message || 'Verifique os dados informados ou tente novamente em instantes.',
      })
    } finally {
      setAuthSubmitting(false)
    }
  }

  // Handle Mission Click -> Pre-fill action submission modal
  const handleOpenMissionSubmission = (mission: VolunteerMission) => {
    if (!user || !volunteerProfile) {
      toast({
        title: 'Faça login para registrar',
        description: 'Entre ou crie sua conta para cumprir missões e acumular pontos.',
      })
      window.scrollTo({ top: 400, behavior: 'smooth' })
      return
    }

    setSelectedMission(mission)
    let type: any = 'acao_social'
    if (mission.category === 'Indicação') type = 'indicacao'
    if (mission.category === 'Doação') type = 'doacao'
    if (mission.category === 'Divulgação') type = 'divulgacao'

    setActionType(type)
    setActionTitle(mission.title)
    setActionPointsClaimed(mission.points_reward)
    setActionDescription('')
    setActionProofUrl('')
    setActionDonationValue(undefined)
    setActionInvitedEmail('')
    setActionProofFile(null)
    setActionModalOpen(true)
  }

  // Handle Custom Action Modal Open
  const handleOpenCustomAction = () => {
    if (!user || !volunteerProfile) {
      toast({
        title: 'Faça login para registrar',
        description: 'Entre ou crie sua conta para registrar boas ações e pontuar.',
      })
      window.scrollTo({ top: 400, behavior: 'smooth' })
      return
    }

    setSelectedMission(null)
    setActionType('acao_social')
    setActionTitle('')
    setActionDescription('')
    setActionProofUrl('')
    setActionDonationValue(undefined)
    setActionInvitedEmail('')
    setActionPointsClaimed(100)
    setActionProofFile(null)
    setActionModalOpen(true)
  }

  // Submit Action to Backend
  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!volunteerProfile) return

    if (!actionTitle || !actionDescription) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Informe o título e a descrição da sua ação realizada.',
      })
      return
    }

    setActionSubmitting(true)
    try {
      await submitVolunteerAction({
        volunteer_profile_id: volunteerProfile.id,
        mission_id: selectedMission?.id,
        action_type: actionType,
        title: actionTitle,
        description: actionDescription,
        proof_url: actionProofUrl,
        proof_file: actionProofFile,
        points_claimed: actionPointsClaimed,
        donation_value: actionDonationValue,
        invited_email: actionInvitedEmail,
      })

      toast({
        title: '✨ Registro enviado com sucesso!',
        description:
          'Sua ação foi registrada e está em análise pela coordenação. Os pontos serão adicionados assim que validada!',
      })
      setActionModalOpen(false)
      loadGamificationData()
      refreshVolunteerProfile()
    } catch (err: any) {
      console.error('Error submitting volunteer action:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar ação',
        description: err.message || 'Tente novamente em instantes.',
      })
    } finally {
      setActionSubmitting(false)
    }
  }

  // Copy referral link helper
  const handleCopyReferral = () => {
    if (!volunteerProfile?.referral_code) return
    const inviteUrl = `${window.location.origin}/area-do-voluntario?ref=${volunteerProfile.referral_code}`
    navigator.clipboard.writeText(inviteUrl)
    setCopiedLink(true)
    toast({
      title: 'Link de convite copiado!',
      description: 'Envie para amigos e familiares no WhatsApp e redes sociais.',
    })
    setTimeout(() => setCopiedLink(false), 3000)
  }

  // Level calculations for active user
  const userPoints = volunteerProfile?.points || 0
  const levelInfo = calculateLevelInfo(userPoints)
  const earnedBadgeIds = new Set(earnedBadges.map((eb) => eb.badge_id || eb.expand?.badge_id?.id))

  // Render badge icon helper
  const renderBadgeIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake className={className} />
      case 'Users':
      case 'UserPlus':
        return <Users className={className} />
      case 'Gift':
        return <Gift className={className} />
      case 'ShieldCheck':
      case 'Shield':
        return <ShieldCheck className={className} />
      case 'Sparkles':
      case 'Sparkle':
        return <Sparkles className={className} />
      case 'PartyPopper':
        return <PartyPopper className={className} />
      case 'Crown':
        return <Crown className={className} />
      case 'Award':
        return <Award className={className} />
      default:
        return <Medal className={className} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Header Padronizado Oficial do Projeto */}
      <InstitutionalHeader />

      {/* 2. Subbarra de navegação rápida do Voluntário */}
      <div className="bg-slate-900 text-white px-4 sm:px-8 py-2.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5">
              PAINEL DO VOLUNTÁRIO
            </Badge>
            <span className="text-slate-300 font-semibold hidden sm:inline">
              • Jornada Solidária & Gamificação
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/voluntariado"
              className="text-slate-300 hover:text-white transition font-medium flex items-center gap-1"
            >
              Áreas de Atuação
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/abracolandia"
              className="text-pink-400 hover:text-pink-300 transition font-medium flex items-center gap-1"
            >
              Hotsite Abraçolândia
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/admin"
              className="text-blue-400 hover:text-blue-300 transition font-medium flex items-center gap-1"
            >
              Área Administrativa →
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* HERO HEADER GAMIFICADO */}
        <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Glowing orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Intro */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Área do Voluntário • Jornada Solidária Gamificada</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  Cada abraço conta. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-emerald-400">
                    Suas boas ações valem pontos e transformação!
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Traga novos amigos, realize doações, participe de eventos presenciais e suba de
                  nível na rede do Projeto Abraço. Desbloqueie conquistas e lidere o ranking do bem!
                </p>

                {/* Stat pills */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-bold">
                        Missões Ativas
                      </div>
                      <div className="text-base font-extrabold text-white">{missions.length}</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-bold">Medalhas</div>
                      <div className="text-base font-extrabold text-white">{badges.length}</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2.5">
                    <Users className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-bold">
                        Comunidade
                      </div>
                      <div className="text-base font-extrabold text-white">
                        {leaderboard.length * 15}+ Voluntários
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: User Status Card or Quick Login Card */}
              <div className="lg:col-span-5">
                {user && volunteerProfile ? (
                  // Logged In Volunteer Header Card
                  <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={
                            volunteerProfile.avatar_url ||
                            'https://img.usecurling.com/ppl/medium?seed=12'
                          }
                          alt={volunteerProfile.display_name}
                          className="w-14 h-14 rounded-2xl border-2 border-amber-400 object-cover shadow-lg"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-white">
                              {volunteerProfile.display_name}
                            </h3>
                            <Badge className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0">
                              NÍVEL {levelInfo.currentLevel.level}
                            </Badge>
                          </div>
                          <p className="text-xs text-amber-300 font-semibold">
                            {levelInfo.currentLevel.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-xs text-slate-400 hover:text-white hover:bg-slate-800 h-8"
                      >
                        Sair
                      </Button>
                    </div>

                    {/* Progress to next level */}
                    <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                          <Flame className="w-4 h-4 text-amber-400" />
                          Progresso de Nível
                        </span>
                        <span className="font-extrabold text-amber-400 text-sm">
                          {userPoints.toLocaleString()} pts
                        </span>
                      </div>
                      <Progress value={levelInfo.progressPercent} className="h-2.5 bg-slate-800" />
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                        <span>{levelInfo.currentLevel.name}</span>
                        {levelInfo.nextLevel ? (
                          <span className="text-amber-300 font-semibold">
                            Faltam {levelInfo.pointsToNext} pts para {levelInfo.nextLevel.name}
                          </span>
                        ) : (
                          <span className="text-purple-300 font-bold">Nível Máximo Atingido!</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Referral Box */}
                    <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                          <Share2 className="w-3.5 h-3.5 text-blue-400" /> Seu Código de Convite:
                        </span>
                        <Badge className="bg-blue-600 text-white font-mono tracking-wider text-xs">
                          {volunteerProfile.referral_code}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={`${window.location.origin}/area-do-voluntario?ref=${volunteerProfile.referral_code}`}
                          className="text-[11px] h-8 bg-slate-900 border-blue-900 text-slate-300 font-mono"
                        />
                        <Button
                          size="sm"
                          onClick={handleCopyReferral}
                          className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white shrink-0 font-semibold"
                        >
                          {copiedLink ? (
                            <Check className="w-3.5 h-3.5 mr-1" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 mr-1" />
                          )}
                          {copiedLink ? 'Copiado' : 'Copiar'}
                        </Button>
                      </div>
                      <p className="text-[10px] text-blue-300">
                        Ganhe <strong>+150 pontos</strong> automaticamente a cada pessoa que se
                        cadastrar com seu link!
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        onClick={handleOpenCustomAction}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold h-9 shadow-md"
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Registrar Ação
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const el = document.getElementById('missoes-tab')
                          el?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="w-full text-xs font-semibold bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200 h-9"
                      >
                        <Target className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Ver Missões
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Guest / Auth Box
                  <Card className="bg-slate-900/90 border-slate-800 text-white shadow-2xl backdrop-blur-xl">
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <HeartHandshake className="w-5 h-5 text-amber-400" />
                          {authMode === 'login'
                            ? 'Acessar Área do Voluntário'
                            : 'Criar Minha Conta'}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-[10px] border-slate-700 text-slate-300"
                        >
                          {authMode === 'login' ? 'Já sou voluntário' : 'Novo cadastro'}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs text-slate-400">
                        {authMode === 'login'
                          ? 'Entre com suas credenciais para acompanhar seus pontos e conquistas.'
                          : 'Cadastre-se para começar a pontuar e receber seu link exclusivo de indicação.'}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 pt-0">
                      <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                        {authMode === 'register' && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs text-slate-300">Seu Nome Completo *</Label>
                              <Input
                                required
                                value={authName}
                                onChange={(e) => setAuthName(e.target.value)}
                                placeholder="Ex: Maria Clara"
                                className="bg-slate-950 border-slate-800 text-white text-xs h-9"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs text-slate-300">WhatsApp / Tel</Label>
                                <Input
                                  value={authPhone}
                                  onChange={(e) => setAuthPhone(e.target.value)}
                                  placeholder="(11) 99999-9999"
                                  className="bg-slate-950 border-slate-800 text-white text-xs h-9"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-slate-300">Cidade / UF</Label>
                                <Input
                                  value={authCity}
                                  onChange={(e) => setAuthCity(e.target.value)}
                                  placeholder="São Paulo/SP"
                                  className="bg-slate-950 border-slate-800 text-white text-xs h-9"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="space-y-1">
                          <Label className="text-xs text-slate-300">E-mail *</Label>
                          <Input
                            type="email"
                            required
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                            className="bg-slate-950 border-slate-800 text-white text-xs h-9"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-slate-300">Senha *</Label>
                          <Input
                            type="password"
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            className="bg-slate-950 border-slate-800 text-white text-xs h-9"
                          />
                        </div>

                        {authMode === 'register' && (
                          <div className="space-y-1 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                            <Label className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400" /> Código de Indicação
                              (Opcional)
                            </Label>
                            <Input
                              value={authRefCode}
                              onChange={(e) => setAuthRefCode(e.target.value)}
                              placeholder="Ex: WILL2025"
                              className="bg-slate-900 border-slate-700 text-white text-xs h-8 uppercase font-mono"
                            />
                            <span className="text-[10px] text-slate-400 block">
                              Se alguém te indicou, digite o código para seu amigo ganhar +150
                              pontos!
                            </span>
                          </div>
                        )}

                        <Button
                          type="submit"
                          disabled={authSubmitting}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs h-10 shadow-lg mt-2"
                        >
                          {authSubmitting ? (
                            'Processando...'
                          ) : authMode === 'login' ? (
                            <>
                              <LogIn className="w-3.5 h-3.5 mr-1.5" /> Entrar na Área do Voluntário
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Criar Conta & Ganhar +100
                              pts
                            </>
                          )}
                        </Button>

                        {/* Toggle login / register */}
                        <div className="text-center pt-2 text-xs text-slate-400 border-t border-slate-800">
                          {authMode === 'login' ? (
                            <>
                              Ainda não tem conta de voluntário?{' '}
                              <button
                                type="button"
                                onClick={() => setAuthMode('register')}
                                className="text-amber-400 font-bold hover:underline ml-1"
                              >
                                Cadastre-se aqui
                              </button>
                            </>
                          ) : (
                            <>
                              Já possui cadastro?{' '}
                              <button
                                type="button"
                                onClick={() => setAuthMode('login')}
                                className="text-blue-400 font-bold hover:underline ml-1"
                              >
                                Fazer Login
                              </button>
                            </>
                          )}
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        <ColorStrip className="h-1.5" />

        {/* REGRAS & COMO FUNCIONA A PONTUAÇÃO */}
        <section className="bg-white border-b border-slate-200 py-10 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <Badge className="bg-blue-100 text-blue-800 text-[11px] font-bold">
                Mecânica de Pontos
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Como Funciona a Gamificação do Abraço
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Cada atitude positiva é reconhecida e soma pontos ao seu perfil.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Traga Novos Voluntários</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Compartilhe seu link ou código de indicação. Cada amigo que se cadastrar garante{' '}
                    <strong className="text-blue-700 font-bold">+150 pontos</strong> imediatos para
                    você.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-blue-200/60 flex items-center justify-between text-xs font-semibold text-blue-900">
                  <span>Recompensa:</span>
                  <Badge className="bg-blue-600 text-white font-extrabold">+150 pts / pessoa</Badge>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 p-6 rounded-2xl border border-amber-100 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Promova & Faça Doações</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ajude na arrecadação de cestas básicas, brinquedos para a Abraçolândia ou
                    donativos para nossas campanhas emergenciais.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-amber-200/60 flex items-center justify-between text-xs font-semibold text-amber-900">
                  <span>Recompensa:</span>
                  <Badge className="bg-amber-500 text-slate-950 font-extrabold">
                    +200 a +500 pts
                  </Badge>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6 rounded-2xl border border-emerald-100 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Ações Presenciais & Eventos
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Participe dos dias de campo, mutirões de distribuição ou atue nas barraquinhas e
                    organização da grandiosa festa Abraçolândia.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-emerald-200/60 flex items-center justify-between text-xs font-semibold text-emerald-900">
                  <span>Recompensa:</span>
                  <Badge className="bg-emerald-600 text-white font-extrabold">
                    +250 a +400 pts
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NÍVEIS DE PROGRESSÃO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h2 className="text-2xl font-black text-slate-900">
                  Escalada de Níveis do Voluntário
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Conforme você acumula pontos, seu status sobe e novas honrarias são desbloqueadas.
              </p>
            </div>

            {volunteerProfile && (
              <Badge className="bg-slate-900 text-amber-300 px-3 py-1 text-xs">
                Seu Nível Atual: {levelInfo.currentLevel.name} ({userPoints} pts)
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {VOLUNTEER_LEVELS.map((lvl) => {
              const isCurrent = volunteerProfile && levelInfo.currentLevel.level === lvl.level
              const isAchieved = volunteerProfile && userPoints >= lvl.minPoints

              return (
                <div
                  key={lvl.level}
                  className={`relative p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-b from-amber-500/10 to-amber-500/5 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                      : isAchieved
                        ? 'bg-white border-emerald-200'
                        : 'bg-white/80 border-slate-200 opacity-80'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Seu Nível
                    </span>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        Nível {lvl.level}
                      </span>
                      {isAchieved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {lvl.minPoints} pts
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-slate-900 text-sm leading-tight">{lvl.name}</div>

                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                      {lvl.description}
                    </p>

                    <div className="pt-2 text-[10px] font-semibold text-slate-500 border-t border-slate-100">
                      {lvl.maxPoints < 999999
                        ? `${lvl.minPoints} a ${lvl.maxPoints} pts`
                        : `${lvl.minPoints}+ pts`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* TABS PRINCIPAIS: MISSÕES, CONQUISTAS/BADGES, RANKING, MEU HISTÓRICO */}
        <section id="missoes-tab" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <Tabs defaultValue="missoes" className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <TabsList className="bg-slate-200/80 p-1 rounded-xl flex flex-wrap h-auto gap-1">
                <TabsTrigger
                  value="missoes"
                  className="text-xs font-bold py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-sm"
                >
                  <Target className="w-4 h-4 mr-1.5 text-blue-600" /> Missões & Desafios (
                  {missions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="badges"
                  className="text-xs font-bold py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm"
                >
                  <Award className="w-4 h-4 mr-1.5 text-amber-500" /> Medalhas & Conquistas (
                  {badges.length})
                </TabsTrigger>
                <TabsTrigger
                  value="ranking"
                  className="text-xs font-bold py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-900 data-[state=active]:shadow-sm"
                >
                  <Trophy className="w-4 h-4 mr-1.5 text-emerald-600" /> Ranking Solidário (Top 10)
                </TabsTrigger>
                {volunteerProfile && (
                  <TabsTrigger
                    value="historico"
                    className="text-xs font-bold py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-900 data-[state=active]:shadow-sm"
                  >
                    <Clock className="w-4 h-4 mr-1.5 text-purple-600" /> Minhas Ações Registradas (
                    {actionsHistory.length})
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            {/* TAB 1: MISSÕES E DESAFIOS */}
            <TabsContent value="missoes" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Missões e Desafios Disponíveis
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cumpra os desafios abaixo e envie a comprovação para somar pontos ao seu perfil.
                  </p>
                </div>
                <Button
                  onClick={handleOpenCustomAction}
                  className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold h-9"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Registrar Outra Boa Ação
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missions.map((mission) => (
                  <Card
                    key={mission.id}
                    className="border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="outline"
                          className={
                            mission.category === 'Indicação'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : mission.category === 'Doação'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : mission.category === 'Ação Social'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                          }
                        >
                          {mission.category}
                        </Badge>
                        <Badge
                          className={
                            mission.difficulty === 'Fácil'
                              ? 'bg-emerald-600 text-white text-[10px]'
                              : mission.difficulty === 'Médio'
                                ? 'bg-blue-600 text-white text-[10px]'
                                : mission.difficulty === 'Avançado'
                                  ? 'bg-amber-600 text-white text-[10px]'
                                  : 'bg-purple-700 text-white text-[10px]'
                          }
                        >
                          {mission.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                          {renderBadgeIcon(mission.icon_name || 'Target')}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base leading-snug">
                            {mission.title}
                          </h4>
                          <div className="text-amber-600 font-extrabold text-xs mt-0.5">
                            +{mission.points_reward} Pontos
                          </div>
                        </div>
                      </div>

                      <div
                        className="text-xs text-slate-600 leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: mission.description }}
                      />

                      {mission.instructions && (
                        <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 border border-slate-100">
                          <strong>Instruções:</strong> {mission.instructions}
                        </div>
                      )}
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                      <Button
                        onClick={() => handleOpenMissionSubmission(mission)}
                        className="w-full bg-slate-900 hover:bg-blue-900 text-white text-xs font-semibold h-9 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                        Comprovar & Ganhar +{mission.points_reward} pts
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB 2: MEDALHAS & CONQUISTAS */}
            <TabsContent value="badges" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Medalhas de Honra do Voluntário
                </h3>
                <p className="text-xs text-slate-500">
                  Conquistas especiais desbloqueadas automaticamente ao atingir metas e pontuações.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => {
                  const isEarned = earnedBadgeIds.has(badge.id)

                  return (
                    <div
                      key={badge.id}
                      className={`p-5 rounded-2xl border transition flex items-start gap-4 ${
                        isEarned
                          ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-200'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                          isEarned
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {renderBadgeIcon(badge.icon_name, 'w-7 h-7')}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-[9px] uppercase font-extrabold ${
                              badge.rarity === 'Mestre'
                                ? 'bg-purple-600 text-white'
                                : badge.rarity === 'Lendário'
                                  ? 'bg-amber-600 text-white'
                                  : badge.rarity === 'Raro'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-600 text-white'
                            }`}
                          >
                            {badge.rarity}
                          </Badge>
                          {isEarned ? (
                            <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                              ✓ Desbloqueada
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">
                              Requer {badge.points_required} pts
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {badge.name}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            {/* TAB 3: RANKING SOLIDÁRIO */}
            <TabsContent value="ranking" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Ranking de Voluntários do Projeto Abraço
                  </h3>
                  <p className="text-xs text-slate-500">
                    Os voluntários mais engajados em acolher, transformar e mobilizar pessoas.
                  </p>
                </div>
                <div className="text-xs text-slate-500 italic">
                  * Apenas nome público e pontos são exibidos. Dados sensíveis protegidos.
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="divide-y divide-slate-100">
                  {leaderboard.map((item, index) => {
                    const isCurrentUser = volunteerProfile && volunteerProfile.id === item.id

                    return (
                      <div
                        key={item.id}
                        className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition ${
                          isCurrentUser
                            ? 'bg-amber-50/70 border-l-4 border-amber-500'
                            : index === 0
                              ? 'bg-amber-50/30'
                              : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Position Badge */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                              index === 0
                                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                                : index === 1
                                  ? 'bg-slate-300 text-slate-900'
                                  : index === 2
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {index === 0
                              ? '🥇'
                              : index === 1
                                ? '🥈'
                                : index === 2
                                  ? '🥉'
                                  : index + 1}
                          </div>

                          <img
                            src={item.avatar_url || 'https://img.usecurling.com/ppl/medium?seed=15'}
                            alt={item.display_name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                          />

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm truncate">
                                {item.display_name}
                              </span>
                              {isCurrentUser && (
                                <Badge className="bg-amber-500 text-slate-950 text-[10px] font-bold">
                                  VOCÊ
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                              <span className="text-amber-700 font-semibold">
                                {item.level_name || 'Voluntário'}
                              </span>
                              <span>•</span>
                              <span>{item.city || 'São Paulo/SP'}</span>
                              <span>•</span>
                              <span>{item.total_actions_completed || 0} ações</span>
                            </div>
                          </div>
                        </div>

                        {/* Points Score */}
                        <div className="text-right shrink-0">
                          <div className="text-lg font-black text-slate-900">
                            {item.points.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Pontos
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: HISTÓRICO DE AÇÕES DO VOLUNTÁRIO */}
            {volunteerProfile && (
              <TabsContent value="historico" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Minhas Ações Registradas</h3>
                    <p className="text-xs text-slate-500">
                      Acompanhe o status de validação das suas boas ações e doações.
                    </p>
                  </div>
                  <Button
                    onClick={handleOpenCustomAction}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Registrar Nova Ação
                  </Button>
                </div>

                {actionsHistory.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <p>Você ainda não registrou nenhuma ação ou doação.</p>
                    <Button onClick={handleOpenCustomAction} size="sm" variant="outline">
                      Registrar minha primeira ação
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {actionsHistory.map((act) => (
                      <div
                        key={act.id}
                        className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                act.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : act.status === 'rejected'
                                    ? 'bg-red-100 text-red-800 border-red-200'
                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                              }
                            >
                              {act.status === 'approved'
                                ? '✓ Aprovada & Pontuada'
                                : act.status === 'rejected'
                                  ? '✗ Rejeitada'
                                  : '⏳ Em Análise / Pendente'}
                            </Badge>
                            <span className="text-xs text-slate-400 capitalize">
                              Tipo: {act.action_type.replace('_', ' ')}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm">{act.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {act.description}
                          </p>

                          {act.admin_feedback && (
                            <p className="text-xs bg-slate-50 p-2 rounded border border-slate-100 text-slate-700 italic mt-1">
                              <strong>Mensagem da Coordenação:</strong> "{act.admin_feedback}"
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                          <div className="text-base font-extrabold text-amber-600">
                            +{act.points_claimed} pts
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {act.created ? new Date(act.created).toLocaleDateString('pt-BR') : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </section>

        {/* CTA FINAL DE CONVITE */}
        <section className="bg-slate-900 text-white py-12 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Pronto para fazer a diferença hoje?
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Seja na arrecadação de alimentos, na Abraçolândia ou indicando novos voluntários, seu
              impacto é inestimável para centenas de famílias.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link to="/voluntariado">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 h-10">
                  Ver Áreas de Voluntariado
                </Button>
              </Link>
              <Link to="/abracolandia">
                <Button
                  variant="outline"
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white text-xs h-10"
                >
                  Conhecer a Abraçolândia
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DE COMPROVAÇÃO / REGISTRO DE AÇÃO */}
      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              {selectedMission ? `Cumprir: ${selectedMission.title}` : 'Registrar Ação Voluntária'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Descreva sua ação realizada e adicione um comprovante (link ou arquivo) para a
              coordenação validar seus pontos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleActionSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Título da Ação *</Label>
              <Input
                required
                value={actionTitle}
                onChange={(e) => setActionTitle(e.target.value)}
                placeholder="Ex: Entrega de mantimentos no galpão"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Tipo de Ação</Label>
                <select
                  value={actionType}
                  onChange={(e: any) => setActionType(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded-md text-xs bg-white text-slate-800"
                >
                  <option value="acao_social">Ação Social / Presencial</option>
                  <option value="doacao">Doação / Arrecadação</option>
                  <option value="indicacao">Indicação de Amigo</option>
                  <option value="divulgacao">Divulgação em Redes</option>
                  <option value="outro">Outra Iniciativa</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Pontos a Reivindicar</Label>
                <Input
                  type="number"
                  required
                  min={10}
                  value={actionPointsClaimed}
                  onChange={(e) => setActionPointsClaimed(Number(e.target.value))}
                  className="text-xs font-bold text-amber-600"
                />
              </div>
            </div>

            {actionType === 'indicacao' && (
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  E-mail do Amigo Indicado (se souber)
                </Label>
                <Input
                  type="email"
                  value={actionInvitedEmail}
                  onChange={(e) => setActionInvitedEmail(e.target.value)}
                  placeholder="amigo@email.com"
                  className="text-xs"
                />
              </div>
            )}

            {actionType === 'doacao' && (
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Valor Estimado / Itens Doados (R$)
                </Label>
                <Input
                  type="number"
                  value={actionDonationValue || ''}
                  onChange={(e) => setActionDonationValue(Number(e.target.value))}
                  placeholder="Ex: 100"
                  className="text-xs"
                />
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">
                Relato / O que foi realizado? *
              </Label>
              <Textarea
                required
                rows={3}
                value={actionDescription}
                onChange={(e) => setActionDescription(e.target.value)}
                placeholder="Conte com detalhes onde e como você ajudou..."
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Link de Comprovação (Post/Drive)
                </Label>
                <Input
                  value={actionProofUrl}
                  onChange={(e) => setActionProofUrl(e.target.value)}
                  placeholder="https://instagram.com/p/..."
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Ou Foto do Comprovante
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setActionProofFile(e.target.files[0])
                    }
                  }}
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActionModalOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={actionSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                {actionSubmitting ? 'Enviando...' : 'Submeter Ação para Validação'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Rodapé Padronizado Oficial com ColorStrip */}
      <ColorStrip className="h-1.5" />
      <InstitutionalFooter />
    </div>
  )
}
