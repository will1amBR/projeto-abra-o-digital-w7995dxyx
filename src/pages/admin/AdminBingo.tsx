import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import {
  BingoGame,
  getCurrentBingoGame,
  createOrResetBingoGame,
  drawNextRandomNumber,
  markManualNumber,
  undoLastDrawnNumber,
  updateBingoSettings,
  getBingoColumn,
} from '@/services/bingoService'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import {
  Sparkles,
  RefreshCw,
  RotateCcw,
  Volume2,
  Trophy,
  Tv,
  ArrowLeft,
  ExternalLink,
  Dice5,
  CheckCircle2,
  Flame,
  Award,
  Play,
  Pause,
  AlertTriangle,
} from 'lucide-react'

export default function AdminBingo() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [game, setGame] = useState<BingoGame | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  const [manualNumberInput, setManualNumberInput] = useState('')
  const [prizeInput, setPrizeInput] = useState('')
  const [titleInput, setTitleInput] = useState('')
  const [isSavingSettings, setIsSavingSettings] = useState(false)

  // Carregar dados e escutar atualizações Realtime
  const loadGame = async () => {
    try {
      const currentGame = await getCurrentBingoGame()
      if (!currentGame) {
        // Criar primeira partida automaticamente
        const created = await createOrResetBingoGame()
        setGame(created)
        setPrizeInput(created.round_prize || '')
        setTitleInput(created.title)
      } else {
        setGame(currentGame)
        setPrizeInput(currentGame.round_prize || '')
        setTitleInput(currentGame.title)
      }
    } catch (err) {
      console.error(err)
      toast({ variant: 'destructive', title: 'Erro ao carregar partida de bingo.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGame()

    // Inscrever no PocketBase Realtime
    pb.collection('bingo_games').subscribe('*', (e) => {
      if (e.action === 'update' || e.action === 'create') {
        setGame(e.record as unknown as BingoGame)
      }
    })

    return () => {
      pb.collection('bingo_games').unsubscribe('*')
    }
  }, [])

  // Sorteio Aleatório Automático
  const handleDrawNextRandom = async () => {
    if (!game) return
    setIsDrawing(true)
    try {
      const result = await drawNextRandomNumber(game.id, user?.name || 'Equipe Palco')
      setGame(result.game)
      toast({
        title: `🎉 Número Sorteado: ${result.drawnNumber}!`,
        description: `Letra ${getBingoColumn(result.drawnNumber).letter} - Número ${result.drawnNumber}`,
      })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Não foi possível sortear',
        description: err.message,
      })
    } finally {
      setIsDrawing(false)
    }
  }

  // Marcar Manualmente (Globo Físico)
  const handleMarkManual = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!game || !manualNumberInput.trim()) return
    const num = parseInt(manualNumberInput, 10)
    if (isNaN(num)) {
      toast({ variant: 'destructive', title: 'Informe um número válido.' })
      return
    }

    try {
      const result = await markManualNumber(game.id, num, 'Globo Físico')
      setGame(result.game)
      setManualNumberInput('')
      toast({
        title: `Número ${num} Registrado!`,
        description: `Confirmado no painel da Abraçolândia.`,
      })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao marcar número',
        description: err.message,
      })
    }
  }

  // Desfazer último número
  const handleUndo = async () => {
    if (!game || !game.drawn_numbers || game.drawn_numbers.length === 0) return
    if (!window.confirm('Deseja realmente cancelar o último número sorteado?')) return

    try {
      const updated = await undoLastDrawnNumber(game.id)
      setGame(updated)
      toast({ title: 'Último número desfeito com sucesso.' })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao desfazer',
        description: err.message,
      })
    }
  }

  // Resetar Partida
  const handleResetGame = async () => {
    if (
      !window.confirm(
        '⚠️ ATENÇÃO: Deseja realmente RESETAR a partida de Bingo? Todos os números sorteados serão apagados e uma nova rodada começará.',
      )
    ) {
      return
    }

    try {
      const reset = await createOrResetBingoGame({
        title: titleInput || 'Super Bingo da Abraçolândia 2025',
        round_prize: prizeInput || 'Smart TV 55" + Prêmios Especiais',
      })
      setGame(reset)
      toast({
        title: 'Nova Partida Iniciada!',
        description: 'Painel resetado com sucesso para a próxima rodada.',
      })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao resetar',
        description: err.message,
      })
    }
  }

  // Salvar Título e Prêmio
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!game) return
    setIsSavingSettings(true)
    try {
      const updated = await updateBingoSettings(game.id, {
        title: titleInput,
        round_prize: prizeInput,
      })
      setGame(updated)
      toast({ title: 'Configurações da rodada atualizadas!' })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: err.message,
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  const drawnList = game?.drawn_numbers || []
  const maxNumber = game?.max_number || 75
  const lastNumber = game?.last_number

  // Colunas do Bingo B-I-N-G-O (1-15, 16-30, 31-45, 46-60, 61-75)
  const columns = [
    { letter: 'B', color: 'bg-pink-600', range: [1, 15] },
    { letter: 'I', color: 'bg-purple-600', range: [16, 30] },
    { letter: 'N', color: 'bg-blue-600', range: [31, 45] },
    { letter: 'G', color: 'bg-cyan-600', range: [46, 60] },
    { letter: 'O', color: 'bg-orange-500', range: [61, 75] },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-xs text-slate-300 hover:text-white hover:bg-slate-800 p-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> CMS
            </Button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 flex items-center justify-center text-white shadow-lg">
              <Dice5 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
                  Painel de Controle do Bingo • Equipe
                </h1>
                <Badge className="bg-pink-600 text-white text-[10px] font-bold">REALTIME</Badge>
              </div>
              <p className="text-xs text-slate-400">
                Sorteio de números, globo físico, prêmios e sincronização imediata com os telões
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/abracolandia/bingo', '_blank')}
              className="text-xs bg-pink-950/80 text-pink-200 border-pink-700 hover:bg-pink-900 font-bold"
            >
              <Tv className="w-3.5 h-3.5 mr-1.5 text-pink-400" /> Abrir Telão Público (Novo Tab)
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetGame}
              className="text-xs font-bold bg-red-600 hover:bg-red-700"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Resetar Partida
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-6 flex-1 space-y-6">
        {/* Top Control Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sorteador Principal (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs px-3 py-1 font-extrabold">
                  {game?.title || 'Partida de Bingo'}
                </Badge>
                <span className="text-xs text-slate-400">
                  {drawnList.length} de {maxNumber} sorteados (
                  {Math.round((drawnList.length / maxNumber) * 100)}%)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" /> Prêmio:{' '}
                <span className="text-amber-300 font-bold">
                  {game?.round_prize || 'Não especificado'}
                </span>
              </h2>
            </div>

            {/* Big Last Number Display */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6">
              <div className="text-center sm:text-left">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">
                  Último Número Chamado
                </span>
                {lastNumber ? (
                  <div className="flex items-center gap-4 mt-2">
                    <div
                      className={`w-24 h-24 rounded-3xl ${getBingoColumn(lastNumber).color} flex flex-col items-center justify-center shadow-2xl shadow-pink-500/20 border-4 animate-bounce`}
                    >
                      <span className="text-xs font-black uppercase tracking-widest leading-none">
                        {getBingoColumn(lastNumber).letter}
                      </span>
                      <span className="text-5xl font-black leading-none">{lastNumber}</span>
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">
                        Letra {getBingoColumn(lastNumber).letter}
                      </div>
                      <div className="text-xs text-slate-400">
                        Total chamados: <strong>{drawnList.length}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 font-bold text-base mt-2">
                    Nenhum número sorteado nesta rodada ainda.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                <Button
                  onClick={handleDrawNextRandom}
                  disabled={isDrawing || drawnList.length >= maxNumber}
                  className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-black text-base h-14 px-8 rounded-2xl shadow-lg shadow-pink-600/30 active:scale-95 transition"
                >
                  <Sparkles className="w-5 h-5 mr-2 text-amber-300" />
                  {isDrawing ? 'Sorteando...' : 'Sortear Próximo Aleatório'}
                </Button>

                {drawnList.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    className="border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white text-xs h-9 rounded-xl"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-400" /> Desfazer Última Bola (
                    {lastNumber})
                  </Button>
                )}
              </div>
            </div>

            {/* Marcar Manualmente (Globo Físico) */}
            <form
              onSubmit={handleMarkManual}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div className="text-left w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Dice5 className="w-4 h-4 text-cyan-400" /> Globo Físico / Entrada Manual:
                </span>
                <span className="text-[11px] text-slate-500">
                  Digite o número cantado pelo locutor (1 a {maxNumber})
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  type="number"
                  min="1"
                  max={maxNumber}
                  placeholder="Nº"
                  value={manualNumberInput}
                  onChange={(e) => setManualNumberInput(e.target.value)}
                  className="w-24 bg-slate-800 border-slate-700 text-white font-bold text-center text-base h-10"
                />
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs h-10 px-4"
                >
                  Confirmar Bola
                </Button>
              </div>
            </form>
          </div>

          {/* Configurações da Rodada & Histórico Recente (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Editar Prêmio / Rodada */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4" /> Configurar Rodada & Prêmio
              </h3>
              <form onSubmit={handleSaveSettings} className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                    Título da Partida
                  </label>
                  <Input
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white text-xs h-9"
                    placeholder="Ex: Rodada Especial - Carro 0km"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                    Prêmio em Destaque no Telão
                  </label>
                  <Input
                    value={prizeInput}
                    onChange={(e) => setPrizeInput(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white text-xs h-9 font-bold text-amber-300"
                    placeholder="Ex: Smart TV 55'' 4K ou Moto Elétrica"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSavingSettings}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs h-9 rounded-xl border border-slate-700"
                >
                  Atualizar Informações no Telão
                </Button>
              </form>
            </div>

            {/* Últimos 5 Números Sorteados */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center justify-between">
                <span>Histórico Recente</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {drawnList.length} chamados
                </span>
              </h3>

              {drawnList.length === 0 ? (
                <div className="text-xs text-slate-500 py-3 text-center">
                  Nenhum número sorteado ainda.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {drawnList
                    .slice(-8)
                    .reverse()
                    .map((num, idx) => {
                      const col = getBingoColumn(num)
                      return (
                        <div
                          key={num}
                          className={`px-3 py-1.5 rounded-xl ${col.color} flex items-center gap-1.5 font-black text-xs shadow-sm ${
                            idx === 0 ? 'ring-2 ring-white scale-105' : 'opacity-80'
                          }`}
                        >
                          <span className="text-[10px] opacity-75">{col.letter}</span>
                          <span className="text-sm">{num}</span>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grade Visual 1 a 75 (Visual B-I-N-G-O) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Dice5 className="w-5 h-5 text-pink-500" /> Grade Geral dos 75 Números
              </h3>
              <p className="text-xs text-slate-400">
                Os números em destaque já foram sorteados nesta rodada.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-pink-400 font-bold">
                <span className="w-3 h-3 rounded-full bg-pink-600 inline-block" /> Sorteado
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700 inline-block" />{' '}
                Disponível
              </span>
            </div>
          </div>

          {/* 5 Rows B-I-N-G-O */}
          <div className="space-y-3">
            {columns.map((col) => {
              const numbers: number[] = []
              for (let i = col.range[0]; i <= col.range[1]; i++) {
                numbers.push(i)
              }

              return (
                <div key={col.letter} className="flex items-center gap-2 sm:gap-3">
                  {/* Letter Header */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${col.color} text-white font-black text-lg sm:text-xl flex items-center justify-center shrink-0 shadow-md`}
                  >
                    {col.letter}
                  </div>

                  {/* Numbers row (15 numbers per letter) */}
                  <div className="grid grid-cols-5 sm:grid-cols-15 gap-1 sm:gap-2 flex-1">
                    {numbers.map((n) => {
                      const isDrawn = drawnList.includes(n)
                      const isLast = lastNumber === n

                      return (
                        <div
                          key={n}
                          onClick={() => {
                            if (!isDrawn) {
                              markManualNumber(game!.id, n, 'Clique na Grade')
                            }
                          }}
                          className={`h-9 sm:h-11 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm transition cursor-pointer select-none ${
                            isLast
                              ? `${col.color} text-white ring-4 ring-amber-400 scale-110 z-10 shadow-lg shadow-pink-500/50 animate-pulse`
                              : isDrawn
                                ? `${col.color} text-white shadow-md`
                                : 'bg-slate-800/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                          }`}
                          title={`Número ${n} (${isDrawn ? 'Sorteado' : 'Clique para marcar'})`}
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
        </div>
      </div>
    </div>
  )
}
