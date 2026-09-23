import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const SITE_DOMAIN = 'https://abraco.glikholding.com.br'
export const DEFAULT_OG_IMAGE =
  'https://img.usecurling.com/p/1600/900?q=children%20hospital%20visit%20volunteers'
export const DEFAULT_TITLE = 'Projeto Abraço — Faça da Diversão uma Boa Ação!'
export const DEFAULT_DESCRIPTION =
  'Projeto Abraço — Faça da Diversão uma Boa Ação! Conheça nossas ações sociais, voluntariado e a tradicional festa solidária Abraçolândia.'

interface RouteMeta {
  title: string
  description: string
  image?: string
  url?: string
}

const ROUTE_META_MAP: Record<string, RouteMeta> = {
  '/': {
    title: 'Projeto Abraço — Faça da Diversão uma Boa Ação!',
    description:
      'Projeto Abraço — Faça da Diversão uma Boa Ação! Há mais de 20 anos transformando solidariedade em alegria por meio de eventos e ações sociais.',
    image: DEFAULT_OG_IMAGE,
  },
  '/nossa-historia': {
    title: 'Nossa História — Projeto Abraço',
    description:
      'Conheça a história e trajetória do Projeto Abraço: mais de duas décadas promovendo assistência social, cultura e cidadania.',
    image: DEFAULT_OG_IMAGE,
  },
  '/voluntariado': {
    title: 'Voluntariado — Projeto Abraço',
    description:
      'Faça parte da nossa corrente de solidariedade! Cadastre-se como voluntário no Projeto Abraço.',
    image: DEFAULT_OG_IMAGE,
  },
  '/area-do-voluntario': {
    title: 'Área do Voluntário — Projeto Abraço',
    description:
      'Acompanhe seus pontos, missões sociais, conquistas e convide amigos para fazer parte do Projeto Abraço.',
    image: DEFAULT_OG_IMAGE,
  },
  '/noticias': {
    title: 'Notícias & Eventos — Projeto Abraço',
    description:
      'Fique por dentro das últimas notícias, entregas de doações e eventos realizados pelo Projeto Abraço.',
    image: DEFAULT_OG_IMAGE,
  },
  '/beneficiados': {
    title: 'Instituições & Comunidades Beneficiadas — Projeto Abraço',
    description:
      'Conheça as instituições assistenciais, creches, asilos e comunidades impactadas pelo Projeto Abraço.',
    image: DEFAULT_OG_IMAGE,
  },
  '/patrocinadores': {
    title: 'Patrocinadores & Empresas Apoiadoras — Projeto Abraço',
    description:
      'Empresas que acreditam e apoiam o propósito de fazer da diversão uma boa ação junto ao Projeto Abraço.',
    image: DEFAULT_OG_IMAGE,
  },
  '/abracolandia': {
    title: 'Abraçolândia 2027 — O Maior Festival Solidário | Projeto Abraço',
    description:
      'Abraçolândia 2027: Venha viver dias de pura alegria e solidariedade! Gastronomia, shows ao vivo, mega área infantil e bingo beneficente.',
    image: DEFAULT_OG_IMAGE,
  },
  '/abracolandia/a-festa': {
    title: 'A Festa — Abraçolândia 2027 | Projeto Abraço',
    description:
      'Todas as informações sobre a grande festa Abraçolândia: gastronomia, atrações musicais, espaço kids e muito mais!',
    image: DEFAULT_OG_IMAGE,
  },
  '/abracolandia/ingressos': {
    title: 'Ingressos Online — Abraçolândia 2027 | Projeto Abraço',
    description:
      'Garanta seu ingresso online para a Abraçolândia! 100% da arrecadação é revertida em projetos sociais e benfeitorias.',
    image: DEFAULT_OG_IMAGE,
  },
  '/abracolandia/convites': {
    title: 'Pontos de Convites — Abraçolândia 2027',
    description:
      'Encontre os pontos físicos oficiais para adquirir seu convite da festa Abraçolândia.',
    image: DEFAULT_OG_IMAGE,
  },
  '/abracolandia/bingo': {
    title: 'Super Bingo Solidário — Abraçolândia | Projeto Abraço',
    description:
      'Acompanhe o sorteio das pedras do Super Bingo da Abraçolândia em tempo real pelo seu smartphone!',
    image: DEFAULT_OG_IMAGE,
  },
  '/abracolandia/festas-anteriores': {
    title: 'Galeria de Festas Anteriores — Abraçolândia | Projeto Abraço',
    description:
      'Reviva os melhores momentos das edições anteriores da Abraçolândia e veja o impacto das arrecadações.',
    image: DEFAULT_OG_IMAGE,
  },
  '/abracolandia/beneficiados': {
    title: 'Instituições Beneficiadas pela Abraçolândia — Projeto Abraço',
    description:
      'Veja as instituições que recebem os recursos arrecadados durante o festival Abraçolândia.',
    image: DEFAULT_OG_IMAGE,
  },
  '/abracolandia/patrocinadores': {
    title: 'Patrocinadores da Abraçolândia — Projeto Abraço',
    description: 'Marcas e empresas que tornam possível a realização da grande festa Abraçolândia.',
    image: DEFAULT_OG_IMAGE,
  },
  '/abracolandia/voluntariado': {
    title: 'Voluntariado na Abraçolândia — Projeto Abraço',
    description:
      'Seja um voluntário na Abraçolândia! Ajude na organização, suporte, barracas e recreação infantil.',
    image: DEFAULT_OG_IMAGE,
  },
  '/demo': {
    title: 'Demonstração do Sistema — Projeto Abraço Digital',
    description:
      'Página central de demonstração e tour guiado do Projeto Abraço e da festa Abraçolândia.',
    image: DEFAULT_OG_IMAGE,
  },
}

