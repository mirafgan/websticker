"use client"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import type {Order, Status} from "@/lib/types"
import {usePDFGenerator} from "@/hooks/use-pdf-generator"
import {countries} from "@/lib/countries"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronDown, FileText} from "lucide-react";

interface IOrderTable {
    orders: Order[]
    statuses: Status[]
    statusOnSubmit: (id: number, statusId: number) => void
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "paid":
            return "bg-green-100 text-green-800 hover:bg-green-200"
        case "pending":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        case "draft":
            return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        case "cancelled":
            return "bg-red-100 text-red-800 hover:bg-red-200"
        case "completed":
            return "bg-blue-100 text-blue-800 hover:bg-blue-200"
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
}

const formatDate = (dateString: Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

const getCountryName = (countryId: string) => {
    const country = countries.find((c) => c.id.toString() === countryId)
    return country?.name || countryId
}

export default function OrderTable({orders, statuses, statusOnSubmit}: IOrderTable) {
    const {isGenerating, generateInvoice, generateFromTemplate} = usePDFGenerator()


    async function handleGeneratePDF(order: Order) {
        try {
            await generateFromTemplate(order)
        } catch (e) {
            console.log("generateFromTemplate", e)

            try {
                await generateInvoice(order)
            } catch (e) {
                console.log("generateInvoice", e)
            }
        }
    }


    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Order ID</TableHead>
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead className="w-[200px]">Customer</TableHead>
                        <TableHead className="w-[300px]">Products</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[120px]">Total</TableHead>
                        <TableHead className="max-w-[200px]">Notes</TableHead>
                        {/*<TableHead className="w-[100px]">Actions</TableHead>*/}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">#{order.id}</TableCell>
                                <TableCell
                                    className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="font-medium text-sm">
                                            {order.contact.name} {order.contact.surname}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{order.contact.company}</div>
                                        <div className="text-xs text-muted-foreground">{order.contact.email}</div>
                                        {order.contact.country && (
                                            <div
                                                className="text-xs text-muted-foreground">{getCountryName(order.contact.country)}</div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <div className="font-medium">{order.products?.length || 0} items</div>
                                        {order.products && order.products.length > 0 && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {order.products.map((product, index) => (
                                                    <div key={product.id} className=" max-w-[300px]">
                                                        {product.name} - {product.quantity}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(order.status.name)} variant="secondary">
                                        {order.status.name}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                                <TableCell>
                                    {order.notes ? (
                                        <div className="text-sm text-muted-foreground max-w-[200px] truncate"
                                             title={order.notes}>
                                            {order.notes}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">No notes</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-2 text-xs bg-transparent"
                                                    title="Update Status"
                                                >
                                                    Status
                                                    <ChevronDown className="h-3 w-3 ml-1"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {statuses.map((status) => (
                                                    <DropdownMenuItem
                                                        key={status.name}
                                                        onClick={() => statusOnSubmit(Number(order.id), Number(status.id))}
                                                        className="cursor-pointer"
                                                        disabled={order.status.name.toLowerCase() === status.name.toLowerCase()}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`w-2 h-2 rounded-full ${getStatusColor(status.name)}`}/>
                                                            {status.name}
                                                        </div>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleGeneratePDF(order)}
                                            disabled={isGenerating}
                                            className="h-8 w-8 p-0"
                                            title="Generate PDF"
                                        >
                                            <FileText className="h-4 w-4"/>
                                        </Button>
                                        {/*<Button*/}
                                        {/*    variant="outline"*/}
                                        {/*    size="sm"*/}
                                        {/*    className="h-8 w-8 p-0 bg-transparent"*/}
                                        {/*    title="View Details"*/}
                                        {/*    onClick={() => {*/}
                                        {/*        console.log("View order details:", order.id)*/}
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
