import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Status} from "@/generated/prisma/enums"

interface RevenueDistributionProps {
    filteredOrders: any[]
    paidRevenue: number
    totalRevenue: number
}

export function RevenueDistribution({filteredOrders, paidRevenue, totalRevenue}: RevenueDistributionProps) {
    const pendingRevenue = filteredOrders
        .filter((order) => order.status.name === Status.PENDING)
        .reduce((sum, order) => sum + order.total, 0)

    const draftRevenue = filteredOrders
        .filter((order) => order.status.name === Status.DRAFT)
        .reduce((sum, order) => sum + order.total, 0)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Paid Orders</span>
                        <span className="text-lg font-bold text-green-600">₺{paidRevenue.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Pending Orders</span>
                        <span className="text-lg font-bold text-yellow-600">₺{pendingRevenue.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Draft Orders</span>
                        <span className="text-lg font-bold text-gray-600">₺{draftRevenue.toFixed(2)}</span>
                    </div>

                    <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold">Total Potential</span>
                            <span className="text-xl font-bold">₺{totalRevenue.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
