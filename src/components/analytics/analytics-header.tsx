"use client"

import {CalendarIcon} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {format} from "date-fns"
import {enUS} from "date-fns/locale"
import type {DateRange} from "./types"

interface AnalyticsHeaderProps {
    dateRange: DateRange
    setDateRange: (range: DateRange | ((prev: DateRange) => DateRange)) => void
}

export function AnalyticsHeader({dateRange, setDateRange}: AnalyticsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Analytics</h1>
                <p className="text-gray-600 mt-1">Detailed analysis reports of your orders</p>
            </div>

            <div className="flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline"
                                className="w-[140px] justify-start text-left font-normal bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {format(dateRange.from, "dd MMM", {locale: enUS})}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => date && setDateRange((prev) => ({...prev, from: date}))}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <span className="flex items-center text-gray-500">-</span>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline"
                                className="w-[140px] justify-start text-left font-normal bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {format(dateRange.to, "dd MMM", {locale: enUS})}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => date && setDateRange((prev) => ({...prev, to: date}))}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
