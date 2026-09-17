import React, { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import AbracoLogo from '@/components/brand/AbracoLogo'
import { ColorStrip } from '@/components/brand/ColorStrip'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.warn('404: Rota não encontrada:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-100 py-4 text-center">
        <Link to="/" className="inline-block">
          <AbracoLogo size="md" />
        </Link>
      </header>
      <ColorStrip className="h-1.5" />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <span className="text-6xl font-black text-[#ed0e58] block">404</span>
          <h1 className="text-2xl font-black text-slate-900">Página não encontrada</h1>
          <p className="text-sm text-slate-600">
            A página que você tentou acessar (
            <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded">
              {location.pathname}
            </code>
            ) não existe ou mudou de endereço.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button className="w-full bg-[#ed0e58] hover:bg-pink-600 text-white font-bold text-xs">
                <Home className="w-4 h-4 mr-1.5" /> Página Inicial
              </Button>
            </Link>
            <Link to="/abracolandia" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-900 hover:bg-purple-50 font-bold text-xs"
              >
                Hotsite Abraçolândia
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <ColorStrip className="h-1.5" />
      <footer className="bg-black text-slate-400 py-4 text-center text-xs">
        <p>
          &copy; {new Date().getFullYear()} Projeto Abraço by Glik Smart & Studio Artio. Todos os
          direitos reservados.
        </p>
      </footer>
    </div>
  )
}

export default NotFound
