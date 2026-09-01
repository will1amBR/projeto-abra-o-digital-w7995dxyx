import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import ColorStrip from '@/components/brand/ColorStrip'
import {
  getBanners,
  getNews,
  getBeneficiaries,
  getSponsors,
  getSiteSettings,
  getImageSrc,
} from '@/services/contentService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Users,
  Sparkles,
  Calendar,
  ChevronRight,
  ChevronLeft,
  PartyPopper,
} from 'lucide-react'

// Import mockup screenshot asset
import mockupHeroImage from '@/assets/screenshot2026-08-30-17-21-42-705com.android.chrome-edit-ce9fc.jpg'

export default function Home() {
  const [banners, setBanners] = useState<any[]>([])
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [latestNews, setLatestNews] = useState<any[]>([])
  const [recentBeneficiaries, setRecentBeneficiaries] = useState<any[]>([])
  const [sponsors, setSponsors] = useState<any[]>([])
  const [eventSettings, setEventSettings] = useState<any>({
    eventName: 'Abraçolândia 2027',
    edition: '14ª Edição',
    dateStr: 'Em Breve em 2027',
    timeStr: 'Data e Programação a Confirmar',
    venue: 'Parque das Nações & Pavilhão Social',
    address: 'Av. das Festas, 1000 - São Paulo/SP',
    status: 'upcoming',
    statusBadge: 'VEM AÍ 2027',
    headline: 'Vem aí a Abraçolândia 2027!',
    description:
      'O maior festival beneficente da região está sendo preparado para 2027! Gastronomia deliciosa, shows ao vivo, mega área infantil e o tradicional Super Bingo. 100% da arrecadação revertida para causas sociais do Projeto Abraço.',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getBanners('abraco', true),
      getNews({ featuredOnly: false }),
      getBeneficiaries({ site: 'abraco' }),
      getSponsors({ site: 'abraco' }),
      getSiteSettings(),
    ]).then(([banData, newsData, benData, sponData, settingsMap]) => {
      setBanners(banData)
      setLatestNews(newsData.slice(0, 3))
      setRecentBeneficiaries(benData.slice(0, 3))
      setSponsors(sponData)
      if (settingsMap.event_general_info) {
        setEventSettings((prev: any) => ({
          ...prev,
          ...settingsMap.event_general_info,
        }))
      }
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-pink-500 selection:text-white">
      <InstitutionalHeader />

      <main className="flex-1">
        {/* =========================================================================
            HERO SECTION - FIEL AO MOCKUP
            - Imagem de fundo com voluntários com camisetas azuis "VOLUNTÁRIO Eu faço parte! @projetoabraco"
            - Texto destacado "Faça da Diversão uma Boa Ação!" com sombra/borda rosa/roxa
            - Botão "Seja Voluntário" branco com texto na cor principal (#8d198f ou #ed0e58)
            - Setas de navegação nas laterais
            ========================================================================= */}
        <section className="relative overflow-hidden w-full bg-slate-900 min-h-[380px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[580px] flex items-center justify-center">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://img.usecurling.com/p/1600/900?q=volunteers%20blue%20shirts%20community%20event%20crowd"
              alt="Voluntários do Projeto Abraço"
              className="w-full h-full object-cover object-center brightness-95"
            />
            {/* Subtle dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />
          </div>

          {/* Carousel Left/Right indicators as shown on mockup */}
          <button
            type="button"
            aria-label="Banner anterior"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white transition p-2 hover:bg-black/20 rounded-full"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400 drop-shadow-md" />
          </button>
          <button
            type="button"
            aria-label="Próximo banner"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white transition p-2 hover:bg-black/20 rounded-full"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400 drop-shadow-md" />
          </button>

          {/* Hero Content Container */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-12 flex flex-col justify-end h-full">
            <div className="flex flex-col md:flex-row items-end md:items-end justify-between gap-6 pt-24 sm:pt-36">
              {/* Slogan with pink/purple highlight stroke & shadow */}
              <div className="max-w-xl text-left">
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-normal font-sans"
                  style={{
                    textShadow:
                      '0 0 20px rgba(237, 14, 88, 0.9), 0 0 35px rgba(141, 25, 143, 0.8), 2px 2px 4px rgba(0,0,0,0.9), -2px -2px 0 #ed0e58, 2px -2px 0 #ed0e58, -2px 2px 0 #ed0e58, 2px 2px 0 #ed0e58',
                  }}
                >
                  Faça da Diversão <br />
                  uma Boa Ação!
                </h1>
              </div>

              {/* Botão "Seja Voluntário" com fundo branco e texto na cor principal */}
              <div className="self-end md:self-end pb-2">
                <Link to="/voluntariado">
                  <Button
                    size="lg"
                    className="bg-white hover:bg-slate-50 text-[#8d198f] hover:text-[#ed0e58] font-black text-base sm:text-lg px-8 py-6 rounded-2xl shadow-2xl transition-all duration-200 hover:scale-105 border border-pink-200/50"
                  >
                    Seja Voluntário
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Colorful 6-color Project Abraço strip divider */}
        <ColorStrip height="h-[3.5px]" />

        {/* =========================================================================
            SEÇÃO BEM-VINDO - FIEL AO MOCKUP
            - Título "bem-vindo" em minúsculas e negrito
            - Textos institucionais à esquerda (Missão e "O que fazemos?")
            - Botão "Saiba mais..." na cor laranja (#f89c0e)
            - Imagem de um abraço à direita, conforme o mockup
            ========================================================================= */}
        <section className="bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Coluna Esquerda: Conteúdo Institucional (7 colunas) */}
            <div className="md:col-span-7 space-y-6">
              {/* Título "bem-vindo" em minúsculas e negrito */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight lowercase">
                bem-vindo
              </h2>

              {/* Texto 1: Missão / Descrição */}
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal text-justify">
                Somos uma organização sem fins lucrativos e temos como missão engajar pessoas para o
                trabalho voluntário com o objetivo de promover ações sociais que mobilizam recursos
                para instituições assistenciais e comunidades carentes.
              </p>

              {/* Subtítulo: "O que fazemos?" em amarelo/laranja */}
              <div className="space-y-2 pt-2">
                <h3 className="text-sm sm:text-base font-bold text-[#f89c0e]">O que fazemos?</h3>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal text-justify">
                  Promovemos eventos e ações sociais para mobilizar recursos e destiná-los a
                  projetos de benfeitoria para instituições assistenciais e comunidades carentes.
                </p>
              </div>

              {/* Botão "Saiba mais..." na cor laranja (#f89c0e) */}
              <div className="pt-4">
                <Link to="/nossa-historia">
                  <Button className="bg-[#f89c0e] hover:bg-[#e08905] text-white font-bold text-sm px-7 py-5 rounded-xl shadow-md transition-all hover:scale-105">
                    Saiba mais...
                  </Button>
                </Link>
              </div>
            </div>

            {/* Coluna Direita: Imagem de um Abraço (5 colunas) */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden shadow-xl border-4 border-slate-100 group">
                <img
                  src="https://img.usecurling.com/p/600/600?q=warm%20hug%20elderly%20volunteer%20embrace%20love"
                  alt="Um abraço de solidariedade do Projeto Abraço"
                  className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Colorful 6-color Project Abraço strip divider */}
        <ColorStrip height="h-[3.5px]" />

        {/* =========================================================================
            DESTAQUE ABRAÇOLÂNDIA (HOTSITE 2027) - EVENTO ANUAL
            ========================================================================= */}
        <section className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-purple-950 text-xs font-black">
                <PartyPopper className="w-3.5 h-3.5" />
                {eventSettings.statusBadge || 'VEM AÍ 2027'} •{' '}
                {eventSettings.edition || '14ª Edição'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {eventSettings.eventName || 'Abraçolândia 2027'}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {eventSettings.description ||
                  'Nosso tradicional festival beneficente que transforma alegria em solidariedade! Gastronomia, shows ao vivo e o Super Bingo.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/abracolandia">
                <Button className="bg-[#ed0e58] hover:bg-pink-600 text-white font-black px-6 h-12 rounded-xl text-sm shadow-lg">
                  Acessar Hotsite da Abraçolândia <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer já inclui a Seção de Redes Sociais roxa (#8d198f), Contatos laranja (#f89c0e), barras coloridas e Copyright escuro */}
      <InstitutionalFooter />
    </div>
  )
}
