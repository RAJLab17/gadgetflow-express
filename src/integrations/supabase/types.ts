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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      abandoned_carts: {
        Row: {
          converted: boolean
          created_at: string
          customer_email: string
          final_price: number
          id: string
          original_price: number
          product_name: string
          product_variant: string | null
          shopify_draft_order_id: string | null
        }
        Insert: {
          converted?: boolean
          created_at?: string
          customer_email: string
          final_price: number
          id?: string
          original_price: number
          product_name: string
          product_variant?: string | null
          shopify_draft_order_id?: string | null
        }
        Update: {
          converted?: boolean
          created_at?: string
          customer_email?: string
          final_price?: number
          id?: string
          original_price?: number
          product_name?: string
          product_variant?: string | null
          shopify_draft_order_id?: string | null
        }
        Relationships: []
      }
      launch_signups: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      preorders: {
        Row: {
          city: string
          country: string
          created_at: string
          customer_email: string
          customer_name: string
          discount_percent: number
          email_sent_at: string | null
          final_price: number
          id: string
          includes_free_cable: boolean
          order_number: string
          original_price: number
          phone: string | null
          postal_code: string
          product_name: string
          product_variant: string | null
          production_started_at: string | null
          quantity: number
          shipped_at: string | null
          status: string
          street_address: string
          updated_at: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          customer_email: string
          customer_name: string
          discount_percent?: number
          email_sent_at?: string | null
          final_price: number
          id?: string
          includes_free_cable?: boolean
          order_number: string
          original_price: number
          phone?: string | null
          postal_code: string
          product_name: string
          product_variant?: string | null
          production_started_at?: string | null
          quantity?: number
          shipped_at?: string | null
          status?: string
          street_address: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          discount_percent?: number
          email_sent_at?: string | null
          final_price?: number
          id?: string
          includes_free_cable?: boolean
          order_number?: string
          original_price?: number
          phone?: string | null
          postal_code?: string
          product_name?: string
          product_variant?: string | null
          production_started_at?: string | null
          quantity?: number
          shipped_at?: string | null
          status?: string
          street_address?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_likes: {
        Row: {
          created_at: string
          fingerprint: string
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          fingerprint: string
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string
          fingerprint?: string
          id?: string
          product_id?: string
        }
        Relationships: []
      }
      review_emails: {
        Row: {
          created_at: string
          email: string
          review_id: string
        }
        Insert: {
          created_at?: string
          email: string
          review_id: string
        }
        Update: {
          created_at?: string
          email?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_emails_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_emails_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "reviews_public"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          customer_name: string
          founder_responded_at: string | null
          founder_response: string | null
          helpful_count: number
          id: string
          product_id: string
          rating: number
          status: string
          title: string
          updated_at: string
          verified_purchase: boolean
        }
        Insert: {
          comment: string
          created_at?: string
          customer_name: string
          founder_responded_at?: string | null
          founder_response?: string | null
          helpful_count?: number
          id?: string
          product_id?: string
          rating: number
          status?: string
          title: string
          updated_at?: string
          verified_purchase?: boolean
        }
        Update: {
          comment?: string
          created_at?: string
          customer_name?: string
          founder_responded_at?: string | null
          founder_response?: string | null
          helpful_count?: number
          id?: string
          product_id?: string
          rating?: number
          status?: string
          title?: string
          updated_at?: string
          verified_purchase?: boolean
        }
        Relationships: []
      }
      unique_visitors: {
        Row: {
          id: string
          visited_at: string
        }
        Insert: {
          id: string
          visited_at?: string
        }
        Update: {
          id?: string
          visited_at?: string
        }
        Relationships: []
      }
      visitor_count: {
        Row: {
          count: number
          id: number
        }
        Insert: {
          count?: number
          id?: number
        }
        Update: {
          count?: number
          id?: number
        }
        Relationships: []
      }
      visitor_counter: {
        Row: {
          count: number
          id: number
        }
        Insert: {
          count?: number
          id?: number
        }
        Update: {
          count?: number
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      reviews_public: {
        Row: {
          comment: string | null
          created_at: string | null
          customer_name: string | null
          founder_responded_at: string | null
          founder_response: string | null
          helpful_count: number | null
          id: string | null
          product_id: string | null
          rating: number | null
          title: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          customer_name?: string | null
          founder_responded_at?: string | null
          founder_response?: string | null
          helpful_count?: number | null
          id?: string | null
          product_id?: string | null
          rating?: number | null
          title?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          customer_name?: string | null
          founder_responded_at?: string | null
          founder_response?: string | null
          helpful_count?: number | null
          id?: string | null
          product_id?: string | null
          rating?: number | null
          title?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_launch_signups_today_count: { Args: never; Returns: number }
      get_launch_signups_total: { Args: never; Returns: number }
      get_review_stats: {
        Args: { _product_id?: string }
        Returns: {
          average: number
          c1: number
          c2: number
          c3: number
          c4: number
          c5: number
          total: number
        }[]
      }
      increment_review_helpful: {
        Args: { _review_id: string }
        Returns: number
      }
      increment_visitor_count_v2: { Args: never; Returns: number }
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
  public: {
    Enums: {},
  },
} as const
