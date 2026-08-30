import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AbracolandiaHeader, AbracolandiaFooter } from '@/components/layout/AbracolandiaLayout'
import {
  getBanners,
  getEventSections,
  getSponsors,
  getPastEditions,
  getImageSrc,
} from '@/services/contentService'
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

  useEffect(() => {
    Promise.all([
      getBanners('abracolandia', true),
      getEventSections(),
      getSponsors({ site: 'abracolandia' }),
      getPastEditions(),
    ]).then(([banData, secData, sponData, pastData]) => {
      setBanners(banData)
      setSections(secData)
      setSponsors(sponData)
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
    title: 'Abraçolândia 2025: A Maior Festa da Solidariedade!',
    subtitle:
      'Gastronomia deliciosa, shows ao vivo, mega área infantil e o tradicional Bingo Beneficente. 100% da renda revertida para causas sociais.',
    cta_text: 'Comprar Ingressos Online',
    cta_link: '/abracolandia/ingressos',
    badge: '18 & 19 de Outubro • 12ª Edição',
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
                <Link to="/abracolandia/ingressos">
                  <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-extrabold px-7 h-12 rounded-2xl shadow-xl shadow-pink-600/40 text-sm animate-pulse hover:animate-none">
                    <Ticket className="w-4 h-4 mr-2" /> Comprar Ingressos Online (QR Code)
                  </Button>
                </Link>
                <Link to="/abracolandia/festa">
                  <Button
                    variant="outline"
                    className="border-pink-300/40 bg-purple-900/40 text-white hover:bg-purple-800/80 h-12 px-6 rounded-2xl text-sm font-bold"
                  >
                    Ver Toda a Programação
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
                <Badge className="absolute top-2 right-2 bg-pink-600 text-white text-[9px] font-bold">
                  AO VIVO
                </Badge>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-black group-hover:scale-110 transition">
                  <Dice5 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-black text-purple-950 text-sm">Telão do Bingo</h3>
                <p className="text-[11px] text-slate-500">Acompanhe as bolas no celular</p>
              </div>
            </Link>
          </div>
        </section>

        {/* SEÇÃO OFICIAL: ABRAÇOLÂNDIA 2025 & ABRAÇOLÂNDIA 2026 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          {/* Abraçolândia 2025 */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-pink-200 shadow-md grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <Badge className="bg-pink-600 text-white text-xs px-3 py-1 font-black uppercase tracking-wider">
                ABRAÇOLÂNDIA 2025
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
                ABRAÇOLÂNDIA 2025 – O Mágico Circo do Abraço
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                Em 2025, a Abraçolândia ganhou o tema &quot;O Mágico Circo do Abraço&quot;, mantendo
                a proposta de reunir diversão e solidariedade em uma grande ação social. Na edição,
                foram definidas como instituições beneficiadas: ABRACO, Casa Safira, Associação Ikoi
                no Sono, Maternidade Jesus, José e Maria, Kibô-no-Iê, Associação Kodomo no Sono, Lar
                Pequeno Leão. A seleção de diferentes instituições reforça uma característica
                importante do Projeto Abraço: a possibilidade de alcançar públicos e necessidades
                distintas por meio de uma mesma mobilização.
              </p>
              <div className="pt-2">
                <Link to="/abracolandia/beneficiados">
                  <Button className="bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs rounded-xl">
                    Ver Instituições Beneficiadas <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-200">
                <img
                  src="https://img.usecurling.com/p/1000/650?q=circus%20carnival%20magic%20celebration"
                  alt="Abraçolândia 2025 - O Mágico Circo do Abraço"
                  className="w-full h-[360px] object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-2xl shadow-lg rotate-3 text-xs uppercase tracking-wider">
                Edição 2025
              </div>
            </div>
          </div>

          {/* Abraçolândia 2026 */}
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border border-purple-700 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <Badge className="bg-amber-400 text-slate-950 text-xs px-3 py-1 font-black uppercase tracking-wider">
                FUTURO & CONTINUIDADE
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-white">ABRAÇOLÂNDIA 2026</h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                O Projeto Abraço segue sua trajetória com uma nova edição da Abraçolândia em 2026. A
                construção de cada edição envolve uma rede de pessoas, empresas, parceiros e
                apoiadores que contribuem para tornar possível a realização do evento e,
                consequentemente, ampliar sua capacidade de gerar benefícios sociais. Mais do que
                colocar um evento de pé, cada nova Abraçolândia representa a continuidade de uma
                história iniciada há mais de 20 anos. Uma história construída por pessoas que
                acreditam que diversão e solidariedade podem caminhar juntas.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/abracolandia/voluntariado">
                  <Button className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs rounded-xl shadow-lg">
                    cadastre-se como voluntário e FAÇA PARTE!
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wide block">
                VAMOS FAZER DA DIVERSÃO UMA BOA AÇÃO!
              </span>
              <p className="text-xs text-pink-100 leading-relaxed">
                Desde 2005 até as edições de 2025 e 2026, cada edição mobiliza voluntários e
                patrocinadores para garantir benfeitorias estruturais diretas.
              </p>
              <div className="pt-2 text-xs font-mono text-cyan-300">
                projetoabraco.org.br • @projetoabraco
              </div>
            </div>
          </div>
        </section>

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
                <div className="h-16 flex items-center justify-center mb-3">
                  <img
                    src={getImageSrc(s, 'sponsors')}
                    alt={s.name}
                    className="max-h-full max-w-full object-contain"
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
