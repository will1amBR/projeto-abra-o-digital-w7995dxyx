import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  Sparkles,
  Ticket,
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import AbracoLogo from '@/components/brand/AbracoLogo'
import { ColorStrip } from '@/components/brand/ColorStrip'

interface LayoutProps {
  children: React.ReactNode
}

export const AbracolandiaHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Início', path: '/abracolandia' },
    { name: 'A Festa', path: '/abracolandia/a-festa' },
    { name: 'Ingressos Online', path: '/abracolandia/ingressos', highlight: true },
    { name: 'Convites', path: '/abracolandia/convites' },
    { name: 'Bingo Online', path: '/abracolandia/bingo' },
    { name: 'Festas Anteriores', path: '/abracolandia/festas-anteriores' },
    { name: 'Beneficiados', path: '/abracolandia/beneficiados' },
    { name: 'Patrocinadores', path: '/abracolandia/patrocinadores' },
    { name: 'Voluntariado', path: '/abracolandia/voluntariado' },
    { name: 'Site Institucional', path: '/' },
  ]

  const isActive = (path: string) => {
    if (path === '/abracolandia' && location.pathname === '/abracolandia') return true
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/abracolandia' && path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="bg-white sticky top-0 z-50 shadow-xs border-b border-slate-100">
      {/* Top Banner Aviso Festa */}
      <div className="bg-gradient-to-r from-[#ed0e58] via-[#8d198f] to-[#2e3192] text-white text-xs py-1.5 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        <span>Vem aí a Abraçolândia 2025! O maior evento solidário do ano!</span>
        <Link
          to="/abracolandia/ingressos"
          className="underline hover:text-yellow-200 font-extrabold ml-1 hidden sm:inline"
        >
          Garanta seu ingresso antecipado &rarr;
        </Link>
      </div>

      {/* Topo Centralizado: Logo Oficial + Slogan em Arco */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex flex-col items-center text-center">
          <Link
            to="/abracolandia"
            className="inline-flex flex-col items-center group transition transform hover:scale-[1.01]"
          >
            <AbracoLogo size="lg" className="mb-2" />
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#ed0e58] uppercase">
              FAÇA DA DIVERSÃO UMA BOA AÇÃO!
            </span>
          </Link>
        </div>
      </div>

      {/* Faixa Fina Colorida de 6 Cores */}
      <ColorStrip className="h-1.5" />

      {/* Menu de Navegação Horizontal Centralizado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between lg:justify-center py-2.5">
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 justify-center flex-wrap">
            {navLinks.map((link) => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                    link.highlight
                      ? 'bg-[#ed0e58] text-white shadow-xs hover:bg-[#8d198f]'
                      : active
                        ? 'bg-[#8d198f] text-white shadow-xs'
                        : 'text-slate-700 hover:text-[#ed0e58] hover:bg-slate-100'
                  }`}
                >
                  {link.highlight && <Ticket className="w-3.5 h-3.5 mr-0.5" />}
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden w-full flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#ed0e58] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Menu Abraçolândia
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const active = isActive(link.path)
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-lg transition ${
                  link.highlight
                    ? 'bg-[#ed0e58] text-white font-black'
                    : active
                      ? 'bg-[#8d198f] text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}

export const AbracolandiaFooter: React.FC = () => {
  return (
    <footer className="mt-auto">
      {/* 1. Barra Fina Colorida Superior */}
      <ColorStrip className="h-1.5" />

      {/* 2. Seção de Redes Sociais com Fundo Roxo (#8d198f) */}
      <section className="bg-[#8d198f] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-sm sm:text-base font-black tracking-wide uppercase">
                CONECTE-SE COM O PROJETO ABRAÇO & ABRAÇOLÂNDIA
              </h4>
              <p className="text-xs text-purple-200 mt-0.5">
                Acompanhe os preparativos da festa, as entregas das doações e histórias reais!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/projetoabraco"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#8d198f] flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/projetoabraco"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#8d198f] flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@projetoabraco"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#8d198f] flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Seção Principal de Contatos e História com Fundo Laranja (#f89c0e) */}
      <section className="bg-[#f89c0e] text-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Coluna 1: Logo e História */}
            <div className="space-y-4">
              <Link to="/abracolandia" className="inline-block">
                <AbracoLogo size="md" />
              </Link>
              <p className="text-xs leading-relaxed text-slate-900 font-medium">
                Criado em 2004 por William Robson, o Projeto Abraço une solidariedade e alegria,
                transformando a vida de milhares de famílias em situação de vulnerabilidade com
                total transparência e amor.
              </p>
              <Link
                to="/nossa-historia"
                className="inline-flex items-center gap-1 text-xs font-black text-slate-950 underline hover:text-white transition"
              >
                Conheça nossa trajetória completa &rarr;
              </Link>
            </div>

            {/* Coluna 2: A Festa Abraçolândia */}
            <div className="space-y-3">
              <h5 className="font-black text-xs uppercase tracking-wider text-slate-950 border-b-2 border-slate-950/20 pb-1">
                ABRAÇOLÂNDIA
              </h5>
              <ul className="space-y-2 text-xs font-semibold text-slate-900">
                <li>
                  <Link to="/abracolandia/a-festa" className="hover:text-white transition">
                    A Grande Festa Solidária
                  </Link>
                </li>
                <li>
                  <Link
                    to="/abracolandia/ingressos"
                    className="hover:text-white transition font-black text-slate-950 underline"
                  >
                    Comprar Ingressos Online
                  </Link>
                </li>
                <li>
                  <Link to="/abracolandia/convites" className="hover:text-white transition">
                    Pontos de Convites
                  </Link>
                </li>
                <li>
                  <Link to="/abracolandia/bingo" className="hover:text-white transition">
                    Bingo Oficial & Cartelas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/abracolandia/festas-anteriores"
                    className="hover:text-white transition"
                  >
                    Galeria de Festas Anteriores
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Institucional & Voluntariado */}
            <div className="space-y-3">
              <h5 className="font-black text-xs uppercase tracking-wider text-slate-950 border-b-2 border-slate-950/20 pb-1">
                INSTITUCIONAL
              </h5>
              <ul className="space-y-2 text-xs font-semibold text-slate-900">
                <li>
                  <Link to="/nossa-historia" className="hover:text-white transition">
                    Nossa História & Transparência
                  </Link>
                </li>
                <li>
                  <Link to="/voluntariado" className="hover:text-white transition">
                    Programa de Voluntariado
                  </Link>
                </li>
                <li>
                  <Link to="/area-do-voluntario" className="hover:text-white transition font-black">
                    Área do Voluntário (Gamificação)
                  </Link>
                </li>
                <li>
                  <Link to="/beneficiados" className="hover:text-white transition">
                    Famílias & Comunidades Beneficiadas
                  </Link>
                </li>
                <li>
                  <Link to="/patrocinadores" className="hover:text-white transition">
                    Empresas & Patrocinadores
                  </Link>
                </li>
                <li>
                  <Link to="/noticias" className="hover:text-white transition">
                    Notícias & Ações Recentes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 4: Contato Oficial */}
            <div className="space-y-3">
              <h5 className="font-black text-xs uppercase tracking-wider text-slate-950 border-b-2 border-slate-950/20 pb-1">
                CONTATO OFICIAL
              </h5>
              <div className="space-y-2.5 text-xs text-slate-900 font-semibold">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0 text-slate-950" />
                  <span>(11) 98516-7339</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-slate-950" />
                  <span>contato@projetoabraco.org.br</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-950 mt-0.5" />
                  <span>São Paulo - SP • Brasil</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/voluntariado"
                  className="inline-block bg-[#8d198f] hover:bg-[#2e3192] text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-xs"
                >
                  FAÇA PARTE COMO VOLUNTÁRIO
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Barra Preta de Copyright com Studio Artio */}
      <section className="bg-black text-slate-400 py-4 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} Projeto Abraço. Todos os direitos reservados.</p>
            <p className="text-slate-400">
              Desenvolvido por{' '}
              <span className="font-bold text-white tracking-wider">Studio Artio</span>
            </p>
          </div>
        </div>
      </section>
    </footer>
  )
}

export default function AbracolandiaLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AbracolandiaHeader />
      <main className="flex-1">{children}</main>
      <AbracolandiaFooter />
    </div>
  )
}
