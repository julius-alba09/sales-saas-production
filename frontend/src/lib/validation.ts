import { z } from 'zod'

// Base schemas
export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')

export const uuidSchema = z.string().uuid('Invalid UUID')
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional()

// User registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  workspaceName: z.string().min(1, 'Workspace name is required').max(100, 'Workspace name too long'),
  role: z.enum(['manager', 'sales_rep', 'setter']),
  phone: phoneSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// User login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  phone: phoneSchema,
  timezone: z.string().optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional().nullable(),
  bio: z.string().max(500, 'Bio is too long').optional(),
  preferences: z.object({
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    weeklyReports: z.boolean().optional(),
  }).optional(),
})

// Workspace/Organization schema
export const workspaceUpdateSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100, 'Workspace name too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  settings: z.object({
    timezone: z.string().optional(),
    currency: z.string().length(3, 'Currency must be 3 letters').optional(),
    workingDays: z.array(z.number().min(0).max(6)).optional(),
    workingHours: z.object({
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    }).optional(),
    features: z.object({
      eodReporting: z.boolean().optional(),
      teamChat: z.boolean().optional(),
      analytics: z.boolean().optional(),
    }).optional(),
  }).optional(),
})

// Team member invitation schema
export const inviteTeamMemberSchema = z.object({
  email: emailSchema,
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  customMessage: z.string().max(500, 'Message is too long').optional(),
})

// Product schema
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Product name too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().length(3, 'Currency must be 3 letters').default('USD'),
  category: z.string().max(50, 'Category too long').optional(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
})

// EOD (End of Day) report schema
export const eodReportSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  callsMade: z.number().min(0, 'Calls made must be positive'),
  appointments: z.number().min(0, 'Appointments must be positive'),
  sales: z.number().min(0, 'Sales must be positive'),
  revenue: z.number().min(0, 'Revenue must be positive'),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  mood: z.enum(['excellent', 'good', 'average', 'poor', 'terrible']).optional(),
  challenges: z.string().max(500, 'Challenges description too long').optional(),
  wins: z.string().max(500, 'Wins description too long').optional(),
})

// File upload schema
export const fileUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required').max(255, 'File name too long'),
  fileType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif'], {
    errorMap: () => ({ message: 'Only JPEG, PNG, WebP, and GIF images are allowed' })
  }),
  fileSize: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
})

// API response schemas
export const apiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
})

export const apiSuccessSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
})

// Utility types
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type WorkspaceUpdateInput = z.infer<typeof workspaceUpdateSchema>
export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>
export type ProductInput = z.infer<typeof productSchema>
export type EODReportInput = z.infer<typeof eodReportSchema>
export type FileUploadInput = z.infer<typeof fileUploadSchema>

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

export function sanitizeInput(input: string): string {
  // Basic HTML entity encoding to prevent XSS
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}