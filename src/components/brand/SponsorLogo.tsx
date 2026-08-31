import React, { useState } from 'react'
import { Building2 } from 'lucide-react'
import type { Sponsor } from '@/types/content'
import { getImageSrc } from '@/services/contentService'

interface SponsorLogoProps {
  sponsor: Sponsor
  className?: string
  imgClassName?: string
  showNameFallback?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Map tiers to thematic styles
const TIER_STYLES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  Diamante: {
    bg: 'from-cyan-500/10 via-blue-500/5 to-cyan-500/10',
    border: 'border-cyan-200 hover:border-cyan-400',
    text: 'text-cyan-700',
    badge: 'bg-cyan-600 text-white',
  },
  Ouro: {
    bg: 'from-amber-500/10 via-yellow-500/5 to-amber-500/10',
    border: 'border-amber-200 hover:border-amber-400',
    text: 'text-amber-700',
    badge: 'bg-amber-500 text-white',
  },
  Prata: {
    bg: 'from-slate-400/10 via-slate-300/5 to-slate-400/10',
    border: 'border-slate-300 hover:border-slate-400',
    text: 'text-slate-700',
    badge: 'bg-slate-500 text-white',
  },
  Bronze: {
    bg: 'from-orange-500/10 via-amber-700/5 to-orange-500/10',
    border: 'border-orange-200 hover:border-orange-400',
    text: 'text-orange-700',
    badge: 'bg-orange-600 text-white',
  },
  Apoiador: {
    bg: 'from-purple-500/10 via-pink-500/5 to-purple-500/10',
    border: 'border-purple-200 hover:border-purple-400',
    text: 'text-purple-700',
    badge: 'bg-purple-600 text-white',
  },
}

// Generate initials for monogram fallback
function getInitials(name: string): string {
  if (!name) return 'PA'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export function SponsorLogo({
  sponsor,
  className = '',
  imgClassName = '',
  showNameFallback = true,
  size = 'md',
}: SponsorLogoProps) {
  const [imgError, setImgError] = useState(false)
  const tierStyle = TIER_STYLES[sponsor.tier] || TIER_STYLES.Bronze

  // Determine image source
  const src = getImageSrc(sponsor, 'sponsors', '')
  const hasValidImage = Boolean(src && !imgError)

  const sizeClasses = {
    sm: 'h-12 w-24 p-1.5',
    md: 'h-20 w-36 p-2.5',
    lg: 'h-24 w-44 p-3',
    xl: 'h-32 w-56 p-4',
  }[size]

  const monogramSizes = {
    sm: 'text-xs',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-black',
    xl: 'text-2xl font-black',
  }[size]

  return (
    <div
      className={`relative rounded-2xl bg-white flex items-center justify-center transition-all overflow-hidden ${sizeClasses} ${className}`}
    >
      {hasValidImage ? (
        <img
          src={src}
          alt={`Logo de ${sponsor.name}`}
          onError={() => setImgError(true)}
          className={`max-h-full max-w-full object-contain filter hover:brightness-105 transition-all duration-300 ${imgClassName}`}
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-full rounded-xl bg-gradient-to-br ${tierStyle.bg} border border-dashed ${tierStyle.border} flex flex-col items-center justify-center text-center p-2`}
        >
          <span className={`tracking-wider ${tierStyle.text} ${monogramSizes}`}>
            {getInitials(sponsor.name)}
          </span>
          {showNameFallback && (
            <span className="text-[10px] font-bold text-slate-600 leading-tight line-clamp-1 mt-0.5 max-w-full px-1">
              {sponsor.name}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default SponsorLogo
