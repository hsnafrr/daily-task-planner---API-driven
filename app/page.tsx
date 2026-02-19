'use client'

import { useState, useEffect } from 'react'
import SplashScreen from '@/components/splash-screen'
import HomeScreen from '@/components/home-screen'
import DailyTodoScreen from '@/components/daily-todo-screen'
import ExpensesScreen from '@/components/expenses-screen'
import EvaluationScreen from '@/components/evaluation-screen'

export default function CleardayApp() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'home' | 'todo' | 'expenses' | 'evaluation'>('splash')

  return (
    <div className="min-h-screen">
      {currentScreen === 'splash' && (
        <SplashScreen onStart={() => setCurrentScreen('home')} />
      )}
      {currentScreen === 'home' && (
        <HomeScreen
          onNavigate={(screen) => setCurrentScreen(screen as any)}
        />
      )}
      {currentScreen === 'todo' && (
        <DailyTodoScreen onBack={() => setCurrentScreen('home')} />
      )}
      {currentScreen === 'expenses' && (
        <ExpensesScreen onBack={() => setCurrentScreen('home')} />
      )}
      {currentScreen === 'evaluation' && (
        <EvaluationScreen onBack={() => setCurrentScreen('home')} />
      )}
    </div>
  )
}
