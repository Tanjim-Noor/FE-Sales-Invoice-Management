// TypeScript interfaces for the Sales Invoice Management System

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: string;
  line_total?: string;
}

export interface Invoice {
  id: number;
  reference_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  status: 'Pending' | 'Paid';
  total_amount: string;
  items: InvoiceItem[];
  transactions?: Transaction[];
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  transaction_type: 'Sale' | 'Payment';
  amount: string;
  invoice: {
    id: number;
    reference_number: string;
  };
  transaction_date: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface CreateInvoiceData {
  reference_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  items: Omit<InvoiceItem, 'id' | 'line_total'>[];
}
