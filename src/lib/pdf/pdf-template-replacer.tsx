import {PDFDocument, rgb, StandardFonts} from "pdf-lib"
import {QRGenerator} from "../qr/qr-generator"
import type {Product} from "@/lib/types";

export interface TemplateReplacements {
    [key: string]: string | number
}

export class PDFTemplateReplacer {
    static async generateFromTemplate(order: any): Promise<Uint8Array> {
        try {
            // Try to load template first
            let templateBytes: Uint8Array

            try {
                const response = await fetch("/templates/invoice-template.pdf")
                if (!response.ok) {
                    throw new Error("Template not found")
                }
                templateBytes = new Uint8Array(await response.arrayBuffer())
            } catch (error) {
                console.warn("Template PDF not found, creating new PDF")
                // If template fails, create a new PDF
                return await this.createNewInvoicePDF(order)
            }

            // Load the template PDF
            const pdfDoc = await PDFDocument.load(templateBytes)
            const pages = pdfDoc.getPages()
            const firstPage = pages[0]
            const {width, height} = firstPage?.getSize() || {width: 0, height: 0}

            // Embed fonts
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

            // Generate QR Code
            const qrCodeURL = QRGenerator.generateOrderTrackingURL(order.id)

            let qrCodeImage
            try {
                const qrCodeBuffer = await QRGenerator.generateQRBufferFromDataURL(qrCodeURL, {width: 120, margin: 1})
                qrCodeImage = await pdfDoc.embedPng(qrCodeBuffer)
            } catch (qrError) {
                console.warn("QR code generation failed for template:", qrError)
                qrCodeImage = null
            }

            // Parse customer name
            const nameParts = order.customer.split(" ")
            const firstName = nameParts[0] || ""
            const lastName = nameParts.slice(1).join(" ") || ""

            // Add QR Code (top right) - only if successfully generated
            if (qrCodeImage) {
                const qrSize = 80
                firstPage?.drawImage(qrCodeImage, {
                    x: width - qrSize - 30,
                    y: height - qrSize - 30,
                    width: qrSize,
                    height: qrSize,
                })

                // QR Code label
                firstPage?.drawText("Scan to track", {
                    x: width - qrSize - 30,
                    y: height - qrSize - 45,
                    size: 8,
                    font: font,
                    color: rgb(0.5, 0.5, 0.5),
                })
            }

            // Add text overlays on the template
            const overlays = [
                {text: `${firstName} ${lastName}`, x: 100, y: height - 200, size: 14, font: boldFont},
                {text: order.email, x: 100, y: height - 220, size: 12, font: font},
                {text: `Order #${order.id}`, x: 100, y: height - 250, size: 12, font: boldFont},
                {text: order.date, x: 100, y: height - 270, size: 12, font: font},
                {text: `$${order.total.toFixed(2)}`, x: 400, y: height - 250, size: 14, font: boldFont},
            ]

            overlays.forEach(({text, x, y, size, font: textFont}) => {
                firstPage?.drawText(text, {
                    x,
                    y,
                    size,
                    font: textFont,
                    color: rgb(0, 0, 0),
                })
            })

            return await pdfDoc.save()
        } catch (error) {
            console.error("Error processing template:", error)
            // Fallback to creating new PDF
            return await this.createNewInvoicePDF(order)
        }
    }

    private static async createNewInvoicePDF(order: any): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([595, 842])
        const {width, height} = page.getSize()

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

        // Generate QR Code
        const qrCodeURL = QRGenerator.generateOrderTrackingURL(order.id)

        let qrCodeImage
        try {
            const qrCodeBuffer = await QRGenerator.generateQRBufferFromDataURL(qrCodeURL, {width: 120, margin: 1})
            qrCodeImage = await pdfDoc.embedPng(qrCodeBuffer)
        } catch (qrError) {
            console.warn("QR code generation failed for fallback PDF:", qrError)
            qrCodeImage = null
        }

        // Simple invoice layout
        page.drawText("INVOICE", {
            x: 50,
            y: height - 80,
            size: 24,
            font: boldFont,
            color: rgb(0.2, 0.6, 0.2),
        })

        // Add QR Code (top right) - only if successfully generated
        if (qrCodeImage) {
            const qrSize = 100
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
                color: rgb(0.5, 0.5, 0.5),
            })
        }

        page.drawText(`Order #${order.id}`, {
            x: 50,
            y: height - 120,
            size: 14,
            font: boldFont,
        })

        page.drawText(`Customer: ${order.contact.name} ${order.contact.surname}`, {
            x: 50,
            y: height - 150,
            size: 12,
            font: font,
        })

        page.drawText(`Email: ${order.contact.email}`, {
            x: 50,
            y: height - 170,
            size: 12,
            font: font,
        })

        page.drawText(`Date: ${new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })}`, {
            x: 50,
            y: height - 190,
            size: 12,
            font: font,
        })

        page.drawText(`Status: ${order.status.name}`, {
            x: 50,
            y: height - 210,
            size: 12,
            font: font,
        });

        page.drawText(`Products: `, {
            x: 50,
            y: height - 230,
            size: 12,
            font: font,
        });


        order.products.map((item: Product, index: number) => {
            page.drawText(`${index + 1}. ${item.name} (${item.quantity}) x $${item.price.toFixed(2)}\n `, {
                x: 70,
                y: (height - 230) - ((index + 1) * 20),
                size: 12,
                font: font,
            })
        })


        page.drawText(`Total: $${order.total.toFixed(2)}`, {
            x: 50,
            y: height - 270 - order.products.length * 20,
            size: 16,
            font: boldFont,
            color: rgb(0.2, 0.6, 0.2),
        })

        // QR Code URL in footer
        page.drawText(`Track: ${qrCodeURL}`, {
            x: 50,
            y: 80,
            size: 10,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
        })

        return await pdfDoc.save()
    }
}
