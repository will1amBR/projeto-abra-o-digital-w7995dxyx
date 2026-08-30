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
  const [quemSomosBlock, setQuemSomosBlock] = useState<any>(null)
  const [queFazemosBlock, setQueFazemosBlock] = useState<any>(null)
  const [propositoBlock, setPropositoBlock] = useState<any>(null)
  const [timelineBlock, setTimelineBlock] = useState<any>(null)

  useEffect(() => {
    getContentBlocks('abraco').then((blocks) => {
      setQuemSomosBlock(blocks.find((b) => b.slug === 'quem-somos'))
      setQueFazemosBlock(blocks.find((b) => b.slug === 'o-que-fazemos'))
      setPropositoBlock(blocks.find((b) => b.slug === 'nosso-proposito'))
      setTimelineBlock(blocks.find((b) => b.slug === 'nossa-historia-linha-do-tempo'))
    })
  }, [])

  const timelineItems = [
    { year: '2005', title: 'Recreios do Abraço' },
    { year: '2006', title: 'O Mundo do Abraço' },
    { year: '2007', title: 'Delas e Feras' },
    { year: '2008', title: 'Abraçando a 3ª Idade' },
    { year: '2009', title: 'Mundo dos Carentes da Marambaia' },
    { year: '2010', title: 'Brincando nos Cuidados' },
    { year: '2011', title: 'Banda da Costa e Silva' },
    { year: '2012', title: 'Abraço na Comunidade do Inga' },
    { year: '2015', title: 'Huell Abraço Favorito' },
    { year: '2019', title: '2º Reino do Abraço – Carambola' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <main className="flex-1">
        {/* Banner de Topo da Página */}
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-pink-600 text-white text-xs px-3 py-1 font-bold uppercase tracking-wider">
                QUEM SOMOS?
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                QUEM SOMOS?
              </h1>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                O Projeto Abraço é uma organização não governamental, sem fins lucrativos, com
                atuação na área de assistência social. Há mais de 20 anos, um grupo de amigos
                realiza pequenas ações sociais e com o tempo, o pouco de cada um resultou em
                proporções maiores. Este grupo tinha um único objetivo, além de fazer da diversão
                uma boa ação, pois sempre dependeu do apoio e da alegria das pessoas, precisamos
                começar com muita alegria. E assim nasceu o Projeto Abraço.
              </p>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
            <HeartHandshake className="w-96 h-96 text-white" />
          </div>
        </section>

        {/* Bloco 1: QUEM SOMOS (Texto Ampliado) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-pink-600 text-xs font-bold uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full">
                <Users className="w-4 h-4" /> QUEM SOMOS
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Um projeto feito de pessoas para pessoas.
              </h2>
              <div className="prose prose-slate text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  O Projeto Abraço atua na realização de eventos e ações sociais que unem
                  solidariedade, inclusão, cidadania e participação. Ao longo de sua trajetória, o
                  projeto já beneficiou milhares de pessoas por meio de iniciativas direcionadas a
                  instituições assistenciais e comunidades, buscando contribuir para diferentes
                  necessidades e realidades.
                </p>
                <p>
                  Sua atuação alcança crianças, jovens, adultos e idosos, por meio de ações
                  educativas, assistenciais, culturais e recreativas. Mais do que promover uma ação
                  pontual, o Projeto Abraço busca reunir pessoas dispostas a colaborar e transformar
                  essa mobilização em benefícios para instituições e comunidades.
                </p>
                <p>
                  É um trabalho construído coletivamente, com a participação de voluntários,
                  parceiros, apoiadores e de todos aqueles que acreditam que pequenas atitudes podem
                  ganhar uma dimensão muito maior quando realizadas em conjunto.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
                <img
                  src="https://img.usecurling.com/p/1000/700?q=solidarity%20community%20people%20volunteer%20gathering"
                  alt="Quem Somos - Projeto Abraço"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-pink-600 text-white p-6 rounded-2xl shadow-xl hidden sm:block max-w-xs">
                <span className="text-3xl font-extrabold text-amber-300 block">+20 Anos</span>
                <span className="text-xs text-pink-100 font-semibold">
                  De dedicação contínua e diversão que vira boa ação
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Bloco 2: O QUE FAZEMOS? */}
        <section className="bg-slate-100 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                O QUE FAZEMOS?
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Alegria que se transforma em impacto social.
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                Promovemos eventos e ações sociais gerando, a fim de proporcionar um projeto de
                benfeitoria para instituições assistenciais e comunidades carentes em todo
                território nacional. Nosso trabalho beneficia crianças, jovens, adultos e idosos.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 max-w-4xl mx-auto space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>
                O Projeto Abraço promove eventos e ações sociais com o objetivo de gerar recursos e
                viabilizar projetos de benfeitoria para instituições assistenciais e comunidades
                carentes. As iniciativas são desenvolvidas buscando atender necessidades reais das
                instituições e dos públicos beneficiados.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-center text-xs font-bold">
                <span className="bg-blue-50 text-blue-800 p-2.5 rounded-lg border border-blue-100">
                  Assistência Social
                </span>
                <span className="bg-purple-50 text-purple-800 p-2.5 rounded-lg border border-purple-100">
                  Educação
                </span>
                <span className="bg-pink-50 text-pink-800 p-2.5 rounded-lg border border-pink-100">
                  Cultura & Esporte
                </span>
                <span className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100">
                  Saúde & Lazer
                </span>
              </div>
              <p>
                A atuação do projeto envolve diferentes áreas, entre elas: assistência social;
                educação; cultura; esporte; saúde; lazer; atividades recreativas; ações de inclusão
                e cidadania. O trabalho beneficia pessoas de diferentes faixas etárias, incluindo
                crianças, jovens, adultos e idosos.
              </p>
              <p>
                A proposta é simples na origem, mas ampla em seu alcance: mobilizar pessoas, criar
                experiências positivas e transformar essa participação em ações capazes de
                contribuir para a vida de outras pessoas.
              </p>
            </div>
          </div>
        </section>

        {/* Bloco 3: UMA HISTÓRIA CONSTRUÍDA AO LONGO DOS ANOS (LINHA DO TEMPO) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full">
              UMA HISTÓRIA CONSTRUÍDA AO LONGO DOS ANOS
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Linha do Tempo de Ações e Projetos
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A trajetória do Projeto Abraço não começou hoje. Desde 2005, diferentes projetos,
              ações e edições foram realizados, acompanhando diferentes públicos e necessidades.
              Entre os projetos e ações registrados ao longo dessa história estão:
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {timelineItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-pink-300 hover:shadow-md transition"
              >
                <div className="w-16 h-14 rounded-xl bg-gradient-to-br from-pink-600 to-purple-700 text-white flex items-center justify-center font-extrabold text-sm shadow-sm flex-shrink-0">
                  {item.year}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h3>
                  <span className="text-[11px] text-slate-500">Projeto & Ação Registrada</span>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto text-center mt-10 bg-slate-100 p-6 rounded-2xl border border-slate-200 text-slate-700 text-sm leading-relaxed font-medium">
            Essa história ajuda a mostrar que o Projeto Abraço não está baseado apenas na realização
            de um evento, mas em uma trajetória de mobilização social construída durante mais de
            duas décadas.
          </div>
        </section>

        {/* Bloco 4: NOSSO PROPÓSITO */}
        <section className="bg-slate-900 text-white py-16 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider bg-pink-500/10 border border-pink-500/30 px-3.5 py-1 rounded-full">
              NOSSO PROPÓSITO
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Faça da diversão uma boa ação
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              O Projeto Abraço acredita na capacidade das pessoas de transformar realidades quando
              se unem em torno de um propósito. Foi assim que pequenas ações realizadas por um grupo
              de amigos cresceram. Foi assim que nasceu uma história que já atravessa mais de duas
              décadas. E é assim que o projeto continua: reunindo pessoas, promovendo encontros e
              transformando participação em solidariedade. Porque um abraço pode representar
              acolhimento. Pode representar cuidado. Pode representar presença. E, quando muitas
              pessoas se unem, pode também representar transformação. Projeto Abraço. Faça da
              diversão uma boa ação.
            </p>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  )
}
