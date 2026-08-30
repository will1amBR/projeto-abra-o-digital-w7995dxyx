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
            <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-black tracking-wide backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                PROJETO ABRAÇO • FAÇA DA DIVERSÃO UMA BOA AÇÃO
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                PROJETO ABRAÇO
              </h1>

              <div className="text-pink-400 font-extrabold text-lg sm:text-xl uppercase tracking-wide">
                Faça da diversão uma boa ação.
              </div>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                O Projeto Abraço é uma organização não governamental, sem fins lucrativos, que há
                mais de 20 anos desenvolve ações voltadas à assistência social, educação, cultura,
                esporte, saúde e lazer. Sua história nasceu da iniciativa de um grupo de amigos que
                começou realizando pequenas ações sociais. Com o passar do tempo, a participação de
                mais pessoas e a vontade de fazer a diferença fizeram com que essas iniciativas
                ganhassem novas proporções. O que começou com pequenos gestos se transformou em um
                projeto capaz de mobilizar voluntários, parceiros e apoiadores em torno de um mesmo
                propósito: transformar diversão, convivência e solidariedade em ações concretas para
                quem precisa. É dessa essência que nasce uma das frases que melhor traduz o Projeto
                Abraço: Faça da diversão uma boa ação.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/voluntariado">
                  <Button className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold px-6 h-12 rounded-xl text-sm shadow-lg shadow-pink-600/30">
                    Cadastre-se como voluntário e FAÇA PARTE!
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/nossa-historia">
                  <Button
                    variant="outline"
                    className="border-slate-400/40 bg-white/10 hover:bg-white/20 text-white font-bold px-5 h-12 rounded-xl text-sm"
                  >
                    Conheça Quem Somos
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
              <div className="text-3xl lg:text-4xl font-extrabold text-blue-900">+20 Anos</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                De História e Ação Social
              </p>
            </div>
            <div className="space-y-1 pt-4 lg:pt-0">
              <div className="text-3xl lg:text-4xl font-extrabold text-blue-900">Desde 2005</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Realizando a Abraçolândia
              </p>
            </div>
            <div className="space-y-1 pt-4 lg:pt-0">
              <div className="text-3xl lg:text-4xl font-extrabold text-blue-900">Milhares</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                De Pessoas Beneficiadas
              </p>
            </div>
            <div className="space-y-1 pt-4 lg:pt-0">
              <div className="text-3xl lg:text-4xl font-extrabold text-pink-600">100%</div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Renda Revertida em Benfeitorias
              </p>
            </div>
          </div>
        </section>

        {/* DESTAQUE HOTSITE ABRAÇOLÂNDIA (CONVITE) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-abraco-pink via-abraco-purple to-abraco-blue rounded-3xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-pink-100">
                <Sparkles className="w-3.5 h-3.5 text-abraco-lime" /> Evento Anual Beneficente
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Vem aí a Abraçolândia 2025!
              </h2>
              <p className="text-pink-100 text-sm sm:text-base leading-relaxed">
                Música ao vivo, alta gastronomia com sistema de caixa integrado, parque infantil e o
                tradicional Super Bingo em tempo real. 100% da arrecadação é revertida diretamente
                para as causas assistenciais do Projeto Abraço.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/abracolandia">
                  <Button className="bg-white text-purple-900 hover:bg-pink-50 font-extrabold px-6 h-11 rounded-xl shadow-md text-xs sm:text-sm">
                    Acessar Hotsite da Abraçolândia <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/abracolandia/bingo">
                  <Button
                    variant="outline"
                    className="border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold px-4 h-11 rounded-xl text-xs sm:text-sm"
                  >
                    🎲 Painel do Bingo
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-abraco-lime" /> 18 e 19 de Outubro de 2025
              </h3>
              <p className="text-xs text-pink-100">
                Parque das Nações & Pavilhão Social • São Paulo/SP
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/20">
                <div className="bg-black/20 p-2.5 rounded-lg">
                  <span className="font-bold block text-abraco-lime">Bingo Especial</span>
                  <span className="text-[11px] text-pink-200">Smart TVs & Carro 0km</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg">
                  <span className="font-bold block text-abraco-orange">Caixa Pré-Pago</span>
                  <span className="text-[11px] text-pink-200">+25 Food Trucks & Bebidas</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO O QUE FAZEMOS & QUEM BENEFICIA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                O QUE FAZEMOS?
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Alegria que se transforma em impacto social.
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                Promovemos eventos e ações sociais gerando, a fim de proporcionar um projeto de
                benfeitoria para instituições assistenciais e comunidades carentes em todo
                território nacional. Nosso trabalho beneficia crianças, jovens, adultos e idosos.
              </p>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                O Projeto Abraço promove eventos e ações sociais com o objetivo de gerar recursos e
                viabilizar projetos de benfeitoria para instituições assistenciais e comunidades
                carentes. As iniciativas são desenvolvidas buscando atender necessidades reais das
                instituições e dos públicos beneficiados. A atuação do projeto envolve diferentes
                áreas, entre elas: assistência social; educação; cultura; esporte; saúde; lazer;
                atividades recreativas; ações de inclusão e cidadania. O trabalho beneficia pessoas
                de diferentes faixas etárias, incluindo crianças, jovens, adultos e idosos. A
                proposta é simples na origem, mas ampla em seu alcance: mobilizar pessoas, criar
                experiências positivas e transformar essa participação em ações capazes de
                contribuir para a vida de outras pessoas.
              </p>
              <div className="pt-2">
                <Link to="/beneficiados">
                  <Button className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs h-10 rounded-xl">
                    Conhecer Beneficiados <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* A ABRAÇOLÂNDIA (Seção Institucional) */}
            <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 border border-purple-800/40">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-bold rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> A ABRAÇOLÂNDIA
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Diversão que se transforma em uma boa ação.
              </h3>
              <p className="text-pink-100 text-sm leading-relaxed">
                O Projeto Abraço atua desde 2005 na organização da Abraçolândia, um evento social,
                cultural e recreativo. Toda renda obtida através deste evento é integralmente
                revertida em instituições e/ou comunidades carentes, previamente selecionadas, em
                forma de projetos de benfeitorias.
              </p>
              <p className="text-slate-300 text-xs leading-relaxed">
                Desde 2005, o Projeto Abraço realiza a Abraçolândia, um evento social, cultural e
                recreativo que se tornou parte importante da história do projeto. A Abraçolândia
                reúne entretenimento, convivência e solidariedade em torno de um propósito comum. A
                renda obtida por meio do evento é integralmente revertida para instituições e/ou
                comunidades carentes previamente selecionadas, por meio de projetos de benfeitoria.
                Esse modelo permite que a participação no evento vá além da diversão. Quem
                participa, apoia ou colabora com a Abraçolândia também passa a fazer parte da
                corrente de solidariedade criada pelo Projeto Abraço. Por isso, a Abraçolândia
                representa de maneira muito clara a essência do projeto: divertir, reunir pessoas e
                transformar essa energia em uma boa ação.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/abracolandia">
                  <Button className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs h-10 rounded-xl shadow">
                    Ir para Abraçolândia <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* NOSSO PROPÓSITO */}
        <section className="bg-slate-900 text-white py-16 border-y border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider bg-pink-500/10 border border-pink-500/30 px-3.5 py-1 rounded-full">
              NOSSO PROPÓSITO
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Faça da diversão uma boa ação.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              O Projeto Abraço acredita na capacidade das pessoas de transformar realidades quando
              se unem em torno de um propósito. Foi assim que pequenas ações realizadas por um grupo
              de amigos cresceram. Foi assim que nasceu uma história que já atravessa mais de duas
              décadas. E é assim que o projeto continua: reunindo pessoas, promovendo encontros e
              transformando participação em solidariedade. Porque um abraço pode representar
              acolhimento. Pode representar cuidado. Pode representar presença. E, quando muitas
              pessoas se unem, pode também representar transformação. Projeto Abraço. Faça da
              diversão uma boa ação.
            </p>
          </div>
        </section>

        {/* SEÇÃO FAÇA PARTE (CTA FINAL) */}
        <section className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-700 text-white py-16 shadow-xl">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-black tracking-wide backdrop-blur-sm uppercase">
              FAÇA PARTE!
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              VAMOS FAZER DA DIVERSÃO UMA BOA AÇÃO!
            </h2>
            <p className="text-base sm:text-lg text-pink-100 max-w-2xl mx-auto leading-relaxed">
              Você também pode fazer parte dessa história. Participe das ações. Seja voluntário.
              Acompanhe o Projeto Abraço. Apoie nossos projetos.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-white/90 pt-2">
              <span className="bg-black/20 px-3 py-1.5 rounded-lg">
                Domínio: <strong>projetoabraco.org.br</strong>
              </span>
              <a
                href="https://instagram.com/projetoabraco"
                target="_blank"
                rel="noreferrer"
                className="bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
              >
                Instagram: <strong>@projetoabraco</strong>
              </a>
            </div>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link to="/voluntariado">
                <Button className="bg-white text-purple-900 hover:bg-pink-50 font-extrabold px-8 h-12 rounded-xl text-sm shadow-xl">
                  cadastre-se como voluntário e FAÇA PARTE!
                </Button>
              </Link>
              <Link to="/area-do-voluntario">
                <Button
                  variant="outline"
                  className="border-white/50 bg-white/10 hover:bg-white/20 text-white font-bold px-6 h-12 rounded-xl text-sm"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-amber-300" /> Área Gamificada
                </Button>
              </Link>
            </div>
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
