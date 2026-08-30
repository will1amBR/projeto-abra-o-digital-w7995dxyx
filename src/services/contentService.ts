import pb from '@/lib/pocketbase/client'
import type {
  SiteSettings,
  Banner,
  NewsItem,
  Beneficiary,
  Sponsor,
  VolunteerArea,
  EventSection,
  TicketOutlet,
  PastEdition,
  ContentBlock,
  VolunteerInscription,
  SiteEnvironment,
} from '@/types/content'

export function getFileUrl(collectionName: string, recordId: string, filename?: string): string {
  if (!filename) return ''
  return pb.files.getUrl({ id: recordId, collectionName } as any, filename)
}

export function getImageSrc(
  item: { image?: string; image_url?: string; logo?: string; logo_url?: string; id?: string },
  collectionName?: string,
  fallback: string = 'https://img.usecurling.com/p/800/500?q=charity%20community',
): string {
  if (item.image && item.id && collectionName) {
    return getFileUrl(collectionName, item.id, item.image)
  }
  if (item.logo && item.id && collectionName) {
    return getFileUrl(collectionName, item.id, item.logo)
  }
  if (item.image_url) return item.image_url
  if (item.logo_url) return item.logo_url
  return fallback
}

// Site Settings
export async function getSiteSettings(): Promise<Record<string, any>> {
  try {
    const records = await pb.collection('site_settings').getFullList<SiteSettings>()
    const map: Record<string, any> = {}
    for (const r of records) {
      map[r.key] = r.value
    }
    return map
  } catch (err) {
    console.error('Error fetching site settings:', err)
    return {}
  }
}

export async function saveSiteSetting(key: string, value: any): Promise<void> {
  try {
    const existing = await pb
      .collection('site_settings')
      .getFirstListItem<SiteSettings>(`key="${key}"`)
      .catch(() => null)
    if (existing) {
      await pb.collection('site_settings').update(existing.id, { value })
    } else {
      await pb.collection('site_settings').create({ key, value })
    }
  } catch (err) {
    console.error(`Error saving site setting ${key}:`, err)
    throw err
  }
}

// Banners
export async function getBanners(
  site?: 'abraco' | 'abracolandia',
  activeOnly = true,
): Promise<Banner[]> {
  const filters: string[] = []
  if (site) filters.push(`site = "${site}"`)
  if (activeOnly) filters.push('active = true')

  return pb.collection('banners').getFullList<Banner>({
    filter: filters.length ? filters.join(' && ') : '',
    sort: 'order,created',
  })
}

