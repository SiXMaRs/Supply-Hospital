import axiosClient from '.';

/**
 * รวมทุก API Path ตาม Swagger
 */
export const apiService = {
  // --- Health Check ---
  checkHealth: () => axiosClient.get('/healthz/'), //

  // --- Auth ---
  login: (data: any) => axiosClient.post('/auth/login', data), //

  // --- Master Data (ข้อมูลหลัก) ---
  master: {
    getDepartments: () => axiosClient.get('/departments/'), //
    createDepartment: (data: any) => axiosClient.post('/departments/', data), //
    getCategories: () => axiosClient.get('/item-categories/'), //
    createCategory: (data: any) => axiosClient.post('/item-categories/', data), //
    getItems: () => axiosClient.get('/items/'), //
    createItem: (data: any) => axiosClient.post('/items/', data), //
    getLocations: () => axiosClient.get('/locations/'), //
    createLocation: (data: any) => axiosClient.post('/locations/', data), //
    getUsers: () => axiosClient.get('/users/'), //
    createUser: (data: any) => axiosClient.post('/users/', data), //
  },

  // --- Intake (รับผ้าสกปรก) ---
  intake: {
    getAll: () => axiosClient.get('/intakes/'), //
    create: (data: any) => axiosClient.post('/intakes/', data), //
  },

  // --- Wash (งานซัก/สเตอไรส์) ---
  wash: {
    getAll: () => axiosClient.get('/wash-jobs/'), //
    create: (data: any) => axiosClient.post('/wash-jobs/', data), //
    getById: (id: string) => axiosClient.get(`/wash-jobs/${id}`), //
    updateStatus: (id: string, status: string) => 
      axiosClient.patch(`/wash-jobs/${id}/status`, { status }), //
    complete: (id: string, data: any) => 
      axiosClient.patch(`/wash-jobs/${id}/complete`, data), // (สร้าง batch สะอาด)
  },

  // --- Request & Fulfillment (ใบเบิกและจ่ายของ) ---
  request: {
    getAll: () => axiosClient.get('/requests/'), //
    create: (data: any) => axiosClient.post('/requests/', data), // (Ward เป็นคนทำ)
    getById: (id: string) => axiosClient.get(`/requests/${id}`), //
    approve: (id: string, data: { status: string }) => 
      axiosClient.patch(`/requests/${id}/approve`, data), //
    fulfill: (id: string, data: any) => 
      axiosClient.post(`/requests/${id}/fulfill`, data), // (เลือก batch ตัดสต็อก)
  },

  // --- Inventory & Ledger ---
  inventory: {
    getAvailable: (itemId?: string) => 
      axiosClient.get('/inventory/available', { params: { item_id: itemId } }), //
    getStockMoves: () => axiosClient.get('/stock-moves/'), //
  },

  // --- Loss (สูญเสีย/ชำรุด) ---
  loss: {
    getAll: () => axiosClient.get('/losses/'), //
    create: (data: any) => axiosClient.post('/losses/', data), //
  }
};