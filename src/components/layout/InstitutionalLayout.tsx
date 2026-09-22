import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getSiteSettings } from '@/services/contentService'
import { Button } from '@/components/ui/button'
import AbracoLogo from '@/components/brand/AbracoLogo'
import {
  HeartHandshake,
  Menu,
  X,
  Sparkles,
  Search,
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Lock,
  ArrowRight,
  PartyPopper,
  ShieldCheck,
  ChevronRight,
  Dice5,
  CreditCard,
} from 'lucide-react'

interface LayoutProps {
  children?: React.ReactNode
}

import ColorStrip from '@/components/brand/ColorStrip'

export const InstitutionalHeader: React.FC = () => {
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
    { name: 'Início', path: '/' },
    { name: 'Nossa História', path: '/nossa-historia' },
    { name: 'Voluntariado', path: '/voluntariado' },
    { name: 'Área do Voluntário', path: '/area-do-voluntario' },
    { name: 'Notícias & Eventos', path: '/noticias' },
    { name: 'Beneficiados', path: '/beneficiados' },
    { name: 'Patrocinadores', path: '/patrocinadores' },
    { name: 'Abraçolândia', path: '/abracolandia' },
  ]

  return (
    <header className="bg-white">
      {/* Top quick utility bar with administrative and direct links */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-pink-400 tracking-wider">PROJETO ABRAÇO</span>
            <span className="text-slate-400 hidden sm:inline">
              • Faça da diversão uma boa ação!
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              to="/abracolandia"
              className="text-pink-400 hover:text-pink-300 font-bold transition flex items-center gap-1"
            >
              <PartyPopper className="w-3 h-3" /> Hotsite Abraçolândia
            </Link>
            <div className="h-3 w-px bg-slate-700" />
            <Link
              to="/area-do-voluntario"
              className="text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Área do Voluntário
            </Link>
            <div className="h-3 w-px bg-slate-700" />
            <Link
              to={isAdmin ? '/admin' : '/admin/login'}
              className="text-slate-300 hover:text-amber-400 transition flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-amber-400" /> {isAdmin ? 'Painel CMS' : 'Login CMS'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header with Centered Logo & Slogan matching Mockup */}
      <div className="py-4 sm:py-6 px-4 bg-white flex flex-col items-center justify-center text-center">
        <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
          <AbracoLogo size="lg" variant="svg-transparent" showSubtitle={true} />
        </Link>
      </div>

      {/* Navigation menu bar */}
      <div className="border-t border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
          <nav className="hidden md:flex items-center justify-center flex-1 gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? 'text-pink-600 bg-pink-50 shadow-xs'
                      : 'text-slate-700 hover:text-pink-600 hover:bg-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex md:hidden items-center justify-between w-full">
            <span className="text-xs font-bold text-slate-600">Menu de Navegação</span>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition"
              aria-label="Abrir Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-bold ${
                location.pathname === link.path
                  ? 'bg-pink-50 text-pink-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <Link to="/voluntariado" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-[#ed0e58] hover:bg-pink-600 text-white font-bold text-xs h-9">
                Seja Voluntário
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Colorful 6-color Project Abraço strip divider below Header */}
      <ColorStrip height="h-[3.5px]" />
    </header>
  )
}

export const InstitutionalFooter: React.FC = () => {
  return (
    <footer>
      {/* Colorful 6-color Project Abraço strip divider */}
      <ColorStrip height="h-[3.5px]" />

      {/* Redes Sociais Section (Purple #8d198f) */}
      <section className="bg-[#8d198f] text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Siga nossas Redes!</h2>
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            <a
              href="https://instagram.com/projetoabraco"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Projeto Abraço"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white/90 flex items-center justify-center text-white hover:bg-white/15 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <Instagram className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2]" />
            </a>
            <a
              href="https://facebook.com/projetoabraco"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Projeto Abraço"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white/90 flex items-center justify-center text-white hover:bg-white/15 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <Facebook className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2]" />
            </a>
            <a
              href="https://youtube.com/@projetoabraco"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube Projeto Abraço"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white/90 flex items-center justify-center text-white hover:bg-white/15 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <Youtube className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2]" />
            </a>
          </div>
        </div>
      </section>

      {/* Colorful 6-color Project Abraço strip divider */}
      <ColorStrip height="h-[3.5px]" />

      {/* Rodapé / Contatos Section (Orange #f89c0e) */}
      <section className="bg-[#f89c0e] text-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Coluna 1: História */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
              Assim, nasceu o Projeto Abraço
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-900 font-medium text-justify">
              Há mais de 15 anos um grupo de amigos começou a realizar pequenas ações sociais que,
              com o tempo, cresceram em escala e participação. Mais pessoas e voluntários se
              envolveram organizando eventos com o lema de transformar diversão em boa ação,
              acreditando que a alegria é essencial para fazer a diferença na vida das pessoas.
            </p>
          </div>

          {/* Coluna 2: Contatos */}
          <div className="space-y-4 md:pl-8">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
              Contatos
            </h3>
            <div className="space-y-2 text-sm sm:text-base text-slate-950">
              <p>
                <span className="font-extrabold">Telefone:</span>{' '}
                <a
                  href="tel:+5511983582888"
                  className="font-bold hover:underline hover:text-black transition"
                >
                  (11) 98358-2888
                </a>
              </p>
              <p>
                <span className="font-extrabold">E-mail:</span>{' '}
                <a
                  href="mailto:contato@projetoabraco.com.br"
                  className="font-bold hover:underline hover:text-black transition"
                >
                  contato@projetoabraco.com.br
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Colorful 6-color Project Abraço strip divider */}
      <ColorStrip height="h-[3.5px]" />

      {/* Copyright Bar (Escuro) */}
      <div className="bg-[#222222] text-slate-300 py-3.5 px-4 text-center text-xs font-normal">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-center sm:text-left">
            Todos os Direitos Reservados @ 2026 - Projeto Abraço by Glik Smart & Studio Artio
          </span>
          <Link
            to="/demo"
            className="text-[11px] text-slate-400 hover:text-pink-400 transition underline underline-offset-2 opacity-80 hover:opacity-100"
          >
            Demonstração do Sistema
          </Link>
        </div>
      </div>
    </footer>
  )
}
