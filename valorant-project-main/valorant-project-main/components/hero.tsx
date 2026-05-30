"use client"

import React, { ReactNode } from 'react'

interface HeroProps {
  title?: string | ReactNode
  subtitle?: string | ReactNode
  backgroundImage?: string
  videoSrc?: string
  children?: ReactNode
  className?: string
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  videoSrc,
  children,
  className = '',
}: HeroProps) {
  const backgroundStyle: React.CSSProperties = {}

  if (backgroundImage && !videoSrc) {
    backgroundStyle.backgroundImage = `url('${backgroundImage}')`
    backgroundStyle.backgroundSize = 'cover'
    backgroundStyle.backgroundPosition = 'center'
  }

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={backgroundImage && !videoSrc ? backgroundStyle : {}}
    >
      {videoSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      {/* Overlay */}
      {(backgroundImage || videoSrc) && (
        <div className="absolute inset-0 bg-black/65" />
      )}

      {/* Gradient Fallback */}
      {!backgroundImage && !videoSrc && (
        <div className="absolute inset-0 bg-gradient-to-br from-valorant-red/10 via-background to-valorant-cyan/10" />
      )}

      {/* Content */}
      <div className="container relative mx-auto px-4 py-32 md:py-48 lg:py-56">
        <div className="mx-auto max-w-4xl text-center">
          {title && (
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance text-white" style={{ textShadow: '0 6px 20px rgba(0, 0, 0, 0.9), 0 3px 10px rgba(0, 0, 0, 0.7), 0 1px 4px rgba(0, 0, 0, 0.5)' }}>
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 mb-10 text-pretty" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5)' }}>
              {subtitle}
            </p>
          )}

          {children}
        </div>
      </div>
    </section>
  )
}
