'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Plus, Coffee, Car, BookOpen, Gift, X } from 'lucide-react'

interface Expense {
  id: string
  amount: number
  category: 'jajan' | 'transport' | 'kebutuhan' | 'lainnya'
  note: string
  timestamp: number
}

interface ExpensesScreenProps {
  onBack: () => void
}

const categories = [
  { id: 'jajan' as const, label: 'Jajan', icon: Coffee, color: 'pink' },
  { id: 'transport' as const, label: 'Transport', icon: Car, color: 'blue' },
  { id: 'kebutuhan' as const, label: 'Kebutuhan', icon: BookOpen, color: 'purple' },
  { id: 'lainnya' as const, label: 'Lainnya', icon: Gift, color: 'green' }
]

export default function ExpensesScreen({ onBack }: ExpensesScreenProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Expense['category']>('jajan')
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('clearday-expenses')
    if (saved) {
      const allExpenses = JSON.parse(saved)
      // Filter only today's expenses
      const today = new Date().toDateString()
      const todayExpenses = allExpenses.filter((exp: Expense) => 
        new Date(exp.timestamp).toDateString() === today
      )
      setExpenses(todayExpenses)
    }
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('clearday-expenses') || '[]'
    const allExpenses = JSON.parse(saved)
    const otherDays = allExpenses.filter((exp: Expense) => 
      new Date(exp.timestamp).toDateString() !== new Date().toDateString()
    )
    localStorage.setItem('clearday-expenses', JSON.stringify([...otherDays, ...expenses]))
  }, [expenses])

  const addExpense = () => {
    const amountNum = parseFloat(amount)
    if (amountNum && amountNum > 0) {
      const expense: Expense = {
        id: Date.now().toString(),
        amount: amountNum,
        category: selectedCategory,
        note: note || categories.find(c => c.id === selectedCategory)?.label || '',
        timestamp: Date.now()
      }
      setExpenses([expense, ...expenses])
      setAmount('')
      setNote('')
      setShowCoinAnimation(true)
      setTimeout(() => setShowCoinAnimation(false), 1000)
    }
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  const totalToday = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.color || 'pink'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

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
            <h2 className="text-2xl font-bold text-pink-400">Pengeluaran</h2>
            <p className="text-sm text-blue-400">Hari ini uang kamu ke mana aja?</p>
          </div>
          <div className="w-24" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        {/* Add Expense Form */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 shadow-lg rounded-2xl p-6 mb-6 relative overflow-hidden">
          {showCoinAnimation && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="text-6xl animate-coin-drop">💰</div>
            </div>
          )}
          
          {/* Category Selection */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isSelected = selectedCategory === cat.id
              return (
                <Button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col gap-2 py-6 rounded-xl transition-all ${
                    isSelected
                      ? `bg-${cat.color}-300 hover:bg-${cat.color}-400 text-${cat.color}-800 border-2 border-${cat.color}-400`
                      : 'bg-white hover:bg-gray-50 text-gray-600 border-2 border-gray-200'
                  }`}
                  style={{
                    backgroundColor: isSelected 
                      ? cat.color === 'pink' ? '#fbcfe8' 
                      : cat.color === 'blue' ? '#bfdbfe' 
                      : cat.color === 'purple' ? '#e9d5ff' 
                      : '#bbf7d0' 
                      : 'white',
                    borderColor: isSelected 
                      ? cat.color === 'pink' ? '#f9a8d4' 
                      : cat.color === 'blue' ? '#93c5fd' 
                      : cat.color === 'purple' ? '#d8b4fe' 
                      : '#86efac' 
                      : '#e5e7eb'
                  }}
                >
                  <Icon className="w-6 h-6 mx-auto" />
                  <span className="text-xs">{cat.label}</span>
                </Button>
              )
            })}
          </div>

          {/* Amount Input */}
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Jumlah (Rp)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addExpense()}
                className="border-pink-200 focus:border-pink-400 rounded-xl text-lg"
              />
            </div>
            <Button
              onClick={addExpense}
              className="bg-gradient-to-r from-pink-300 to-blue-300 hover:from-pink-400 hover:to-blue-400 text-white rounded-xl px-6"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Note Input */}
          <Input
            placeholder="Catatan (opsional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addExpense()}
            className="border-blue-200 focus:border-blue-400 rounded-xl"
          />
        </Card>

        {/* Total Summary */}
        {expenses.length > 0 && (
          <Card className="bg-gradient-to-r from-pink-200 to-blue-200 rounded-2xl p-6 mb-6 text-center">
            <p className="text-sm text-pink-700 mb-2">Total hari ini</p>
            <p className="text-3xl font-bold text-pink-800 mb-2">{formatCurrency(totalToday)}</p>
            <p className="text-sm text-blue-700 italic">
              {totalToday < 50000 ? 'Masih aman kok' : totalToday < 100000 ? 'Pelan-pelan ya' : 'Kamu sadar, itu sudah bagus'}
            </p>
          </Card>
        )}

        {/* Expenses List */}
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm border-2 border-dashed border-pink-200 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">💸</div>
              <p className="text-pink-400 font-medium">Belum ada pengeluaran hari ini</p>
              <p className="text-sm text-blue-300 mt-2">Catat pelan-pelan, biar sadar</p>
            </Card>
          ) : (
            expenses.map((expense) => {
              const category = categories.find(c => c.id === expense.category)
              const Icon = category?.icon || Coffee
              return (
                <Card
                  key={expense.id}
                  className="bg-white/90 backdrop-blur-sm border-2 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                  style={{
                    borderColor: category?.color === 'pink' ? '#fbcfe8' 
                      : category?.color === 'blue' ? '#bfdbfe' 
                      : category?.color === 'purple' ? '#e9d5ff' 
                      : '#bbf7d0'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: category?.color === 'pink' ? '#fce7f3' 
                          : category?.color === 'blue' ? '#dbeafe' 
                          : category?.color === 'purple' ? '#f3e8ff' 
                          : '#dcfce7'
                      }}
                    >
                      <Icon className="w-6 h-6" style={{
                        color: category?.color === 'pink' ? '#ec4899' 
                          : category?.color === 'blue' ? '#3b82f6' 
                          : category?.color === 'purple' ? '#a855f7' 
                          : '#22c55e'
                      }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-pink-800">{formatCurrency(expense.amount)}</p>
                      <p className="text-sm text-blue-600">{expense.note}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(expense.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Button
                      onClick={() => deleteExpense(expense.id)}
                      variant="ghost"
                      size="sm"
                      className="text-pink-300 hover:text-pink-500 hover:bg-pink-50"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-sm text-pink-300 italic">Sadar finansial tanpa rasa bersalah</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes coin-drop {
          0% { transform: translateY(-100px) scale(0); opacity: 0; }
          50% { transform: translateY(0) scale(1.2); opacity: 1; }
          100% { transform: translateY(100px) scale(0); opacity: 0; }
        }
        .animate-coin-drop {
          animation: coin-drop 1s ease-out;
        }
      `}</style>
    </div>
  )
}
