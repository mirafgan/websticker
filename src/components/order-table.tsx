import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import type {Order} from "@/lib/types";
import {Button} from "@/components/ui/button";
import {FileText} from "lucide-react";
import {usePDFGenerator} from "@/hooks/use-pdf-generator";

interface IOrderTable {
    orders: Order[]
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "fulfilled":
            return "bg-green-100 text-green-800"
        case "pending":
            return "bg-yellow-100 text-yellow-800"
        case "cancelled":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}
export default function OrderTable({orders}: IOrderTable) {

    const {isGenerating, generateInvoice, generateFromTemplate} = usePDFGenerator();

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

    return <>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>${order.total}</TableCell>
                        <TableCell>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGeneratePDF(order)}
                                disabled={isGenerating}
                                className="h-8 w-8 p-0"
                            >
                                <FileText className="h-4 w-4"/>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
}