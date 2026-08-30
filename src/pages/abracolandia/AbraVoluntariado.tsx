import React, { useState, useEffect } from 'react'
import { AbracolandiaHeader, AbracolandiaFooter } from '@/components/layout/AbracolandiaLayout'
import { getVolunteerAreas, submitVolunteerInscription } from '@/services/contentService'
import type { VolunteerArea } from '@/types/content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Search,
  Clock,
  Briefcase,
  Quote,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AbraVoluntariado() {
  const [areas, setAreas] = useState<VolunteerArea[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    area_interest: '',
    environment: 'abracolandia' as const,
    availability: '',
    message: '',
  })

  useEffect(() => {
    getVolunteerAreas({ site: 'abracolandia', search: searchTerm }).then(setAreas)
  }, [searchTerm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitVolunteerInscription(formData)
      setSubmitted(true)
      toast({
        title: 'Inscrição enviada!',
        description:
          'Em breve nossa equipe entrará em contato para agendar sua escala na Abraçolândia.',
      })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <AbracolandiaHeader />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-gradient-to-r from-purple-900 via-pink-700 to-amber-600 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-amber-400 text-purple-950 text-xs px-3 py-1 font-black shadow">
                Staff & Voluntários do Bem
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                Voluntariado na Abraçolândia
              </h1>
              <p className="text-pink-100 text-base sm:text-lg leading-relaxed">
                Venha fazer parte da equipe de mais de 200 voluntários que constroem a magia da
                festa no Espaço Kids, Bingo, Acolhimento, Logística e Mídias.
              </p>
            </div>
          </div>
        </section>

        {/* Áreas de Atuação com Campo de Busca Funcional */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Funções & Equipes da Festa</h2>
              <p className="text-xs text-slate-500">
                Escolha onde você mais se identifica para trabalhar nos dias do evento.
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <Input
                placeholder="Buscar por área de atuação no evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area) => (
              <Card
                key={area.id}
                className="border-2 border-amber-100 bg-white hover:border-pink-300 hover:shadow-lg transition rounded-3xl flex flex-col justify-between"
              >
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge className="bg-pink-100 text-pink-800 text-[10px] font-bold">
                      Equipe do Evento
                    </Badge>
                    {area.spots_available && (
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {area.spots_available} vagas abertas
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg font-black text-slate-900">{area.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  <div
                    className="text-xs text-slate-600 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: area.description }}
                  />

                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    {area.time_commitment && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>
                          <strong>Escala:</strong> {area.time_commitment}
                        </span>
                      </div>
                    )}
                    {area.requirements && (
                      <div className="flex items-start gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          <strong>Perfil:</strong> {area.requirements}
                        </span>
                      </div>
                    )}
                  </div>

                  {area.testimonials && area.testimonials[0] && (
                    <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 text-xs italic text-slate-600">
                      <Quote className="w-3.5 h-3.5 text-amber-500 mb-1" />"
                      {area.testimonials[0].text}"
                      <span className="block font-bold not-italic text-slate-800 text-[11px] mt-1">
                        — {area.testimonials[0].name}
                      </span>
                    </div>
                  )}

                  <Button
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, area_interest: area.title }))
                      const el = document.getElementById('abra-inscricao')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-xl"
                  >
                    Quero Esta Função
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Formulário */}
        <section id="abra-inscricao" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-purple-200 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <Badge className="bg-purple-900 text-white font-bold text-xs">
                Inscrição para a 12ª Edição
              </Badge>
              <h3 className="text-2xl font-black text-purple-950">
                Inscreva-se como Voluntário da Festa
              </h3>
              <p className="text-xs text-slate-500">
                Você receberá camiseta oficial do evento, alimentação e certificado de horas
                voluntárias.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900">Inscrição Confirmada!</h4>
                <p className="text-xs text-emerald-700">
                  Entraremos em contato com você pelo WhatsApp para alinhar seu turno e entrega da
                  camiseta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700">Nome Completo *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700">E-mail *</Label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemplo.com"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700">WhatsApp / Celular *</Label>
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700">Função Escolhida *</Label>
                    <Input
                      required
                      value={formData.area_interest}
                      onChange={(e) => setFormData({ ...formData, area_interest: e.target.value })}
                      placeholder="Ex: Bingo, Espaço Kids, Mídia, Apoio"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">
                    Disponibilidade nos Dias de Festa
                  </Label>
                  <Input
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="Ex: Sábado à tarde, Domingo o dia todo"
                    className="text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black h-11 text-xs rounded-2xl shadow-md"
                >
                  {loading ? 'Gravando...' : 'Confirmar Minha Inscrição Voluntária'}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>

      <AbracolandiaFooter />
    </div>
  )
}
