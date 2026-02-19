'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Cloud, Sun, Moon, Home, DollarSign, Lightbulb } from 'lucide-react'

interface HomeScreenProps {
  onNavigate: (screen: 'todo' | 'expenses' | 'evaluation') => void
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning')
  const [showEvaluationPopup, setShowEvaluationPopup] = useState(false)

  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning')
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay('afternoon')
      } else {
        setTimeOfDay('evening')
      }
    }
    
    updateTimeOfDay()
    const interval = setInterval(updateTimeOfDay, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Check if evaluation popup should appear in the evening
    const checkEvaluationTime = () => {
      const hour = new Date().getHours()
      const lastEvaluation = localStorage.getItem('lastEvaluation')
      const today = new Date().toDateString()
      
      if (hour >= 19 && lastEvaluation !== today && timeOfDay === 'evening') {
        setTimeout(() => setShowEvaluationPopup(true), 3000)
      }
    }
    
    checkEvaluationTime()
  }, [timeOfDay])

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'Selamat pagi'
      case 'afternoon':
        return 'Istirahat bentar ya, kamu masih hebat kok'
      case 'evening':
        return 'Selamat pulang'
    }
  }

  const getSubGreeting = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'Yuk mulai hari dengan ringan'
      case 'afternoon':
        return 'Kita lanjut pelan-pelan'
      case 'evening':
        return 'Hari ini sudah kamu lewati'
    }
  }

  const handleEvaluationClick = () => {
    setShowEvaluationPopup(false)
    onNavigate('evaluation')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {/* Animated Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Cloud className="absolute top-10 left-5 w-20 h-20 text-white/50 animate-float-slow" />
        <Cloud className="absolute top-20 right-10 w-24 h-24 text-white/40 animate-float-slow" style={{ animationDelay: '2s' }} />
        <Cloud className="absolute bottom-32 left-20 w-16 h-16 text-white/60 animate-float-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-8 pb-4 px-6">
        <h1 className="text-3xl font-bold text-pink-400 mb-2">CLEARDAY</h1>
        <div className="flex items-center justify-center gap-2 mb-1">
          {timeOfDay === 'evening' ? (
            <Moon className="w-5 h-5 text-blue-400" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
          <p className="text-lg text-blue-400 font-medium">{getGreeting()}</p>
        </div>
        <p className="text-sm text-pink-300">{getSubGreeting()}</p>
      </div>

      {/* House Container */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-12">
        {/* House SVG */}
        <div className="relative">
          {/* House Background */}
          <div className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-3xl p-8 shadow-2xl border-4 border-white/50">
            {/* Roof */}
            <div className="relative -mt-16 mb-8">
              <div className="w-0 h-0 border-l-[150px] border-r-[150px] border-b-[80px] border-l-transparent border-r-transparent border-b-pink-200 mx-auto" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-16 bg-pink-300 rounded-t-lg" />
            </div>

            {/* House Body */}
            <div className="space-y-6">
              {/* Main Door - To-Do Harian */}
              <Button
                onClick={() => onNavigate('todo')}
                className="w-full bg-gradient-to-r from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400 text-pink-800 p-8 rounded-2xl border-4 border-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl h-auto flex flex-col gap-3"
              >
                <Home className="w-12 h-12" />
                <div className="text-center">
                  <p className="text-xl font-bold">Hari Ini</p>
                  <p className="text-sm font-normal opacity-80">Apa aja yang mau kamu lakukan hari ini?</p>
                </div>
              </Button>

              {/* Secondary Options */}
              <div className="grid grid-cols-2 gap-4">
                {/* Table - Expenses */}
                <Button
                  onClick={() => onNavigate('expenses')}
                  className="bg-gradient-to-br from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 text-blue-800 p-6 rounded-2xl border-4 border-white shadow-lg transition-all duration-300 hover:scale-105 h-auto flex flex-col gap-2"
                >
                  <DollarSign className="w-10 h-10" />
                  <div className="text-center">
                    <p className="text-base font-bold">Pengeluaran</p>
                    <p className="text-xs font-normal opacity-80">Catat pelan-pelan</p>
                  </div>
                </Button>

                {/* Lamp - Evaluation */}
                <Button
                  onClick={() => timeOfDay === 'evening' ? onNavigate('evaluation') : null}
                  disabled={timeOfDay !== 'evening'}
                  className={`p-6 rounded-2xl border-4 border-white shadow-lg transition-all duration-300 h-auto flex flex-col gap-2 ${
                    timeOfDay === 'evening'
                      ? 'bg-gradient-to-br from-purple-200 to-purple-300 hover:from-purple-300 hover:to-purple-400 text-purple-800 hover:scale-105 cursor-pointer'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Lightbulb className={`w-10 h-10 ${timeOfDay === 'evening' ? 'fill-current' : ''}`} />
                  <div className="text-center">
                    <p className="text-base font-bold">Evaluasi</p>
                    <p className="text-xs font-normal opacity-80">
                      {timeOfDay === 'evening' ? 'Kita refleksi bentar ya' : 'Aktif malam hari'}
                    </p>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative Windows */}
          <div className="absolute top-24 left-12 w-16 h-16 bg-yellow-100 rounded-lg border-4 border-white shadow-md opacity-60" />
          <div className="absolute top-24 right-12 w-16 h-16 bg-yellow-100 rounded-lg border-4 border-white shadow-md opacity-60" />
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-sm text-pink-300 italic">Clear your day, not your energy</p>
        </div>
      </div>

      {/* Evening Evaluation Popup */}
      {showEvaluationPopup && timeOfDay === 'evening' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 max-w-md shadow-2xl border-4 border-white animate-fade-in">
            <Moon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-800 text-center mb-3">
              Hari ini mungkin capek, tapi kamu bertahan
            </h3>
            <p className="text-purple-600 text-center mb-6">
              Nggak apa-apa belum sempurna. Terima kasih sudah menjalani hari ini
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleEvaluationClick}
                className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-full"
              >
                <Moon className="w-4 h-4 mr-2" />
                Yuk evaluasi bentar
              </Button>
              <Button
                onClick={() => setShowEvaluationPopup(false)}
                variant="outline"
                className="px-6 bg-white/50 border-purple-300 text-purple-700 rounded-full hover:bg-white"
              >
                Nanti dulu
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
