import React, { useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Send, Sparkles, User, RefreshCw, Copy, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created?: string
}

export const AdminAiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Olá! Sou o **Guia Abraço**, o assistente inteligente do Projeto Abraço e da Abraçolândia. Posso ajudar você a criar legendas atraentes para redes sociais, redigir notícias sobre ações e doações, resumir informações de patrocinadores ou tirar dúvidas sobre o histórico da instituição. Como posso ajudar hoje?',
    },
  ])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim()
    if (!textToSend || loading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
    }

    setMessages((prev) => [...prev, userMsg])
    if (!customPrompt) setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/agent-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: pb.authStore.token,
        },
        body: JSON.stringify({
          message: textToSend,
          conversation_id: conversationId,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro na comunicação com a IA')
      }

      if (data.conversation_id) {
        setConversationId(data.conversation_id)
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
        },
      ])
    } catch (err: any) {
      console.error(err)
      toast({
        variant: 'destructive',
        title: 'Falha na resposta da IA',
        description: err.message || 'Não foi possível consultar o Guia Abraço.',
      })
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            'Desculpe, tive uma instabilidade temporária ao consultar os dados. Por favor, tente novamente em instantes.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast({ title: 'Copiado para a área de transferência!' })
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <Card className="border-blue-200/60 shadow-md flex flex-col h-[650px] bg-slate-50/50">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 rounded-t-xl shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-1.5">
                Guia Abraço <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              </CardTitle>
              <p className="text-xs text-blue-100/90">
                Assistente de Conteúdo & Redes Sociais do Projeto Abraço
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-100 hover:text-white hover:bg-white/10 h-8 px-2 text-xs"
            onClick={() => {
              setMessages([
                {
                  id: 'welcome',
                  role: 'assistant',
                  content: 'Conversa reiniciada! Como posso te apoiar com os conteúdos agora?',
                },
              ])
              setConversationId(null)
            }}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Nova conversa
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col justify-between overflow-hidden gap-3">
        {/* Messages scroll */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm relative group ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed text-[13px]">{msg.content}</div>
                {msg.role === 'assistant' && msg.id !== 'welcome' && (
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="absolute -bottom-2 right-2 p-1 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-blue-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copiar texto"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 text-sm items-center text-slate-500 italic">
              <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span>Guia Abraço está pensando e consultando os dados...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 text-xs">
          <button
            onClick={() =>
              handleSend(
                'Sugira uma legenda para o Instagram sobre a doação de cestas básicas na Comunidade Esperança com emojis e hashtags.',
              )
            }
            className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full hover:bg-blue-100 transition whitespace-nowrap text-[11px]"
          >
            📸 Legenda Instagram (Cestas)
          </button>
          <button
            onClick={() =>
              handleSend(
                'Escreva um convite caloroso para voluntários participarem da Abraçolândia 2025.',
              )
            }
            className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full hover:bg-amber-100 transition whitespace-nowrap text-[11px]"
          >
            🎉 Chamada Voluntários (Abraçolândia)
          </button>
          <button
            onClick={() =>
              handleSend('Como posso descrever o pilar da Transparência no relatório anual?')
            }
            className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full hover:bg-emerald-100 transition whitespace-nowrap text-[11px]"
          >
            💎 Texto Transparência
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex items-end gap-2 pt-1 border-t border-slate-200">
          <Textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Pergunte algo ou peça para gerar um texto..."
            className="resize-none bg-white text-sm focus-visible:ring-blue-500"
          />
          <Button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-4 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
