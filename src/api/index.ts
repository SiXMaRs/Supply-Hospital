import axios from 'axios';
import * as T from '../types/api';

const api = axios.create({ 
  baseURL: 'http://192.168.19.55:30094', 
});

// ดึง Token มาใส่ Header อัตโนมัติทุก Request
api.interceptors.request.use((config) => {                 
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  login: (data: T.LoginRequest) => api.post('/auth/login', data),

  // Master Data (ใส่ / ปิดท้ายตาม Swagger)
  getDepartments: () => api.get('/departments/'),
  createDepartment: (data: T.DepartmentRequest) => api.post('/departments/', data),

  getItemCategories: () => api.get('/item-categories/'),
  createItemCategory: (data: T.ItemCategoryRequest) => api.post('/item-categories/', data),

  getItems: () => api.get('/items/'),
  createItem: (data: T.ItemRequest) => api.post('/items/', data),

  getLocations: () => api.get('/locations/'),
  createLocation: (data: T.LocationRequest) => api.post('/locations/', data),
  
  getUsers: () => api.get('/users/'),
  createUser: (data: T.CreateUserRequest) => api.post('/users/', data),

  // Intake (รับของสกปรก)
  getIntakes: () => api.get('/intakes/'),
  createIntake: (data: T.IntakeRequest) => api.post('/intakes/', data),

  // Wash (งานซัก/สเตอไรล์)
  getWashJobs: () => api.get('/wash-jobs/'),
  createWashJob: (data: T.WashJobRequest) => api.post('/wash-jobs/', data),
  getWashJobDetail: (id: string | number) => api.get(`/wash-jobs/${id}`),
  updateWashStatus: (id: string | number, status: string) => api.patch(`/wash-jobs/${id}/status`, { status }),
  completeWashJob: (id: string | number) => api.patch(`/wash-jobs/${id}/complete`),

  // Request (การขอเบิก)
  getRequests: () => api.get('/requests/'),
  createRequest: (data: T.OrderRequest) => api.post('/requests/', data),
  getRequestDetail: (id: string | number) => api.get(`/requests/${id}`),
  approveRequest: (id: string | number, approved: boolean) => api.patch(`/requests/${id}/approve`, { approved }),
  fulfillRequest: (id: string | number, data: T.FulfillmentRequest) => api.post(`/requests/${id}/fulfill`, data),

  // Inventory & Loss
  getAvailableStock: (itemId?: number) => api.get('/inventory/available', { params: { item_id: itemId } }),
  getStockMoves: () => api.get('/stock-moves/'),
  getLosses: () => api.get('/losses/'),
  createLoss: (data: any) => api.post('/losses/', data),

  // System
  checkHealth: () => api.get('/healthz/'),
};