'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Moon, Star, Check, Minus, X as XIcon } from 'lucide-react'

interface Evaluation {
  date: string
  scheduleStatus: 'good' | 'okay' | 'not-good'
  goodThings: string
  tiredThings: string
  timestamp: number
}

interface EvaluationScreenProps {
  onBack: () => void
}

const motivationalMessages = [
  'Kamu cukup hari ini',
  'Hari ini mungkin capek, tapi kamu bertahan',
  'Nggak apa-apa belum sempurna',
  'Terima kasih sudah menjalani hari ini',
  'Besok kita lanjut pelan-pelan',
  'Capek nggak apa-apa, kamu sudah hebat'
]

export default function EvaluationScreen({ onBack }: EvaluationScreenProps) {
  const [scheduleStatus, setScheduleStatus] = useState<'good' | 'okay' | 'not-good' | null>(null)
  const [goodThings, setGoodThings] = useState('')
  const [tiredThings, setTiredThings] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)
  const [motivationalMessage] = useState(
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  )

  const saveEvaluation = () => {
    if (scheduleStatus) {
      const evaluation: Evaluation = {
        date: new Date().toDateString(),
        scheduleStatus,
        goodThings,
        tiredThings,
        timestamp: Date.now()
      }

      const saved = localStorage.getItem('clearday-evaluations') || '[]'
      const evaluations = JSON.parse(saved)
      evaluations.push(evaluation)
      localStorage.setItem('clearday-evaluations', JSON.stringify(evaluations))
      localStorage.setItem('lastEvaluation', new Date().toDateString())

      setShowThankYou(true)
      setTimeout(() => {
        onBack()
      }, 3000)
    }
  }

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
        <div className="text-center animate-fade-in">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" />
            <Moon className="relative w-32 h-32 text-yellow-100" />
          </div>
          {[...Array(12)].map((_, i) => (
            <Star
              key={i}
              className="absolute text-yellow-200 animate-twinkle"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                width: `${8 + Math.random() * 12}px`,
                height: `${8 + Math.random() * 12}px`,
                animationDelay: `${Math.random() * 2}s`,
                fill: 'currentColor'
              }}
            />
          ))}
          <h2 className="text-4xl font-bold text-white mb-4">{motivationalMessage}</h2>
          <p className="text-xl text-purple-200">Besok kita lanjut pelan-pelan</p>
          <p className="text-lg text-blue-300 mt-8">Selamat istirahat</p>
        </div>

        <style jsx>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          .animate-twinkle {
            animation: twinkle 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-purple-900 pb-12">
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-white/30 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${6 + Math.random() * 8}px`,
              height: `${6 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              fill: 'currentColor'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="bg-purple-900/50 backdrop-blur-sm border-b-2 border-purple-700/50 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-purple-200 hover:text-purple-100 hover:bg-purple-800/50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Moon className="w-6 h-6 text-yellow-200" />
              <h2 className="text-2xl font-bold text-purple-200">Evaluasi Hari Ini</h2>
            </div>
            <p className="text-sm text-blue-300">Kita refleksi bentar ya</p>
          </div>
          <div className="w-24" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 pt-8 relative z-10">
        {/* Welcome Message */}
        <Card className="bg-purple-800/40 backdrop-blur-sm border-2 border-purple-600/50 rounded-2xl p-6 mb-6 text-center">
          <p className="text-lg text-purple-100 leading-relaxed">{motivationalMessage}</p>
        </Card>

        {/* Question 1: Schedule Status */}
        <Card className="bg-purple-800/40 backdrop-blur-sm border-2 border-purple-600/50 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-purple-100 mb-4">Jadwal hari ini:</h3>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => setScheduleStatus('good')}
              className={`flex flex-col gap-3 py-8 rounded-xl transition-all ${
                scheduleStatus === 'good'
                  ? 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-400'
                  : 'bg-purple-700/50 hover:bg-purple-700 text-purple-200 border-2 border-purple-600'
              }`}
            >
              <Check className="w-8 h-8 mx-auto" />
              <span className="text-sm font-medium">Jalan</span>
            </Button>
            <Button
              onClick={() => setScheduleStatus('okay')}
              className={`flex flex-col gap-3 py-8 rounded-xl transition-all ${
                scheduleStatus === 'okay'
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-400'
                  : 'bg-purple-700/50 hover:bg-purple-700 text-purple-200 border-2 border-purple-600'
              }`}
            >
              <Minus className="w-8 h-8 mx-auto" />
              <span className="text-sm font-medium">Lumayan</span>
            </Button>
            <Button
              onClick={() => setScheduleStatus('not-good')}
              className={`flex flex-col gap-3 py-8 rounded-xl transition-all ${
                scheduleStatus === 'not-good'
                  ? 'bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-400'
                  : 'bg-purple-700/50 hover:bg-purple-700 text-purple-200 border-2 border-purple-600'
              }`}
            >
              <XIcon className="w-8 h-8 mx-auto" />
              <span className="text-sm font-medium">Belum</span>
            </Button>
          </div>
        </Card>

        {/* Question 2: Good Things */}
        <Card className="bg-purple-800/40 backdrop-blur-sm border-2 border-purple-600/50 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-purple-100 mb-3">Hal kecil yang berhasil?</h3>
          <p className="text-sm text-blue-300 mb-4">Apa aja yang bikin kamu tersenyum hari ini</p>
          <Textarea
            value={goodThings}
            onChange={(e) => setGoodThings(e.target.value)}
            placeholder="Contoh: Bangun tepat waktu, makan enak, ngobrol sama teman..."
            className="bg-purple-900/50 border-purple-500 text-purple-100 placeholder:text-purple-400 rounded-xl min-h-[100px] resize-none"
          />
        </Card>

        {/* Question 3: Tired Things */}
        <Card className="bg-purple-800/40 backdrop-blur-sm border-2 border-purple-600/50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-purple-100 mb-3">Hal yang bikin capek?</h3>
          <p className="text-sm text-blue-300 mb-4">Boleh curhat, nggak ada yang menghakimi</p>
          <Textarea
            value={tiredThings}
            onChange={(e) => setTiredThings(e.target.value)}
            placeholder="Ceritain aja pelan-pelan..."
            className="bg-purple-900/50 border-purple-500 text-purple-100 placeholder:text-purple-400 rounded-xl min-h-[100px] resize-none"
          />
        </Card>

        {/* Save Button */}
        <Button
          onClick={saveEvaluation}
          disabled={!scheduleStatus}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Moon className="w-5 h-5 mr-2" />
          Simpan & Istirahat
        </Button>

        {/* Footer Message */}
        <div className="text-center mt-8 mb-4">
          <p className="text-sm text-purple-300 italic">Kamu sudah cukup hari ini</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
