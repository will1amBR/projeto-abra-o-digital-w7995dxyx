import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { getSponsorBySlug, getSponsors, getImageSrc } from '@/services/contentService'
import type { Sponsor } from '@/types/content'
import { SponsorLogo } from '@/components/brand/SponsorLogo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  Globe,
  Award,
  Building,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react'

export default function PatrocinadorDetalhe() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [sponsor, setSponsor] = useState<Sponsor | null>(null)
  const [related, setRelated] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getSponsorBySlug(slug).then((item) => {
      setSponsor(item)
      setLoading(false)
      if (item) {
        getSponsors().then((list) => {
          setRelated(list.filter((s) => s.id !== item.id).slice(0, 3))
        })
      }
    })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <InstitutionalHeader />
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Carregando informações do patrocinador...
        </div>
        <InstitutionalFooter />
      </div>
    )
  }

  if (!sponsor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <InstitutionalHeader />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Patrocinador não encontrado</h1>
          <p className="text-slate-600 text-sm">
            A empresa solicitada não consta em nossos registros.
          </p>
          <Button onClick={() => navigate('/patrocinadores')} className="bg-blue-600">
            Voltar para Patrocinadores
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
          {/* Top Back */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/patrocinadores')}
              className="text-xs text-slate-600 hover:text-slate-900 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar para Patrocinadores
            </Button>
          </div>

          {/* Sponsor Profile Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-8">
              <div className="w-36 h-36 rounded-2xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-center shrink-0">
                <SponsorLogo
                  sponsor={sponsor}
                  size="xl"
                  className="w-full h-full shadow-none bg-transparent"
                />
              </div>
              <div className="space-y-3 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge
                    className={
                      sponsor.tier === 'Diamante'
                        ? 'bg-cyan-600 text-white'
                        : sponsor.tier === 'Ouro'
                          ? 'bg-amber-500 text-white'
                          : sponsor.tier === 'Prata'
                            ? 'bg-slate-400 text-white'
                            : 'bg-orange-600 text-white'
                    }
                  >
                    Cota {sponsor.tier}
                  </Badge>
                  {sponsor.since_year && (
                    <span className="text-xs text-slate-500">
                      Parceiro Oficial Desde {sponsor.since_year}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {sponsor.name}
                </h1>

                {sponsor.website && (
                  <div className="pt-1">
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                      <Globe className="w-3.5 h-3.5" /> Acessar site oficial da empresa{' '}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Description / Sobre a Empresa */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" /> Sobre a Parceria com o Projeto
                Abraço
              </h2>
              <article
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: sponsor.description }}
              />
            </div>
          </div>

          {/* Other Sponsors */}
          {related.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Outras Empresas Patrocinadoras</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link key={rel.id} to={`/patrocinadores/${rel.slug}`}>
                    <Card className="border-slate-200 bg-white hover:border-blue-300 transition">
                      <CardContent className="p-3 flex items-center gap-3">
                        <SponsorLogo
                          sponsor={rel}
                          size="sm"
                          showNameFallback={false}
                          className="w-12 h-12 shrink-0 shadow-none border border-slate-100"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{rel.name}</h4>
                          <span className="text-[10px] text-slate-400">{rel.tier}</span>
                        </div>
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
