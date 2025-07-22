import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

// API Client Configuration
class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api") {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Log request in development
        if (process.env.NODE_ENV === "development") {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data)
        }

        return config
      },
      (error) => {
        console.error("Request error:", error)
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development
        if (process.env.NODE_ENV === "development") {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
        }
        return response
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Unauthorized - redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token")
            window.location.href = "/login"
          }
        }

        if (error.response?.status === 403) {
          console.error("Forbidden: You do not have permission to access this resource")
        }

        if (error.response?.status >= 500) {
          console.error("Server error:", error.response.data)
        }

        console.error("Response error:", error.response?.data || error.message)
        return Promise.reject(error)
      },
    )
  }

  // Generic HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for better TypeScript support
export type { AxiosRequestConfig, AxiosResponse }