// Official fallback texts for content blocks
export const OFFICIAL_CONTENT_BLOCKS: Record<string, Partial<ContentBlock>> = {
  'quem-somos': {
    slug: 'quem-somos',
    site: 'abraco',
    title: 'QUEM SOMOS?',
    subtitle: 'Um projeto feito de pessoas para pessoas.',
    body: '<p>O Projeto Abraço é uma organização não governamental, sem fins lucrativos, com atuação na área de assistência social. Há mais de 20 anos, um grupo de amigos realiza pequenas ações sociais e com o tempo, o pouco de cada um resultou em proporções maiores. Este grupo tinha um único objetivo, além de fazer da diversão uma boa ação, pois sempre dependeu do apoio e da alegria das pessoas, precisamos começar com muita alegria. E assim nasceu o Projeto Abraço.</p><p>Um projeto feito de pessoas para pessoas. O Projeto Abraço atua na realização de eventos e ações sociais que unem solidariedade, inclusão, cidadania e participação. Ao longo de sua trajetória, o projeto já beneficiou milhares de pessoas por meio de iniciativas direcionadas a instituições assistenciais e comunidades, buscando contribuir para diferentes necessidades e realidades. Sua atuação alcança crianças, jovens, adultos e idosos, por meio de ações educativas, assistenciais, culturais e recreativas. Mais do que promover uma ação pontual, o Projeto Abraço busca reunir pessoas dispostas a colaborar e transformar essa mobilização em benefícios para instituições e comunidades. É um trabalho construído coletivamente, com a participação de voluntários, parceiros, apoiadores e de todos aqueles que acreditam que pequenas atitudes podem ganhar uma dimensão muito maior quando realizadas em conjunto.</p>',
  },
  'o-que-fazemos': {
    slug: 'o-que-fazemos',
    site: 'abraco',
    title: 'O QUE FAZEMOS?',
    subtitle: 'Alegria que se transforma em impacto social.',
    body: '<p>Promovemos eventos e ações sociais gerando, a fim de proporcionar um projeto de benfeitoria para instituições assistenciais e comunidades carentes em todo território nacional. Nosso trabalho beneficia crianças, jovens, adultos e idosos.</p><p>Alegria que se transforma em impacto social. O Projeto Abraço promove eventos e ações sociais com o objetivo de gerar recursos e viabilizar projetos de benfeitoria para instituições assistenciais e comunidades carentes. As iniciativas são desenvolvidas buscando atender necessidades reais das instituições e dos públicos beneficiados. A atuação do projeto envolve diferentes áreas, entre elas: assistência social; educação; cultura; esporte; saúde; lazer; atividades recreativas; ações de inclusão e cidadania. O trabalho beneficia pessoas de diferentes faixas etárias, incluindo crianças, jovens, adultos e idosos. A proposta é simples na origem, mas ampla em seu alcance: mobilizar pessoas, criar experiências positivas e transformar essa participação em ações capazes de contribuir para a vida de outras pessoas.</p>',
  },
  'abracolandia-institucional': {
    slug: 'abracolandia-institucional',
    site: 'abraco',
    title: 'A ABRAÇOLÂNDIA',
    subtitle: 'Diversão que se transforma em uma boa ação.',
    body: '<p>O Projeto Abraço atua desde 2005 na organização da Abraçolândia, um evento social, cultural e recreativo. Toda renda obtida através deste evento é integralmente revertida em instituições e/ou comunidades carentes, previamente selecionadas, em forma de projetos de benfeitorias.</p><p>Diversão que se transforma em uma boa ação. Desde 2005, o Projeto Abraço realiza a Abraçolândia, um evento social, cultural e recreativo que se tornou parte importante da história do projeto. A Abraçolândia reúne entretenimento, convivência e solidariedade em torno de um propósito comum. A renda obtida por meio do evento é integralmente revertida para instituições e/ou comunidades carentes previamente selecionadas, por meio de projetos de benfeitoria. Esse modelo permite que a participação no evento vá além da diversão. Quem participa, apoia ou colabora com a Abraçolândia também passa a fazer parte da corrente de solidariedade criada pelo Projeto Abraço. Por isso, a Abraçolândia representa de maneira muito clara a essência do projeto: divertir, reunir pessoas e transformar essa energia em uma boa ação.</p>',
  },
  'nossa-historia-linha-do-tempo': {
    slug: 'nossa-historia-linha-do-tempo',
    site: 'abraco',
    title: 'UMA HISTÓRIA CONSTRUÍDA AO LONGO DOS ANOS',
    subtitle: 'A trajetória do Projeto Abraço não começou hoje.',
    body: '<p>A trajetória do Projeto Abraço não começou hoje. Desde 2005, diferentes projetos, ações e edições foram realizados, acompanhando diferentes públicos e necessidades. Entre os projetos e ações registrados ao longo dessa história estão:</p><ul><li><strong>2005</strong> – Recreios do Abraço</li><li><strong>2006</strong> – O Mundo do Abraço</li><li><strong>2007</strong> – Delas e Feras</li><li><strong>2008</strong> – Abraçando a 3ª Idade</li><li><strong>2009</strong> – Mundo dos Carentes da Marambaia</li><li><strong>2010</strong> – Brincando nos Cuidados</li><li><strong>2011</strong> – Banda da Costa e Silva</li><li><strong>2012</strong> – Abraço na Comunidade do Inga</li><li><strong>2015</strong> – Huell Abraço Favorito</li><li><strong>2019</strong> – 2º Reino do Abraço – Carambola</li></ul><p>Essa história ajuda a mostrar que o Projeto Abraço não está baseado apenas na realização de um evento, mas em uma trajetória de mobilização social construída durante mais de duas décadas.</p>',
  },
  'quem-beneficia': {
    slug: 'quem-beneficia',
    site: 'abraco',
    title: 'QUEM O PROJETO ABRAÇO BENEFICIA',
    subtitle: 'Um abraço que alcança diferentes gerações',
    body: '<p>O trabalho desenvolvido pelo Projeto Abraço não é direcionado a apenas um público. As ações podem beneficiar: crianças, jovens, adultos e idosos, sempre por meio de instituições, projetos e comunidades selecionados para receber as iniciativas realizadas pelo projeto. Cada ação parte da ideia de que diferentes públicos possuem necessidades diferentes. Por isso, os projetos desenvolvidos ao longo dos anos transitam por áreas como assistência social, educação, cultura, saúde, esporte, lazer e convivência.</p>',
  },
  'voluntariado-institucional': {
    slug: 'voluntariado-institucional',
    site: 'abraco',
    title: 'VOLUNTARIADO',
    subtitle: 'Faça parte dessa história',
    body: '<p>O Projeto Abraço é feito por pessoas. Pessoas que doam tempo, trabalho, conhecimento, apoio e disposição para ajudar a transformar cada iniciativa em realidade. Ser voluntário é uma das formas de participar dessa corrente. Ao longo das ações e eventos, diferentes pessoas se unem em torno de um objetivo comum, contribuindo para que os projetos possam chegar às instituições e aos públicos beneficiados. Se você acredita que a diversão também pode se transformar em uma boa ação, venha fazer parte do Projeto Abraço. Cadastre-se como voluntário.</p>',
  },
  'empresas-parceiros': {
    slug: 'empresas-parceiros',
    site: 'abraco',
    title: 'EMPRESAS E PARCEIROS',
    subtitle: 'Uma transformação construída em conjunto',
    body: '<p>A realização das ações do Projeto Abraço também depende da participação de empresas, patrocinadores, fornecedores e parceiros que acreditam no propósito do projeto. Essa colaboração ajuda a viabilizar eventos, estruturas, serviços e iniciativas que posteriormente se transformam em benefícios para as instituições selecionadas. Ao apoiar o Projeto Abraço, empresas e parceiros passam a integrar uma rede de pessoas e organizações mobilizadas em torno de uma finalidade social comum.</p>',
  },
  'nosso-proposito': {
    slug: 'nosso-proposito',
    site: 'abraco',
    title: 'NOSSO PROPÓSITO',
    subtitle: 'Faça da diversão uma boa ação',
    body: '<p>O Projeto Abraço acredita na capacidade das pessoas de transformar realidades quando se unem em torno de um propósito. Foi assim que pequenas ações realizadas por um grupo de amigos cresceram. Foi assim que nasceu uma história que já atravessa mais de duas décadas. E é assim que o projeto continua: reunindo pessoas, promovendo encontros e transformando participação em solidariedade. Porque um abraço pode representar acolhimento. Pode representar cuidado. Pode representar presença. E, quando muitas pessoas se unem, pode também representar transformação. Projeto Abraço. Faça da diversão uma boa ação.</p>',
  },
  'faca-parte-cta': {
    slug: 'faca-parte-cta',
    site: 'abraco',
    title: 'FAÇA PARTE!',
    subtitle: 'VAMOS FAZER DA DIVERSÃO UMA BOA AÇÃO!',
    body: '<p>Você também pode fazer parte dessa história. Participe das ações. Seja voluntário. Acompanhe o Projeto Abraço. Apoie nossos projetos.</p><p>Acesse <strong>projetoabraco.org.br</strong> e siga-nos no Instagram <strong>@projetoabraco</strong>. Cadastre-se como voluntário e FAÇA PARTE!</p>',
  },
  'apresentacao-geral': {
    slug: 'apresentacao-geral',
    site: 'abraco',
    title: 'PROJETO ABRAÇO',
    subtitle: 'Faça da diversão uma boa ação.',
    body: '<p>O Projeto Abraço é uma organização não governamental, sem fins lucrativos, que há mais de 20 anos desenvolve ações voltadas à assistência social, educação, cultura, esporte, saúde e lazer. Sua história nasceu da iniciativa de um grupo de amigos que começou realizando pequenas ações sociais. Com o passar do tempo, a participação de mais pessoas e a vontade de fazer a diferença fizeram com que essas iniciativas ganhassem novas proporções. O que começou com pequenos gestos se transformou em um projeto capaz de mobilizar voluntários, parceiros e apoiadores em torno de um mesmo propósito: transformar diversão, convivência e solidariedade em ações concretas para quem precisa. É dessa essência que nasce uma das frases que melhor traduz o Projeto Abraço: Faça da diversão uma boa ação.</p>',
  },
  'abracolandia-2025': {
    slug: 'abracolandia-2025',
    site: 'abracolandia',
    title: 'ABRAÇOLÂNDIA 2025 – O Mágico Circo do Abraço',
    subtitle: 'Reunindo diversão e solidariedade em uma grande ação social.',
    body: '<p>Em 2025, a Abraçolândia ganhou o tema "O Mágico Circo do Abraço", mantendo a proposta de reunir diversão e solidariedade em uma grande ação social. Na edição, foram definidas como instituições beneficiadas: ABRACO, Casa Safira, Associação Ikoi no Sono, Maternidade Jesus, José e Maria, Kibô-no-Iê, Associação Kodomo no Sono, Lar Pequeno Leão. A seleção de diferentes instituições reforça uma característica importante do Projeto Abraço: a possibilidade de alcançar públicos e necessidades distintas por meio de uma mesma mobilização.</p>',
  },
  'abracolandia-2026': {
    slug: 'abracolandia-2026',
    site: 'abracolandia',
    title: 'ABRAÇOLÂNDIA 2026',
    subtitle: 'A continuidade de uma história iniciada há mais de 20 anos.',
    body: '<p>O Projeto Abraço segue sua trajetória com uma nova edição da Abraçolândia em 2026. A construção de cada edição envolve uma rede de pessoas, empresas, parceiros e apoiadores que contribuem para tornar possível a realização do evento e, consequentemente, ampliar sua capacidade de gerar benefícios sociais. Mais do que colocar um evento de pé, cada nova Abraçolândia representa a continuidade de uma história iniciada há mais de 20 anos. Uma história construída por pessoas que acreditam que diversão e solidariedade podem caminhar juntas.</p>',
  },
}

