export interface OrderItem {
    name: string
    price: number
    quantity: number
}

export interface CreateOrderData {
    contact: string
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


export interface Product {
    id: number
    name: string
    price: number
    quantity: number
    material: string
    size: string
}

export interface Status {
    id: number
    name: string
}

export interface Contact {
    id: number
    name: string
    surname: string
    email: string
    company: string | null
    country: string
    contact: string
    cargoAddress: string
    billingAddress: string
    ico: number | null
    dico: string | null
    deletedAt: Date | null
}

export interface Order {
    id: number
    total: number
    notes: string
    createdAt: Date
    products: Product[]
    status: Status
    contact: Contact
}
