export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          target_organization_id: string | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_organization_id?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_organization_id?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_target_organization_id_fkey"
            columns: ["target_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_questions: {
        Row: {
          created_at: string | null
          field_name: string
          id: string
          input_type: string
          is_required: boolean | null
          order_index: number
          organization_id: string
          question_text: string
          question_type: string
          section: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          field_name: string
          id?: string
          input_type: string
          is_required?: boolean | null
          order_index: number
          organization_id: string
          question_text: string
          question_type: string
          section: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          field_name?: string
          id?: string
          input_type?: string
          is_required?: boolean | null
          order_index?: number
          organization_id?: string
          question_text?: string
          question_type?: string
          section?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_questions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          call_close_rate: number | null
          cash_per_call: number | null
          cash_per_offer: number | null
          closes: number | null
          created_at: string | null
          deposits: number | null
          id: string
          live_calls: number | null
          offer_close_rate: number | null
          offer_rate: number | null
          offers_made: number | null
          organization_id: string | null
          report_date: string
          scheduled_calls: number | null
          show_rate: number | null
          total_cash_collected: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          call_close_rate?: number | null
          cash_per_call?: number | null
          cash_per_offer?: number | null
          closes?: number | null
          created_at?: string | null
          deposits?: number | null
          id?: string
          live_calls?: number | null
          offer_close_rate?: number | null
          offer_rate?: number | null
          offers_made?: number | null
          organization_id?: string | null
          report_date: string
          scheduled_calls?: number | null
          show_rate?: number | null
          total_cash_collected?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          call_close_rate?: number | null
          cash_per_call?: number | null
          cash_per_offer?: number | null
          closes?: number | null
          created_at?: string | null
          deposits?: number | null
          id?: string
          live_calls?: number | null
          offer_close_rate?: number | null
          offer_rate?: number | null
          offers_made?: number | null
          organization_id?: string | null
          report_date?: string
          scheduled_calls?: number | null
          show_rate?: number | null
          total_cash_collected?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      eod_responses: {
        Row: {
          consults_notes: string | null
          conversations_updated: boolean | null
          created_at: string | null
          day_summary: string | null
          full_potential: boolean | null
          help_needed: string | null
          hit_projections: boolean | null
          id: string
          organization_id: string
          overall_performance: string | null
          overcame_objections: boolean | null
          pipeline_updated: boolean | null
          positive_energy: boolean | null
          report_date: string
          self_rating: number | null
          uncovered_pain: boolean | null
          user_id: string
          warm_leads_remaining: number | null
        }
        Insert: {
          consults_notes?: string | null
          conversations_updated?: boolean | null
          created_at?: string | null
          day_summary?: string | null
          full_potential?: boolean | null
          help_needed?: string | null
          hit_projections?: boolean | null
          id?: string
          organization_id: string
          overall_performance?: string | null
          overcame_objections?: boolean | null
          pipeline_updated?: boolean | null
          positive_energy?: boolean | null
          report_date: string
          self_rating?: number | null
          uncovered_pain?: boolean | null
          user_id: string
          warm_leads_remaining?: number | null
        }
        Update: {
          consults_notes?: string | null
          conversations_updated?: boolean | null
          created_at?: string | null
          day_summary?: string | null
          full_potential?: boolean | null
          help_needed?: string | null
          hit_projections?: boolean | null
          id?: string
          organization_id?: string
          overall_performance?: string | null
          overcame_objections?: boolean | null
          pipeline_updated?: boolean | null
          positive_energy?: boolean | null
          report_date?: string
          self_rating?: number | null
          uncovered_pain?: boolean | null
          user_id?: string
          warm_leads_remaining?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eod_responses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      eom_responses: {
        Row: {
          changes_next_month: string | null
          created_at: string | null
          goal_next_month: string | null
          goal_reached: boolean | null
          help_needed: string | null
          id: string
          month_summary: string | null
          month_year: string
          monthly_goal: string | null
          organization_id: string
          success_factors: string | null
          user_id: string
        }
        Insert: {
          changes_next_month?: string | null
          created_at?: string | null
          goal_next_month?: string | null
          goal_reached?: boolean | null
          help_needed?: string | null
          id?: string
          month_summary?: string | null
          month_year: string
          monthly_goal?: string | null
          organization_id: string
          success_factors?: string | null
          user_id: string
        }
        Update: {
          changes_next_month?: string | null
          created_at?: string | null
          goal_next_month?: string | null
          goal_reached?: boolean | null
          help_needed?: string | null
          id?: string
          month_summary?: string | null
          month_year?: string
          monthly_goal?: string | null
          organization_id?: string
          success_factors?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "eom_responses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      eow_responses: {
        Row: {
          changes_next_week: string | null
          created_at: string | null
          goal_next_week: string | null
          goal_reached: boolean | null
          help_needed: string | null
          id: string
          organization_id: string
          success_factors: string | null
          user_id: string
          week_start_date: string
          week_summary: string | null
          weekly_goal: string | null
        }
        Insert: {
          changes_next_week?: string | null
          created_at?: string | null
          goal_next_week?: string | null
          goal_reached?: boolean | null
          help_needed?: string | null
          id?: string
          organization_id: string
          success_factors?: string | null
          user_id: string
          week_start_date: string
          week_summary?: string | null
          weekly_goal?: string | null
        }
        Update: {
          changes_next_week?: string | null
          created_at?: string | null
          goal_next_week?: string | null
          goal_reached?: boolean | null
          help_needed?: string | null
          id?: string
          organization_id?: string
          success_factors?: string | null
          user_id?: string
          week_start_date?: string
          week_summary?: string | null
          weekly_goal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eow_responses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string | null
          daily_email_per_rep: boolean | null
          daily_team_totals: boolean | null
          id: string
          manager_email: string | null
          monthly_email_per_rep: boolean | null
          monthly_team_totals: boolean | null
          organization_id: string
          slack_webhook_url: string | null
          updated_at: string | null
          weekly_email_per_rep: boolean | null
          weekly_team_totals: boolean | null
        }
        Insert: {
          created_at?: string | null
          daily_email_per_rep?: boolean | null
          daily_team_totals?: boolean | null
          id?: string
          manager_email?: string | null
          monthly_email_per_rep?: boolean | null
          monthly_team_totals?: boolean | null
          organization_id: string
          slack_webhook_url?: string | null
          updated_at?: string | null
          weekly_email_per_rep?: boolean | null
          weekly_team_totals?: boolean | null
        }
        Update: {
          created_at?: string | null
          daily_email_per_rep?: boolean | null
          daily_team_totals?: boolean | null
          id?: string
          manager_email?: string | null
          monthly_email_per_rep?: boolean | null
          monthly_team_totals?: boolean | null
          organization_id?: string
          slack_webhook_url?: string | null
          updated_at?: string | null
          weekly_email_per_rep?: boolean | null
          weekly_team_totals?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          custom_domain: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_sales: {
        Row: {
          cash_collected: number | null
          closes: number | null
          created_at: string | null
          daily_report_id: string
          id: string
          product_id: string
        }
        Insert: {
          cash_collected?: number | null
          closes?: number | null
          created_at?: string | null
          daily_report_id: string
          id?: string
          product_id: string
        }
        Update: {
          cash_collected?: number | null
          closes?: number | null
          created_at?: string | null
          daily_report_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_sales_daily_report_id_fkey"
            columns: ["daily_report_id"]
            isOneToOne: false
            referencedRelation: "daily_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean | null
          last_name: string | null
          organization_id: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          id: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          last_name?: string | null
          organization_id?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          last_name?: string | null
          organization_id?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      setter_reports: {
        Row: {
          closed_sets: number | null
          consult_calls_booked: number | null
          consult_offers_made: number | null
          created_at: string | null
          id: string
          minutes_messaging: number | null
          organization_id: string
          outbound_calls: number | null
          report_date: string
          scheduled_sets: number | null
          triage_calls_booked: number | null
          triage_offers_made: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          closed_sets?: number | null
          consult_calls_booked?: number | null
          consult_offers_made?: number | null
          created_at?: string | null
          id?: string
          minutes_messaging?: number | null
          organization_id: string
          outbound_calls?: number | null
          report_date: string
          scheduled_sets?: number | null
          triage_calls_booked?: number | null
          triage_offers_made?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          closed_sets?: number | null
          consult_calls_booked?: number | null
          consult_offers_made?: number | null
          created_at?: string | null
          id?: string
          minutes_messaging?: number | null
          organization_id?: string
          outbound_calls?: number | null
          report_date?: string
          scheduled_sets?: number | null
          triage_calls_booked?: number | null
          triage_offers_made?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setter_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_team_totals: {
        Args: { end_date: string; org_id: string; start_date: string }
        Returns: {
          avg_call_close_rate: number
          avg_offer_rate: number
          avg_show_rate: number
          total_cash_collected: number
          total_closes: number
          total_deposits: number
          total_live_calls: number
          total_offers_made: number
          total_scheduled_calls: number
        }[]
      }
      is_client_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_platform_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
