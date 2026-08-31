import React, { useState, useEffect } from 'react'
import { AbracolandiaHeader, AbracolandiaFooter } from '@/components/layout/AbracolandiaLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { getEventSections, getSiteSettings, getImageSrc } from '@/services/contentService'
import type { EventSection } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Music,
  Utensils,
  Smile,
  Award,
  Car,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  Ticket,
  ChevronRight,
  Info,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AFesta() {
  const [sections, setSections] = useState<EventSection[]>([])
  const [activeTab, setActiveTab] = useState<string>('todos')
  const [eventSettings, setEventSettings] = useState<any>({
    eventName: 'Abraçolândia 2026',
    edition: '13ª Edição',
    dateStr: 'Hoje, 30 de Agosto de 2026',
    timeStr: 'Das 10h às 22h (Em Andamento)',
    venue: 'Parque das Nações & Pavilhão Social',
    address: 'Av. das Festas, 1000 - São Paulo/SP',
    statusBadge: 'ACONTECENDO AGORA',
  })

  useEffect(() => {
    Promise.all([getEventSections(), getSiteSettings()]).then(([secData, settingsMap]) => {
      setSections(secData)
      if (settingsMap.event_general_info) {
        setEventSettings((prev: any) => ({
          ...prev,
          ...settingsMap.event_general_info,
        }))
      }
    })
  }, [])

  const generalSection = sections.find((s) => s.section_type === 'geral')
  const attractionsSection = sections.find((s) => s.section_type === 'atracoes')
  const gastronomySection = sections.find((s) => s.section_type === 'gastronomia')
  const kidsSection = sections.find((s) => s.section_type === 'espaco_kids')
  const bingoSection = sections.find((s) => s.section_type === 'bingo')
  const parkingSection = sections.find((s) => s.section_type === 'estacionamento')

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <AbracolandiaHeader />

      <main className="flex-1">
        {/* Banner de Topo da Festa com Textos Oficiais da Abraçolândia */}
        <section className="bg-gradient-to-r from-purple-900 via-pink-700 to-amber-600 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-amber-400 text-purple-950 text-xs px-3 py-1 font-black shadow uppercase tracking-wider">
                  {eventSettings.eventName || 'ABRAÇOLÂNDIA 2026'}
                </Badge>
                <Badge className="bg-red-600 text-white text-xs px-3 py-1 font-black shadow animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white mr-1.5 animate-ping inline-block" />
                  {eventSettings.statusBadge || 'ACONTECENDO AGORA'}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                Diversão que se transforma em uma boa ação.
              </h1>
              <p className="text-pink-100 text-base sm:text-lg leading-relaxed font-medium">
                O Projeto Abraço atua desde 2005 na organização da Abraçolândia, um evento social,
                cultural e recreativo. Toda renda obtida através deste evento é integralmente
                revertida em instituições e/ou comunidades carentes, previamente selecionadas, em
                forma de projetos de benfeitorias.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-white">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  FAÇA PARTE!
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  VAMOS FAZER DA DIVERSÃO UMA BOA AÇÃO!
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Informações Rápidas (Data, Horário, Local - Editáveis via CMS) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-200 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Data do Evento
                </span>
                <span className="font-black text-slate-900 text-sm sm:text-base">
                  {eventSettings.dateStr || 'Hoje, 30 de Agosto de 2026'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Horários de Funcionamento
                </span>
                <span className="font-black text-slate-900 text-sm sm:text-base">
                  {eventSettings.timeStr || 'Hoje das 10h às 22h (Em Andamento)'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Local / Pavilhão
                </span>
                <span className="font-black text-slate-900 text-sm sm:text-base">
                  {eventSettings.venue || 'Parque das Nações & Pavilhão Social'}
                </span>
                {eventSettings.address && (
                  <span className="text-[11px] text-slate-500 block truncate max-w-xs">
                    {eventSettings.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <ColorStrip className="h-1.5" />

        {/* 1. SEÇÃO GERAL & INFRAESTRUTURA */}
        {generalSection && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Badge className="bg-pink-100 text-pink-800 font-bold text-xs">
                  Informações Gerais
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
                  {generalSection.title}
                </h2>
                <div
                  className="prose prose-slate text-sm text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: generalSection.content }}
                />
                <div className="pt-2">
                  <Link to="/abracolandia/convites">
                    <Button className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl">
                      <Ticket className="w-4 h-4 mr-1.5" /> Adquira Seu Convite com Desconto
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg border border-pink-100 bg-slate-200">
                <img
                  src={getImageSrc(generalSection, 'event_sections')}
                  alt={generalSection.title}
                  className="w-full h-[320px] object-cover"
                />
              </div>
            </div>
          </section>
        )}

        <ColorStrip className="h-1.5" />

        {/* 2. ATRAÇÕES & SHOWS CONFIRMADOS */}
        {attractionsSection && (
          <section id="atracoes" className="bg-purple-950 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                <Badge className="bg-pink-500 text-white font-black text-xs">
                  Palco Principal & Palco Cultural
                </Badge>
                <h2 className="text-3xl font-black">{attractionsSection.title}</h2>
                <p className="text-pink-200 text-sm">{attractionsSection.subtitle}</p>
              </div>

              {attractionsSection.items && attractionsSection.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attractionsSection.items.map((item: any, idx: number) => (
                    <Card
                      key={idx}
                      className="bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/15 transition"
                    >
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-amber-400 text-purple-950 font-black text-[10px]">
                            {item.genre || 'Música ao Vivo'}
                          </Badge>
                          <span className="text-xs font-semibold text-pink-300">{item.time}</span>
                        </div>
                        <h3 className="text-lg font-black text-white">{item.name}</h3>
                        <p className="text-xs text-pink-100/90 leading-relaxed">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        )}

        <ColorStrip className="h-1.5" />

        {/* 3. GASTRONOMIA & PRAÇA DE ALIMENTAÇÃO */}
        {gastronomySection && (
          <section id="gastronomia" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <Badge className="bg-amber-100 text-amber-900 font-bold text-xs">
                Sabores da Solidariedade
              </Badge>
              <h2 className="text-3xl font-black text-purple-950">{gastronomySection.title}</h2>
              <p className="text-slate-600 text-sm">{gastronomySection.subtitle}</p>
            </div>

            {gastronomySection.items && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gastronomySection.items.map((food: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm hover:shadow-md transition space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                        {food.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{food.name}</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{food.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 4. MEGA ESPAÇO KIDS */}
        {kidsSection && (
          <section id="kids" className="bg-pink-100/60 py-16 border-y border-pink-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-4">
                  <Badge className="bg-pink-600 text-white font-bold text-xs">
                    Diversão 100% Segura
                  </Badge>
                  <h2 className="text-3xl font-black text-purple-950">{kidsSection.title}</h2>
                  <div
                    className="text-slate-700 text-sm leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{ __html: kidsSection.content }}
                  />

                  {kidsSection.items && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                      {kidsSection.items.map((k: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white p-3.5 rounded-2xl border border-pink-200 text-xs space-y-1"
                        >
                          <span className="font-bold text-purple-900 block">{k.name}</span>
                          <span className="text-[11px] text-pink-600 block">Faixa: {k.age}</span>
                          <span className="text-slate-500 text-[11px]">{k.info}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-200">
                  <img
                    src={getImageSrc(kidsSection, 'event_sections')}
                    alt={kidsSection.title}
                    className="w-full h-[380px] object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. BINGO BENEFICENTE */}
        {bingoSection && (
          <section id="bingo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
                <Badge className="bg-black/30 text-amber-200 font-bold text-xs">
                  Prêmios Incríveis & Emoção
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-black">{bingoSection.title}</h2>
                <p className="text-amber-100 text-sm">{bingoSection.subtitle}</p>
              </div>

              {bingoSection.items && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {bingoSection.items.map((b: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-black/25 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-2 text-center"
                    >
                      <span className="text-xs font-bold text-amber-300 block">{b.round}</span>
                      <h4 className="font-black text-white text-base">{b.prize}</h4>
                      <span className="text-[11px] text-pink-100 block">{b.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. ESTACIONAMENTO & TRANSPORTE */}
        {parkingSection && (
          <section id="estacionamento" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <Car className="w-8 h-8" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold text-slate-900">{parkingSection.title}</h3>
                <div
                  className="prose prose-slate text-xs sm:text-sm text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parkingSection.content }}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      <AbracolandiaFooter />
    </div>
  )
}
