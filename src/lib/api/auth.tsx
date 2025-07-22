import { apiClient } from "./client"
import type { User } from "@/lib/types"

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export const authApi = {
  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials)

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", response.token)
    }

    return response
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post("/auth/logout")

    // Remove token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>("/auth/me")
  },

  // Refresh token
  async refreshToken(): Promise<{ token: string }> {
    return apiClient.post<{ token: string }>("/auth/refresh")
  },
}
