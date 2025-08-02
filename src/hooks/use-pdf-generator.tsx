"use client"

import {useState} from "react"
import {type InvoiceData, PDFGenerator} from "@/lib/pdf/pdf-generator"
import type {Order} from "@/lib/types"

export function usePDFGenerator() {
    const [isGenerating, setIsGenerating] = useState(false)

    const generateInvoice = async (order: Order) => {
        try {
            setIsGenerating(true)

            // Parse customer name (assuming format "FirstName LastName")
            const customerName = order.contact.name || ""
            const customerSurname = order.contact.surname || ""

            const invoiceData: InvoiceData = {
                customerName,
                customerSurname,
                customerEmail: order.contact.email,
                orderId: order.id,
                orderDate: new Date(order.createdAt).toLocaleDateString(),
                orderTotal: order.total,
                items: order.products
            }
            const pdfBytes = await PDFGenerator.generateInvoice(invoiceData)
            return pdfBytes
            // const filename = `invoice-${order.id}-${Date.now()}.pdf`

            // PDFGenerator.downloadPDF(pdfBytes, filename)
        } catch (error) {
            console.error("Failed to generate PDF:", error)
            throw error
        } finally {
            setIsGenerating(false)
        }
    }


    return {
        generateInvoice,
        isGenerating,
    }
}
