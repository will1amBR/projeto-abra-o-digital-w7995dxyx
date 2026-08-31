import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { getBeneficiaryBySlug, getBeneficiaries, getImageSrc } from '@/services/contentService'
import type { Beneficiary } from '@/types/content'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Gift,
  Video,
  Share2,
  Users,
  Building,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function BeneficiadoDetalhe() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null)
  const [related, setRelated] = useState<Beneficiary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getBeneficiaryBySlug(slug).then((item) => {
      setBeneficiary(item)
      setLoading(false)
      if (item) {
        getBeneficiaries().then((list) => {
          setRelated(list.filter((b) => b.id !== item.id).slice(0, 3))
        })
      }
    })
  }, [slug])

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: beneficiary?.title,
          text: beneficiary?.summary,
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
          Carregando informações da ação...
        </div>
        <InstitutionalFooter />
      </div>
    )
  }

  if (!beneficiary) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <InstitutionalHeader />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Ação / Beneficiado não encontrado</h1>
          <p className="text-slate-600 text-sm">
            O registro solicitado não existe ou foi modificado.
          </p>
          <Button onClick={() => navigate('/beneficiados')} className="bg-red-600 text-white">
            Voltar para Beneficiados
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
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/beneficiados')}
              className="text-xs text-slate-600 hover:text-slate-900 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar para Beneficiados
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="text-xs h-8">
              <Share2 className="w-3.5 h-3.5 mr-1.5" /> Compartilhar
            </Button>
          </div>

          {/* Action Header */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-red-600 text-white text-xs font-semibold">
                {beneficiary.type}
              </Badge>
              {beneficiary.site === 'abracolandia' && (
                <Badge className="bg-pink-600 text-white text-xs font-semibold">Abraçolândia</Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {beneficiary.title}
            </h1>

            {beneficiary.summary && (
              <p className="text-slate-600 text-base leading-relaxed font-medium">
                {beneficiary.summary}
              </p>
            )}

            {/* Quick Metadata Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-y border-slate-200 py-3 text-xs text-slate-700">
              {beneficiary.recipient_name && (
                <div className="bg-slate-100 p-2.5 rounded-lg">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    Beneficiado / Comunidade
                  </span>
                  <span className="font-semibold text-slate-900">{beneficiary.recipient_name}</span>
                </div>
              )}
              {beneficiary.quantity && (
                <div className="bg-slate-100 p-2.5 rounded-lg">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    Volume / Quantidade
                  </span>
                  <span className="font-semibold text-slate-900">{beneficiary.quantity}</span>
                </div>
              )}
              {beneficiary.location && (
                <div className="bg-slate-100 p-2.5 rounded-lg">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    Localização
                  </span>
                  <span className="font-semibold text-slate-900">{beneficiary.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg mb-10 bg-slate-200 max-h-[500px]">
            <img
              src={getImageSrc(beneficiary, 'beneficiaries')}
              alt={beneficiary.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Impact Stats Card (if available) */}
          {beneficiary.impact_stats && (
            <div className="mb-10 bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 rounded-2xl shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider text-red-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" /> Métricas de Impacto Desta Ação
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                {Object.entries(beneficiary.impact_stats).map(([k, v]) => (
                  <div key={k} className="bg-black/20 p-3 rounded-xl backdrop-blur-sm">
                    <span className="text-2xl sm:text-3xl font-extrabold block">{v}</span>
                    <span className="text-[11px] text-red-100 uppercase tracking-wider mt-1 block">
                      {k.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rich HTML Content Description */}
          <article
            className="prose prose-slate lg:prose-lg max-w-none text-slate-700 leading-relaxed space-y-6 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm"
            dangerouslySetInnerHTML={{ __html: beneficiary.description }}
          />

          {/* Video Section */}
          {beneficiary.video_url && (
            <div className="mt-10 p-6 bg-slate-900 rounded-2xl text-white space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Video className="w-5 h-5 text-red-400" /> Registro em Vídeo da Entrega
              </h3>
              <p className="text-xs text-slate-300">
                Acompanhe os momentos de emoção e depoimentos das famílias acolhidas.
              </p>
              <div className="pt-2">
                <a
                  href={beneficiary.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
                >
                  <ExternalLink className="w-4 h-4" /> Assistir Registro no YouTube
                </a>
              </div>
            </div>
          )}

          {/* Related Actions */}
          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Outras Ações Solidárias</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link key={rel.id} to={`/beneficiados/${rel.slug}`} className="group">
                    <Card className="border-slate-200 bg-white overflow-hidden hover:shadow-md transition h-full flex flex-col">
                      <div className="h-36 overflow-hidden bg-slate-200">
                        <img
                          src={getImageSrc(rel, 'beneficiaries')}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col justify-between">
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-red-700 line-clamp-2">
                          {rel.title}
                        </h4>
                        <span className="text-[11px] text-red-600 font-semibold mt-2 flex items-center gap-1">
                          Ver detalhes <ChevronRight className="w-3 h-3" />
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
