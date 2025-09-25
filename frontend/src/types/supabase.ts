export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          settings: Json
          is_active: boolean
          plan_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          settings?: Json
          is_active?: boolean
          plan_type?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          settings?: Json
          is_active?: boolean
          plan_type?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          id: string
          user_id: string
          workspace_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_id: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_id?: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          price: number
          currency: string
          category: string | null
          is_active: boolean
          metadata: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          price?: number
          currency?: string
          category?: string | null
          is_active?: boolean
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          category?: string | null
          is_active?: boolean
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_workspace_id_fkey"
            columns: ["workspace_id"]
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      eod_reports: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          report_date: string
          calls_made: number
          appointments: number
          sales: number
          revenue: number
          notes: string | null
          mood: 'excellent' | 'good' | 'average' | 'poor' | 'terrible' | null
          challenges: string | null
          wins: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          report_date: string
          calls_made?: number
          appointments?: number
          sales?: number
          revenue?: number
          notes?: string | null
          mood?: 'excellent' | 'good' | 'average' | 'poor' | 'terrible' | null
          challenges?: string | null
          wins?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          report_date?: string
          calls_made?: number
          appointments?: number
          sales?: number
          revenue?: number
          notes?: string | null
          mood?: 'excellent' | 'good' | 'average' | 'poor' | 'terrible' | null
          challenges?: string | null
          wins?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "eod_reports_workspace_id_fkey"
            columns: ["workspace_id"]
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eod_reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      admin_function_audit: {
        Row: {
          id: string
          user_id: string | null
          workspace_id: string | null
          function_name: string
          executed_at: string
          ip_address: string | null
          user_agent: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          user_id?: string | null
          workspace_id?: string | null
          function_name: string
          executed_at?: string
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string | null
          workspace_id?: string | null
          function_name?: string
          executed_at?: string
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "admin_function_audit_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_function_audit_workspace_id_fkey"
            columns: ["workspace_id"]
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          avatar_url: string | null
          role: 'manager' | 'sales_rep' | 'setter'
          organization_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          avatar_url?: string | null
          role?: 'manager' | 'sales_rep' | 'setter'
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          avatar_url?: string | null
          role?: 'manager' | 'sales_rep' | 'setter'
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_workspace_admin_permission: {
        Args: {
          workspace_uuid: string
        }
        Returns: boolean
      }
      get_workspace_stats: {
        Args: {
          workspace_uuid: string
        }
        Returns: {
          total_members: number
          active_members: number
          total_products: number
          active_products: number
          total_eod_reports: number
          this_month_reports: number
          total_revenue: number
          this_month_revenue: number
        }[]
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      workspace_role: 'owner' | 'admin' | 'member' | 'viewer'
      eod_mood: 'excellent' | 'good' | 'average' | 'poor' | 'terrible'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}