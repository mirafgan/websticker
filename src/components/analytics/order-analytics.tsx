"use client"

import {useState} from "react"
import {api} from "@/trpc/react"
import {Status} from "@/generated/prisma/enums"
import {AnalyticsHeader} from "./analytics-header"
import {MetricsCards} from "./metrics-cards"
import {StatusBreakdown} from "./status-breakdown"
import {RevenueDistribution} from "./revenue-distribution"
import {OrdersTable} from "./orders-table"
import type {DateRange, StatusCounts} from "./types"

const d = new Date()
const currentYear = d.getFullYear()
const currentMonth = d.getMonth()
const currentDay = d.getDate()

export default function OrdersAnalytics() {
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(currentYear, 0, 1),
        to: new Date(currentYear, currentMonth, currentDay),
    })

    const analyticsQuery = api.order.getOrdersByDate.useQuery(dateRange)
    const filteredOrders = analyticsQuery?.data?.data || []

    const totalOrders = filteredOrders.length
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)

    const statusCounts: StatusCounts = {
        Drafts: filteredOrders.filter((order) => order.status.name === Status.DRAFT).length,
        Pending: filteredOrders.filter((order) => order.status.name === Status.PENDING).length,
        Paid: filteredOrders.filter((order) => order.status.name === Status.PAID).length,
    }

    const paidRevenue = filteredOrders
        .filter((order) => order.status.name === Status.PAID)
        .reduce((sum, order) => sum + order.total, 0)

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <AnalyticsHeader
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />

                <MetricsCards
                    totalOrders={totalOrders}
                    totalRevenue={totalRevenue}
                    paidRevenue={paidRevenue}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StatusBreakdown
                        statusCounts={statusCounts}
                        totalOrders={totalOrders}
                    />
                    <RevenueDistribution
                        filteredOrders={filteredOrders}
                        paidRevenue={paidRevenue}
                        totalRevenue={totalRevenue}
                    />
                </div>

                <OrdersTable filteredOrders={filteredOrders}/>
            </div>
        </div>
    )
}
