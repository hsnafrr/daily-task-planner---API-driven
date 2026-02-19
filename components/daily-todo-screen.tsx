'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Plus, Clock, Bell, Sparkles, X } from 'lucide-react'

interface Task {
  id: string
  title: string
  time: string
  completed: boolean
  icon: string
}

interface DailyTodoScreenProps {
  onBack: () => void
}

export default function DailyTodoScreen({ onBack }: DailyTodoScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [newTime, setNewTime] = useState('')
  const [showAlarm, setShowAlarm] = useState(false)
  const [currentAlarm, setCurrentAlarm] = useState<Task | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('clearday-tasks')
    if (saved) {
      setTasks(JSON.parse(saved))
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('clearday-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      
      tasks.forEach(task => {
        if (task.time === currentTime && !task.completed) {
          const alarmKey = `alarm-${task.id}-${currentTime}`
          const alreadyShown = sessionStorage.getItem(alarmKey)
          
          if (!alreadyShown) {
            setCurrentAlarm(task)
            setShowAlarm(true)
            sessionStorage.setItem(alarmKey, 'true')
            playAlarmSound()
          }
        }
      })
    }, 30000)

    return () => clearInterval(checkAlarms)
  }, [tasks])

  const playAlarmSound = () => {
    // Create audio context for gentle alarm sound
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 528 // Calm frequency
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1)
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 1)
    }
  }

  const addTask = () => {
    if (newTask.trim()) {
      const icons = ['📚', '🎸', '☕', '🏃', '💼', '🍽️', '🛏️', '✨']
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        time: newTime || '09:00',
        completed: false,
        icon: icons[Math.floor(Math.random() * icons.length)]
      }
      setTasks([...tasks, task])
      setNewTask('')
      setNewTime('')
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleAlarmResponse = (action: 'start' | 'snooze' | 'skip') => {
    if (currentAlarm) {
      if (action === 'start') {
        // Mark as completed or just close
        setShowAlarm(false)
      } else if (action === 'snooze') {
        // Snooze for 10 minutes
        const newTime = new Date()
        newTime.setMinutes(newTime.getMinutes() + 10)
        const snoozeTime = `${String(newTime.getHours()).padStart(2, '0')}:${String(newTime.getMinutes()).padStart(2, '0')}`
        setTasks(tasks.map(task => 
          task.id === currentAlarm.id ? { ...task, time: snoozeTime } : task
        ))
        setShowAlarm(false)
      } else {
        setShowAlarm(false)
      }
      setCurrentAlarm(null)
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b-2 border-pink-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-pink-400 hover:text-pink-600 hover:bg-pink-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-pink-400">Hari Ini</h2>
            <p className="text-sm text-blue-400">Kita selesaikan yang penting dulu</p>
          </div>
          <div className="w-24" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        {/* Add Task Form */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 shadow-lg rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Kegiatan apa yang mau kamu lakukan?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1 border-pink-200 focus:border-pink-400 rounded-xl"
            />
            <div className="flex gap-3">
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-32 border-blue-200 focus:border-blue-400 rounded-xl"
              />
              <Button
                onClick={addTask}
                className="bg-gradient-to-r from-pink-300 to-blue-300 hover:from-pink-400 hover:to-blue-400 text-white rounded-xl"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Progress Summary */}
        {tasks.length > 0 && (
          <div className="bg-gradient-to-r from-pink-200 to-blue-200 rounded-2xl p-4 mb-6 text-center">
            <p className="text-pink-800 font-medium">
              {completedCount === 0 ? 'Ayo mulai pelan-pelan' : completedCount === tasks.length ? 'Kamu hebat! Semua selesai' : `Nice. ${completedCount} dari ${tasks.length} selesai`}
            </p>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm border-2 border-dashed border-pink-200 rounded-2xl p-12 text-center">
              <Sparkles className="w-16 h-16 text-pink-300 mx-auto mb-4" />
              <p className="text-pink-400 font-medium">Belum ada kegiatan hari ini</p>
              <p className="text-sm text-blue-300 mt-2">Tambahkan satu per satu, pelan-pelan aja</p>
            </Card>
          ) : (
            <>
              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="border-pink-300 data-[state=checked]:bg-pink-400 w-6 h-6"
                        />
                        <span className="text-3xl">{task.icon}</span>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-pink-800">{task.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-blue-400 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{task.time}</span>
                            <Bell className="w-4 h-4 ml-2" />
                          </div>
                        </div>
                        <Button
                          onClick={() => deleteTask(task.id)}
                          variant="ghost"
                          size="sm"
                          className="text-pink-300 hover:text-pink-500 hover:bg-pink-50"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-blue-400 font-medium mb-3 px-2">Selesai</p>
                  <div className="space-y-3">
                    {completedTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="bg-green-50/80 backdrop-blur-sm border-2 border-green-200 rounded-2xl p-4 opacity-60"
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                            className="border-green-300 data-[state=checked]:bg-green-400 w-6 h-6"
                          />
                          <span className="text-3xl grayscale">{task.icon}</span>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-green-800 line-through">{task.title}</h3>
                            <p className="text-sm text-green-600 mt-1">Satu langkah selesai</p>
                          </div>
                          <Button
                            onClick={() => deleteTask(task.id)}
                            variant="ghost"
                            size="sm"
                            className="text-green-300 hover:text-green-500 hover:bg-green-100"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-sm text-pink-300 italic">Pelan-pelan aja, kamu cukup hari ini</p>
        </div>
      </div>

      {/* Alarm Modal */}
      {showAlarm && currentAlarm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-3xl p-8 max-w-md shadow-2xl border-4 border-white">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">{currentAlarm.icon}</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-2">Waktunya mulai</h3>
              <p className="text-lg text-blue-700 font-medium mb-1">{currentAlarm.title}</p>
              <p className="text-pink-600 italic">Kamu mampu</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => handleAlarmResponse('start')}
                className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white rounded-full py-6 text-base"
              >
                Aku mulai sekarang
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleAlarmResponse('snooze')}
                  variant="outline"
                  className="bg-white/50 border-blue-300 text-blue-700 rounded-full hover:bg-white"
                >
                  Bentar ya (10 min)
                </Button>
                <Button
                  onClick={() => handleAlarmResponse('skip')}
                  variant="outline"
                  className="bg-white/50 border-pink-300 text-pink-700 rounded-full hover:bg-white"
                >
                  Lewatin dulu
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