function updateMetaTag(selector: string, attr: 'content' | 'href', value: string) {
  let element = document.head.querySelector(selector)
  if (!element) {
    // If not existing, create it
    if (selector.startsWith('meta[')) {
      const matchProperty = selector.match(/property="([^"]+)"/)
      const matchName = selector.match(/name="([^"]+)"/)
      element = document.createElement('meta')
      if (matchProperty) element.setAttribute('property', matchProperty[1])
      if (matchName) element.setAttribute('name', matchName[1])
      document.head.appendChild(element)
    } else if (selector.startsWith('link[')) {
      const matchRel = selector.match(/rel="([^"]+)"/)
      element = document.createElement('link')
      if (matchRel) element.setAttribute('rel', matchRel[1])
      document.head.appendChild(element)
    }
  }
  if (element) {
    element.setAttribute(attr, value)
  }
}

/**
 * RouteMetaSync updates head tags dynamically during client-side navigation.
 * Even though scrapers see index.html, modern browsers, bookmarks and webviews
 * observe runtime document updates.
 */
export function RouteMetaSync() {
  const location = useLocation()

  useEffect(() => {
    const meta = ROUTE_META_MAP[location.pathname] || {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      image: DEFAULT_OG_IMAGE,
    }

    const currentUrl = `${SITE_DOMAIN}${location.pathname}`
    const imageUrl = meta.image || DEFAULT_OG_IMAGE

    // Title & standard meta
    document.title = meta.title
    updateMetaTag('meta[name="description"]', 'content', meta.description)
    updateMetaTag('link[rel="canonical"]', 'href', currentUrl)

    // Open Graph
    updateMetaTag('meta[property="og:title"]', 'content', meta.title)
    updateMetaTag('meta[property="og:description"]', 'content', meta.description)
    updateMetaTag('meta[property="og:url"]', 'content', currentUrl)
    updateMetaTag('meta[property="og:image"]', 'content', imageUrl)
    updateMetaTag('meta[property="og:image:secure_url"]', 'content', imageUrl)
    updateMetaTag('meta[property="og:site_name"]', 'content', 'Projeto Abraço')

    // Twitter
    updateMetaTag('meta[name="twitter:title"]', 'content', meta.title)
    updateMetaTag('meta[name="twitter:description"]', 'content', meta.description)
    updateMetaTag('meta[name="twitter:image"]', 'content', imageUrl)
    updateMetaTag('meta[name="twitter:url"]', 'content', currentUrl)
  }, [location.pathname])

  return null
}
