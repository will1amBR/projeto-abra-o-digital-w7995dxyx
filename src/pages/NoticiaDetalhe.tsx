import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { getNewsBySlug, getNews, getImageSrc } from '@/services/contentService'
import type { NewsItem } from '@/types/content'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  Share2,
  Tag,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function NoticiaDetalhe() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null)
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getNewsBySlug(slug).then((item) => {
      setNewsItem(item)
      setLoading(false)
      if (item) {
        getNews({ category: item.category }).then((list) => {
          setRelatedNews(list.filter((n) => n.id !== item.id).slice(0, 3))
        })
      }
    })
  }, [slug])

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: newsItem?.title,
          text: newsItem?.summary,
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({ title: 'Link copiado para a área de transferência!' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <InstitutionalHeader />
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Carregando publicação...
        </div>
        <InstitutionalFooter />
      </div>
    )
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <InstitutionalHeader />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Notícia não encontrada</h1>
          <p className="text-slate-600 text-sm">A matéria solicitada não existe ou foi removida.</p>
          <Button onClick={() => navigate('/noticias')} className="bg-blue-600">
            Voltar para Notícias
          </Button>
        </div>
        <InstitutionalFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb & Back */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/noticias')}
              className="text-xs text-slate-600 hover:text-slate-900 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar para Notícias
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="text-xs h-8">
              <Share2 className="w-3.5 h-3.5 mr-1.5" /> Compartilhar
            </Button>
          </div>

          {/* Article Header */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-blue-900 text-white text-xs font-semibold">
                {newsItem.category}
              </Badge>
              {newsItem.is_event && (
                <Badge className="bg-purple-600 text-white text-xs font-semibold">Evento</Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {newsItem.title}
            </h1>

            <p className="text-slate-600 text-base leading-relaxed font-medium">
              {newsItem.summary}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-y border-slate-200 py-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>
                  Publicado em: <strong>{newsItem.published_at || 'Recente'}</strong>
                </span>
              </div>
              {newsItem.event_date && (
                <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                  <Calendar className="w-4 h-4" />
                  <span>Data do Evento: {newsItem.event_date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg mb-10 bg-slate-200 max-h-[500px]">
            <img
              src={getImageSrc(newsItem, 'news')}
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Rich HTML Content */}
          <article
            className="prose prose-slate lg:prose-lg max-w-none text-slate-700 leading-relaxed space-y-6 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />

          {/* Video Section (if exists) */}
          {newsItem.video_url && (
            <div className="mt-10 p-6 bg-slate-900 rounded-2xl text-white space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Video className="w-5 h-5 text-red-400" /> Cobertura em Vídeo
              </h3>
              <p className="text-xs text-slate-300">
                Assista ao vídeo complementar da cobertura desta notícia ou evento.
              </p>
              <div className="pt-2">
                <a
                  href={newsItem.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
                >
                  <ExternalLink className="w-4 h-4" /> Assistir Vídeo no YouTube
                </a>
              </div>
            </div>
          )}

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Notícias Relacionadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((rel) => (
                  <Link key={rel.id} to={`/noticias/${rel.slug}`} className="group">
                    <Card className="border-slate-200 bg-white overflow-hidden hover:shadow-md transition h-full flex flex-col">
                      <div className="h-36 overflow-hidden bg-slate-200">
                        <img
                          src={getImageSrc(rel, 'news')}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col justify-between">
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 line-clamp-2">
                          {rel.title}
                        </h4>
                        <span className="text-[11px] text-blue-600 font-semibold mt-2 flex items-center gap-1">
                          Ler matéria <ChevronRight className="w-3 h-3" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <ColorStrip className="h-1.5" />
      <InstitutionalFooter />
    </div>
  )
}
