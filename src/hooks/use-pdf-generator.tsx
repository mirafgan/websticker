"use client"

import {useState} from "react"
import {type InvoiceData, PDFGenerator} from "@/lib/pdf/pdf-generator"
import {PDFTemplateReplacer} from "@/lib/pdf/pdf-template-replacer"
import type {Order} from "@/lib/types"

export function usePDFGenerator() {
    const [isGenerating, setIsGenerating] = useState(false)

    const generateInvoice = async (order: Order) => {
        try {
            setIsGenerating(true)

            // Parse customer name (assuming format "FirstName LastName")
            const nameParts = order.contact.name.split(" ")
            const customerName = nameParts[0] || ""
            const customerSurname = nameParts.slice(1).join(" ") || ""

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
            const filename = `invoice-${order.id}-${Date.now()}.pdf`

            PDFGenerator.downloadPDF(pdfBytes, filename)
        } catch (error) {
            console.error("Failed to generate PDF:", error)
            throw error
        } finally {
            setIsGenerating(false)
        }
    }

    const generateFromTemplate = async (order: Order) => {
        try {
            setIsGenerating(true)

            const pdfBytes = await PDFTemplateReplacer.generateFromTemplate(order)
            const filename = `invoice-template-${order.id}-${Date.now()}.pdf`

            PDFGenerator.downloadPDF(pdfBytes, filename)
        } catch (error) {
            console.error("Failed to generate PDF from template:", error)
            throw error
        } finally {
            setIsGenerating(false)
        }
    }

    return {
        generateInvoice,
        generateFromTemplate,
        isGenerating,
    }
}
