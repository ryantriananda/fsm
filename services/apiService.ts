const API_BASE_URL = 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Asset Categories
export const assetCategoryAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/asset-categories`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/asset-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/asset-categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/asset-categories/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};

// Asset Locations
export const assetLocationAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/asset-locations`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/asset-locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/asset-locations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/asset-locations/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};

// Asset Status
export const assetStatusAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/asset-statuses`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/asset-statuses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/asset-statuses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/asset-statuses/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};

// Assets
export const assetAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/assets`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};

// Vendors
export const vendorAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/vendors`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/vendors/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};

// Contracts
export const contractAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/contracts`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/contracts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/contracts/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};


// Maintenance Schedules
export const maintenanceScheduleAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/maintenance-schedules`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/maintenance-schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/maintenance-schedules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/maintenance-schedules/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};

// Maintenance Types
export const maintenanceTypeAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/maintenance-types`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/maintenance-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/maintenance-types/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/maintenance-types/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};

// Disposals
export const disposalAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/disposals`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/disposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/disposals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/disposals/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};

// Asset Documents
export const assetDocumentAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/asset-documents`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/asset-documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/asset-documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/asset-documents/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};

// Spareparts
export const sparepartAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/spareparts`);
    return res.json() as Promise<ApiResponse<any[]>>;
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/spareparts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE_URL}/spareparts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/spareparts/${id}`, {
      method: 'DELETE',
    });
    return res.json() as Promise<ApiResponse<any>>;
  },
};
