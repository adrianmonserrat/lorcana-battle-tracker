export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      deck_statistics: {
        Row: {
          created_at: string
          deck_id: string
          defeats: number | null
          id: string
          ties: number | null
          total_matches: number | null
          updated_at: string
          user_id: string
          victories: number | null
          win_rate: number | null
        }
        Insert: {
          created_at?: string
          deck_id: string
          defeats?: number | null
          id?: string
          ties?: number | null
          total_matches?: number | null
          updated_at?: string
          user_id: string
          victories?: number | null
          win_rate?: number | null
        }
        Update: {
          created_at?: string
          deck_id?: string
          defeats?: number | null
          id?: string
          ties?: number | null
          total_matches?: number | null
          updated_at?: string
          user_id?: string
          victories?: number | null
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_statistics_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "user_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      match_records: {
        Row: {
          created_at: string
          game_format: string
          id: string
          initial_turn: string | null
          match_format: string
          notes: string | null
          notes_en: string | null
          notes_es: string | null
          opponent_deck_colors: string[]
          opponent_deck_id: string | null
          opponent_deck_name: string | null
          opponent_deck_name_en: string | null
          opponent_deck_name_es: string | null
          result: string
          user_deck_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          game_format: string
          id?: string
          initial_turn?: string | null
          match_format: string
          notes?: string | null
          notes_en?: string | null
          notes_es?: string | null
          opponent_deck_colors: string[]
          opponent_deck_id?: string | null
          opponent_deck_name?: string | null
          opponent_deck_name_en?: string | null
          opponent_deck_name_es?: string | null
          result: string
          user_deck_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          game_format?: string
          id?: string
          initial_turn?: string | null
          match_format?: string
          notes?: string | null
          notes_en?: string | null
          notes_es?: string | null
          opponent_deck_colors?: string[]
          opponent_deck_id?: string | null
          opponent_deck_name?: string | null
          opponent_deck_name_en?: string | null
          opponent_deck_name_es?: string | null
          result?: string
          user_deck_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_records_opponent_deck_id_fkey"
            columns: ["opponent_deck_id"]
            isOneToOne: false
            referencedRelation: "opponent_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_records_user_deck_id_fkey"
            columns: ["user_deck_id"]
            isOneToOne: false
            referencedRelation: "user_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      opponent_decks: {
        Row: {
          colors: string[]
          created_at: string
          description: string | null
          description_en: string | null
          description_es: string | null
          id: string
          name: string
          name_en: string | null
          name_es: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          colors: string[]
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_es?: string | null
          id?: string
          name: string
          name_en?: string | null
          name_es?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          colors?: string[]
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_es?: string | null
          id?: string
          name?: string
          name_en?: string | null
          name_es?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          identifier: string
          ip_address: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          identifier: string
          ip_address: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          identifier?: string
          ip_address?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_decks: {
        Row: {
          colors: string[]
          created_at: string
          format: string
          id: string
          name: string
          name_en: string | null
          name_es: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          colors: string[]
          created_at?: string
          format?: string
          id?: string
          name: string
          name_en?: string | null
          name_es?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          colors?: string[]
          created_at?: string
          format?: string
          id?: string
          name?: string
          name_en?: string | null
          name_es?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_rate_limit_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_rate_limit_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      recalculate_deck_statistics: {
        Args: { p_user_id: string; p_deck_id: string }
        Returns: undefined
      }
      validate_deck_name: {
        Args: { deck_name: string }
        Returns: boolean
      }
      validate_notes: {
        Args: { notes_text: string }
        Returns: boolean
      }
      validate_string_input: {
        Args: { input_value: string }
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
  public: {
    Enums: {},
  },
} as const
