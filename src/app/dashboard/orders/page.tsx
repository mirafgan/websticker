"use client"

import {useMemo, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {CreateOrderModal} from "@/components/create-order-modal"
import {Plus, Search} from "lucide-react"
import OrderTable from "@/components/order-table"
import {api} from "@/trpc/react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const orderMutation = api.order.create.useMutation();
    const allOrderQuery = api.order.getAllOrders.useQuery()
    const allStatusQuery = api.order.getAllOrdersStatus.useQuery();
    const updateOrderStatusMutation = api.order.updateOrderStatus.useMutation({
        onSuccess: () => {
            allOrderQuery.refetch()
        }
    });
    const {data: ordersResponse, isLoading} = allOrderQuery
    const {data: statusResponse} = allStatusQuery
    const orders = ordersResponse?.data ?? []
    const statuses = statusResponse?.data ?? []

    // Filter orders based on search term and status
    const filteredOrders = useMemo(() => {
        let filtered = orders

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter((order) => order.status.id.toString() === statusFilter)
        }

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (order) =>
                    order.id.toString().includes(searchLower) ||
                    order.contact.name.toLowerCase().includes(searchLower) ||
                    order.contact.surname.toLowerCase().includes(searchLower) ||
                    order.contact?.company?.toLowerCase()?.includes(searchLower) ||
                    order.contact.email.toLowerCase().includes(searchLower) ||
                    order.notes.toLowerCase().includes(searchLower) ||
                    order.products.some((product) => product.name.toLowerCase().includes(searchLower)),
            )
        }

        return filtered
    }, [orders, statusFilter, searchTerm])

    const handleCreateOrder = async (orderData: any) => {
        try {
            await orderMutation.mutateAsync(orderData);
            await allOrderQuery.refetch();
        } catch (error) {
            console.error("Failed to create order:", error)
        }
    }

    async function handleStatusUpdate(id: number, statusId: number) {
        try {
            await updateOrderStatusMutation.mutateAsync({id, statusId})
        } catch (e) {
            console.log(e)
        }
    }

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
                        <div className="flex items-center gap-4">
                            {/* Status Filter */}


                            {/* Search Input */}
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
                            <div className="">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.id} value={status.id.toString()}>
                                                {status.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Filter Summary */}
                    {(statusFilter !== "all" || searchTerm) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            Showing {filteredOrders.length} of {orders.length} orders
                          </span>
                            {statusFilter !== "all" && (
                                <span>• Status: {statuses.find((s) => s.id.toString() === statusFilter)?.name}</span>
                            )}
                            {searchTerm && <span>• Search: "{searchTerm}"</span>}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setStatusFilter("all")
                                    setSearchTerm("")
                                }}
                                className="h-6 px-2 text-xs"
                            >
                                Clear filters
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-gray-500">Loading orders...</div>
                        </div>
                    ) : (
                        <OrderTable orders={filteredOrders} statuses={statuses} statusOnSubmit={handleStatusUpdate}/>
                    )}
                </CardContent>
            </Card>
            {/*<InvoiceGenerator />*/}
            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateOrder}
            />
        </div>
    )
}
