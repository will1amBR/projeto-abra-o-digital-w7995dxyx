import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import {
  getBanners,
  getNews,
  getBeneficiaries,
  getSponsors,
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
  Gift,
  Award,
  ChevronRight,
  Quote,
  CheckCircle2,
  TrendingUp,
  Building,
} from 'lucide-react'

export default function Home() {
  const [banners, setBanners] = useState<any[]>([])
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [latestNews, setLatestNews] = useState<any[]>([])
  const [recentBeneficiaries, setRecentBeneficiaries] = useState<any[]>([])
  const [sponsors, setSponsors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getBanners('abraco', true),
      getNews({ featuredOnly: false }),
      getBeneficiaries({ site: 'abraco' }),
      getSponsors({ site: 'abraco' }),
    ]).then(([banData, newsData, benData, sponData]) => {
      setBanners(banData)
      setLatestNews(newsData.slice(0, 3))
      setRecentBeneficiaries(benData.slice(0, 3))
      setSponsors(sponData)
      setLoading(false)
    })
  }, [])

  // Banner carousel timer
  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [banners.length])

  const activeBanner = banners[currentBannerIndex] || {
    title: 'Acolher, incluir e transformar vidas',
    subtitle:
      'Uma rede de solidariedade e amor ao próximo que transforma vulnerabilidade em esperança e novas oportunidades.',
    cta_text: 'Quero Ser Voluntário',
    cta_link: '/voluntariado',
    badge: 'Projeto Abraço Institucional',
    image_url: 'https://img.usecurling.com/p/1600/700?q=solidarity%20community%20charity%20hands',
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <main className="flex-1">
        {/* HERO SECTION / BANNER PRINCIPAL EDITÁVEL VIA CMS */}
        <section className="relative overflow-hidden bg-slate-950 text-white py-20 lg:py-28">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={getImageSrc(activeBanner, 'banners')}
              alt={activeBanner.title}
              className="w-full h-full object-cover object-center opacity-30 scale-105 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {activeBanner.badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {activeBanner.badge}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {activeBanner.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                {activeBanner.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to={activeBanner.cta_link || '/voluntariado'}>
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 h-12 rounded-xl shadow-lg shadow-blue-600/30 text-sm">
                    {activeBanner.cta_text || 'Quero Fazer Parte'}{' '}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/nossa-historia">
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white h-12 px-5 rounded-xl text-sm"
                  >
                    Conheça Nossa História
                  </Button>
                </Link>
              </div>

              {/* Carousel Indicators */}
              {banners.length > 1 && (
                <div className="flex items-center gap-2 pt-4">
                  {banners.map((b, idx) => (
                    <button
                      key={b.id || idx}
                      onClick={() => setCurrentBannerIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentBannerIndex
                          ? 'w-8 bg-blue-500'
                          : 'w-2 bg-slate-600 hover:bg-slate-400'
                      }`}
                      aria-label={`Ir para banner ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* IMPACT METRICS BAR */}
        <section className="bg-white border-y border-slate-200 shadow-xs relative z-20 -mt-6 max-w-6xl mx-auto rounded-2xl p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="space-y-1">
              <div className="text-3xl lg:text-4xl font-extrabold text-blue-900">+5.000</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Famílias Acolhidas
              </p>
            </div>
            <div className="space-y-1 pt-4 lg:pt-0">
              <div className="text-3xl lg:text-4xl font-extrabold text-blue-900">+350</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Voluntários Ativos
              </p>
            </div>
            <div className="space-y-1 pt-4 lg:pt-0">
              <div className="text-3xl lg:text-4xl font-extrabold text-blue-900">+45 Ton</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Alimentos Distribuídos
              </p>
            </div>
            <div className="space-y-1 pt-4 lg:pt-0">
              <div className="text-3xl lg:text-4xl font-extrabold text-blue-900">12 Anos</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                De Amor e Transformação
              </p>
            </div>
          </div>
        </section>

        {/* DESTAQUE HOTSITE ABRAÇOLÂNDIA (CONVITE) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 rounded-3xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-pink-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Evento Anual Beneficente
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Vem aí a Abraçolândia 2025!
              </h2>
              <p className="text-pink-100 text-sm sm:text-base leading-relaxed">
                Música ao vivo, alta gastronomia, parque infantil e o tradicional Bingo Solidário.
                100% da arrecadação é revertida diretamente para as famílias do Projeto Abraço.
              </p>
              <div className="pt-2">
                <Link to="/abracolandia">
                  <Button className="bg-white text-purple-900 hover:bg-pink-50 font-extrabold px-6 h-11 rounded-xl shadow-md text-xs sm:text-sm">
                    Acessar Hotsite da Abraçolândia <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-300" /> 18 e 19 de Outubro de 2025
              </h3>
              <p className="text-xs text-pink-100">
                Parque das Nações & Pavilhão Social • São Paulo/SP
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/20">
                <div className="bg-black/20 p-2.5 rounded-lg">
                  <span className="font-bold block">Bingo Especial</span>
                  <span className="text-[11px] text-pink-200">Carro 0km e Prêmios</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg">
                  <span className="font-bold block">Gastronomia</span>
                  <span className="text-[11px] text-pink-200">+25 Food Trucks</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NOSSOS PILARES (INCLUSÃO, SOLIDARIEDADE, TRANSPARÊNCIA) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full">
              Nossa Essência
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Missão e Valores Inegociáveis
            </h2>
            <p className="text-slate-600 text-sm">
              Conheça os três pilares que guiam nossas ações comunitárias diárias e decisões
              institucionais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-slate-200 bg-white hover:shadow-lg transition group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Inclusão</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Criamos espaços, projetos e oportunidades onde todos se sintam integrados,
                  acolhidos, ouvidos e respeitados em sua integridade humana.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-lg transition group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold group-hover:bg-amber-500 group-hover:text-white transition">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Solidariedade</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Transformamos a empatia em ações concretas, ágeis e eficientes que geram impacto
                  real e imediato na vida de quem mais precisa.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-lg transition group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Transparência</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Garantimos que cada doação financeira, alimento e esforço voluntário cheguem
                  diretamente a quem mais precisa com prestação de contas aberta.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ÚLTIMAS NOTÍCIAS & EVENTOS */}
        <section className="bg-slate-100 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
                  Fique por dentro
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Últimas Notícias & Novidades
                </h2>
              </div>
              <Link to="/noticias">
                <Button variant="outline" className="text-xs font-semibold">
                  Ver Todas as Notícias <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((n) => (
                <Link key={n.id} to={`/noticias/${n.slug}`} className="group">
                  <Card className="border-slate-200 bg-white overflow-hidden hover:shadow-md transition h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative bg-slate-200">
                      <img
                        src={getImageSrc(n, 'news')}
                        alt={n.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-blue-900 text-white text-[11px] font-semibold shadow">
                          {n.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block mb-1">
                          {n.published_at || 'Recente'}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition line-clamp-2">
                          {n.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-2">{n.summary}</p>
                      </div>
                      <div className="text-xs font-semibold text-blue-700 flex items-center gap-1 pt-2">
                        Ler notícia completa <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFICIADOS & AÇÕES SOCIAIS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-red-600 tracking-wider uppercase">
                Impacto Real
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Ações Sociais & Beneficiados
              </h2>
            </div>
            <Link to="/beneficiados">
              <Button variant="outline" className="text-xs font-semibold">
                Ver Todas as Ações <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBeneficiaries.map((b) => (
              <Link key={b.id} to={`/beneficiados/${b.slug}`} className="group">
                <Card className="border-slate-200 bg-white overflow-hidden hover:shadow-md transition h-full flex flex-col">
                  <div className="h-48 overflow-hidden relative bg-slate-200">
                    <img
                      src={getImageSrc(b, 'beneficiaries')}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-600 text-white text-[11px] font-semibold shadow">
                        {b.type}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold mb-1">
                        {b.quantity} • {b.location}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-red-700 transition line-clamp-2">
                        {b.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-2">{b.summary}</p>
                    </div>
                    <div className="text-xs font-semibold text-red-700 flex items-center gap-1 pt-2">
                      Conhecer esta ação <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* PATROCINADORES / APOIADORES */}
        <section className="bg-white py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
              Empresas do Bem
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1 mb-8">
              Nossos Patrocinadores e Parceiros
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center">
              {sponsors.slice(0, 8).map((s) => (
                <Link
                  key={s.id}
                  to={`/patrocinadores/${s.slug}`}
                  className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition flex flex-col items-center group"
                >
                  <img
                    src={getImageSrc(s, 'sponsors')}
                    alt={s.name}
                    className="h-14 object-contain grayscale group-hover:grayscale-0 transition mb-2"
                  />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-900">
                    {s.name}
                  </span>
                  <Badge variant="outline" className="text-[10px] mt-1">
                    {s.tier}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/patrocinadores">
                <Button variant="outline" className="text-xs">
                  Ver Todos os Patrocinadores & Como Apoiar{' '}
                  <ChevronRight className="w-4 h-4 ml-1" />
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
