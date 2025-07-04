export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          match_format: string
          notes: string | null
          opponent_deck_colors: string[]
          opponent_deck_id: string | null
          opponent_deck_name: string
          result: string
          user_deck_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          game_format: string
          id?: string
          match_format: string
          notes?: string | null
          opponent_deck_colors: string[]
          opponent_deck_id?: string | null
          opponent_deck_name: string
          result: string
          user_deck_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          game_format?: string
          id?: string
          match_format?: string
          notes?: string | null
          opponent_deck_colors?: string[]
          opponent_deck_id?: string | null
          opponent_deck_name?: string
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
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          colors: string[]
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          colors?: string[]
          created_at?: string
          description?: string | null
          id?: string
          name?: string
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
      user_decks: {
        Row: {
          colors: string[]
          created_at: string
          format: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          colors: string[]
          created_at?: string
          format?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          colors?: string[]
          created_at?: string
          format?: string
          id?: string
          name?: string
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
      recalculate_deck_statistics: {
        Args: { p_user_id: string; p_deck_id: string }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
