import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AbracolandiaHeader, AbracolandiaFooter } from '@/components/layout/AbracolandiaLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { getBeneficiaries, getImageSrc } from '@/services/contentService'
import type { Beneficiary } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  HeartHandshake,
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Users,
} from 'lucide-react'

export default function AbraBeneficiados() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getBeneficiaries({
      site: 'abracolandia',
      search: searchTerm,
    }).then((res) => {
      setBeneficiaries(res)
      setLoading(false)
    })
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <AbracolandiaHeader />

      <main className="flex-1">
        {/* Banner Oficial de Beneficiados Abraçolândia 2025 */}
        <section className="bg-gradient-to-r from-purple-900 via-pink-700 to-rose-700 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-amber-400 text-purple-950 text-xs px-3 py-1 font-black shadow uppercase tracking-wider">
                ABRAÇOLÂNDIA 2025 – O Mágico Circo do Abraço
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                Instituições Beneficiadas
              </h1>
              <p className="text-pink-100 text-base sm:text-lg leading-relaxed">
                Em 2025, a Abraçolândia ganhou o tema &quot;O Mágico Circo do Abraço&quot;, mantendo
                a proposta de reunir diversão e solidariedade em uma grande ação social. Na edição,
                foram definidas como instituições beneficiadas: ABRACO, Casa Safira, Associação Ikoi
                no Sono, Maternidade Jesus, José e Maria, Kibô-no-Iê, Associação Kodomo no Sono, Lar
                Pequeno Leão. A seleção de diferentes instituições reforça uma característica
                importante do Projeto Abraço: a possibilidade de alcançar públicos e necessidades
                distintas por meio de uma mesma mobilização.
              </p>
            </div>
          </div>
        </section>
        {/* Barra de Busca */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <Input
                placeholder="Buscar instituição parceira ou benefício..."
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
        </section>

        {/* Lista de Beneficiados da Festa */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              Carregando beneficiados...
            </div>
          ) : beneficiaries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-amber-200 text-slate-500">
              Nenhuma ação encontrada com o termo pesquisado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beneficiaries.map((item) => (
                <Link key={item.id} to={`/beneficiados/${item.slug}`} className="group">
                  <Card className="border-2 border-amber-100 bg-white overflow-hidden hover:border-pink-300 hover:shadow-xl transition rounded-3xl h-full flex flex-col justify-between">
                    <div className="h-52 overflow-hidden relative bg-slate-200">
                      <img
                        src={getImageSrc(item, 'beneficiaries')}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-pink-600 text-white text-[11px] font-bold shadow">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {item.recipient_name && (
                          <span className="text-[11px] font-bold text-purple-900 block mb-1">
                            {item.recipient_name}
                          </span>
                        )}
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-pink-600 transition line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-pink-600 flex items-center gap-1 pt-3 border-t border-slate-100">
                        Ver relatório completo da ação <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <ColorStrip className="h-1.5" />
      <AbracolandiaFooter />
    </div>
  )
}
