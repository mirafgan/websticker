import {CheckCircle, Clock, FileText} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import type {StatusCounts} from "./types"

interface StatusBreakdownProps {
    statusCounts: StatusCounts
    totalOrders: number
}

export function StatusBreakdown({statusCounts, totalOrders}: StatusBreakdownProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 text-gray-600">
                            <FileText className="h-5 w-5 "/>
                            <span className="font-medium ">Drafts</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">{statusCounts.Drafts}</Badge>
                            <span className="text-sm text-gray-600">
                %{totalOrders > 0 ? ((statusCounts.Drafts / totalOrders) * 100).toFixed(1) : "0"}
              </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-3 text-yellow-600">
                            <Clock className="h-5 w-5 "/>
                            <span className="font-medium">Pending</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-100 text-yellow-800">{statusCounts.Pending}</Badge>
                            <span className="text-sm text-gray-600">
                %{totalOrders > 0 ? ((statusCounts.Pending / totalOrders) * 100).toFixed(1) : "0"}
              </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3 text-green-600">
                            <CheckCircle className="h-5 w-5 "/>
                            <span className="font-medium">Paid</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">{statusCounts.Paid}</Badge>
                            <span className="text-sm text-gray-600">
                %{totalOrders > 0 ? ((statusCounts.Paid / totalOrders) * 100).toFixed(1) : "0"}
              </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
