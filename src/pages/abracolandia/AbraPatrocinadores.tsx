import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AbracolandiaHeader, AbracolandiaFooter } from '@/components/layout/AbracolandiaLayout'
import { getSponsors, getImageSrc } from '@/services/contentService'
import type { Sponsor } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Award,
  Search,
  Sparkles,
  ExternalLink,
  Building,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react'

export default function AbraPatrocinadores() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getSponsors({
      site: 'abracolandia',
      search: searchTerm,
    }).then((res) => {
      setSponsors(res)
      setLoading(false)
    })
  }, [searchTerm])

  const diamanteSponsors = sponsors.filter((s) => s.tier === 'Diamante')
  const ouroSponsors = sponsors.filter((s) => s.tier === 'Ouro')
  const prataSponsors = sponsors.filter((s) => s.tier === 'Prata')
  const bronzeSponsors = sponsors.filter((s) => s.tier === 'Bronze' || s.tier === 'Apoiador')

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <AbracolandiaHeader />

      <main className="flex-1">
        {/* Banner Oficial Empresas e Parceiros Abraçolândia */}
        <section className="bg-gradient-to-r from-purple-950 via-pink-800 to-amber-700 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-amber-400 text-purple-950 text-xs px-3 py-1 font-black shadow uppercase tracking-wider">
                EMPRESAS E PARCEIROS
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                Uma transformação construída em conjunto
              </h1>
              <p className="text-pink-100 text-base sm:text-lg leading-relaxed font-medium">
                A realização das ações do Projeto Abraço também depende da participação de empresas,
                patrocinadores, fornecedores e parceiros que acreditam no propósito do projeto. Essa
                colaboração ajuda a viabilizar eventos, estruturas, serviços e iniciativas que
                posteriormente se transformam em benefícios para as instituições selecionadas. Ao
                apoiar o Projeto Abraço, empresas e parceiros passam a integrar uma rede de pessoas
                e organizações mobilizadas em torno de uma finalidade social comum.
              </p>
            </div>
          </div>
        </section>
        {/* Busca por Nome */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <Input
                placeholder="Buscar patrocinador por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm h-11"
              />
            </div>
          </div>
        </section>

        {/* SEÇÕES DIVIDIDAS POR COTAS: DIAMANTE, OURO, PRATA, BRONZE */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
          {/* COTA DIAMANTE */}
          {diamanteSponsors.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-cyan-400 pb-3">
                <span className="text-2xl">💎</span>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Patrocinadores Diamante (Master)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Apoiadores estratégicos de palco e infraestrutura global do evento.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {diamanteSponsors.map((s) => (
                  <Link key={s.id} to={`/abracolandia/patrocinadores/${s.slug}`}>
                    <Card className="border-2 border-cyan-300 bg-white hover:shadow-xl transition rounded-3xl p-6 h-full flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="h-28 bg-cyan-50/50 rounded-2xl p-4 flex items-center justify-center border border-cyan-100">
                          <img
                            src={getImageSrc(s, 'sponsors')}
                            alt={s.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <h3 className="font-black text-slate-900 text-lg">{s.name}</h3>
                        <div
                          className="text-xs text-slate-600 line-clamp-3 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: s.description }}
                        />
                      </div>
                      <span className="text-xs font-bold text-cyan-700 flex items-center gap-1 pt-4">
                        Ver página do patrocinador <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* COTA OURO */}
          {ouroSponsors.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-amber-400 pb-3">
                <span className="text-2xl">🥇</span>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Patrocinadores Ouro</h2>
                  <p className="text-xs text-slate-500">
                    Parceiros oficiais da Praça Gastronômica e Espaço Kids.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ouroSponsors.map((s) => (
                  <Link key={s.id} to={`/abracolandia/patrocinadores/${s.slug}`}>
                    <Card className="border-2 border-amber-300 bg-white hover:shadow-lg transition rounded-3xl p-6 h-full flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="h-24 bg-amber-50/50 rounded-2xl p-4 flex items-center justify-center border border-amber-100">
                          <img
                            src={getImageSrc(s, 'sponsors')}
                            alt={s.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                        <div
                          className="text-xs text-slate-600 line-clamp-2 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: s.description }}
                        />
                      </div>
                      <span className="text-xs font-bold text-amber-700 flex items-center gap-1 pt-4">
                        Ver detalhes <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* COTA PRATA */}
          {prataSponsors.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-slate-300 pb-3">
                <span className="text-2xl">🥈</span>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Patrocinadores Prata</h2>
                  <p className="text-xs text-slate-500">Apoio logístico, transporte e montagem.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {prataSponsors.map((s) => (
                  <Link key={s.id} to={`/abracolandia/patrocinadores/${s.slug}`}>
                    <Card className="border border-slate-200 bg-white hover:border-slate-400 transition rounded-2xl p-4 text-center">
                      <div className="h-16 flex items-center justify-center mb-2">
                        <img
                          src={getImageSrc(s, 'sponsors')}
                          alt={s.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 truncate">{s.name}</h4>
                      <Badge className="bg-slate-400 text-white text-[10px] mt-1">Prata</Badge>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* COTA BRONZE & APOIADORES */}
          {bronzeSponsors.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-orange-300 pb-3">
                <span className="text-2xl">🥉</span>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Patrocinadores Bronze & Apoiadores
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gráfica, hidratação, insumos e comunicação visual.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {bronzeSponsors.map((s) => (
                  <Link key={s.id} to={`/abracolandia/patrocinadores/${s.slug}`}>
                    <Card className="border border-orange-200 bg-white hover:border-orange-400 transition rounded-2xl p-4 text-center">
                      <div className="h-16 flex items-center justify-center mb-2">
                        <img
                          src={getImageSrc(s, 'sponsors')}
                          alt={s.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 truncate">{s.name}</h4>
                      <Badge className="bg-orange-600 text-white text-[10px] mt-1">{s.tier}</Badge>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Chamada para Parcerias e Voluntariado */}
          <div className="mt-16 bg-gradient-to-r from-purple-900 to-pink-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider">
              FAÇA PARTE!
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              VAMOS FAZER DA DIVERSÃO UMA BOA AÇÃO!
            </h3>
            <p className="text-pink-100 text-sm max-w-2xl mx-auto leading-relaxed">
              Parceiros registrados: Pipoll Travel, Talento Seguros, Questa, Grupo Curumim, Alfa
              Alimentos, Facintelli, Bazar Irmãos Kido, Ozz, Instituto i9c, Yamamura, Soneda e
              Sacolão Saúde, GlikSmart, entre outros.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:contato@projetoabraco.org.br?subject=Interesse%20em%20Cota%20de%20Patroc%C3%ADnio"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-purple-950 font-black px-7 h-12 rounded-2xl text-xs sm:text-sm shadow-xl transition"
              >
                Solicitar Apresentação e Cotas <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/abracolandia/voluntariado"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold px-6 h-12 rounded-2xl text-xs sm:text-sm transition"
              >
                cadastre-se como voluntário e FAÇA PARTE!
              </Link>
            </div>
          </div>
        </div>
      </main>

      <AbracolandiaFooter />
    </div>
  )
}
