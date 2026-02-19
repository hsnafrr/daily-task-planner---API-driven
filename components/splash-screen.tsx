'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Cloud, Sun, Sparkles } from 'lucide-react'

interface SplashScreenProps {
  onStart: () => void
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowContent(true), 500)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-pink-50 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated Clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <Cloud className="absolute top-20 left-10 w-24 h-24 text-white/60 animate-float" style={{ animationDelay: '0s' }} />
        <Cloud className="absolute top-32 right-20 w-32 h-32 text-white/50 animate-float" style={{ animationDelay: '1s' }} />
        <Cloud className="absolute bottom-40 left-32 w-28 h-28 text-white/40 animate-float" style={{ animationDelay: '2s' }} />
        <Cloud className="absolute top-1/2 right-10 w-20 h-20 text-white/50 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-pink-300/40 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${12 + Math.random() * 8}px`,
              height: `${12 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`text-center z-10 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Sun Icon with Glow */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-yellow-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
          <Sun className="relative w-24 h-24 text-yellow-400 animate-spin-slow" />
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-4 text-pink-400 tracking-tight">
          CLEARDAY
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-blue-400 font-medium mb-3 italic">
          Let's make today feel lighter.
        </p>

        {/* Subtext */}
        <p className="text-base md:text-lg text-pink-300 mb-12 max-w-md mx-auto leading-relaxed">
          Pelan-pelan. Hari ini nggak perlu berat
        </p>

        {/* Start Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-pink-300 to-blue-300 hover:from-pink-400 hover:to-blue-400 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Mulai Hari Ini
        </Button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
