import {PDFDocument, rgb, StandardFonts} from "pdf-lib"
import {QRGenerator} from "../qr/qr-generator"

export interface InvoiceData {
    customerName: string
    customerSurname: string
    customerEmail: string
    orderId: number
    orderDate: string
    orderTotal: number
    items: Array<{
        name: string
        price: number
        quantity: number
        material: string
        size: string
    }>
}

export class PDFGenerator {
    // Create a new PDF from scratch instead of using template
    static async generateInvoice(data: InvoiceData): Promise<Uint8Array> {
        try {
            // Create a new PDF document
            const pdfDoc = await PDFDocument.create()
            const page = pdfDoc.addPage([595, 842]) // A4 size
            const {width, height} = page.getSize()

            // Embed fonts
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

            // Colors
            const primaryColor = rgb(0.2, 0.6, 0.2) // Green
            const textColor = rgb(0, 0, 0)
            const grayColor = rgb(0.5, 0.5, 0.5)

            // Generate QR Code
            const qrCodeURL = QRGenerator.generateOrderTrackingURL(data.orderId)

            let qrCodeImage
            try {
                const qrCodeBuffer = await QRGenerator.generateQRBufferFromDataURL(qrCodeURL, {width: 120, margin: 1})
                qrCodeImage = await pdfDoc.embedPng(qrCodeBuffer)
            } catch (qrError) {
                console.warn("QR code generation failed, continuing without QR code:", qrError)
                qrCodeImage = null
            }

            // Header
            page.drawText("INVOICE", {
                x: 50,
                y: height - 80,
                size: 28,
                font: boldFont,
                color: primaryColor,
            })

            // QR Code (top right) - only if successfully generated
            const qrSize = 100
            if (qrCodeImage) {
                page.drawImage(qrCodeImage, {
                    x: width - qrSize - 50,
                    y: height - qrSize - 50,
                    width: qrSize,
                    height: qrSize,
                })

                // QR Code label
                page.drawText("Scan to track order", {
                    x: width - qrSize - 50,
                    y: height - qrSize - 65,
                    size: 8,
                    font: font,
                    color: grayColor,
                })
            }

            // Invoice details (below QR code area)
            page.drawText(`Invoice #${data.orderId}`, {
                x: width - 200,
                y: height - qrSize - 90,
                size: 14,
                font: boldFont,
                color: textColor,
            })

            page.drawText(`Date: ${data.orderDate}`, {
                x: width - 200,
                y: height - qrSize - 110,
                size: 12,
                font: font,
                color: textColor,
            })

            // Customer information
            let yPosition = height - 180

            page.drawText("Bill To:", {
                x: 50,
                y: yPosition,
                size: 14,
                font: boldFont,
                color: textColor,
            })

            yPosition -= 25
            page.drawText(`${data.customerName} ${data.customerSurname}`, {
                x: 50,
                y: yPosition,
                size: 12,
                font: font,
                color: textColor,
            })

            yPosition -= 20
            page.drawText(data.customerEmail, {
                x: 50,
                y: yPosition,
                size: 12,
                font: font,
                color: textColor,
            })

            // Items table
            yPosition = height - 280

            // Table header
            page.drawRectangle({
                x: 50,
                y: yPosition - 5,
                width: width - 100,
                height: 25,
                color: rgb(0.95, 0.95, 0.95),
            })

            page.drawText("Item", {
                x: 60,
                y: yPosition + 5,
                size: 12,
                font: boldFont,
                color: textColor,
            })

            page.drawText("Qty", {
                x: 300,
                y: yPosition + 5,
                size: 12,
                font: boldFont,
                color: textColor,
            })

            page.drawText("Price", {
                x: 360,
                y: yPosition + 5,
                size: 12,
                font: boldFont,
                color: textColor,
            })

            page.drawText("Total", {
                x: 450,
                y: yPosition + 5,
                size: 12,
                font: boldFont,
                color: textColor,
            })

            yPosition -= 30

            // Table items
            data.items.forEach((item, index) => {
                const itemTotal = item.price * item.quantity

                // Alternate row background
                if (index % 2 === 0) {
                    page.drawRectangle({
                        x: 50,
                        y: yPosition - 5,
                        width: width - 100,
                        height: 20,
                        color: rgb(0.98, 0.98, 0.98),
                    })
                }

                page.drawText(item.name, {
                    x: 60,
                    y: yPosition,
                    size: 10,
                    font: font,
                    color: textColor,
                })

                page.drawText(item.quantity.toString(), {
                    x: 300,
                    y: yPosition,
                    size: 10,
                    font: font,
                    color: textColor,
                })

                page.drawText(`$${item.price.toFixed(2)}`, {
                    x: 360,
                    y: yPosition,
                    size: 10,
                    font: font,
                    color: textColor,
                })

                page.drawText(`$${itemTotal.toFixed(2)}`, {
                    x: 450,
                    y: yPosition,
                    size: 10,
                    font: font,
                    color: textColor,
                })

                yPosition -= 25
            })

            // Total section
            yPosition -= 20

            // Draw line above total
            page.drawLine({
                start: {x: 350, y: yPosition + 10},
                end: {x: width - 50, y: yPosition + 10},
                thickness: 1,
                color: grayColor,
            })

            page.drawText("TOTAL:", {
                x: 400,
                y: yPosition - 10,
                size: 14,
                font: boldFont,
                color: textColor,
            })

            page.drawText(`$${data.orderTotal.toFixed(2)}`, {
                x: 450,
                y: yPosition - 10,
                size: 14,
                font: boldFont,
                color: primaryColor,
            })

            // Footer
            page.drawText("Thank you for your business!", {
                x: 50,
                y: 100,
                size: 12,
                font: font,
                color: grayColor,
            })

            // QR Code info in footer
            page.drawText(`Track your order: ${qrCodeURL}`, {
                x: 50,
                y: 80,
                size: 10,
                font: font,
                color: grayColor,
            })

            // Save and return PDF
            const pdfBytes = await pdfDoc.save()
            return pdfBytes
        } catch (error) {
            console.error("Error generating PDF:", error)
            throw new Error("Failed to generate PDF")
        }
    }

    static downloadPDF(pdfBytes: Uint8Array, filename: string) {
        try {
            const blob = new Blob([pdfBytes], {type: "application/pdf"})
            const url = URL.createObjectURL(blob)

            const link = document.createElement("a")
            link.href = url
            link.download = filename
            link.style.display = "none"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 100)
        } catch (error) {
            console.error("Error downloading PDF:", error)
            throw new Error("Failed to download PDF")
        }
    }
}
