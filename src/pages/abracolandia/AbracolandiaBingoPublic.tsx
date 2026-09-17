import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { BingoGame, getCurrentBingoGame, getBingoColumn } from '@/services/bingoService'
import { AbracolandiaHeader, AbracolandiaFooter } from '@/components/layout/AbracolandiaLayout'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AbracoLogo from '@/components/brand/AbracoLogo'
import {
  Trophy,
  Sparkles,
  PartyPopper,
  Tv,
  Gift,
  Volume2,
  RefreshCw,
  Clock,
  Award,
  Zap,
} from 'lucide-react'

export default function AbracolandiaBingoPublic() {
  const [game, setGame] = useState<BingoGame | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastDrawnEffect, setLastDrawnEffect] = useState(false)

  const loadGame = async () => {
    try {
      const currentGame = await getCurrentBingoGame()
      setGame(currentGame)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGame()

    // Inscrever no PocketBase Realtime para atualizações em tempo real no telão/celular do público
    pb.collection('bingo_games').subscribe('*', (e) => {
      if (e.action === 'update' || e.action === 'create') {
        const newGame = e.record as unknown as BingoGame
        setGame(newGame)
        // Disparar efeito visual no último número
        setLastDrawnEffect(true)
        setTimeout(() => setLastDrawnEffect(false), 3000)
      }
    })

    return () => {
      pb.collection('bingo_games').unsubscribe('*')
    }
  }, [])

  const drawnList = game?.drawn_numbers || []
  const maxNumber = game?.max_number || 75
  const lastNumber = game?.last_number

  const columns = [
    { letter: 'B', color: 'from-pink-600 to-rose-600', badgeColor: 'bg-pink-600', range: [1, 15] },
    {
      letter: 'I',
      color: 'from-purple-600 to-fuchsia-600',
      badgeColor: 'bg-purple-600',
      range: [16, 30],
    },
    {
      letter: 'N',
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-600',
      range: [31, 45],
    },
    { letter: 'G', color: 'from-cyan-500 to-teal-600', badgeColor: 'bg-cyan-600', range: [46, 60] },
    {
      letter: 'O',
      color: 'from-orange-500 to-amber-500',
      badgeColor: 'bg-orange-500',
      range: [61, 75],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      <AbracolandiaHeader />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Banner de Destaque Lúdico */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-purple-700 to-blue-800 p-6 lg:p-10 text-white shadow-2xl border-2 border-pink-400/30">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-xs font-black uppercase tracking-wider border border-white/20">
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                Painel Digital Oficial • Abraçolândia
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-md">
                {game?.title || 'Super Bingo Beneficente 2027'}
              </h1>
              <p className="text-sm sm:text-base text-pink-100 max-w-xl">
                Acompanhe os números cantados em tempo real na palma da sua mão ou nos telões do
                pavilhão. 100% da renda é revertida para as causas do Projeto Abraço!
              </p>
            </div>

            {/* Caixa do Prêmio em Destaque */}
            <div className="w-full lg:w-auto bg-slate-950/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-center lg:text-right shadow-xl">
              <div className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center justify-center lg:justify-end gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" /> Prêmio da Rodada
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                {game?.round_prize || 'Smart TV 55" 4K + Prêmios Especiais'}
              </div>
              <div className="text-xs text-pink-200 mt-1">
                {drawnList.length} bolas chamadas de {maxNumber}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BLOCO CENTRAL: DESTAQUE DO ÚLTIMO NÚMERO E HISTÓRICO RECENTE             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Último Número Sorteado (Gigante) */}
          <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-purple-500/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-radial from-purple-500/10 to-transparent pointer-events-none" />

            <span className="text-xs sm:text-sm font-black text-purple-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" /> Último Número Sorteado
            </span>

            {lastNumber ? (
              <div className="space-y-4">
                <div
                  className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl ${getBingoColumn(lastNumber).color} flex flex-col items-center justify-center shadow-2xl shadow-pink-500/40 border-4 border-white ${
                    lastDrawnEffect ? 'scale-110 ring-8 ring-amber-400' : ''
                  } transition-transform duration-500`}
                >
                  <span className="text-lg sm:text-xl font-black uppercase tracking-widest opacity-90 leading-none">
                    LETRA {getBingoColumn(lastNumber).letter}
                  </span>
                  <span className="text-7xl sm:text-8xl font-black leading-none drop-shadow-lg">
                    {lastNumber}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-300">
                  Total de Bolas Cantadas:{' '}
                  <span className="text-amber-400 font-black text-lg">{drawnList.length}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 space-y-2 text-slate-400">
                <Clock className="w-12 h-12 mx-auto text-slate-600 animate-pulse" />
                <p className="text-sm font-bold">Aguardando início do sorteio...</p>
                <p className="text-xs text-slate-500">
                  Fique atento à chamada do locutor no palco principal!
                </p>
              </div>
            )}
          </div>

          {/* Histórico das Últimas Bolas */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-pink-400" /> Últimos Números Cantados
                </h3>
                <span className="text-xs text-slate-400 font-semibold">
                  Ordem inversa (mais recentes primeiro)
                </span>
              </div>

              {drawnList.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  Nenhuma bola chamada até o momento.
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-4">
                  {drawnList
                    .slice(-12)
                    .reverse()
                    .map((num, idx) => {
                      const col = getBingoColumn(num)
                      return (
                        <div
                          key={num}
                          className={`p-3 rounded-2xl ${col.color} flex flex-col items-center justify-center text-center shadow-md transition ${
                            idx === 0
                              ? 'ring-4 ring-amber-400 scale-105 font-black'
                              : 'opacity-90 font-bold'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase opacity-80">
                            {col.letter}
                          </span>
                          <span className="text-xl sm:text-2xl font-black leading-tight">
                            {num}
                          </span>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>
                Fez a linha ou a cartela cheia? <strong>Avise o fiscal de mesa!</strong>
              </span>
              <span className="text-pink-400 font-bold">🎉 Boa Sorte!</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PAINEL DIGITAL: GRADE COMPLETA 1 A 75 (B-I-N-G-O)                         */}
        {/* ========================================================================= */}
        <section className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <PartyPopper className="w-6 h-6 text-pink-500" /> Grade Geral do Bingo (1 a 75)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Os números coloridos já foram cantados. Acompanhe na sua cartela!
              </p>
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-pink-600 inline-block" />
                <span className="text-slate-300 font-bold">B (1-15)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-purple-600 inline-block" />
                <span className="text-slate-300 font-bold">I (16-30)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-blue-600 inline-block" />
                <span className="text-slate-300 font-bold">N (31-45)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-cyan-600 inline-block" />
                <span className="text-slate-300 font-bold">G (46-60)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-orange-500 inline-block" />
                <span className="text-slate-300 font-bold">O (61-75)</span>
              </div>
            </div>
          </div>

          {/* As 5 Linhas do B-I-N-G-O */}
          <div className="space-y-3.5">
            {columns.map((col) => {
              const numbers: number[] = []
              for (let i = col.range[0]; i <= col.range[1]; i++) {
                numbers.push(i)
              }

              return (
                <div key={col.letter} className="flex items-center gap-2 sm:gap-3">
                  {/* Letra Cabeçalho */}
                  <div
                    className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${col.color} text-white font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-lg border border-white/20`}
                  >
                    {col.letter}
                  </div>

                  {/* 15 Números da Linha */}
                  <div className="grid grid-cols-5 sm:grid-cols-15 gap-1.5 sm:gap-2 flex-1">
                    {numbers.map((n) => {
                      const isDrawn = drawnList.includes(n)
                      const isLast = lastNumber === n

                      return (
                        <div
                          key={n}
                          className={`h-10 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xs sm:text-base select-none transition duration-300 ${
                            isLast
                              ? `bg-gradient-to-br ${col.color} text-white ring-4 ring-amber-300 scale-110 z-20 shadow-2xl animate-bounce`
                              : isDrawn
                                ? `bg-gradient-to-br ${col.color} text-white shadow-md shadow-black/40`
                                : 'bg-slate-800/40 text-slate-500 border border-slate-800/60'
                          }`}
                        >
                          {n}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA Comprar Cartela Extra ou Conhecer a Festa */}
        <section className="bg-gradient-to-r from-purple-900 via-pink-900 to-slate-900 rounded-3xl p-8 text-center text-white border border-pink-500/30 space-y-4">
          <h3 className="text-xl sm:text-2xl font-black">
            Quer concorrer com mais chances no próximo sorteio?
          </h3>
          <p className="text-xs sm:text-sm text-pink-200 max-w-xl mx-auto">
            Adquira cartelas avulsas diretamente nos pontos de caixa da Abraçolândia ou com nossos
            voluntários identificados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/abracolandia/a-festa">
              <Button className="bg-pink-600 hover:bg-pink-500 text-white font-black text-xs h-11 px-6 rounded-xl shadow-lg">
                Ver Atrações da Festa
              </Button>
            </Link>
            <Link to="/abracolandia/ingressos">
              <Button
                variant="outline"
                className="border-pink-400 text-pink-200 hover:bg-pink-950 text-xs h-11 px-6 rounded-xl"
              >
                Comprar Ingressos Online
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <ColorStrip className="h-1.5" />
      <AbracolandiaFooter />
    </div>
  )
}
