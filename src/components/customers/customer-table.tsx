"use client"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {countries} from "@/lib/countries"
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {api} from "@/trpc/react";
import useConfirmationModalStore from "@/store/confirmation-modal-store";

interface Customer {
    id: number
    name: string
    surname: string
    email: string
    ico: number | null
    dico: string | null
    billingAddress?: string
    cargoAddress?: string
    company: string | null
    contact?: string
    country?: string
    createdAt: Date
}

interface CustomerTableProps {
    customers: Customer[]
    onEdit?: (customer: Customer) => void
}

const getCountryName = (countryId: string) => {
    const country = countries.find((c) => c.id.toString() === countryId)
    return country?.name || countryId
}

const formatDate = (dateString: Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export default function CustomerTable({customers, onEdit}: CustomerTableProps) {
    const deleteCustomerMutation = api.customer.deleteCustomer.useMutation({
        onSuccess: (ctx) => {
            console.log(ctx)
        },
        onError: (err) => {
            console.log(err)
        }
    });
    const {openModal} = useConfirmationModalStore();

    function handleDelete(id: number) {
        if (id) {
            openModal({
                title: "Are you sure you want to delete this customer?",
                content: "This action cannot be undone. The customer and all its associated data will be permanently deleted.",
                onSubmit: () => deleteCustomerMutation.mutate({id}),
                isOpen: true
            });
        }

    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead className="w-[200px]">Customer</TableHead>
                        <TableHead className="w-[200px]">Contact</TableHead>
                        <TableHead className="w-[150px]">Company</TableHead>
                        <TableHead className="w-[120px]">ICO/DICO</TableHead>
                        <TableHead className="w-[200px]">Billing Address</TableHead>
                        <TableHead className="w-[200px]">Cargo Address</TableHead>
                        <TableHead className="w-[120px]">Country</TableHead>
                        <TableHead className="w-[120px]">Created</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                                No customers found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        customers.map((customer) => (
                            <TableRow key={customer.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">#{customer.id}</TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="font-medium text-sm">
                                            {customer.name} {customer.surname}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{customer.email}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {customer.contact ? (
                                            <div className="text-muted-foreground">{customer.contact}</div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">No contact</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {customer.company ? (
                                            <div className="font-medium">{customer.company}</div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">No company</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm space-y-1">
                                        {customer.ico && (
                                            <div className="text-xs">
                                                <span className="font-medium">ICO:</span> {customer.ico}
                                            </div>
                                        )}
                                        {customer.dico && (
                                            <div className="text-xs">
                                                <span className="font-medium">DICO:</span> {customer.dico}
                                            </div>
                                        )}
                                        {!customer.ico && !customer.dico && (
                                            <span className="text-xs text-muted-foreground italic">Not provided</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {customer.billingAddress ? (
                                            <div className="text-muted-foreground max-w-[180px] truncate"
                                                 title={customer.billingAddress}>
                                                {customer.billingAddress}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">No address</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {customer.cargoAddress ? (
                                            <div className="text-muted-foreground max-w-[180px] truncate"
                                                 title={customer.cargoAddress}>
                                                {customer.cargoAddress}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">No address</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {customer.country ? (
                                            <div
                                                className="text-muted-foreground">{getCountryName(customer.country)}</div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">Not specified</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    className="text-sm text-muted-foreground">{formatDate(customer.createdAt)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            title="Edit Customer"
                                            onClick={() => handleDelete(customer.id)}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                        {/*<Button*/}
                                        {/*    variant="outline"*/}
                                        {/*    size="sm"*/}
                                        {/*    className="h-8 w-8 p-0 bg-transparent"*/}
                                        {/*    title="Edit Customer"*/}
                                        {/*    onClick={() => onEdit?.(customer)}*/}
                                        {/*>*/}
                                        {/*    <Edit className="h-4 w-4"/>*/}
                                        {/*</Button>*/}
                                        {/*<Button*/}
                                        {/*    variant="outline"*/}
                                        {/*    size="sm"*/}
                                        {/*    className="h-8 w-8 p-0 bg-transparent"*/}
                                        {/*    title="View Details"*/}
                                        {/*    onClick={() => {*/}
                                        {/*        console.log("View customer details:", customer.id)*/}
                                        {/*    }}*/}
                                        {/*>*/}
                                        {/*    <Eye className="h-4 w-4"/>*/}
                                        {/*</Button>*/}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
