'use client'

import { useState } from 'react'
import { 
  PhoneIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  TargetIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function SetterDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Mock data - would come from API
  const todayMetrics = {
    outboundCalls: 45,
    minutesMessaging: 120,
    triageOffersMade: 12,
    triageCallsBooked: 8,
    consultOffersMade: 6,
    consultCallsBooked: 3,
    scheduledSets: 5,
    closedSets: 2
  }

  // Calculate rates
  const triageBookedRate = (todayMetrics.triageCallsBooked / todayMetrics.triageOffersMade) * 100
  const consultBookedRate = (todayMetrics.consultCallsBooked / todayMetrics.consultOffersMade) * 100
  const closeRate = (todayMetrics.closedSets / todayMetrics.scheduledSets) * 100

  const weeklyComparison = {
    outboundCalls: { current: 280, previous: 245, change: '+14.3%' },
    triageBooked: { current: 52, previous: 48, change: '+8.3%' },
    consultBooked: { current: 24, previous: 22, change: '+9.1%' },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointment Setter Dashboard</h1>
              <p className="text-sm text-gray-600">
                Track your appointment setting performance and booking rates
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Outbound Calls
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {todayMetrics.outboundCalls}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-600">
                  Weekly: {weeklyComparison.outboundCalls.current}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChatBubbleLeftIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Minutes Messaging
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {todayMetrics.minutesMessaging}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-600">
                  {(todayMetrics.minutesMessaging / 60).toFixed(1)} hours
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Triage Booked
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {todayMetrics.triageCallsBooked}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-green-600">
                  Rate: {triageBookedRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TargetIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Consult Booked
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {todayMetrics.consultCallsBooked}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-green-600">
                  Rate: {consultBookedRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Performance Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Triage Offers Made</span>
                <span className="text-sm font-semibold text-gray-900">{todayMetrics.triageOffersMade}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Triage Calls Booked</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{todayMetrics.triageCallsBooked}</span>
                  <div className="text-xs text-green-600">
                    {triageBookedRate.toFixed(1)}% booking rate
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Consult Offers Made</span>
                <span className="text-sm font-semibold text-gray-900">{todayMetrics.consultOffersMade}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Consult Calls Booked</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{todayMetrics.consultCallsBooked}</span>
                  <div className="text-xs text-green-600">
                    {consultBookedRate.toFixed(1)}% booking rate
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Scheduled Sets</span>
                <span className="text-sm font-semibold text-gray-900">{todayMetrics.scheduledSets}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Closed Sets</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{todayMetrics.closedSets}</span>
                  <div className="text-xs text-green-600">
                    {closeRate.toFixed(1)}% close rate
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Comparison</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Outbound Calls</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {weeklyComparison.outboundCalls.current}
                    </span>
                    <div className="text-xs text-green-600">
                      {weeklyComparison.outboundCalls.change} vs last week
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Triage Booked</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {weeklyComparison.triageBooked.current}
                    </span>
                    <div className="text-xs text-green-600">
                      {weeklyComparison.triageBooked.change} vs last week
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Consult Booked</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {weeklyComparison.consultBooked.current}
                    </span>
                    <div className="text-xs text-green-600">
                      {weeklyComparison.consultBooked.change} vs last week
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Rate Trends */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-gray-400" />
            Booking Rate Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {triageBookedRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Triage Booking Rate
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {todayMetrics.triageCallsBooked} of {todayMetrics.triageOffersMade} offers
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {consultBookedRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Consult Booking Rate
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {todayMetrics.consultCallsBooked} of {todayMetrics.consultOffersMade} offers
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {closeRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Set Close Rate
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {todayMetrics.closedSets} of {todayMetrics.scheduledSets} sets
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border border-gray-200 rounded">
              <ClockIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900">
                {(todayMetrics.minutesMessaging / todayMetrics.outboundCalls).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Avg. messaging time per call (min)</div>
            </div>

            <div className="text-center p-3 border border-gray-200 rounded">
              <TargetIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900">
                {((todayMetrics.triageCallsBooked + todayMetrics.consultCallsBooked) / todayMetrics.outboundCalls * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Overall booking rate</div>
            </div>

            <div className="text-center p-3 border border-gray-200 rounded">
              <ChartBarIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900">
                {(todayMetrics.outboundCalls / 8).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Calls per hour (8hr day)</div>
            </div>

            <div className="text-center p-3 border border-gray-200 rounded">
              <CalendarIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900">
                {todayMetrics.triageCallsBooked + todayMetrics.consultCallsBooked}
              </div>
              <div className="text-xs text-gray-500">Total appointments booked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}