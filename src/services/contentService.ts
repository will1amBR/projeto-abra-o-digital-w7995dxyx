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

// Content Blocks
export async function getContentBlockBySlug(slug: string): Promise<ContentBlock | null> {
  try {
    return await pb.collection('content_blocks').getFirstListItem<ContentBlock>(`slug="${slug}"`)
  } catch {
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
