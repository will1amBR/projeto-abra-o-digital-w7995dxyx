import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { HeartHandshake, Lock, Mail, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('william@korenambiental.com')
  const [password, setPassword] = useState('Skip@Pass')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      toast({
        title: 'Login efetuado com sucesso!',
        description: 'Bem-vindo ao Painel Administrativo do Projeto Abraço.',
      })
      navigate(from, { replace: true })
    } catch (err: any) {
      console.error(err)
      setError('Credenciais inválidas ou conta sem permissão de acesso.')
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Verifique seu e-mail e senha de administrador.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Website
          </Button>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-xl mb-4">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Painel Administrativo</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestão de Conteúdo • Projeto Abraço & Abraçolândia
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-900/90 text-white shadow-2xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" /> Acesso Restrito
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Entre com as credenciais de administrador institucional.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/40 border border-red-700/50 rounded-lg text-red-200 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  E-mail do Administrador
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                    placeholder="exemplo@projetoabraco.org.br"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-blue-950/40 border border-blue-800/30 rounded-md text-xs text-blue-300">
                <span className="font-semibold block mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Conta Administrador
                  Pré-configurada:
                </span>
                <span className="text-slate-300">william@korenambiental.com</span> (Senha padrão:{' '}
                <code className="text-amber-300 font-mono">Skip@Pass</code>)
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md transition-all h-10"
              >
                {loading ? 'Validando acesso...' : 'Entrar no Painel CMS'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