// Content Blocks
export async function getContentBlockBySlug(slug: string): Promise<ContentBlock | null> {
  try {
    const record = await pb
      .collection('content_blocks')
      .getFirstListItem<ContentBlock>(`slug="${slug}"`)
    return record
  } catch {
    const fallback = OFFICIAL_CONTENT_BLOCKS[slug]
    if (fallback) {
      return {
        id: slug,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        slug,
        title: fallback.title || '',
        subtitle: fallback.subtitle || '',
        body: fallback.body || '',
        site: (fallback.site as any) || 'abraco',
        order: fallback.order || 0,
      }
    }
    return null
  }
}

export async function getContentBlocks(site?: SiteEnvironment): Promise<ContentBlock[]> {
  const filter = site && site !== 'both' ? `site = "${site}" || site = "both"` : ''
  return pb.collection('content_blocks').getFullList<ContentBlock>({
    filter,
    sort: 'order,created',
  })
}

// News
export async function getNews(options?: {
  featuredOnly?: boolean
  category?: string
  isEvent?: boolean
  search?: string
  limit?: number
}): Promise<NewsItem[]> {
  const filters: string[] = []
  if (options?.featuredOnly) filters.push('featured = true')
  if (options?.category && options.category !== 'all')
    filters.push(`category = "${options.category}"`)
  if (options?.isEvent !== undefined) filters.push(`is_event = ${options.isEvent}`)
  if (options?.search) {
    const q = options.search.replace(/"/g, '\\"')
    filters.push(`(title ~ "${q}" || summary ~ "${q}" || content ~ "${q}")`)
  }

  return pb.collection('news').getFullList<NewsItem>({
    filter: filters.join(' && '),
    sort: '-created',
    requestKey: null,
  })
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    return await pb.collection('news').getFirstListItem<NewsItem>(`slug="${slug}"`)
  } catch {
    return null
  }
}

