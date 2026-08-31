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
import AdminLayout from '@/components/layout/AdminLayout'

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
    <AdminLayout title="Autenticação Administrativa" showSubnav={false}>
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <div className="text-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-slate-500 hover:text-slate-900 mb-2 -ml-2 text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar ao Website
            </Button>

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl mb-3">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Painel Administrativo
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Gestão Integrada • Projeto Abraço & Abraçolândia
            </p>
          </div>

          <Card className="border-slate-200 bg-white text-slate-900 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-5">
              <CardTitle className="text-base text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" /> Acesso Restrito
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Entre com as credenciais de administrador institucional.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-5 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    E-mail do Administrador
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 text-xs h-10 rounded-xl"
                      placeholder="exemplo@projetoabraco.org.br"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 text-xs h-10 rounded-xl"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-0.5 flex items-center gap-1 text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Conta Administrador
                    Pré-configurada:
                  </span>
                  <span className="text-slate-700 font-medium">william@korenambiental.com</span>{' '}
                  (Senha:{' '}
                  <code className="text-amber-800 font-bold font-mono bg-amber-100 px-1 py-0.5 rounded">
                    Skip@Pass
                  </code>
                  )
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-0">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all h-11 rounded-xl text-xs"
                >
                  {loading ? 'Validando acesso...' : 'Entrar no Painel CMS'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
