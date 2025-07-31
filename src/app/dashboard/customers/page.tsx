"use client"

import {useMemo, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {CustomerMutationModal} from "@/components/customers/customer-mutation-modal"
import {Plus, Search} from "lucide-react"
import CustomerTable from "@/components/customers/customer-table"
import {api} from "@/trpc/react"
import type {Customer} from "@/generated/prisma/client";
import {toast} from "sonner";

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [editCustomerData, setEditCustomerData] = useState<Customer | null>(null);
    // Replace these with your actual tRPC queries
    const customerCreateMutation = api.customer.createCustomer.useMutation()
    const customerUpdateMutation = api.customer.updateCustomer.useMutation()
    const allCustomersQuery = api.customer.getAllCustomer.useQuery()

    const {data: customersResponse, isLoading} = allCustomersQuery
    const customers = customersResponse?.data ?? []

    // Filter customers based on search term
    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers

        const searchLower = searchTerm.toLowerCase()
        return customers.filter(
            (customer) =>
                customer.id.toString().includes(searchLower) ||
                customer.name.toLowerCase().includes(searchLower) ||
                customer.surname.toLowerCase().includes(searchLower) ||
                customer.email.toLowerCase().includes(searchLower) ||
                customer.company?.toLowerCase()?.includes(searchLower) ||
                customer.contact?.toLowerCase()?.includes(searchLower),
        )
    }, [customers, searchTerm])

    const handleCreateCustomer = async (customerData: any) => {
        try {
            await customerCreateMutation.mutateAsync(customerData)
            await allCustomersQuery.refetch()
        } catch (error) {
            console.error("Failed to create customer:", error)
        }
    }

    const handleUpdateCustomer = async (customerData: any) => {
        try {
            await customerUpdateMutation.mutateAsync(customerData)
            await allCustomersQuery.refetch()
            toast.success("Customer updated successfully")
        } catch (error) {
            toast.error("Something went wrong.")
            console.error("Failed to update customer:", error)
        } finally {
            setEditCustomerData(null);
        }
    }

    const handleEditCustomer = (customer: Customer) => {
        setEditCustomerData(customer);
        setIsCustomerModalOpen(true)
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600">Manage your customers</p>
                </div>
                <Button onClick={() => setIsCustomerModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2"/>
                    Create Customer
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All customers</CardTitle>
                        <div className="flex items-center gap-4">
                            {/* Search Input */}
                            <div className="relative w-64">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter Summary */}
                    {searchTerm && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Showing {filteredCustomers.length} of {customers.length} customers
              </span>
                            <span>• Search: "{searchTerm}"</span>
                            <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}
                                    className="h-6 px-2 text-xs">
                                Clear search
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-gray-500">Loading customers...</div>
                        </div>
                    ) : (
                        <CustomerTable customers={filteredCustomers} onEdit={handleEditCustomer}/>
                    )}
                </CardContent>
            </Card>

            <CustomerMutationModal
                isOpen={isCustomerModalOpen}
                onClose={() => {
                    setEditCustomerData(null);
                    setIsCustomerModalOpen(false)
                }}
                editCustomerData={editCustomerData}
                onSubmit={editCustomerData ? handleUpdateCustomer : handleCreateCustomer}
            />
        </div>
    )
}
