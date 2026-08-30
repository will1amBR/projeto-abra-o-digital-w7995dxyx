import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import { useAuth } from '@/contexts/AuthContext'
import {
  getVolunteerAreas,
  submitVolunteerInscription,
  getImageSrc,
} from '@/services/contentService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  HeartHandshake,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Quote,
  Sparkles,
  Send,
  HelpCircle,
  Trophy,
  Award,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function Voluntariado() {
  const { user, registerVolunteer } = useAuth()
  const [areas, setAreas] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form State
  const [createAccount, setCreateAccount] = useState(true)
  const [accountPassword, setAccountPassword] = useState('')
  const [referralCodeInput, setReferralCodeInput] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    area_interest: '',
    environment: 'both' as 'abraco' | 'abracolandia' | 'both',
    availability: '',
    message: '',
  })

  useEffect(() => {
    getVolunteerAreas({ site: 'abraco', search: searchTerm }).then(setAreas)
  }, [searchTerm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone || !formData.area_interest) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos destacados.',
      })
      return
    }

    setLoading(true)
    try {
      await submitVolunteerInscription(formData)

      // Se optou por criar conta na Área do Voluntário gamificada
      if (createAccount && !user && accountPassword) {
        try {
          await registerVolunteer({
            email: formData.email,
            password: accountPassword,
            name: formData.name,
            phone: formData.phone,
            city: formData.city,
            referred_by_code: referralCodeInput,
          })
          toast({
            title: '🎉 Inscrição e Conta Criadas com Sucesso!',
            description: 'Você já ganhou +100 pontos de boas-vindas na Área do Voluntário!',
          })
        } catch (accErr: any) {
          console.warn('Conta já existe ou erro:', accErr)
        }
      }

      setSubmitted(true)
      toast({
        title: 'Inscrição enviada com sucesso!',
        description: 'Nossa coordenação entrará em contato em breve para o treinamento.',
      })
    } catch (err: any) {
      console.error(err)
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar inscrição',
        description: 'Tente novamente ou envie mensagem via WhatsApp.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <Badge className="bg-green-600 text-white text-xs px-3 py-1 font-semibold">
                  Faça Parte da Mudança
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  Seja um Voluntário do Projeto Abraço
                </h1>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Doe seu tempo, seu talento e seu amor ao próximo. O voluntariado é o coração
                  pulsante de todas as nossas iniciativas e eventos.
                </p>
              </div>

              {/* Box de Acesso Rápido à Área Gamificada */}
              <div className="lg:col-span-4 bg-gradient-to-br from-blue-900/90 to-indigo-950/90 border border-blue-500/30 rounded-2xl p-5 text-white backdrop-blur-md shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Área do Voluntário Gamificada
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Já é voluntário? Acompanhe sua pontuação, participe de missões e suba no ranking!
                </p>
                <Link to="/area-do-voluntario" className="block">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs h-9 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Acessar Meus Pontos & Missões
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona o voluntariado & Disseminação */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Inscrição Online</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Preencha o formulário abaixo escolhendo a área de atuação que melhor se alinha com
                seus horários e interesses.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Acolhimento & Capacitação</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Você participa de um encontro de integração para conhecer a equipe, entender os
                protocolos de apoio e receber mentoria.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Atuação em Campo</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Junto com outros voluntários, você atua diretamente nas entregas de mantimentos,
                mutirões de saúde ou nos grandes eventos.
              </p>
            </div>
          </div>

          {/* ÁREAS DE ATUAÇÃO COM BUSCA FUNCIONAL */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Áreas de Atuação Disponíveis
                </h2>
                <p className="text-xs text-slate-500">
                  Encontre a área de voluntariado perfeita para seu perfil.
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  placeholder="Buscar por área de atuação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            {areas.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                Nenhuma área de voluntariado encontrada para o termo pesquisado.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areas.map((area) => (
                  <Card
                    key={area.id}
                    className="border-slate-200 bg-white hover:shadow-md transition flex flex-col justify-between"
                  >
                    <CardHeader className="p-5 pb-2">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800 text-[10px] font-semibold border-blue-200">
                          {area.site === 'both' ? 'Geral + Eventos' : area.site}
                        </Badge>
                        {area.spots_available && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {area.spots_available} vagas
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        {area.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 space-y-4">
                      <div
                        className="text-xs text-slate-600 line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: area.description }}
                      />

                      <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                        {area.time_commitment && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>
                              <strong>Dedicação:</strong> {area.time_commitment}
                            </span>
                          </div>
                        )}
                        {area.requirements && (
                          <div className="flex items-start gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              <strong>Requisitos:</strong> {area.requirements}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Depoimento em destaque */}
                      {area.testimonials && area.testimonials[0] && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs italic text-slate-600">
                          <Quote className="w-3.5 h-3.5 text-slate-400 mb-1" />"
                          {area.testimonials[0].text}"
                          <span className="block font-bold not-italic text-slate-800 text-[11px] mt-1">
                            — {area.testimonials[0].name} ({area.testimonials[0].role})
                          </span>
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, area_interest: area.title }))
                          const el = document.getElementById('inscricao-form')
                          el?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="w-full text-xs font-semibold text-blue-700 hover:bg-blue-50 border-blue-200"
                      >
                        Candidatar-se a esta área
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FORMULÁRIO DE INSCRIÇÃO DE VOLUNTÁRIOS */}
        <section id="inscricao-form" className="bg-slate-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-10">
              <Badge className="bg-blue-600 text-white text-xs px-3 py-1 font-semibold">
                Formulário de Inscrição
              </Badge>
              <h2 className="text-3xl font-extrabold">Junte-se à Nossa Rede do Bem</h2>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                Preencha os seus dados para iniciarmos o processo de integração voluntária.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-950/60 border border-emerald-600/50 rounded-2xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Inscrição Enviada com Sucesso!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Agradecemos imensamente por seu gesto de amor e solidariedade. Nossa equipe
                  entrará em contato por WhatsApp ou E-mail com as próximas datas de capacitação.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      city: '',
                      area_interest: '',
                      environment: 'both',
                      availability: '',
                      message: '',
                    })
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs mt-2"
                >
                  Enviar outra inscrição
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-md"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      Seu Nome Completo *
                    </Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: João da Silva"
                      className="bg-slate-900 border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      E-mail para Contato *
                    </Label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="exemplo@email.com"
                      className="bg-slate-900 border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      Telefone / WhatsApp *
                    </Label>
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="bg-slate-900 border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">Cidade / Bairro</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="São Paulo/SP"
                      className="bg-slate-900 border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      Área de Interesse *
                    </Label>
                    <Input
                      required
                      value={formData.area_interest}
                      onChange={(e) => setFormData({ ...formData, area_interest: e.target.value })}
                      placeholder="Ex: Logística, Espaço Kids, Saúde, Bingo"
                      className="bg-slate-900 border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      Onde você prefere atuar?
                    </Label>
                    <select
                      value={formData.environment}
                      onChange={(e: any) =>
                        setFormData({ ...formData, environment: e.target.value })
                      }
                      className="w-full h-10 px-3 border border-slate-700 rounded-md bg-slate-900 text-white text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="both">Ambos (Ações Contínuas + Abraçolândia)</option>
                      <option value="abraco">Apenas Projeto Abraço (Assistência Contínua)</option>
                      <option value="abracolandia">Apenas Abraçolândia (Evento Anual)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    Disponibilidade de Dias e Horários
                  </Label>
                  <Input
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="Ex: Sábados pela manhã ou finais de semana da festa"
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    Conte um pouco sobre você / Motivação
                  </Label>
                  <Textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Por que você deseja fazer parte do Projeto Abraço?"
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
                {/* Integração com Conta da Área Gamificada */}
                {!user && (
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="createAccount"
                        checked={createAccount}
                        onChange={(e) => setCreateAccount(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-800 text-blue-600"
                      />
                      <label
                        htmlFor="createAccount"
                        className="text-xs font-bold text-amber-300 cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Criar também meu acesso na Área do Voluntário (Ganhe +100 pontos!)
                      </label>
                    </div>

                    {createAccount && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-300">
                            Crie uma Senha de Acesso *
                          </Label>
                          <Input
                            type="password"
                            required={createAccount}
                            value={accountPassword}
                            onChange={(e) => setAccountPassword(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            className="bg-slate-950 border-slate-700 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-300">
                            Código de Indicação (se tiver)
                          </Label>
                          <Input
                            value={referralCodeInput}
                            onChange={(e) => setReferralCodeInput(e.target.value)}
                            placeholder="Ex: WILL2025"
                            className="bg-slate-950 border-slate-700 text-white text-xs uppercase font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 text-sm shadow-lg"
                >
                  {loading ? 'Enviando sua inscrição...' : 'Concluir Inscrição Voluntária'}
                </Button>{' '}
              </form>
            )}
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  )
}
