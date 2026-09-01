import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AbracolandiaHeader, AbracolandiaFooter } from '@/components/layout/AbracolandiaLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import {
  getBanners,
  getEventSections,
  getSponsors,
  getPastEditions,
  getSiteSettings,
  getImageSrc,
} from '@/services/contentService'
import { SponsorLogo } from '@/components/brand/SponsorLogo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  PartyPopper,
  Sparkles,
  Ticket,
  Music,
  Utensils,
  Smile,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Car,
  Flame,
  ChevronRight,
  Users,
  Dice5,
  CreditCard,
  QrCode,
} from 'lucide-react'

export default function AbracolandiaHome() {
  const [banners, setBanners] = useState<any[]>([])
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [sections, setSections] = useState<any[]>([])
  const [sponsors, setSponsors] = useState<any[]>([])
  const [lastEdition, setLastEdition] = useState<any>(null)
  const [eventSettings, setEventSettings] = useState<any>({
    eventName: 'Abraçolândia 2027',
    edition: '14ª Edição',
    dateStr: 'Em Breve em 2027',
    timeStr: 'Data e Programação a Confirmar',
    venue: 'Parque das Nações & Pavilhão Social',
    address: 'Av. das Festas, 1000 - São Paulo/SP',
    statusBadge: 'VEM AÍ 2027',
  })

  useEffect(() => {
    Promise.all([
      getBanners('abracolandia', true),
      getEventSections(),
      getSponsors({ site: 'abracolandia' }),
      getPastEditions(),
      getSiteSettings(),
    ]).then(([banData, secData, sponData, pastData, settingsMap]) => {
      setBanners(banData)
      setSections(secData)
      setSponsors(sponData)
      if (settingsMap.event_general_info) {
        setEventSettings((prev: any) => ({
          ...prev,
          ...settingsMap.event_general_info,
        }))
      }
      if (pastData.length > 0) setLastEdition(pastData[0])
    })
  }, [])

  // Carousel
  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [banners.length])

  const activeBanner = banners[currentBannerIndex] || {
    title: 'Vem aí a Abraçolândia 2027!',
    subtitle:
      'Prepare-se para mais uma grande edição de alegria e solidariedade! Gastronomia deliciosa, shows ao vivo, mega área infantil e o tradicional Bingo Beneficente.',
    cta_text: 'Ver Informações da Festa',
    cta_link: '/abracolandia/a-festa',
    badge: 'VEM AÍ • 14ª Edição 2027',
    image_url: 'https://img.usecurling.com/p/1600/700?q=festival%20carnival%20celebration%20lights',
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <AbracolandiaHeader />

      <main className="flex-1">
        {/* FESTIVE HERO BANNER */}
        <section className="relative overflow-hidden bg-slate-950 text-white py-20 lg:py-28">
          <div className="absolute inset-0 z-0">
            <img
              src={getImageSrc(activeBanner, 'banners')}
              alt={activeBanner.title}
              className="w-full h-full object-cover opacity-40 scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-pink-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {activeBanner.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 text-white text-xs font-black shadow-lg">
                  <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
                  {activeBanner.badge}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                {activeBanner.title}
              </h1>

              <p className="text-base sm:text-lg text-pink-100 leading-relaxed font-normal">
                {activeBanner.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/abracolandia/a-festa">
                  <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-extrabold px-7 h-12 rounded-2xl shadow-xl shadow-pink-600/40 text-sm">
                    <Sparkles className="w-4 h-4 mr-2" /> Conhecer a Festa 2027
                  </Button>
                </Link>
                <Link to="/abracolandia/festas-anteriores">
                  <Button
                    variant="outline"
                    className="border-pink-300/40 bg-purple-900/40 text-white hover:bg-purple-800/80 h-12 px-6 rounded-2xl text-sm font-bold"
                  >
                    Ver Edições Anteriores
                  </Button>
                </Link>
              </div>

              {/* Indicators */}
              {banners.length > 1 && (
                <div className="flex items-center gap-2 pt-4">
                  {banners.map((b, idx) => (
                    <button
                      key={b.id || idx}
                      onClick={() => setCurrentBannerIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentBannerIndex ? 'w-8 bg-pink-500' : 'w-2 bg-slate-600'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* QUICK EVENT HIGHLIGHTS GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/abracolandia/festa" className="group">
              <div className="bg-white p-5 rounded-3xl border-2 border-pink-200 shadow-lg hover:border-pink-400 hover:shadow-xl transition flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-black group-hover:scale-110 transition">
                  <Music className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-800 text-sm">Shows & Atrações</h3>
                <p className="text-[11px] text-slate-500">Música ao vivo o dia todo</p>
              </div>
            </Link>

            <Link to="/abracolandia/festa" className="group">
              <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-lg hover:border-amber-400 hover:shadow-xl transition flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black group-hover:scale-110 transition">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-800 text-sm">Gastronomia</h3>
                <p className="text-[11px] text-slate-500">+25 Food Trucks & Churrasco</p>
              </div>
            </Link>

            <Link to="/abracolandia/festa" className="group">
              <div className="bg-white p-5 rounded-3xl border-2 border-emerald-200 shadow-lg hover:border-emerald-400 hover:shadow-xl transition flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black group-hover:scale-110 transition">
                  <Smile className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-800 text-sm">Mega Espaço Kids</h3>
                <p className="text-[11px] text-slate-500">Infláveis, oficinas e monitores</p>
              </div>
            </Link>

            <Link to="/abracolandia/bingo" className="group">
              <div className="bg-white p-5 rounded-3xl border-2 border-purple-300 shadow-lg hover:border-purple-500 hover:shadow-xl transition flex flex-col items-center text-center space-y-2 relative overflow-hidden">
                <Badge className="absolute top-2 right-2 bg-purple-700 text-white text-[9px] font-bold">
                  BINGO
                </Badge>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-black group-hover:scale-110 transition">
                  <Dice5 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-black text-purple-950 text-sm">Super Bingo</h3>
                <p className="text-[11px] text-slate-500">Acompanhe as bolas no celular</p>
              </div>
            </Link>
          </div>
        </section>

        <ColorStrip className="h-1.5" />

        {/* SEÇÃO OFICIAL: PRÓXIMA EDIÇÃO 2027 & HISTÓRICO DAS EDIÇÕES (2025 / 2026) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          {/* Próxima Edição: Abraçolândia 2027 */}
          <div className="bg-gradient-to-br from-pink-600 via-purple-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border-2 border-pink-400/40 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-amber-400 text-purple-950 text-xs px-3 py-1 font-black uppercase tracking-wider">
                  PRÓXIMA EDIÇÃO • 2027
                </Badge>
                <Badge className="bg-pink-500 text-white text-xs px-3 py-1 font-black">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300 inline" />
                  VEM AÍ EM 2027
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                VEM AÍ A ABRAÇOLÂNDIA 2027
              </h2>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
                O Projeto Abraço segue sua trajetória preparando a grande edição da Abraçolândia
                2027. A construção de cada edição envolve uma rede de voluntários, empresas,
                parceiros e apoiadores que tornam possível a realização do evento e,
                consequentemente, ampliam a capacidade de gerar benefícios sociais concretos para
                quem mais precisa.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/abracolandia/a-festa">
                  <Button className="bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs rounded-xl shadow-lg">
                    ✨ Informações da Festa
                  </Button>
                </Link>
                <Link to="/abracolandia/voluntariado">
                  <Button className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs rounded-xl shadow-lg">
                    Cadastre-se como Voluntário
                  </Button>
                </Link>
                <Link to="/abracolandia/patrocinadores">
                  <Button
                    variant="outline"
                    className="border-white/50 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl"
                  >
                    Seja um Patrocinador
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/15 pb-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  VAMOS FAZER DA DIVERSÃO UMA BOA AÇÃO!
                </span>
                <span className="text-[11px] font-bold text-amber-300">● Preparativos 2027</span>
              </div>
              <p className="text-xs text-pink-100 leading-relaxed">
                {eventSettings.dateStr || 'Em Breve em 2027'} •{' '}
                {eventSettings.venue || 'Parque das Nações & Pavilhão Social'}
                {eventSettings.address ? ` • ${eventSettings.address}` : ''}
              </p>
              <p className="text-[11px] text-slate-200 leading-relaxed">
                Desde 2005, cada edição mobiliza voluntários e patrocinadores para garantir
                benfeitorias estruturais diretas para instituições e comunidades assistidas em todo
                o Brasil.
              </p>
              <div className="pt-2 text-xs font-mono text-cyan-300">
                projetoabraco.org.br • @projetoabraco
              </div>
            </div>
          </div>

          {/* Histórico: Abraçolândia 2025 & 2026 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Edição 2025 */}
            <div className="bg-white rounded-3xl p-8 border-2 border-pink-200 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Badge className="bg-pink-600 text-white text-xs px-3 py-1 font-black uppercase tracking-wider">
                  EDIÇÃO ANTERIOR • 2025
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black text-purple-950">
                  ABRAÇOLÂNDIA 2025 – O Mágico Circo do Abraço
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  Em 2025, a Abraçolândia ganhou o tema &quot;O Mágico Circo do Abraço&quot;,
                  mantendo a proposta de reunir diversão e solidariedade em uma grande ação social.
                  Na edição, foram beneficiadas: ABRACO, Casa Safira, Associação Ikoi no Sono,
                  Maternidade Jesus, José e Maria, Kibô-no-Iê, Associação Kodomo no Sono e Lar
                  Pequeno Leão.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/abracolandia/beneficiados">
                  <Button
                    variant="outline"
                    className="border-purple-300 text-purple-950 hover:bg-purple-50 font-bold text-xs rounded-xl"
                  >
                    Ver Instituições Beneficiadas <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Edição 2026 */}
            <div className="bg-white rounded-3xl p-8 border-2 border-purple-200 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Badge className="bg-purple-900 text-white text-xs px-3 py-1 font-black uppercase tracking-wider">
                  EDIÇÃO ANTERIOR • 2026
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black text-purple-950">
                  ABRAÇOLÂNDIA 2026
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  A edição de 2026 foi marcada por momentos inesquecíveis, com o engajamento massivo
                  de voluntários, grandes shows, praça gastronômica completa e o tradicional bingo
                  beneficente, gerando impacto e recursos essenciais para dezenas de famílias e
                  instituições assistidas.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/abracolandia/festas-anteriores">
                  <Button
                    variant="outline"
                    className="border-purple-300 text-purple-950 hover:bg-purple-50 font-bold text-xs rounded-xl"
                  >
                    Ver Galeria de Festas Anteriores <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ColorStrip className="h-1.5" />

        {/* RESUMO DAS FESTAS ANTERIORES & ARRECADAÇÃO */}
        {lastEdition && (
          <section className="bg-purple-950 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
                <div>
                  <Badge className="bg-amber-400 text-purple-950 font-black text-xs mb-2">
                    Histórico de Sucesso
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-black">
                    Resultados da Última Abraçolândia
                  </h2>
                </div>
                <Link to="/abracolandia/festas-anteriores">
                  <Button
                    variant="outline"
                    className="text-xs text-purple-200 border-purple-700 bg-purple-900/60 hover:bg-purple-800 font-bold rounded-xl"
                  >
                    Ver Todas as Edições Anteriores <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center space-y-2">
                  <span className="text-3xl lg:text-4xl font-black text-amber-300 block">
                    {lastEdition.raised_amount}
                  </span>
                  <span className="text-xs font-bold text-pink-200 uppercase tracking-wider">
                    Arrecadação 100% Solidária
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center space-y-2">
                  <span className="text-3xl lg:text-4xl font-black text-pink-300 block">
                    {lastEdition.attendance}
                  </span>
                  <span className="text-xs font-bold text-pink-200 uppercase tracking-wider">
                    Visitantes Presentes
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center space-y-2">
                  <span className="text-3xl lg:text-4xl font-black text-emerald-300 block">
                    {lastEdition.benefited_families}
                  </span>
                  <span className="text-xs font-bold text-pink-200 uppercase tracking-wider">
                    Famílias Impactadas
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        <ColorStrip className="h-1.5" />

        {/* PATROCINADORES OFICIAIS (DIAMANTE, OURO, PRATA, BRONZE) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Badge className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 mb-2">
            Apoiadores da Festa
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950 mb-8">
            Patrocinadores da Abraçolândia
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sponsors.map((s) => (
              <Link
                key={s.id}
                to={`/abracolandia/patrocinadores/${s.slug}`}
                className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm hover:border-pink-400 hover:shadow-md transition flex flex-col items-center group"
              >
                <div className="h-16 w-full flex items-center justify-center mb-3">
                  <SponsorLogo
                    sponsor={s}
                    size="sm"
                    className="w-full h-full shadow-none bg-transparent"
                  />
                </div>
                <h4 className="font-bold text-xs text-slate-800 group-hover:text-pink-600 transition truncate w-full">
                  {s.name}
                </h4>
                <Badge
                  className={
                    s.tier === 'Diamante'
                      ? 'bg-cyan-600 text-white text-[10px] mt-1'
                      : s.tier === 'Ouro'
                        ? 'bg-amber-500 text-white text-[10px] mt-1'
                        : s.tier === 'Prata'
                          ? 'bg-slate-400 text-white text-[10px] mt-1'
                          : 'bg-orange-600 text-white text-[10px] mt-1'
                  }
                >
                  {s.tier}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/abracolandia/patrocinadores">
              <Button
                variant="outline"
                className="text-xs border-purple-300 text-purple-900 font-bold"
              >
                Conheça Todos os Patrocinadores & Cotas <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <AbracolandiaFooter />
    </div>
  )
}
