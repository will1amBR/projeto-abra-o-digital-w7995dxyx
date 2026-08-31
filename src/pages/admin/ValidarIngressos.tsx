import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/layout/AdminLayout'
import { validateTicketApi, getAllTickets, formatCurrencyBRL } from '@/services/ticketService'
import type { TicketValidationResponse, TicketItem } from '@/types/content'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Camera,
  RefreshCw,
  Clock,
  UserCheck,
  ShieldCheck,
  ArrowLeft,
  Ticket,
  Users,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react'

export default function ValidarIngressos() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [inputCode, setInputCode] = useState('')
  const [validating, setValidating] = useState(false)
  const [result, setResult] = useState<TicketValidationResponse | null>(null)
  const [recentValidations, setRecentValidations] = useState<any[]>([])

  // Overall Stats
  const [allTickets, setAllTickets] = useState<TicketItem[]>([])
  const [loadingStats, setLoadingStats] = useState(true)

  // Camera scanner simulation / active camera state
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Load live statistics
  const loadStats = async () => {
    setLoadingStats(true)
    try {
      const tickets = await getAllTickets(500)
      setAllTickets(tickets)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingStats(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  // Clean up camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Audio beeps for fast validation feedback (Web Audio API)
  const playBeep = (type: 'success' | 'error' | 'warning') => {
    if (!soundEnabled) return
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)

      if (type === 'success') {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime) // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.2)
      } else if (type === 'warning') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime) // A4
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.3)
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime) // A3 (low buzz)
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.4)
      }
    } catch {
      /* intentionally ignored */
    }
  }

  // Camera start / stop
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      setIsCameraActive(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        setIsCameraActive(true)
        toast({
          title: 'Câmera Ativada',
          description: 'Aponte para o QR Code do ingresso para realizar a leitura.',
        })
      } catch (err: any) {
        console.warn('Camera error:', err)
        toast({
          variant: 'destructive',
          title: 'Não foi possível acessar a câmera',
          description:
            'Verifique as permissões de vídeo do navegador ou utilize o campo de digitação manual.',
        })
      }
    }
  }

  // Execute validation
  const handleValidate = async (codeToTest: string, confirmEntry = true) => {
    const code = codeToTest.trim().toUpperCase()
    if (!code) return

    setValidating(true)
    try {
      const res = await validateTicketApi(code, confirmEntry)
      setResult(res)

      if (res.status === 'validated_success' || res.status === 'valid') {
        playBeep('success')
        toast({
          title: '✓ ENTRADA LIBERADA!',
          description: `${res.ticket?.attendee_name} (${res.ticket?.category?.name})`,
        })
      } else if (res.status === 'already_used') {
        playBeep('warning')
        toast({
          variant: 'destructive',
          title: '⚠️ INGRESSO JÁ UTILIZADO!',
          description: res.message,
        })
      } else {
        playBeep('error')
        toast({
          variant: 'destructive',
          title: '✗ INGRESSO INVÁLIDO OU NÃO ENCONTRADO',
          description: res.message || res.error,
        })
      }

      // Add to recent validations log
      setRecentValidations((prev) => [
        {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          code: code,
          status: res.status,
          attendee_name: res.ticket?.attendee_name || 'Desconhecido',
          category_name: res.ticket?.category?.name || '---',
          message: res.message,
        },
        ...prev.slice(0, 19),
      ])

      setInputCode('')
      loadStats()
    } catch (err: any) {
      playBeep('error')
      setResult({
        status: 'not_found',
        error: err.message || 'Código não encontrado',
        message: 'Código inválido ou inexistente no banco de dados.',
      })
    } finally {
      setValidating(false)
    }
  }

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault()
    handleValidate(inputCode, true)
  }

  // Computed Counters
  const totalSold = allTickets.length
  const totalUsed = allTickets.filter((t) => t.status === 'used').length
  const totalUnused = allTickets.filter((t) => t.status === 'unused').length

  return (
    <AdminLayout title="Controle de Portaria & Ingressos" activeNav="portaria">
      {/* Subheader action bar for scanner */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                  <ScanLine className="w-5 h-5 text-pink-500" /> Portaria Abraçolândia
                </h1>
                <Badge className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0">
                  ONLINE
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">
                Validação Oficial de Ingressos & Controle de Acesso
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                soundEnabled
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-800 text-slate-400'
              }`}
              title={soundEnabled ? 'Sons de Bip Ativados' : 'Sons Silenciados'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <Button
              size="sm"
              variant="outline"
              onClick={loadStats}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 h-8 px-2.5 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-900 text-slate-100 flex-1">
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6">
          {/* Real-time Counters Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Emitidos
              </span>
              <span className="text-xl sm:text-3xl font-black text-white mt-0.5 block">
                {totalSold}
              </span>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-700/80 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Entradas Validadas
              </span>
              <span className="text-xl sm:text-3xl font-black text-emerald-300 mt-0.5 block">
                {totalUsed}
              </span>
            </div>

            <div className="bg-purple-950/60 border border-purple-700/80 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-purple-400 uppercase tracking-wider block">
                Restantes na Fila
              </span>
              <span className="text-xl sm:text-3xl font-black text-purple-300 mt-0.5 block">
                {totalUnused}
              </span>
            </div>
          </div>

          {/* Action Panel: Scanner Camera + Manual Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leitor de Câmera / QR */}
            <Card className="bg-slate-800/90 border-slate-700 text-slate-100 rounded-3xl overflow-hidden shadow-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-black flex items-center justify-between">
                  <span className="flex items-center gap-2 text-white">
                    <Camera className="w-5 h-5 text-pink-400" /> Leitor por Câmera (QR Code)
                  </span>
                  <Button
                    size="sm"
                    onClick={toggleCamera}
                    className={`text-xs h-8 px-3 rounded-xl font-bold ${
                      isCameraActive
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-pink-600 hover:bg-pink-700 text-white'
                    }`}
                  >
                    {isCameraActive ? 'Parar Câmera' : 'Ativar Câmera'}
                  </Button>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Aponte a câmera do celular para o QR Code impresso ou na tela do visitante.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                <div className="relative aspect-video sm:aspect-square bg-slate-950 rounded-2xl border-2 border-slate-700 overflow-hidden flex items-center justify-center">
                  {isCameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Scanner target overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-2 border-pink-500 rounded-2xl relative animate-pulse shadow-lg shadow-pink-500/20">
                          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-amber-400 rounded-tl" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-amber-400 rounded-tr" />
                          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-amber-400 rounded-bl" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-amber-400 rounded-br" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 space-y-3">
                      <QrCode className="w-16 h-16 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Clique em <strong>Ativar Câmera</strong> acima para escanear ingressos em
                        tempo real.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Validação Manual por Código */}
            <Card className="bg-slate-800/90 border-slate-700 text-slate-100 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-base font-black flex items-center gap-2 text-white">
                    <Ticket className="w-5 h-5 text-purple-400" /> Digitação Manual do Código
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Digite o código alfanumérico do ingresso (Ex: <code>ABRA-A1B2C3D4</code>) ou ID.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  <form onSubmit={handleSubmitManual} className="space-y-3">
                    <div className="relative">
                      <Input
                        placeholder="Ex: ABRA-XXXXXX"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        className="bg-slate-950 border-slate-700 text-white font-mono text-base uppercase tracking-wider h-12 pl-4 pr-12 rounded-2xl"
                        autoFocus
                      />
                      <div className="absolute right-3 top-3 text-slate-400">
                        <Search className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="submit"
                        disabled={validating || !inputCode.trim()}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-11 rounded-xl shadow-lg"
                      >
                        {validating ? (
                          'Validando...'
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Check className="w-4 h-4" /> Validar & Liberar Entrada
                          </span>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={validating || !inputCode.trim()}
                        onClick={() => handleValidate(inputCode, false)}
                        className="w-full bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 text-xs h-11 rounded-xl"
                      >
                        Consultar Apenas
                      </Button>
                    </div>
                  </form>

                  {/* Exibição do Resultado da Leitura Atual */}
                  {result && (
                    <div className="pt-3 border-t border-slate-700/80 animate-in fade-in-50">
                      {result.status === 'validated_success' || result.status === 'valid' ? (
                        <div className="p-4 bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-emerald-300 font-black text-base">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                            <span>ENTRADA LIBERADA COM SUCESSO!</span>
                          </div>
                          <div className="text-xs text-emerald-100 space-y-1 pl-8">
                            <div>
                              <strong>Participante:</strong>{' '}
                              {result.ticket?.attendee_name || 'Titular'}
                            </div>
                            <div>
                              <strong>Categoria:</strong> {result.ticket?.category?.name}
                            </div>
                            <div>
                              <strong>Código:</strong>{' '}
                              <code className="font-mono bg-emerald-900 px-2 py-0.5 rounded">
                                {result.ticket?.ticket_code}
                              </code>
                            </div>
                            <div>
                              <strong>Comprador:</strong> {result.ticket?.order?.customer_name}
                            </div>
                          </div>
                        </div>
                      ) : result.status === 'already_used' ? (
                        <div className="p-4 bg-amber-950/80 border-2 border-amber-500 rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-amber-300 font-black text-base">
                            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                            <span>ATENÇÃO: INGRESSO JÁ UTILIZADO!</span>
                          </div>
                          <div className="text-xs text-amber-200 space-y-1 pl-8">
                            <p>{result.message}</p>
                            <div>
                              <strong>Nome:</strong> {result.ticket?.attendee_name}
                            </div>
                            <div>
                              <strong>Utilizado em:</strong> {result.ticket?.used_at}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-red-950/80 border-2 border-red-500 rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-red-300 font-black text-base">
                            <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                            <span>INGRESSO INVÁLIDO OU NÃO ENCONTRADO</span>
                          </div>
                          <p className="text-xs text-red-200 pl-8">
                            {result.message || result.error || 'Verifique o código digitado.'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </div>

              {/* Quick Demo QR shortcut for instant testing */}
              <div className="p-4 bg-slate-950 border-t border-slate-700/80 text-[11px] text-slate-400 flex items-center justify-between rounded-b-3xl">
                <span>Validador autenticado: {user?.name || user?.email}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Portaria Oficial
                </span>
              </div>
            </Card>
          </div>

          {/* Histórico de Validações Recentes */}
          <Card className="bg-slate-800/90 border-slate-700 text-slate-100 rounded-3xl overflow-hidden shadow-xl">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-black flex items-center justify-between">
                <span className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-amber-400" /> Leituras e Validações Recentes nesta
                  Sessão ({recentValidations.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {recentValidations.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Nenhuma leitura efetuada nesta sessão. Aponte a câmera ou digite um código acima.
                </div>
              ) : (
                <div className="divide-y divide-slate-700 text-xs">
                  {recentValidations.map((val) => (
                    <div key={val.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-[11px]">
                          {val.timestamp}
                        </span>
                        <div>
                          <strong className="text-white font-bold">{val.attendee_name}</strong>
                          <span className="text-slate-400 ml-2">({val.category_name})</span>
                          <div className="text-[10px] font-mono text-slate-400">{val.code}</div>
                        </div>
                      </div>
                      <Badge
                        className={
                          val.status === 'validated_success' || val.status === 'valid'
                            ? 'bg-emerald-600 text-white text-[10px]'
                            : val.status === 'already_used'
                              ? 'bg-amber-600 text-white text-[10px]'
                              : 'bg-red-600 text-white text-[10px]'
                        }
                      >
                        {val.status === 'validated_success'
                          ? 'Liberado'
                          : val.status === 'valid'
                            ? 'Válido'
                            : val.status === 'already_used'
                              ? 'Repetido'
                              : 'Inválido'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
