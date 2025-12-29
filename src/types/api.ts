// --- Auth ---
export interface LoginRequest {
  email: string;
  password: string;
}

// --- Master Data ---
export interface DepartmentRequest {
  code: string;
  name: string;
  type: string;
  is_active: boolean;
}

export interface ItemCategoryRequest {
  code: string;
  name: string;
  is_active: boolean;
}

export interface ItemRequest {
  category_id: number;
  code: string;
  name: string;
  uom: string;
  track_by_piece: boolean;
  sterile_required: boolean;
  standard_par_qty: number;
  is_active: boolean;
}

export interface LocationRequest {
  code: string;
  name: string;
  type: string;
  department_id: number;
  parent_id: number;
  is_active: boolean;
}

export interface CreateUserRequest {
  department_id: number;
  role: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  password: string;
}

// --- Transactions ---
export interface IntakeRequest {
  department_id: number;
  sent_by: string;
  received_by: string;
  ref_no: string;
  received_at: string;
  notes: string;
  items: {
    item_id: number;
    qty_received: number;
    condition_note: string;
    bag_no: string;
  }[];
}

export interface WashJobRequest {
  intake_id: number;
  job_no: string;
  cycle_type: string;
  notes: string;
  items: {
    intake_item_id: number;
    item_id: number;
    qty_input: number;
  }[];
}

export interface OrderRequest {
  department_id: number;
  requested_by: string;
  needed_on: string;
  priority: string;
  notes: string;
  items: {
    item_id: number;
    qty_requested: number;
  }[];
}

export interface FulfillmentRequest {
  fills: {
    request_item_id: number;
    batch_id: number;
    qty: number;
    issued_by: string;
    delivered_by: string;
  }[];
}