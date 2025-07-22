export interface Order {
  id: number
  customer: string
  email: string
  date: string
  status: "pending" | "fulfilled" | "cancelled"
  total: number
  items: OrderItem[]
  phone?: string
  address?: string
  notes?: string
}

export interface OrderItem {
  name: string
  price: number
  quantity: number
}

export interface CreateOrderData {
  customer: string
  email: string
  phone?: string
  address?: string
  items: OrderItem[]
  notes?: string
  total: number
}

export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "user"
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
