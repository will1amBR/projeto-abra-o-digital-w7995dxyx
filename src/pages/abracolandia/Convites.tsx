import React, { useState, useEffect } from 'react'
import { AbracolandiaHeader, AbracolandiaFooter } from '@/components/layout/AbracolandiaLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { getTicketOutlets } from '@/services/contentService'
import type { TicketOutlet } from '@/types/content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Ticket,
  Search,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
} from 'lucide-react'

export default function Convites() {
  const [outlets, setOutlets] = useState<TicketOutlet[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getTicketOutlets({
      type: selectedType,
      city: selectedCity,
      search: searchTerm,
    }).then((res) => {
      setOutlets(res)
      setLoading(false)
    })
  }, [searchTerm, selectedType, selectedCity])

  const cities = [
    'all',
    'São Paulo',
    'Santo André',
    'São Bernardo do Campo',
    'Online / Todo o Brasil',
  ]

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <AbracolandiaHeader />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-gradient-to-r from-purple-900 via-pink-700 to-indigo-800 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-amber-400 text-purple-950 text-xs px-3 py-1 font-black shadow">
                Garanta Sua Entrada
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                Convites & Pontos de Venda (PDVs)
              </h1>
              <p className="text-pink-100 text-base sm:text-lg leading-relaxed">
                Adquira seus convites antecipados online ou nos pontos físicos autorizados. 100% do
                valor arrecadado é revertido para as famílias do Projeto Abraço.
              </p>
            </div>
          </div>
        </section>

        {/* Informações de Preço Solidário & Chamada para Bilheteria Online */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-300 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                Bilheteria Oficial Online & Convite Solidário
              </span>
              <div className="text-3xl font-black text-purple-950">
                A partir de R$ 15,00{' '}
                <span className="text-sm font-normal text-slate-500">
                  (várias categorias com QR Code)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                • Crianças de até 5 anos acompanhadas de responsável <strong>NÃO PAGAM</strong>.{' '}
                Emissão instantânea de ingressos com QR Code no seu celular!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/abracolandia/ingressos"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black px-6 h-12 rounded-2xl shadow-lg transition text-xs sm:text-sm animate-bounce hover:animate-none"
              >
                <Ticket className="w-4 h-4" /> Comprar Ingressos Online com QR Code
              </Link>
            </div>
          </div>
        </section>

        <ColorStrip className="h-1.5" />

        {/* Filtros & Barra de Busca por Cidade ou Nome */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Campo de Busca por Cidade ou Nome */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <Input
                  placeholder="Buscar ponto por nome do local ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm h-11"
                />
              </div>

              {/* Filtro Físico vs Online */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Button
                  size="sm"
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('all')}
                  className="text-xs h-9 px-3"
                >
                  Todos os Pontos
                </Button>
                <Button
                  size="sm"
                  variant={selectedType === 'Online' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('Online')}
                  className="text-xs h-9 px-3 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  Venda Online
                </Button>
                <Button
                  size="sm"
                  variant={selectedType === 'Físico' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('Físico')}
                  className="text-xs h-9 px-3 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                >
                  Pontos Físicos
                </Button>
              </div>
            </div>

            {/* Cidades Filtro */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-500 mr-1 whitespace-nowrap">
                Filtrar por Cidade:
              </span>
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${
                    selectedCity === c
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c === 'all' ? 'Todas as Cidades' : c}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Lista de Pontos de Venda */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              Carregando pontos de venda...
            </div>
          ) : outlets.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-amber-200 text-slate-500">
              Nenhum ponto de venda encontrado para os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outlets.map((item) => (
                <Card
                  key={item.id}
                  className="border-2 border-amber-100 bg-white hover:border-pink-300 hover:shadow-lg transition rounded-3xl overflow-hidden flex flex-col justify-between"
                >
                  <CardHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge
                        className={
                          item.type === 'Online'
                            ? 'bg-blue-600 text-white text-[10px]'
                            : 'bg-purple-700 text-white text-[10px]'
                        }
                      >
                        {item.type}
                      </Badge>
                      <span className="text-xs font-bold text-slate-500">{item.city}</span>
                    </div>
                    <CardTitle className="text-lg font-black text-slate-900">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <div className="space-y-2 text-xs text-slate-600">
                      {item.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                          <span>{item.address}</span>
                        </div>
                      )}
                      {item.opening_hours && (
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                          <span>{item.opening_hours}</span>
                        </div>
                      )}
                      {item.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{item.phone}</span>
                        </div>
                      )}
                      {item.price_info && (
                        <div className="flex items-start gap-2 pt-2 border-t border-slate-100 text-purple-950 font-semibold">
                          <CreditCard className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{item.price_info}</span>
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <div
                        className="text-xs text-slate-500 bg-amber-50/50 p-3 rounded-xl border border-amber-100 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}

                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer" className="block">
                        <Button className="w-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl">
                          Comprar Online neste Canal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </a>
                    ) : (
                      <div className="text-center p-2 bg-slate-50 rounded-xl text-[11px] font-bold text-slate-600">
                        Ponto Físico com Ingressos Disponíveis
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <AbracolandiaFooter />
    </div>
  )
}
