import React from 'react'

interface ColorStripProps {
  className?: string
  height?: string
}

/**
 * 6 official brand colors of Projeto Abraço:
 * - #ed0e58 (Pink)
 * - #8d198f (Purple)
 * - #2e3192 (Blue)
 * - #01abb7 (Cyan)
 * - #cce310 (Lime Green)
 * - #f89c0e (Orange)
 */
export const ColorStrip: React.FC<ColorStripProps> = ({ className = '', height = 'h-[3px]' }) => {
  return (
    <div className={`w-full flex ${height} overflow-hidden ${className}`}>
      <div className="flex-1 bg-[#ed0e58]" />
      <div className="flex-1 bg-[#8d198f]" />
      <div className="flex-1 bg-[#2e3192]" />
      <div className="flex-1 bg-[#01abb7]" />
      <div className="flex-1 bg-[#cce310]" />
      <div className="flex-1 bg-[#f89c0e]" />
    </div>
  )
}

export default ColorStrip
