/**
 * Types cho Customer data từ view v_customer_client
 */

export interface RecentInvoice {
  id: number;
  kiotviet_id: number;
  code: string;
  purchase_date: string;
  total: number;
  total_payment: number;
  status: number;
  status_value: string;
  glt_paid: boolean | null;
  branch_name: string | null;
  sold_by_name: string | null;
  description: string | null;
}

export interface CustomerClient {
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
  recent_invoices: RecentInvoice[];
  recent_invoice_count: number;
  total_invoice_count: number;
  total_purchase_amount: number;
}

export interface CustomerResponse {
  customers_data: CustomerClient[];
}

