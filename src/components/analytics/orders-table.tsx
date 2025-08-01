import {CheckCircle, Clock, FileText, Package} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {format} from "date-fns"
import {enUS} from "date-fns/locale"
import {Status} from "@/generated/prisma/enums"

interface OrdersTableProps {
    filteredOrders: any[]
}

export function OrdersTable({filteredOrders}: OrdersTableProps) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case Status.DRAFT:
                return <FileText className="h-4 w-4"/>
            case Status.PENDING:
                return <Clock className="h-4 w-4"/>
            case Status.PAID:
                return <CheckCircle className="h-4 w-4"/>
            default:
                return <Package className="h-4 w-4"/>
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case Status.DRAFT:
                return "bg-gray-100 text-gray-800"
            case Status.PENDING:
                return "bg-yellow-100 text-yellow-800"
            case Status.PAID:
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusLabel = (statusId: number) => {
        switch (statusId) {
            case 1:
                return "Draft"
            case 2:
                return "Pending"
            case 3:
                return "Paid"
            default:
                return "Unknown"
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.contact.name} {order.contact.surname}</TableCell>
                                <TableCell>{format(new Date(order.createdAt), "dd MMM yyyy", {locale: enUS})}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(order.status.name)}>
                                        <span className="flex items-center gap-1">
                                          {getStatusIcon(order.status.name)}
                                            {order.status.name}
                                        </span>
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
