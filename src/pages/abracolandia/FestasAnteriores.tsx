import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AbracolandiaHeader, AbracolandiaFooter } from '@/components/layout/AbracolandiaLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { getPastEditions, getImageSrc } from '@/services/contentService'
import type { PastEdition } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Clock,
  Search,
  Calendar,
  Users,
  Award,
  Video,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react'

export default function FestasAnteriores() {
  const [editions, setEditions] = useState<PastEdition[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPastEditions({ search: searchTerm }).then((res) => {
      setEditions(res)
      setLoading(false)
    })
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <AbracolandiaHeader />

      <main className="flex-1">
        {/* Banner Oficial de Festas Anteriores */}
        <section className="bg-gradient-to-r from-purple-950 via-pink-800 to-amber-700 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-amber-400 text-purple-950 text-xs px-3 py-1 font-black shadow uppercase tracking-wider">
                UMA HISTÓRIA CONSTRUÍDA AO LONGO DOS ANOS
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                Festas Anteriores e Edições da Abraçolândia
              </h1>
              <p className="text-pink-100 text-base sm:text-lg leading-relaxed">
                A trajetória do Projeto Abraço não começou hoje. Desde 2005, diferentes projetos,
                ações e edições foram realizados, acompanhando diferentes públicos e necessidades.
                Toda renda obtida através deste evento é integralmente revertida em instituições
                e/ou comunidades carentes, previamente selecionadas, em forma de projetos de
                benfeitorias.
              </p>
            </div>
          </div>
        </section>

        <ColorStrip className="h-1.5" />

        {/* Campo de Busca por Ano ou Tema */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <Input
                placeholder="Buscar por ano (ex: 2024) ou tema da festa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm h-11"
              />
            </div>
          </div>
        </section>

        {/* Lista de Festas Anteriores */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">Carregando histórico...</div>
          ) : editions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-amber-200 text-slate-500">
              Nenhuma edição encontrada para o termo pesquisado.
            </div>
          ) : (
            editions.map((edition) => (
              <div
                key={edition.id}
                className="bg-white rounded-3xl border-2 border-amber-200 overflow-hidden shadow-lg p-6 sm:p-10 space-y-8"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-amber-100 pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-purple-900 text-white font-black text-xs px-3 py-1">
                        Edição {edition.year}
                      </Badge>
                      {edition.raised_amount && (
                        <Badge className="bg-emerald-600 text-white font-bold text-xs">
                          {edition.raised_amount} Arrecadados
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {edition.theme}
                    </h2>
                  </div>

                  {/* Impact Stats Pills */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {edition.attendance && (
                      <div className="bg-pink-50 text-pink-900 px-3.5 py-2 rounded-2xl border border-pink-200 font-bold flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-pink-600" /> {edition.attendance}
                      </div>
                    )}
                    {edition.benefited_families && (
                      <div className="bg-purple-50 text-purple-900 px-3.5 py-2 rounded-2xl border border-purple-200 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />{' '}
                        {edition.benefited_families}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    {edition.summary && (
                      <p className="font-bold text-slate-800 text-sm leading-relaxed">
                        {edition.summary}
                      </p>
                    )}
                    <div
                      className="prose prose-slate text-xs sm:text-sm text-slate-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: edition.description }}
                    />
                  </div>

                  <div className="rounded-3xl overflow-hidden shadow-md border-4 border-white bg-slate-200">
                    <img
                      src={getImageSrc(edition, 'past_editions')}
                      alt={edition.theme}
                      className="w-full h-[320px] object-cover"
                    />
                  </div>
                </div>

                {/* Galeria de Fotos e Vídeos da Edição */}
                {edition.gallery && edition.gallery.length > 0 && (
                  <div className="pt-6 border-t border-amber-100 space-y-4">
                    <h4 className="text-sm font-black text-purple-950 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-pink-600" /> Galeria de Momentos da Edição{' '}
                      {edition.year}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {edition.gallery.map((g: any, gIdx: number) => (
                        <div
                          key={gIdx}
                          className="group relative rounded-2xl overflow-hidden bg-slate-100 shadow-xs"
                        >
                          <img
                            src={g.url}
                            alt={g.caption || 'Foto da festa'}
                            className="w-full h-36 object-cover group-hover:scale-105 transition duration-300"
                          />
                          {g.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-[10px] truncate">
                              {g.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>

      <AbracolandiaFooter />
    </div>
  )
}
