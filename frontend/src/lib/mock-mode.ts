// Mock mode for testing when Supabase is not available
// This allows you to test the UI and functionality without a backend

export const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

// Mock user data
export const MOCK_USER = {
  id: '12345678-1234-1234-1234-123456789012',
  email: 'demo@example.com',
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
}

export const MOCK_WORKSPACE = {
  id: '87654321-4321-4321-4321-210987654321',
  name: 'Demo Workspace',
  description: 'A demo workspace for testing',
  settings: {
    timezone: 'UTC',
    currency: 'USD',
    workingDays: [1, 2, 3, 4, 5],
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
    features: {
      eodReporting: true,
      teamChat: true,
      analytics: true,
    }
  },
  is_active: true,
  plan_type: 'pro',
  created_at: new Date().toISOString(),
}

export const MOCK_WORKSPACE_MEMBER = {
  id: '11111111-1111-1111-1111-111111111111',
  role: 'owner' as const,
  is_active: true,
  workspace: MOCK_WORKSPACE,
}

export const MOCK_TEAM_MEMBERS = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    userId: '22222222-2222-2222-2222-222222222222',
    email: 'john@example.com',
    fullName: 'John Smith',
    role: 'admin' as const,
    isActive: true,
    joinedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    userId: '33333333-3333-3333-3333-333333333333',
    email: 'sarah@example.com',
    fullName: 'Sarah Johnson',
    role: 'member' as const,
    isActive: true,
    joinedAt: '2024-02-01T14:30:00Z',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    userId: '44444444-4444-4444-4444-444444444444',
    email: 'mike@example.com',
    fullName: 'Mike Wilson',
    role: 'viewer' as const,
    isActive: true,
    joinedAt: '2024-02-15T09:15:00Z',
  },
]

export const MOCK_PRODUCTS = [
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Premium CRM Package',
    description: 'Our flagship CRM solution with advanced analytics',
    price: 299.99,
    currency: 'USD',
    category: 'Software',
    is_active: true,
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Sales Training Course',
    description: 'Comprehensive sales training for new team members',
    price: 149.99,
    currency: 'USD',
    category: 'Training',
    is_active: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    name: 'Lead Generation Tool',
    description: 'AI-powered lead generation and qualification system',
    price: 199.99,
    currency: 'USD',
    category: 'Software',
    is_active: true,
    created_at: '2024-02-01T11:00:00Z',
    updated_at: '2024-02-01T11:00:00Z',
  },
]

export const MOCK_EOD_REPORTS = [
  {
    id: '88888888-8888-8888-8888-888888888888',
    date: '2024-09-25',
    callsMade: 45,
    appointments: 8,
    sales: 3,
    revenue: 899.97,
    notes: 'Great day! Closed three deals and have strong follow-ups scheduled.',
    mood: 'excellent' as const,
    challenges: 'Had some technical issues with the CRM in the morning',
    wins: 'Successfully closed the biggest deal this quarter',
    user: {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      fullName: 'Demo User',
    },
    createdAt: '2024-09-25T17:30:00Z',
    updatedAt: '2024-09-25T17:30:00Z',
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    date: '2024-09-24',
    callsMade: 38,
    appointments: 6,
    sales: 2,
    revenue: 599.98,
    notes: 'Solid day with good prospect conversations.',
    mood: 'good' as const,
    challenges: 'Needed more qualified leads',
    wins: 'Two quick closes on existing prospects',
    user: {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      fullName: 'Demo User',
    },
    createdAt: '2024-09-24T17:45:00Z',
    updatedAt: '2024-09-24T17:45:00Z',
  },
]

// Mock API responses
export const mockApiResponses = {
  '/api/profile': {
    user: MOCK_USER,
    workspace: MOCK_WORKSPACE,
    membership: MOCK_WORKSPACE_MEMBER,
  },
  '/api/team': {
    members: MOCK_TEAM_MEMBERS,
    pagination: {
      page: 1,
      limit: 20,
      total: MOCK_TEAM_MEMBERS.length,
      pages: 1,
    },
  },
  '/api/products': {
    products: MOCK_PRODUCTS,
    pagination: {
      page: 1,
      limit: 20,
      total: MOCK_PRODUCTS.length,
      pages: 1,
    },
  },
  '/api/eod': {
    reports: MOCK_EOD_REPORTS,
    pagination: {
      page: 1,
      limit: 20,
      total: MOCK_EOD_REPORTS.length,
      pages: 1,
    },
  },
}

// Mock authentication functions
export const mockAuth = {
  signUp: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
    return { user: MOCK_USER, error: null }
  },
  signIn: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { user: MOCK_USER, error: null }
  },
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { error: null }
  },
  getUser: async () => {
    return { user: MOCK_USER, error: null }
  },
}

// Helper to simulate API calls in mock mode
export async function mockApiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700)) // Simulate network delay
  
  const response = mockApiResponses[endpoint as keyof typeof mockApiResponses]
  if (response) {
    return { success: true, data: response } as T
  }
  
  // Default response for unknown endpoints
  return { success: true, data: { message: 'Mock response' } } as T
}