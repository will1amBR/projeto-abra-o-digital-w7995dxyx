import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getSiteSettings } from '@/services/contentService'
import { Button } from '@/components/ui/button'
import {
  PartyPopper,
  Sparkles,
  Ticket,
  Music,
  Utensils,
  Smile,
  Award,
  Users,
  Clock,
  HeartHandshake,
  Menu,
  X,
  Instagram,
  Facebook,
  Youtube,
  Lock,
  ArrowLeft,
  ChevronRight,
  Flame,
  Gamepad2,
} from 'lucide-react'

export const AbracolandiaHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [socials, setSocials] = useState<any>({})
  const { user, isAdmin } = useAuth()
  const location = useLocation()

  useEffect(() => {
    getSiteSettings().then((res) => {
      if (res.social_links) setSocials(res.social_links)
    })
  }, [])

  const navLinks = [
    { name: 'A Festa', path: '/abracolandia/festa', icon: Music },
    { name: 'Convites / PDVs', path: '/abracolandia/convites', icon: Ticket },
    { name: 'Beneficiados', path: '/abracolandia/beneficiados', icon: HeartHandshake },
    { name: 'Patrocinadores', path: '/abracolandia/patrocinadores', icon: Award },
    { name: 'Voluntariado', path: '/abracolandia/voluntariado', icon: Users },
    { name: 'Festas Anteriores', path: '/abracolandia/festas-anteriores', icon: Clock },
  ]

  return (
    <header className="sticky top-0 z-50 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm transition-all">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 text-white text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Back to Institutional */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-bold text-amber-200 hover:text-white transition bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded-full text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Projeto Abraço (Institucional)
          </Link>

          <div className="flex items-center gap-4 ml-auto">
            {/* Socials */}
            <div className="flex items-center gap-3 text-pink-100">
              <a
                href={socials.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={socials.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={socials.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="h-3 w-px bg-white/30" />

            <Link
              to={isAdmin ? '/admin' : '/admin/login'}
              className="inline-flex items-center gap-1 text-[11px] text-pink-200 hover:text-amber-300 font-medium transition"
            >
              <Lock className="w-3 h-3" /> {isAdmin ? 'Painel CMS' : 'CMS'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Festive Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Festive Logo */}
          <Link to="/abracolandia" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 group-hover:rotate-6 transition-transform">
              <PartyPopper className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                  Abraçolândia
                </span>
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-purple-800 tracking-wider uppercase block">
                O Maior Festival Beneficente
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                      : 'text-purple-900 hover:bg-pink-100/70 hover:text-pink-700'
                  }`
                }
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/abracolandia/convites">
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs px-5 h-10 shadow-md rounded-2xl">
                <Ticket className="w-4 h-4 mr-1.5" /> Comprar Convite
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-2xl bg-pink-100 text-pink-700 hover:bg-pink-200 transition"
              aria-label="Abrir Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="xl:hidden bg-amber-50 border-b border-amber-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4">
          <Link
            to="/abracolandia"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-purple-900 hover:bg-pink-100"
          >
            🎪 Início da Abraçolândia
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold ${
                location.pathname === link.path
                  ? 'bg-pink-600 text-white'
                  : 'text-purple-900 hover:bg-pink-100'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-amber-200 space-y-2">
            <Link to="/abracolandia/convites" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl">
                <Ticket className="w-4 h-4 mr-2" /> Garantir Meu Convite
              </Button>
            </Link>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-center text-xs font-bold text-purple-800 hover:underline pt-2"
            >
              ← Voltar ao Portal Institucional do Projeto Abraço
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export const AbracolandiaFooter: React.FC = () => {
  const [socials, setSocials] = useState<any>({})

  useEffect(() => {
    getSiteSettings().then((res) => {
      if (res.social_links) setSocials(res.social_links)
    })
  }, [])

  return (
    <footer className="bg-slate-950 text-white border-t-4 border-pink-500 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <PartyPopper className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">
                Abraçolândia
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              O maior evento beneficente do Projeto Abraço. Uma celebração de música, alta
              gastronomia, parque infantil e bingo beneficente onde 100% da arrecadação é revertida
              para causas sociais.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={socials.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400 hover:text-white hover:bg-pink-600 transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={socials.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-600 transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={socials.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-600 transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-pink-400 uppercase tracking-wider">
              A Festa & Atrações
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/abracolandia/festa" className="hover:text-white transition">
                  Programação & Shows ao Vivo
                </Link>
              </li>
              <li>
                <Link to="/abracolandia/festa" className="hover:text-white transition">
                  Praça Gastronômica & Food Trucks
                </Link>
              </li>
              <li>
                <Link to="/abracolandia/festa" className="hover:text-white transition">
                  Mega Espaço Kids & Brinquedos
                </Link>
              </li>
              <li>
                <Link to="/abracolandia/festa" className="hover:text-white transition">
                  Super Bingo Beneficente
                </Link>
              </li>
              <li>
                <Link to="/abracolandia/festa" className="hover:text-white transition">
                  Estacionamento & Transporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider">
              Participe
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link
                  to="/abracolandia/convites"
                  className="hover:text-white text-amber-300 font-bold transition"
                >
                  🎟 Onde Comprar Convites (PDVs)
                </Link>
              </li>
              <li>
                <Link to="/abracolandia/voluntariado" className="hover:text-white transition">
                  Ser Voluntário na Festa
                </Link>
              </li>
              <li>
                <Link to="/abracolandia/beneficiados" className="hover:text-white transition">
                  Quem é Beneficiado com o Lucro
                </Link>
              </li>
              <li>
                <Link to="/abracolandia/patrocinadores" className="hover:text-white transition">
                  Cotas de Patrocínio (Diamante a Bronze)
                </Link>
              </li>
              <li>
                <Link to="/abracolandia/festas-anteriores" className="hover:text-white transition">
                  Galeria de Festas Anteriores
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              Projeto Abraço
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              A Abraçolândia é uma realização oficial da Associação Projeto Abraço (CNPJ
              12.345.678/0001-90).
            </p>
            <div className="pt-2">
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs bg-slate-900 text-blue-300 border-blue-900 hover:bg-blue-950"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Ir ao Site Institucional
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Abraçolândia • Projeto Abraço. 100% Solidário.</p>
          <div className="flex items-center gap-3 text-pink-400 font-semibold">
            <span>Música • Gastronomia • Espaço Kids • Bingo</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
