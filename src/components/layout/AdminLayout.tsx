import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ColorStrip } from '@/components/brand/ColorStrip'
import AbracoLogo from '@/components/brand/AbracoLogo'
import { InstitutionalFooter } from '@/components/layout/InstitutionalLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  CreditCard,
  Dice5,
  ScanLine,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Users,
  Sparkles,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  activeNav?: 'cms' | 'caixa' | 'bingo' | 'portaria'
  showSubnav?: boolean
}

export function AdminLayout({
  children,
  title,
  subtitle,
  activeNav = 'cms',
  showSubnav = true,
}: AdminLayoutProps) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Official Standard Header (Centered Logo + Slogan + Strip) */}
      <header className="bg-white border-b border-slate-100 shadow-xs relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2">
            {/* Logo Link to Admin or Public */}
            <Link to="/admin" className="inline-block transition-transform hover:scale-[1.02]">
              <AbracoLogo size="lg" variant="full" />
            </Link>

            {/* Slogan institucional oficial */}
            <p className="text-[11px] sm:text-xs font-black tracking-widest text-[#2e3192] uppercase">
              FAÇA DA DIVERSÃO UMA BOA AÇÃO!
            </p>
          </div>
        </div>

        {/* 6-Color Strip under header */}
        <ColorStrip className="h-1.5" />

        {/* Administrative Status & Quick Navigation Subbar */}
        {showSubnav && (
          <div className="bg-slate-900 text-white px-4 sm:px-8 py-2.5 border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Badge className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5">
                  ÁREA ADMINISTRATIVA
                </Badge>
                {title && (
                  <span className="text-xs font-bold text-slate-200 hidden sm:inline">
                    • {title}
                  </span>
                )}
              </div>

              {/* Quick links to Admin Modules */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <Link to="/admin">
                  <Button
                    size="sm"
                    variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                    className={`text-xs h-8 px-2.5 rounded-lg ${
                      location.pathname === '/admin'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1" /> CMS
                  </Button>
                </Link>

                <Link to="/admin/caixa">
                  <Button
                    size="sm"
                    variant={location.pathname === '/admin/caixa' ? 'default' : 'ghost'}
                    className={`text-xs h-8 px-2.5 rounded-lg ${
                      location.pathname === '/admin/caixa'
                        ? 'bg-[#ed0e58] text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-1" /> Caixa
                  </Button>
                </Link>

                <Link to="/admin/bingo">
                  <Button
                    size="sm"
                    variant={location.pathname === '/admin/bingo' ? 'default' : 'ghost'}
                    className={`text-xs h-8 px-2.5 rounded-lg ${
                      location.pathname === '/admin/bingo'
                        ? 'bg-[#8d198f] text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Dice5 className="w-3.5 h-3.5 mr-1 text-amber-300" /> Bingo
                  </Button>
                </Link>

                <Link to="/admin/validar-ingressos">
                  <Button
                    size="sm"
                    variant={location.pathname === '/admin/validar-ingressos' ? 'default' : 'ghost'}
                    className={`text-xs h-8 px-2.5 rounded-lg ${
                      location.pathname === '/admin/validar-ingressos'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <ScanLine className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Portaria
                  </Button>
                </Link>

                <Link to="/area-do-voluntario">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-8 px-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 hidden md:inline-flex"
                  >
                    <Users className="w-3.5 h-3.5 mr-1 text-amber-400" /> Painel Voluntários
                  </Button>
                </Link>

                <Link to="/abracolandia" target="_blank" rel="noreferrer">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-8 px-2 rounded-lg text-pink-300 hover:text-white hover:bg-slate-800 hidden lg:inline-flex"
                    title="Ver Hotsite Abraçolândia"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>

                <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block" />

                {user && (
                  <div className="items-center gap-2 hidden lg:flex">
                    <span className="text-[11px] text-slate-300 max-w-[120px] truncate">
                      {user.name || user.email}
                    </span>
                  </div>
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    logout()
                    navigate('/admin/login')
                  }}
                  className="text-xs h-8 px-2.5 rounded-lg bg-red-600 hover:bg-red-700"
                  title="Encerrar Sessão"
                >
                  <LogOut className="w-3.5 h-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">{children}</main>

      {/* Standard Unified Footer */}
      <ColorStrip className="h-1.5" />
      <InstitutionalFooter />
    </div>
  )
}

export default AdminLayout
