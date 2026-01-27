/**
 * Database types cho Supabase
 * Được generate từ Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      kv_customers: {
        Row: {
          id: number;
          kiotviet_id: number;
          code: string | null;
          name: string | null;
          contact_number: string | null;
          address: string | null;
          groups: string | null;
          glt_customer_group_name: string | null;
          debt: number | null;
          glt_is_active: boolean;
          created_date: string | null;
        };
        Insert: never;
        Update: never;
      };
      kv_invoices: {
        Row: {
          id: number;
          kiotviet_id: number | null;
          code: string | null;
          purchase_date: string | null;
          total: number | null;
          total_payment: number | null;
          status: number | null;
          status_value: string | null;
          glt_paid: boolean | null;
          branch_name: string | null;
          sold_by_name: string | null;
          description: string | null;
        };
        Insert: never;
        Update: never;
      };
    };
    Views: {
      v_customer_client: {
        Row: {
          customer_id: number;
          customer_kiotviet_id: number;
          customer_code: string;
          customer_name: string;
          contact_number: string | null;
          address: string | null;
          customer_group: string | null;
          glt_customer_group_name: string | null;
          debt: number | null;
          glt_is_active: boolean;
          customer_created_date: string | null;
          recent_invoices: Json;
          recent_invoice_count: number;
          total_invoice_count: number;
          total_purchase_amount: number;
        };
        Insert: never;
        Update: never;
      };
    };
    Functions: {};
    Enums: {};
  };
}

