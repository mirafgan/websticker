import { apiClient } from "./client"
import type { Order, CreateOrderData } from "@/lib/types"

export const ordersApi = {
  // Get all orders
  async getAll(): Promise<Order[]> {
    // Simulate API call with mock data for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1001,
            customer: "John Doe",
            email: "john@example.com",
            date: "2024-01-15",
            status: "fulfilled",
            total: 299.99,
            items: [{ name: "Wireless Headphones", price: 299.99, quantity: 1 }],
          },
          {
            id: 1002,
            customer: "Jane Smith",
            email: "jane@example.com",
            date: "2024-01-14",
            status: "pending",
            total: 149.5,
            items: [{ name: "Bluetooth Speaker", price: 149.5, quantity: 1 }],
          },
          {
            id: 1003,
            customer: "Mike Johnson",
            email: "mike@example.com",
            date: "2024-01-13",
            status: "cancelled",
            total: 89.99,
            items: [{ name: "Phone Case", price: 29.99, quantity: 3 }],
          },
        ])
      }, 500)
    })

    // Real API call would be:
    // return apiClient.get<Order[]>('/orders')
  },

  // Get single order
  async getById(id: number): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`)
  },

  // Create new order
  async create(data: CreateOrderData): Promise<Order> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          id: Date.now(),
          customer: data.customer,
          email: data.email,
          date: new Date().toLocaleDateString(),
          status: "pending",
          total: data.total,
          items: data.items,
        }
        resolve(newOrder)
      }, 1000)
    })

    // Real API call would be:
    // return apiClient.post<Order>('/orders', data)
  },

  // Update order
  async update(id: number, data: Partial<CreateOrderData>): Promise<Order> {
    return apiClient.put<Order>(`/orders/${id}`, data)
  },

  // Delete order
  async delete(id: number): Promise<void> {
    return apiClient.delete(`/orders/${id}`)
  },

  // Update order status
  async updateStatus(id: number, status: string): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}/status`, { status })
  },
}
