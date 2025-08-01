import {DollarSign, Package, TrendingUp} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"

interface MetricsCardsProps {
    totalOrders: number
    totalRevenue: number
    paidRevenue: number
}

export function MetricsCards({totalOrders, totalRevenue, paidRevenue}: MetricsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">In selected date range</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₺{totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">All orders included</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Paid Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">₺{paidRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Paid orders only</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Order</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ₺{totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground">Average per order</p>
                </CardContent>
            </Card>
        </div>
    )
}
