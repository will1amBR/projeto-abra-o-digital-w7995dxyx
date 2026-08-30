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
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Bar for Socials & Contact & Hotsite Switch */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> São Paulo, SP
            </span>
            <a
              href={`mailto:${socials.email || 'contato@projetoabraco.org.br'}`}
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />{' '}
              {socials.email || 'contato@projetoabraco.org.br'}
            </a>
            <a
              href={socials.whatsapp || 'https://wa.me/5511999998888'}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 hover:text-white transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> {socials.phone || '(11) 3234-5678'}
            </a>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={socials.instagram || 'https://instagram.com/projetoabracoficial'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-400 transition"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={socials.facebook || 'https://facebook.com/projetoabracoficial'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 transition"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={socials.youtube || 'https://youtube.com/@projetoabraco'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-400 transition"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="h-3 w-px bg-slate-700" />

            {/* Link direto para Área do Voluntário */}
            <Link
              to="/area-do-voluntario"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[11px] shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> Área do Voluntário
            </Link>

            {/* Link direto para Abraçolândia */}
            <Link
              to="/abracolandia"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px] shadow-sm transition"
            >
              <PartyPopper className="w-3.5 h-3.5 animate-bounce" /> Hotsite Abraçolândia
            </Link>

            {/* CMS Login link */}
            <Link
              to={isAdmin ? '/admin' : '/admin/login'}
              className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-amber-400 transition"
              title="Acesso Administrativo CMS"
            >
              <Lock className="w-3 h-3 text-amber-400" /> {isAdmin ? 'Painel CMS' : 'Login CMS'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Official Vector */}
          <Link to="/" className="flex items-center gap-3 group">
            <AbracoLogo size="md" variant="full" />
            <div className="hidden lg:block border-l-2 border-slate-200 pl-3">
              <span className="text-xs font-black text-slate-800 tracking-tight block">
                Projeto Abraço Oficial
              </span>
              <span className="text-[10px] font-bold text-pink-600 uppercase">
                Faça da Diversão uma Boa Ação
              </span>
            </div>
          </Link>
          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 shadow-xs'
                      : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/area-do-voluntario">
              <Button
                variant="outline"
                className="border-amber-400/80 bg-amber-50/70 hover:bg-amber-100 text-amber-900 font-bold text-xs px-3 h-10 rounded-xl"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> Área Gamificada
              </Button>
            </Link>
            <Link to="/voluntariado">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs px-4 h-10 shadow-sm rounded-xl">
                Quero Participar <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Abrir Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link
              to="/abracolandia"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-white"
            >
              <span className="flex items-center gap-2">
                <PartyPopper className="w-4 h-4" /> Ir para Abraçolândia (Hotsite)
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/voluntariado" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-blue-900 text-white mt-1">Quero Ser Voluntário</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export const InstitutionalFooter: React.FC = () => {
  const [socials, setSocials] = useState<any>({})

  useEffect(() => {
    getSiteSettings().then((res) => {
      if (res.social_links) setSocials(res.social_links)
    })
  }, [])

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Sobre */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AbracoLogo size="md" variant="full" />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Transformamos diversão em boa ação! Há mais de 15 anos unindo voluntários e empresas
              para mobilizar recursos e destinar a projetos de benfeitoria para instituições
              assistenciais.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={socials.instagram || 'https://instagram.com/projetoabracoficial'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={socials.facebook || 'https://facebook.com/projetoabracoficial'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={socials.youtube || 'https://youtube.com/@projetoabraco'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Nossos Pilares */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Missão & Valores
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Inclusão:</strong> Oportunidades onde todos se sintam integrados e
                  respeitados.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Solidariedade:</strong> Empatia transformada em impacto concreto e humano.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Transparência:</strong> Cada doação e esforço chegam diretamente a quem
                  precisa.
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Links Rápidos</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  to="/voluntariado"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400" /> Seja um Voluntário
                </Link>
              </li>
              <li>
                <Link
                  to="/area-do-voluntario"
                  className="text-amber-300 hover:text-amber-200 font-semibold transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Área do Voluntário (Pontos)
                </Link>
              </li>{' '}
              <li>
                <Link
                  to="/voluntariado"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" /> Seja um Voluntário
                </Link>
              </li>
              <li>
                <Link
                  to="/noticias"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" /> Notícias e Acontecimentos
                </Link>
              </li>
              <li>
                <Link
                  to="/beneficiados"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" /> Ações e Beneficiados
                </Link>
              </li>
              <li>
                <Link
                  to="/patrocinadores"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" /> Empresas Patrocinadoras
                </Link>
              </li>
              <li>
                <Link
                  to="/abracolandia"
                  className="hover:text-pink-400 text-pink-300 font-bold transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-pink-400" /> Hotsite Abraçolândia
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contato & Sede */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Sede & Contato
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{socials.address || 'Rua da Solidariedade, 450 - São Paulo/SP'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{socials.phone || '(11) 3234-5678'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{socials.email || 'contato@projetoabraco.org.br'}</span>
              </p>
            </div>
            <div className="pt-2">
              <Link to="/admin/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
                >
                  <Lock className="w-3 h-3 mr-1.5 text-amber-400" /> Acesso Restrito CMS
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Projeto Abraço. Todos os direitos reservados. Organização
            Sem Fins Lucrativos.
          </p>
          <div className="flex items-center gap-4">
            <span>Inclusão • Solidariedade • Transparência</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
