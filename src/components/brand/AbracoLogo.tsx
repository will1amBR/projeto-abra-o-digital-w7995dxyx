import React from 'react'

// Import official assets
import logoFull from '@/assets/img-20260830-wa0051-a14c7.jpg'
import bannerLogoWithStrip from '@/assets/img-20260830-wa0052-1e3e4.jpg'

interface LogoProps {
  className?: string
  variant?: 'full' | 'banner' | 'svg-transparent' | 'icon-only' | 'light-text' | 'dark-text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSubtitle?: boolean
}

/**
 * High-fidelity, crisp SVG Logo of Projeto Abraço
 * Reproduces the colorful blocks:
 * [PROJETO] + [A (Rosa #ed0e58)] + [B (Roxo #8d198f)] + [R (Azul #2e3192)] + [A (Ciano #01abb7)] + [Ç (Verde Lima #cce310)] + [O com símbolo (Laranja #f89c0e)]
 * + "FAÇA DA DIVERSÃO UMA BOA AÇÃO!"
 */
export const AbracoVectorLogo: React.FC<{
  className?: string
  invertedSubtitle?: boolean
  showSubtitle?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}> = ({ className = '', invertedSubtitle = false, showSubtitle = true, size = 'md' }) => {
  const heightMap = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
    xl: 'h-24',
  }

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 460 120"
        className={`${heightMap[size]} w-auto transition-transform`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical PROJETO text */}
        <text
          x="18"
          y="76"
          transform="rotate(-90 18 76)"
          fill={invertedSubtitle ? '#ffffff' : '#222222'}
          fontSize="15"
          fontWeight="900"
          letterSpacing="4"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          PROJETO
        </text>

        {/* 1. Letter A (Pink #ed0e58) */}
        <rect x="30" y="8" width="60" height="60" rx="4" fill="#ed0e58" />
        <text
          x="60"
          y="54"
          fill="#ffffff"
          fontSize="46"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="Roboto, system-ui, sans-serif"
        >
          A
        </text>

        {/* 2. Letter B (Purple #8d198f) */}
        <rect x="94" y="8" width="60" height="60" rx="4" fill="#8d198f" />
        <text
          x="124"
          y="54"
          fill="#ffffff"
          fontSize="46"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="Roboto, system-ui, sans-serif"
        >
          B
        </text>

        {/* 3. Letter R (Dark Blue #2e3192) */}
        <rect x="158" y="8" width="60" height="60" rx="4" fill="#2e3192" />
        <text
          x="188"
          y="54"
          fill="#ffffff"
          fontSize="46"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="Roboto, system-ui, sans-serif"
        >
          R
        </text>

        {/* 4. Letter A (Cyan #01abb7) */}
        <rect x="222" y="8" width="60" height="60" rx="4" fill="#01abb7" />
        <text
          x="252"
          y="54"
          fill="#ffffff"
          fontSize="46"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="Roboto, system-ui, sans-serif"
        >
          A
        </text>

        {/* 5. Letter Ç (Lime Green #cce310) */}
        <rect x="286" y="8" width="60" height="60" rx="4" fill="#cce310" />
        <text
          x="316"
          y="52"
          fill="#ffffff"
          fontSize="44"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="Roboto, system-ui, sans-serif"
        >
          Ç
        </text>

        {/* 6. Symbol O (Orange #f89c0e) */}
        <rect x="350" y="8" width="60" height="60" rx="4" fill="#f89c0e" />
        {/* Embrace circle / community symbol inside O */}
        <g transform="translate(380, 38)">
          <circle cx="0" cy="0" r="18" stroke="#ffffff" strokeWidth="4" fill="none" />
          <circle cx="0" cy="-6" r="3" fill="#ffffff" />
          <circle cx="-6" cy="4" r="3" fill="#ffffff" />
          <circle cx="6" cy="4" r="3" fill="#ffffff" />
          <path
            d="M -12,12 C -6,16 6,16 12,12"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Subtitle */}
        {showSubtitle && (
          <text
            x="228"
            y="98"
            fill={invertedSubtitle ? '#ffffff' : '#ed0e58'}
            fontSize="19"
            fontWeight="700"
            letterSpacing="2.5"
            textAnchor="middle"
            fontFamily="Roboto, system-ui, sans-serif"
          >
            FAÇA DA DIVERSÃO UMA BOA AÇÃO!
          </text>
        )}
      </svg>
    </div>
  )
}

/**
 * Versatile Logo Component Supporting Image and Vector transparent versions
 */
export const AbracoLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'svg-transparent',
  size = 'md',
  showSubtitle = true,
}) => {
  const heightClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
    xl: 'h-24',
  }

  if (variant === 'full') {
    return (
      <img
        src={logoFull}
        alt="Projeto Abraço - Faça da Diversão uma Boa Ação"
        className={`${heightClasses[size]} w-auto object-contain rounded-lg shadow-xs ${className}`}
      />
    )
  }

  if (variant === 'banner') {
    return (
      <img
        src={bannerLogoWithStrip}
        alt="Projeto Abraço Banner"
        className={`${heightClasses[size]} w-auto object-contain rounded-lg ${className}`}
      />
    )
  }

  if (variant === 'light-text') {
    return (
      <AbracoVectorLogo
        className={className}
        size={size}
        invertedSubtitle={true}
        showSubtitle={showSubtitle}
      />
    )
  }

  return (
    <AbracoVectorLogo
      className={className}
      size={size}
      invertedSubtitle={false}
      showSubtitle={showSubtitle}
    />
  )
}

export default AbracoLogo
