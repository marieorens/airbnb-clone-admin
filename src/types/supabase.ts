export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "guest" | "host" | "admin";
          is_host: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "guest" | "host" | "admin";
          is_host?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "guest" | "host" | "admin";
          is_host?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description: string;
          category: string;
          type: string | null;
          country: string | null;
          region: string | null;
          latitude: number | null;
          longitude: number | null;
          price_per_night: number;
          guest_count: number;
          room_count: number;
          bathroom_count: number;
          amenities: string[];
          status: "draft" | "pending_review" | "published" | "suspended" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: {
          status?: "draft" | "pending_review" | "published" | "suspended" | "archived";
          updated_at?: string;
        };
        Relationships: [];
      };
      listing_photos: {
        Row: {
          id: string;
          listing_id: string;
          storage_path: string;
          public_url: string | null;
          alt_text: string | null;
          position: number;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          listing_id: string;
          guest_id: string;
          host_id: string;
          check_in: string;
          check_out: string;
          night_count: number;
          price_per_night: number;
          total_price: number;
          status:
            | "pending_payment"
            | "confirmed"
            | "cancelled_by_guest"
            | "cancelled_by_host"
            | "completed"
            | "refunded";
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: {
          status?:
            | "pending_payment"
            | "confirmed"
            | "cancelled_by_guest"
            | "cancelled_by_host"
            | "completed"
            | "refunded";
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          booking_id: string | null;
          user_id: string;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          amount: number;
          currency: string;
          status: "pending" | "paid" | "failed" | "refunded";
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          target_table: string | null;
          target_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          admin_id?: string | null;
          action: string;
          target_table?: string | null;
          target_id?: string | null;
          metadata?: Json;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
