import pb from '@/lib/pocketbase/client'
import type {
  VolunteerProfile,
  VolunteerMission,
  VolunteerBadge,
  VolunteerEarnedBadge,
  VolunteerAction,
  VolunteerLevelInfo,
} from '@/types/content'

// Level Progression Definition
export const VOLUNTEER_LEVELS: VolunteerLevelInfo[] = [
  {
    level: 1,
    name: 'Voluntário Iniciante',
    minPoints: 0,
    maxPoints: 499,
    icon: 'Sparkle',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Iniciando sua jornada do bem com os primeiros passos e acolhimento.',
  },
  {
    level: 2,
    name: 'Voluntário Dedicado',
    minPoints: 500,
    maxPoints: 1199,
    icon: 'Heart',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Atuação constante e apoio indispensável nas ações do Projeto Abraço.',
  },
  {
    level: 3,
    name: 'Guardião do Abraço',
    minPoints: 1200,
    maxPoints: 2499,
    icon: 'Shield',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Pilar fundamental que mobiliza equipes, doações e novos voluntários.',
  },
  {
    level: 4,
    name: 'Herói da Solidariedade',
    minPoints: 2500,
    maxPoints: 4999,
    icon: 'Award',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Liderança comunitária que transforma vidas e inspira centenas de pessoas.',
  },
  {
    level: 5,
    name: 'Lenda do Abraço',
    minPoints: 5000,
    maxPoints: 999999,
    icon: 'Crown',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Grau máximo de dedicação, amor ao próximo e impacto social permanente.',
  },
]

export function calculateLevelInfo(points: number): {
  currentLevel: VolunteerLevelInfo
  nextLevel: VolunteerLevelInfo | null
  progressPercent: number
  pointsToNext: number
} {
  const current =
    VOLUNTEER_LEVELS.slice()
      .reverse()
      .find((lvl) => points >= lvl.minPoints) || VOLUNTEER_LEVELS[0]

  const nextIndex = VOLUNTEER_LEVELS.findIndex((l) => l.level === current.level) + 1
  const nextLevel = nextIndex < VOLUNTEER_LEVELS.length ? VOLUNTEER_LEVELS[nextIndex] : null

  if (!nextLevel) {
    return {
      currentLevel: current,
      nextLevel: null,
      progressPercent: 100,
      pointsToNext: 0,
    }
  }

  const range = nextLevel.minPoints - current.minPoints
  const earnedInRange = points - current.minPoints
  const progressPercent = Math.min(100, Math.max(0, Math.round((earnedInRange / range) * 100)))
  const pointsToNext = Math.max(0, nextLevel.minPoints - points)

  return {
    currentLevel: current,
    nextLevel,
    progressPercent,
    pointsToNext,
  }
}

// Generate unique referral code
export function generateReferralCode(name: string): string {
  const clean = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 4)
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `${clean || 'VOL'}${rand}`
}

// 1. Volunteer Profile
export async function getVolunteerProfileByUserId(
  userId: string,
): Promise<VolunteerProfile | null> {
  try {
    return await pb
      .collection('volunteer_profiles')
      .getFirstListItem<VolunteerProfile>(`user_id = "${userId}"`)
  } catch {
    return null
  }
}

export async function getVolunteerProfileByReferralCode(
  code: string,
): Promise<VolunteerProfile | null> {
  try {
    return await pb
      .collection('volunteer_profiles')
      .getFirstListItem<VolunteerProfile>(`referral_code = "${code.toUpperCase()}"`)
  } catch {
    return null
  }
}

export async function createVolunteerProfile(data: {
  user_id: string
  display_name: string
  phone?: string
  city?: string
  bio?: string
  referred_by_code?: string
}): Promise<VolunteerProfile> {
  const refCode = generateReferralCode(data.display_name)
  const profile = await pb.collection('volunteer_profiles').create<VolunteerProfile>({
    user_id: data.user_id,
    display_name: data.display_name,
    phone: data.phone || '',
    city: data.city || '',
    bio: data.bio || '',
    points: 100, // Initial welcome bonus points
    level_name: 'Voluntário Iniciante',
    referral_code: refCode,
    referred_by_code: data.referred_by_code?.toUpperCase() || '',
    total_actions_completed: 0,
    total_donations_value: 0,
    total_volunteers_invited: 0,
    avatar_url: `https://img.usecurling.com/ppl/medium?seed=${Math.floor(Math.random() * 80) + 1}`,
  })

  // Award welcome badge "Primeiro Abraço"
  try {
    const welcomeBadge = await pb
      .collection('volunteer_badges')
      .getFirstListItem<VolunteerBadge>('name ~ "Primeiro Abraço"')
      .catch(() => null)
    if (welcomeBadge) {
      await pb.collection('volunteer_earned_badges').create({
        volunteer_profile_id: profile.id,
        badge_id: welcomeBadge.id,
        earned_at: new Date().toISOString().split('T')[0],
        reason: 'Bem-vindo ao time de voluntários do Projeto Abraço!',
      })
    }
  } catch (err) {
    console.warn('Could not award welcome badge:', err)
  }

  // If registered with a referral code, attribute action to referrer
  if (data.referred_by_code) {
    try {
      const referrer = await getVolunteerProfileByReferralCode(data.referred_by_code)
      if (referrer) {
        await pb.collection('volunteer_actions').create({
          volunteer_profile_id: referrer.id,
          action_type: 'indicacao',
          title: `Indicação de ${data.display_name}`,
          description: `Novo voluntário cadastrado com sucesso utilizando seu link/código (${data.referred_by_code.toUpperCase()}).`,
          points_claimed: 150,
          status: 'approved',
          reviewed_by: 'Sistema Automático de Indicação',
          reviewed_at: new Date().toISOString().split('T')[0],
        })

        // Update referrer points & invited count
        const newPoints = (referrer.points || 0) + 150
        const newInvited = (referrer.total_volunteers_invited || 0) + 1
        const { currentLevel } = calculateLevelInfo(newPoints)

        await pb.collection('volunteer_profiles').update(referrer.id, {
          points: newPoints,
          total_volunteers_invited: newInvited,
          level_name: currentLevel.name,
        })
      }
    } catch (err) {
      console.warn('Could not process referral bonus:', err)
    }
  }

  return profile
}

