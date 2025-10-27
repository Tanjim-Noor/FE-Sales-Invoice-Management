import axios from 'axios';
import type {
  AuthTokens,
  LoginCredentials,
  Invoice,
  Transaction,
  PaginatedResponse,
  CreateInvoiceData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = async (credentials: LoginCredentials): Promise<AuthTokens> => {
  const response = await apiClient.post('/auth/login/', credentials);
  return response.data;
};

export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  const response = await apiClient.post('/auth/refresh/', { refresh });
  return response.data;
};

// Invoice APIs
export const getInvoices = async (params?: any): Promise<PaginatedResponse<Invoice>> => {
  const response = await apiClient.get('/invoices/', { params });
  return response.data;
};

export const getInvoice = async (id: number): Promise<Invoice> => {
  const response = await apiClient.get(`/invoices/${id}/`);
  return response.data;
};

export const createInvoice = async (data: CreateInvoiceData): Promise<Invoice> => {
  const response = await apiClient.post('/invoices/', data);
  return response.data;
};

export const updateInvoice = async (id: number, data: Partial<CreateInvoiceData>): Promise<Invoice> => {
  const response = await apiClient.patch(`/invoices/${id}/`, data);
  return response.data;
};

export const payInvoice = async (id: number): Promise<Invoice> => {
  const response = await apiClient.post(`/invoices/${id}/pay/`, {});
  return response.data;
};

export const deleteInvoice = async (id: number): Promise<void> => {
  await apiClient.delete(`/invoices/${id}/`);
};

// Transaction APIs
export const getTransactions = async (params?: any): Promise<PaginatedResponse<Transaction>> => {
  const response = await apiClient.get('/transactions/', { params });
  return response.data;
};

export const getTransaction = async (id: number): Promise<Transaction> => {
  const response = await apiClient.get(`/transactions/${id}/`);
  return response.data;
};