// Beneficiaries
export async function getBeneficiaries(options?: {
  site?: SiteEnvironment
  type?: string
  search?: string
}): Promise<Beneficiary[]> {
  const filters: string[] = []
  if (options?.site && options.site !== 'both') {
    filters.push(`(site = "${options.site}" || site = "both")`)
  }
  if (options?.type && options.type !== 'all') {
    filters.push(`type = "${options.type}"`)
  }
  if (options?.search) {
    const q = options.search.replace(/"/g, '\\"')
    filters.push(
      `(title ~ "${q}" || recipient_name ~ "${q}" || summary ~ "${q}" || description ~ "${q}")`,
    )
  }

  return pb.collection('beneficiaries').getFullList<Beneficiary>({
    filter: filters.join(' && '),
    sort: '-created',
    requestKey: null,
  })
}

export async function getBeneficiaryBySlug(slug: string): Promise<Beneficiary | null> {
  try {
    return await pb.collection('beneficiaries').getFirstListItem<Beneficiary>(`slug="${slug}"`)
  } catch {
    return null
  }
}

// Sponsors
export async function getSponsors(options?: {
  site?: SiteEnvironment
  tier?: string
  search?: string
}): Promise<Sponsor[]> {
  const filters: string[] = []
  if (options?.site && options.site !== 'both') {
    filters.push(`(site = "${options.site}" || site = "both")`)
  }
  if (options?.tier && options.tier !== 'all') {
    filters.push(`tier = "${options.tier}"`)
  }
  if (options?.search) {
    const q = options.search.replace(/"/g, '\\"')
    filters.push(`(name ~ "${q}" || description ~ "${q}")`)
  }

  return pb.collection('sponsors').getFullList<Sponsor>({
    filter: filters.join(' && '),
    sort: 'order,created',
    requestKey: null,
  })
}

export async function getSponsorBySlug(slug: string): Promise<Sponsor | null> {
  try {
    return await pb.collection('sponsors').getFirstListItem<Sponsor>(`slug="${slug}"`)
  } catch {
    return null
  }
}

// Volunteer Areas
export async function getVolunteerAreas(options?: {
  site?: SiteEnvironment
  search?: string
}): Promise<VolunteerArea[]> {
  const filters: string[] = []
  if (options?.site && options.site !== 'both') {
    filters.push(`(site = "${options.site}" || site = "both")`)
  }
  if (options?.search) {
    const q = options.search.replace(/"/g, '\\"')
    filters.push(`(title ~ "${q}" || description ~ "${q}" || requirements ~ "${q}")`)
  }

  return pb.collection('volunteer_areas').getFullList<VolunteerArea>({
    filter: filters.join(' && '),
    sort: 'created',
    requestKey: null,
  })
}

export async function submitVolunteerInscription(
  data: Omit<VolunteerInscription, 'id' | 'created' | 'updated'>,
): Promise<VolunteerInscription> {
  return pb.collection('volunteer_inscriptions').create<VolunteerInscription>({
    ...data,
    status: 'pending',
  })
}

// Event Sections (Abraçolândia: A Festa)
export async function getEventSections(): Promise<EventSection[]> {
  return pb.collection('event_sections').getFullList<EventSection>({
    sort: 'order,created',
    requestKey: null,
  })
}

// Ticket Outlets
export async function getTicketOutlets(options?: {
  city?: string
  type?: string
  search?: string
}): Promise<TicketOutlet[]> {
  const filters: string[] = []
  if (options?.city && options.city !== 'all') {
    filters.push(`city ~ "${options.city}"`)
  }
  if (options?.type && options.type !== 'all') {
    filters.push(`type = "${options.type}"`)
  }
  if (options?.search) {
    const q = options.search.replace(/"/g, '\\"')
    filters.push(`(name ~ "${q}" || city ~ "${q}" || address ~ "${q}" || description ~ "${q}")`)
  }

  return pb.collection('ticket_outlets').getFullList<TicketOutlet>({
    filter: filters.join(' && '),
    sort: 'type,name',
    requestKey: null,
  })
}

// Past Editions
export async function getPastEditions(options?: { search?: string }): Promise<PastEdition[]> {
  const filters: string[] = []
  if (options?.search) {
    const q = options.search.replace(/"/g, '\\"')
    filters.push(`(year ~ "${q}" || theme ~ "${q}" || summary ~ "${q}" || description ~ "${q}")`)
  }

  return pb.collection('past_editions').getFullList<PastEdition>({
    filter: filters.join(' && '),
    sort: '-year',
    requestKey: null,
  })
}

export async function getPastEditionBySlug(slug: string): Promise<PastEdition | null> {
  try {
    return await pb
      .collection('past_editions')
      .getFirstListItem<PastEdition>(`slug="${slug}" || year="${slug}"`)
  } catch {
    return null
  }
}
