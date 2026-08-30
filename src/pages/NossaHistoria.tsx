import React, { useEffect, useState } from 'react'
import { InstitutionalHeader, InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import { getContentBlocks, getImageSrc } from '@/services/contentService'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  HeartHandshake,
  ShieldCheck,
  Users,
  Sparkles,
  History,
  Target,
  Compass,
} from 'lucide-react'

export default function NossaHistoria() {
  const [historyBlock, setHistoryBlock] = useState<any>(null)
  const [valuesBlock, setValuesBlock] = useState<any>(null)
  const [cultureBlock, setCultureBlock] = useState<any>(null)

  useEffect(() => {
    getContentBlocks('abraco').then((blocks) => {
      setHistoryBlock(blocks.find((b) => b.slug === 'nossa-historia-origens'))
      setValuesBlock(blocks.find((b) => b.slug === 'missao-visao-valores'))
      setCultureBlock(blocks.find((b) => b.slug === 'disseminacao-voluntariado'))
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <main className="flex-1">
        {/* Banner de Topo da Página */}
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-blue-600 text-white text-xs px-3 py-1 font-semibold">
                Nossa Trajetória
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Nossa História, Origens e Missão
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Conheça como a solidariedade e o amor ao próximo transformaram uma pequena ação em
                um porto seguro comunitário para milhares de famílias.
              </p>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
            <HeartHandshake className="w-96 h-96 text-white" />
          </div>
        </section>

        {/* Bloco 1: Origens e História */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                <History className="w-4 h-4" /> Desde as Primeiras Ações
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {historyBlock?.title || 'Como o Projeto Abraço Começou'}
              </h2>
              <div
                className="prose prose-slate text-sm sm:text-base text-slate-600 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html:
                    historyBlock?.body ||
                    `
                    <p>O Projeto Abraço nasceu da união de voluntários comprometidos em não fechar os olhos diante da vulnerabilidade social. Iniciamos com sopas comunitárias e hoje mantemos uma infraestrutura permanente de assistência integral, reformas e capacitação profissional.</p>
                  `,
                }}
              />
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
                <img
                  src={
                    historyBlock?.image_url ||
                    'https://img.usecurling.com/p/1000/700?q=volunteers%20group%20helping%20hands%20community'
                  }
                  alt="História do Projeto Abraço"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-blue-900 text-white p-6 rounded-2xl shadow-xl hidden sm:block max-w-xs">
                <span className="text-3xl font-extrabold text-amber-400 block">+12 Anos</span>
                <span className="text-xs text-blue-200 font-medium">
                  De dedicação contínua e amor ao próximo
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Bloco 2: Missão, Visão e Pilares */}
        <section className="bg-white py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                Nossos Alicerces
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                {valuesBlock?.title || 'Missão, Visão e Valores Fundamentais'}
              </h2>
              <div
                className="text-slate-600 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: valuesBlock?.body || '' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Inclusão */}
              <Card className="border-blue-100 bg-gradient-to-b from-blue-50/50 to-white shadow-sm hover:shadow-md transition">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Inclusão</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Criamos espaços, projetos e oportunidades onde todas as pessoas se sintam
                    integradas, acolhidas, ouvidas e respeitadas em sua individualidade e
                    integridade humana.
                  </p>
                </CardContent>
              </Card>

              {/* Solidariedade */}
              <Card className="border-amber-100 bg-gradient-to-b from-amber-50/50 to-white shadow-sm hover:shadow-md transition">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
                    <HeartHandshake className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Solidariedade</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Transformamos o sentimento de empatia em ações concretas, ágeis e eficientes que
                    geram impacto real, imediato e transformador na vida de quem mais precisa.
                  </p>
                </CardContent>
              </Card>

              {/* Transparência */}
              <Card className="border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white shadow-sm hover:shadow-md transition">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Transparência</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Garantimos que cada doação financeira, alimento arrecadado e esforço voluntário
                    cheguem diretamente a quem mais necessita, com prestação de contas pública e
                    rigorosa.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Bloco 3: Disseminação do Voluntariado */}
        {cultureBlock && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xl">
              <div className="space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Disseminação Comunitária
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold">{cultureBlock.title}</h3>
                <div
                  className="text-slate-300 text-sm leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: cultureBlock.body }}
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-700">
                <img
                  src={
                    cultureBlock.image_url ||
                    'https://img.usecurling.com/p/800/500?q=volunteers%20meeting%20training%20community'
                  }
                  alt="Cultura do Voluntariado"
                  className="w-full h-[320px] object-cover"
                />
              </div>
            </div>
          </section>
        )}
      </main>

      <InstitutionalFooter />
    </div>
  )
}
