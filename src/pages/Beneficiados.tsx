import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import { getBeneficiaries, getImageSrc } from '@/services/contentService'
import type { Beneficiary } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Gift,
  HeartHandshake,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Building,
} from 'lucide-react'

export default function Beneficiados() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getBeneficiaries({
      site: 'abraco',
      type: selectedType,
      search: searchTerm,
    }).then((res) => {
      setBeneficiaries(res)
      setLoading(false)
    })
  }, [searchTerm, selectedType])

  const types = [
    'all',
    'Cestas Básicas',
    'Reforma Comunitária',
    'Educação e Inclusão Digital',
    'Instituição Parceira',
    'Atendimento Médico',
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <main className="flex-1">
        {/* Banner Oficial Quem o Projeto Abraço Beneficia */}
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-pink-600 text-white text-xs px-3 py-1 font-bold uppercase tracking-wider">
                QUEM O PROJETO ABRAÇO BENEFICIA
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Um abraço que alcança diferentes gerações
              </h1>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                O trabalho desenvolvido pelo Projeto Abraço não é direcionado a apenas um público.
                As ações podem beneficiar: crianças, jovens, adultos e idosos, sempre por meio de
                instituições, projetos e comunidades selecionados para receber as iniciativas
                realizadas pelo projeto. Cada ação parte da ideia de que diferentes públicos possuem
                necessidades diferentes. Por isso, os projetos desenvolvidos ao longo dos anos
                transitam por áreas como assistência social, educação, cultura, saúde, esporte,
                lazer e convivência.
              </p>
            </div>
          </div>
        </section>

        {/* Filtros & Barra de Busca por Tipo de Benefício ou Nome */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Campo de Busca por tipo de benefício ou nome do beneficiado */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <Input
                  placeholder="Buscar por tipo de benefício ou nome do beneficiado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm h-11"
                />
              </div>

              {/* Botão limpar busca */}
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

            {/* Tipos de Benefício Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-500 mr-1 whitespace-nowrap">
                Tipos de Benefício:
              </span>
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap ${
                    selectedType === t
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'all' ? 'Todos os Benefícios' : t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Lista de Beneficiados */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              Carregando ações sociais...
            </div>
          ) : beneficiaries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
              Nenhum benefício ou ação encontrada com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beneficiaries.map((item) => (
                <Link key={item.id} to={`/beneficiados/${item.slug}`} className="group">
                  <Card className="border-slate-200 bg-white overflow-hidden hover:shadow-lg transition h-full flex flex-col">
                    <div className="h-52 overflow-hidden relative bg-slate-200">
                      <img
                        src={getImageSrc(item, 'beneficiaries')}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-red-600 text-white text-[11px] font-semibold shadow">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold mb-1.5">
                          {item.quantity && <span>{item.quantity}</span>}
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-red-500" /> {item.location}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-red-700 transition line-clamp-2">
                          {item.title}
                        </h3>
                        {item.recipient_name && (
                          <div className="text-xs font-semibold text-slate-700 mt-1">
                            Beneficiado: {item.recipient_name}
                          </div>
                        )}
                        <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-red-700 flex items-center gap-1 pt-2 border-t border-slate-100">
                        Ver detalhes e fotos da ação <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  )
}
