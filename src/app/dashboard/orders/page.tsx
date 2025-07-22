"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {CreateOrderModal} from "@/components/create-order-modal"
import {Plus, Search} from "lucide-react"
import {ordersApi} from "@/lib/api/orders"
import type {Order} from "@/lib/types"
import OrderTable from "@/components/order-table";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        try {
            setIsLoading(true)
            const data = await ordersApi.getAll()
            setOrders(data)
        } catch (error) {
            console.error("Failed to load orders:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateOrder = async (orderData: any) => {
        try {
            const newOrder = await ordersApi.create(orderData)
            setOrders([newOrder, ...orders])
            setIsCreateModalOpen(false)
        } catch (error) {
            console.error("Failed to create order:", error)
        }
    }

    const filteredOrders = orders.filter(
        (order) =>
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toString().includes(searchTerm),
    )


    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600">Manage your store orders</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2"/>
                    Create order
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All orders</CardTitle>
                        <div className="relative w-64">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-gray-500">Loading orders...</div>
                        </div>
                    ) : (
                        <OrderTable orders={filteredOrders}/>
                    )}
                </CardContent>
            </Card>

            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateOrder}
            />
        </div>
    )
}
