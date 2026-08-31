import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { getNews, getImageSrc } from '@/services/contentService'
import type { NewsItem } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Calendar,
  Tag,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock,
  Video,
} from 'lucide-react'

export default function Noticias() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedEventType, setSelectedEventType] = useState<string>('all') // all, upcoming, past
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getNews({
      category: selectedCategory,
      search: searchTerm,
      isEvent: selectedEventType === 'all' ? undefined : true,
    }).then((res) => {
      let filtered = res
      if (selectedEventType === 'upcoming') {
        filtered = filtered.filter((n) => n.event_status === 'upcoming')
      } else if (selectedEventType === 'past') {
        filtered = filtered.filter((n) => n.event_status === 'past')
      }
      setNews(filtered)
      setLoading(false)
    })
  }, [searchTerm, selectedCategory, selectedEventType])

  const categories = ['all', 'Geral', 'Evento', 'Ação Social', 'Voluntariado', 'Transparência']

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-blue-600 text-white text-xs px-3 py-1 font-semibold">
                Informativo Oficial
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Notícias & Cobertura de Eventos
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Acompanhe em ordem cronológica os acontecimentos, coberturas de ações sociais e
                próximos eventos do Projeto Abraço.
              </p>
            </div>
          </div>
        </section>

        <ColorStrip className="h-1.5" />

        {/* Filtros & Barra de Busca Funcional */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Campo de Busca por Palavra-Chave */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <Input
                  placeholder="Buscar notícia por palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm h-11"
                />
              </div>

              {/* Filtro de Eventos Passados / Futuros */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  Filtro de Eventos:
                </span>
                <Button
                  size="sm"
                  variant={selectedEventType === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedEventType('all')}
                  className="text-xs h-8 px-3"
                >
                  Todos
                </Button>
                <Button
                  size="sm"
                  variant={selectedEventType === 'upcoming' ? 'default' : 'outline'}
                  onClick={() => setSelectedEventType('upcoming')}
                  className="text-xs h-8 px-3 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                >
                  Próximos Eventos
                </Button>
                <Button
                  size="sm"
                  variant={selectedEventType === 'past' ? 'default' : 'outline'}
                  onClick={() => setSelectedEventType('past')}
                  className="text-xs h-8 px-3 bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                >
                  Eventos Passados
                </Button>
              </div>
            </div>

            {/* Categorias Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-500 mr-1">Categorias:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Todas as Categorias' : cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Lista de Notícias em Ordem Cronológica */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">Carregando notícias...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
              Nenhuma notícia encontrada com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={item.id} to={`/noticias/${item.slug}`} className="group">
                  <Card className="border-slate-200 bg-white overflow-hidden hover:shadow-lg transition h-full flex flex-col">
                    <div className="h-52 overflow-hidden relative bg-slate-200">
                      <img
                        src={getImageSrc(item, 'news')}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <Badge className="bg-blue-900 text-white text-[11px] font-semibold shadow">
                          {item.category}
                        </Badge>
                        {item.event_status === 'upcoming' && (
                          <Badge className="bg-purple-600 text-white text-[10px] font-semibold">
                            Próximo Evento
                          </Badge>
                        )}
                        {item.event_status === 'past' && (
                          <Badge className="bg-slate-800 text-white text-[10px] font-semibold">
                            Cobertura
                          </Badge>
                        )}
                      </div>
                      {item.video_url && (
                        <div className="absolute bottom-3 right-3 bg-red-600 text-white p-1.5 rounded-full shadow">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mb-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.published_at || 'Data não informada'}</span>
                          {item.event_date && (
                            <>
                              <span>•</span>
                              <span className="text-blue-700 font-semibold">
                                Evento: {item.event_date}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-blue-700 flex items-center gap-1 pt-2 border-t border-slate-100">
                        Acessar publicação completa <ArrowRight className="w-3.5 h-3.5" />
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
