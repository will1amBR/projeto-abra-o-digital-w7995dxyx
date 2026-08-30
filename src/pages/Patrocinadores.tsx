import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import { getSponsors, getImageSrc } from '@/services/contentService'
import type { Sponsor } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Award,
  ExternalLink,
  Building,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
} from 'lucide-react'

export default function Patrocinadores() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getSponsors({
      site: 'abraco',
      tier: selectedTier,
      search: searchTerm,
    }).then((res) => {
      setSponsors(res)
      setLoading(false)
    })
  }, [searchTerm, selectedTier])

  const tiers = ['all', 'Diamante', 'Ouro', 'Prata', 'Bronze', 'Apoiador']

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamante':
        return 'bg-cyan-600 text-white'
      case 'Ouro':
        return 'bg-amber-500 text-white'
      case 'Prata':
        return 'bg-slate-400 text-white'
      case 'Bronze':
        return 'bg-orange-600 text-white'
      default:
        return 'bg-blue-600 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-amber-500 text-slate-950 text-xs px-3 py-1 font-bold">
                Parceiros do Bem
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Patrocinadores & Empresas Apoiadoras
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Empresas que acreditam e investem na transformação social, fortalecendo nossas ações
                comunitárias e a realização da Abraçolândia.
              </p>
            </div>
          </div>
        </section>

        {/* Filtros & Barra de Busca por Nome */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Campo de Busca por Nome do Patrocinador */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <Input
                  placeholder="Buscar patrocinador por nome da empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm h-11"
                />
              </div>

              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-slate-500"
                >
                  Limpar busca
                </Button>
              )}
            </div>

            {/* Categorias / Cotas */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-500 mr-1 whitespace-nowrap">
                Categorias de Apoio:
              </span>
              {tiers.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  className={`px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap ${
                    selectedTier === t
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'all' ? 'Todas as Categorias' : t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Listagem de Patrocinadores */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">Carregando parceiros...</div>
          ) : sponsors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
              Nenhum patrocinador encontrado para o filtro selecionado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsors.map((item) => (
                <Link key={item.id} to={`/patrocinadores/${item.slug}`} className="group">
                  <Card className="border-slate-200 bg-white overflow-hidden hover:shadow-lg transition h-full flex flex-col justify-between">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <Badge className={`text-[10px] font-bold ${getTierColor(item.tier)}`}>
                          {item.tier}
                        </Badge>
                        {item.since_year && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Parceiro desde {item.since_year}
                          </span>
                        )}
                      </div>

                      <div className="h-24 bg-slate-50 rounded-xl p-3 flex items-center justify-center border border-slate-100">
                        <img
                          src={getImageSrc(item, 'sponsors')}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition">
                          {item.name}
                        </h3>
                        <div
                          className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </div>

                      <div className="text-xs font-semibold text-blue-700 flex items-center gap-1 pt-3 border-t border-slate-100">
                        Conhecer parceria <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Chamada para Novas Empresas Patrocinadoras */}
          <div className="mt-16 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 mx-auto">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Sua Empresa Pode Transformar Realidades
            </h3>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
              Associe a marca da sua empresa ao Projeto Abraço ou garanta cotas de patrocínio
              exclusivas para a Abraçolândia. Emitimos recibos sociais e prestação de contas
              integral.
            </p>
            <div className="pt-2">
              <a
                href="mailto:contato@projetoabraco.org.br?subject=Proposta%20de%20Patroc%C3%ADnio%20Projeto%20Abra%C3%A7o"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 h-11 rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                Solicitar Apresentação de Patrocínio <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  )
}