export async function updateVolunteerProfile(
  id: string,
  data: Partial<VolunteerProfile>,
): Promise<VolunteerProfile> {
  return pb.collection('volunteer_profiles').update<VolunteerProfile>(id, data)
}

// 2. Missions
export async function getVolunteerMissions(activeOnly = true): Promise<VolunteerMission[]> {
  const filter = activeOnly ? 'active = true' : ''
  return pb.collection('volunteer_missions').getFullList<VolunteerMission>({
    filter,
    sort: 'order,created',
    requestKey: null,
  })
}

// 3. Badges
export async function getVolunteerBadges(): Promise<VolunteerBadge[]> {
  return pb.collection('volunteer_badges').getFullList<VolunteerBadge>({
    sort: 'points_required,name',
    requestKey: null,
  })
}

export async function getEarnedBadges(volunteerProfileId: string): Promise<VolunteerEarnedBadge[]> {
  return pb.collection('volunteer_earned_badges').getFullList<VolunteerEarnedBadge>({
    filter: `volunteer_profile_id = "${volunteerProfileId}"`,
    expand: 'badge_id',
    sort: '-created',
    requestKey: null,
  })
}

// 4. Actions & Submissions
export async function getVolunteerActions(volunteerProfileId?: string): Promise<VolunteerAction[]> {
  const filter = volunteerProfileId ? `volunteer_profile_id = "${volunteerProfileId}"` : ''
  return pb.collection('volunteer_actions').getFullList<VolunteerAction>({
    filter,
    expand: 'volunteer_profile_id,mission_id',
    sort: '-created',
    requestKey: null,
  })
}

export async function submitVolunteerAction(data: {
  volunteer_profile_id: string
  mission_id?: string
  action_type: 'indicacao' | 'doacao' | 'acao_social' | 'divulgacao' | 'outro'
  title: string
  description: string
  proof_url?: string
  proof_file?: File | null
  points_claimed: number
  donation_value?: number
  invited_email?: string
}): Promise<VolunteerAction> {
  let payload: any = {
    volunteer_profile_id: data.volunteer_profile_id,
    mission_id: data.mission_id || null,
    action_type: data.action_type,
    title: data.title,
    description: data.description,
    proof_url: data.proof_url || '',
    points_claimed: data.points_claimed,
    status: 'pending',
    donation_value: data.donation_value || 0,
    invited_email: data.invited_email || '',
  }

  if (data.proof_file) {
    const formData = new FormData()
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== null && v !== undefined) formData.append(k, String(v))
    })
    formData.append('proof_file', data.proof_file)
    payload = formData
  }

  return pb.collection('volunteer_actions').create<VolunteerAction>(payload)
}

// Admin action approval / rejection
export async function reviewVolunteerAction(
  actionId: string,
  decision: 'approved' | 'rejected',
  adminName: string,
  feedback?: string,
): Promise<VolunteerAction> {
  const action = await pb.collection('volunteer_actions').getOne<VolunteerAction>(actionId, {
    expand: 'volunteer_profile_id',
  })

  const updatedAction = await pb.collection('volunteer_actions').update<VolunteerAction>(actionId, {
    status: decision,
    reviewed_by: adminName,
    reviewed_at: new Date().toISOString().split('T')[0],
    admin_feedback: feedback || '',
  })

  // If approved, add points to volunteer profile
  if (decision === 'approved' && action.status !== 'approved') {
    const profile = await pb
      .collection('volunteer_profiles')
      .getOne<VolunteerProfile>(action.volunteer_profile_id)

    const newPoints = (profile.points || 0) + (action.points_claimed || 0)
    const newActionsCompleted = (profile.total_actions_completed || 0) + 1
    const newDonations = (profile.total_donations_value || 0) + (action.donation_value || 0)
    const { currentLevel } = calculateLevelInfo(newPoints)

    await pb.collection('volunteer_profiles').update(profile.id, {
      points: newPoints,
      total_actions_completed: newActionsCompleted,
      total_donations_value: newDonations,
      level_name: currentLevel.name,
    })

    // Check if new badges should be unlocked automatically
    try {
      const allBadges = await getVolunteerBadges()
      const earned = await getEarnedBadges(profile.id)
      const earnedBadgeIds = new Set(earned.map((e) => e.badge_id))

      for (const badge of allBadges) {
        if (!earnedBadgeIds.has(badge.id) && newPoints >= badge.points_required) {
          await pb.collection('volunteer_earned_badges').create({
            volunteer_profile_id: profile.id,
            badge_id: badge.id,
            earned_at: new Date().toISOString().split('T')[0],
            reason: `Desbloqueado ao atingir ${badge.points_required} pontos`,
          })
        }
      }
    } catch (err) {
      console.warn('Badge check error:', err)
    }
  }

  return updatedAction
}

// 5. Leaderboard / Ranking
export async function getVolunteerLeaderboard(limit = 10): Promise<VolunteerProfile[]> {
  return pb
    .collection('volunteer_profiles')
    .getList<VolunteerProfile>(1, limit, {
      sort: '-points,-total_actions_completed',
      requestKey: null,
    })
    .then((res) => res.items)
}
