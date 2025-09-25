'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Phone, 
  DollarSign, 
  Target,
  TrendingUp,
  MessageSquare,
  CheckCircle
} from 'lucide-react'

interface QuantitativeData {
  scheduledCalls: string
  liveCalls: string
  offersMade: string
  deposits: string
  closes: string
  cashCollected: string
}

interface QualitativeData {
  biggestWin: string
  challengesFaced: string
  lessonsLearned: string
  tomorrowFocus: string
  teamSupport: string
  personalReflection: string
}

interface EODSubmissionFormProps {
  onSubmit: (data: QuantitativeData & QualitativeData) => void
  onClose: () => void
}

export default function EODSubmissionForm({ onSubmit, onClose }: EODSubmissionFormProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [quantitativeData, setQuantitativeData] = useState<QuantitativeData>({
    scheduledCalls: '',
    liveCalls: '',
    offersMade: '',
    deposits: '',
    closes: '',
    cashCollected: ''
  })

  const [qualitativeData, setQualitativeData] = useState<QualitativeData>({
    biggestWin: '',
    challengesFaced: '',
    lessonsLearned: '',
    tomorrowFocus: '',
    teamSupport: '',
    personalReflection: ''
  })

  const updateQuantitativeData = (field: keyof QuantitativeData, value: string) => {
    setQuantitativeData(prev => ({ ...prev, [field]: value }))
  }

  const updateQualitativeData = (field: keyof QualitativeData, value: string) => {
    setQualitativeData(prev => ({ ...prev, [field]: value }))
  }

  const isStep1Complete = Object.values(quantitativeData).every(value => value.trim() !== '')

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit({ ...quantitativeData, ...qualitativeData })
    } finally {
      setIsSubmitting(false)
    }
  }

  const quantitativeFields = [
    { key: 'scheduledCalls' as keyof QuantitativeData, label: 'Scheduled Calls', icon: Phone, color: 'text-blue-500' },
    { key: 'liveCalls' as keyof QuantitativeData, label: 'Live Calls', icon: Phone, color: 'text-indigo-500' },
    { key: 'offersMade' as keyof QuantitativeData, label: 'Offers Made', icon: Target, color: 'text-purple-500' },
    { key: 'deposits' as keyof QuantitativeData, label: 'Deposits', icon: TrendingUp, color: 'text-orange-500' },
    { key: 'closes' as keyof QuantitativeData, label: 'Closes', icon: CheckCircle, color: 'text-emerald-500' },
    { key: 'cashCollected' as keyof QuantitativeData, label: 'Cash Collected ($)', icon: DollarSign, color: 'text-green-500' }
  ]

  const qualitativeQuestions = [
    {
      key: 'biggestWin' as keyof QualitativeData,
      label: 'What was your biggest win today?',
      placeholder: 'Describe your most significant achievement or success...'
    },
    {
      key: 'challengesFaced' as keyof QualitativeData,
      label: 'What challenges did you face?',
      placeholder: 'Share any obstacles or difficulties you encountered...'
    },
    {
      key: 'lessonsLearned' as keyof QualitativeData,
      label: 'What did you learn today?',
      placeholder: 'Reflect on any insights or skills you gained...'
    },
    {
      key: 'tomorrowFocus' as keyof QualitativeData,
      label: 'What will you focus on tomorrow?',
      placeholder: 'Outline your priorities and goals for tomorrow...'
    },
    {
      key: 'teamSupport' as keyof QualitativeData,
      label: 'How can the team support you better?',
      placeholder: 'Share any support or resources you need...'
    },
    {
      key: 'personalReflection' as keyof QualitativeData,
      label: 'Personal reflection on your performance',
      placeholder: 'How do you feel about your performance today? What would you do differently?...'
    }
  ]

  return (
    <div className=\"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4\">
      <div className=\"bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden\">
        
        {/* Header */}
        <div className=\"bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4\">
          <div className=\"flex items-center justify-between\">
            <div>
              <h2 className=\"text-xl font-bold text-white\">
                End of Day Submission
              </h2>
              <p className=\"text-indigo-100 text-sm\">
                Step {step} of 2 - {step === 1 ? 'Performance Metrics' : 'Daily Reflection'}
              </p>
            </div>
            <button
              onClick={onClose}
              className=\"text-white hover:text-indigo-200 transition-colors\"
            >
              ×
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className=\"bg-slate-100 dark:bg-slate-800 px-6 py-2\">
          <div className=\"w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2\">
            <div 
              className=\"bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300\"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className=\"p-6 max-h-[calc(90vh-140px)] overflow-y-auto\">
          {step === 1 ? (
            // Step 1: Quantitative Data
            <div className=\"space-y-6\">
              <div className=\"text-center mb-6\">
                <h3 className=\"text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2\">
                  Daily Performance Metrics
                </h3>
                <p className=\"text-slate-600 dark:text-slate-400 text-sm\">
                  Please enter your quantitative performance data for today
                </p>
              </div>

              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                {quantitativeFields.map((field) => {
                  const Icon = field.icon
                  return (
                    <div key={field.key} className=\"space-y-2\">
                      <label className=\"flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300\">
                        <Icon className={`w-4 h-4 ${field.color}`} />
                        {field.label}
                      </label>
                      <input
                        type={field.key === 'cashCollected' ? 'number' : 'number'}
                        min=\"0\"
                        step={field.key === 'cashCollected' ? '0.01' : '1'}
                        value={quantitativeData[field.key]}
                        onChange={(e) => updateQuantitativeData(field.key, e.target.value)}
                        className=\"w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all\"
                        placeholder={field.key === 'cashCollected' ? '0.00' : '0'}
                        required
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            // Step 2: Qualitative Data
            <div className=\"space-y-6\">
              <div className=\"text-center mb-6\">
                <h3 className=\"text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center justify-center gap-2\">
                  <MessageSquare className=\"w-5 h-5 text-indigo-500\" />
                  Daily Reflection
                </h3>
                <p className=\"text-slate-600 dark:text-slate-400 text-sm\">
                  Take a moment to reflect on your day and share your insights
                </p>
              </div>

              <div className=\"space-y-6\">
                {qualitativeQuestions.map((question) => (
                  <div key={question.key} className=\"space-y-2\">
                    <label className=\"text-sm font-medium text-slate-700 dark:text-slate-300\">
                      {question.label}
                    </label>
                    <textarea
                      value={qualitativeData[question.key]}
                      onChange={(e) => updateQualitativeData(question.key, e.target.value)}
                      rows={3}
                      className=\"w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none\"
                      placeholder={question.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className=\"bg-slate-50 dark:bg-slate-800 px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-700\">
          <div className=\"flex items-center gap-2\">
            {step === 2 && (
              <Button
                variant=\"ghost\"
                onClick={() => setStep(1)}
                className=\"flex items-center gap-2\"
              >
                <ArrowLeft className=\"w-4 h-4\" />
                Back
              </Button>
            )}
          </div>

          <div className=\"flex items-center gap-3\">
            <Button
              variant=\"outline\"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            {step === 1 ? (
              <Button
                onClick={() => setStep(2)}
                disabled={!isStep1Complete}
                className=\"flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700\"
              >
                Continue
                <ArrowRight className=\"w-4 h-4\" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className=\"flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700\"
              >
                {isSubmitting ? (
                  <>
                    <div className=\"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin\" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit EOD
                    <Send className=\"w-4 h-4\" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}