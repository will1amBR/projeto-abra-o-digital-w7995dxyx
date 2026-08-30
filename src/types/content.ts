export type SiteEnvironment = 'abraco' | 'abracolandia' | 'both'

export interface User {
  id: string
  email: string
  name: string
  role?: 'admin' | 'editor'
  avatar?: string
  created: string
  updated: string
}

export interface VolunteerProfile {
  id: string
  user_id: string
  display_name: string
  phone?: string
  city?: string
  bio?: string
  points: number
  level_name?: string
  referral_code: string
  referred_by_code?: string
  total_actions_completed: number
  total_donations_value: number
  total_volunteers_invited: number
  avatar_url?: string
  created: string
  updated: string
  expand?: {
    user_id?: User
  }
}

export interface VolunteerMission {
  id: string
  title: string
  description: string
  category: 'Indicação' | 'Doação' | 'Ação Social' | 'Divulgação' | 'Especial'
  points_reward: number
  icon_name?: string
  badge_reward_id?: string
  active: boolean
  deadline?: string
  difficulty: 'Fácil' | 'Médio' | 'Avançado' | 'Épico'
  instructions?: string
  order?: number
  created: string
  updated: string
}

export interface VolunteerBadge {
  id: string
  name: string
  description: string
  icon_name: string
  category: 'Geral' | 'Indicações' | 'Doações' | 'Presença' | 'Destaque'
  points_required: number
  color?: string
  rarity: 'Comum' | 'Raro' | 'Lendário' | 'Mestre'
  created: string
  updated: string
}

export interface VolunteerEarnedBadge {
  id: string
  volunteer_profile_id: string
  badge_id: string
  earned_at: string
  reason?: string
  created: string
  updated: string
  expand?: {
    badge_id?: VolunteerBadge
    volunteer_profile_id?: VolunteerProfile
  }
}

export interface VolunteerAction {
  id: string
  volunteer_profile_id: string
  mission_id?: string
  action_type: 'indicacao' | 'doacao' | 'acao_social' | 'divulgacao' | 'outro'
  title: string
  description: string
  proof_url?: string
  proof_file?: string
  points_claimed: number
  status: 'pending' | 'approved' | 'rejected'
  admin_feedback?: string
  reviewed_by?: string
  reviewed_at?: string
  donation_value?: number
  invited_email?: string
  created: string
  updated: string
  expand?: {
    volunteer_profile_id?: VolunteerProfile
    mission_id?: VolunteerMission
  }
}

export interface VolunteerLevelInfo {
  level: number
  name: string
  minPoints: number
  maxPoints: number
  icon: string
  badgeColor: string
  description: string
}

export interface SiteSettings {
  id: string
  key: string
  value: {
    instagram?: string
    facebook?: string
    youtube?: string
    whatsapp?: string
    email?: string
    phone?: string
    address?: string
    eventName?: string
    edition?: string
    dateStr?: string
    timeStr?: string
    venue?: string
    ticketPrice?: string
    kidsPolicy?: string
    [key: string]: any
  }
  created: string
  updated: string
}

export interface Banner {
  id: string
  site: 'abraco' | 'abracolandia'
  title: string
  subtitle?: string
  cta_text?: string
  cta_link?: string
  badge?: string
  image_url?: string
  image?: string
  active: boolean
  order: number
  created: string
  updated: string
}

export interface NewsItem {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category: 'Geral' | 'Evento' | 'Ação Social' | 'Voluntariado' | 'Transparência'
  event_date?: string
  is_event?: boolean
  event_status?: 'upcoming' | 'past' | 'none'
  image_url?: string
  image?: string
  video_url?: string
  gallery?: Array<{ url: string; caption?: string }>
  published_at?: string
  featured?: boolean
  created: string
  updated: string
}

export interface Beneficiary {
  id: string
  site: SiteEnvironment
  title: string
  slug: string
  type: string
  recipient_name?: string
  quantity?: string
  location?: string
  date?: string
  summary?: string
  description: string
  image_url?: string
  image?: string
  video_url?: string
  gallery?: Array<{ url: string; caption?: string }>
  impact_stats?: {
    [key: string]: string | number
  }
  created: string
  updated: string
}

export interface Sponsor {
  id: string
  name: string
  slug: string
  site: SiteEnvironment
  tier: 'Diamante' | 'Ouro' | 'Prata' | 'Bronze' | 'Apoiador'
  logo_url?: string
  logo?: string
  website?: string
  description: string
  since_year?: string
  order?: number
  featured?: boolean
  created: string
  updated: string
}

export interface VolunteerArea {
  id: string
  site: SiteEnvironment
  title: string
  slug: string
  description: string
  requirements?: string
  time_commitment?: string
  spots_available?: number
  icon_name?: string
  image_url?: string
  testimonials?: Array<{
    name: string
    role: string
    text: string
    avatar?: string
  }>
  created: string
  updated: string
}

export interface EventSection {
  id: string
  section_type: 'geral' | 'atracoes' | 'gastronomia' | 'espaco_kids' | 'bingo' | 'estacionamento'
  title: string
  subtitle?: string
  content: string
  items?: Array<any>
  image_url?: string
  image?: string
  order: number
  created: string
  updated: string
}

export interface TicketOutlet {
  id: string
  name: string
  type: 'Físico' | 'Online'
  city: string
  address?: string
  phone?: string
  opening_hours?: string
  url?: string
  price_info?: string
  available?: boolean
  description: string
  created: string
  updated: string
}

export interface PastEdition {
  id: string
  year: string
  theme: string
  slug: string
  summary?: string
  description: string
  raised_amount?: string
  attendance?: string
  benefited_families?: string
  image_url?: string
  image?: string
  video_url?: string
  gallery?: Array<{ url: string; caption?: string }>
  created: string
  updated: string
}

export interface ContentBlock {
  id: string
  site: SiteEnvironment
  slug: string
  title: string
  subtitle?: string
  body: string
  image_url?: string
  image?: string
  video_url?: string
  metadata?: {
    pilares?: Array<{
      nome: string
      descricao: string
    }>
    [key: string]: any
  }
  order?: number
  created: string
  updated: string
}

export interface VolunteerInscription {
  id: string
  name: string
  email: string
  phone: string
  city?: string
  area_interest: string
  environment: 'abraco' | 'abracolandia' | 'both'
  availability?: string
  message?: string
  status?: 'pending' | 'contacted' | 'approved' | 'archived'
  created: string
  updated: string
}
