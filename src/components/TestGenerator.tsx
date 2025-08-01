"use client"

import {useState} from "react"
import {PDFDocument, rgb} from "pdf-lib"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Download} from "lucide-react"
import fontkit from "@pdf-lib/fontkit";
import {initClient} from "@/lib/pdf/upload-gdrive";

export const generatePDF = async () => {
    // setIsGenerating(true)

    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([595, 842]) // A4 size

        // Load fonts
        pdfDoc.registerFontkit(fontkit)
        // Load fonts
        const loadRegularFont = await fetch("/fonts/NotoSansRegular.ttf").then((res) => res.arrayBuffer())
        const loadBoldFont = await fetch("/fonts/NotoSansBold.ttf").then((res) => res.arrayBuffer())
        const font = await pdfDoc.embedFont(loadRegularFont)
        const boldFont = await pdfDoc.embedFont(loadBoldFont)
        const logoImageBytes = await fetch("/logo/company-logo.jpg").then((res) => res.arrayBuffer())
        const {width, height} = page.getSize()

        // Colors
        const black = rgb(0, 0, 0)
        const gray = rgb(0.5, 0.5, 0.5)
        const lightGray = rgb(0.8, 0.8, 0.8)

        let yPosition = height - 60

        // ShipEx Logo (top right)
        const jpgImage = await pdfDoc.embedJpg(logoImageBytes)
        const jpgDims = jpgImage.scale(0.15)
        page.drawImage(jpgImage, {
            x: width - 120,
            y: yPosition - 20,
            // size: 24,
            width: jpgDims.width,
            height: jpgDims.height,
            // font: boldFont,
            // color: rgb(0.2, 0.2, 0.6), // Blue color for ShipEx
        })

        // Header section
        yPosition = height - 100

        // Proforma faktura (left) and invoice number (right)
        page.drawText("Proforma faktura", {
            x: 50,
            y: yPosition,
            size: 18,
            font: boldFont,
            color: black,
        })

        page.drawText("0861201", {
            x: width - 120,
            y: yPosition,
            size: 18,
            font: boldFont,
            color: black,
        })

        // Horizontal line under header
        yPosition -= 20
        page.drawLine({
            start: {x: 50, y: yPosition},
            end: {x: width - 50, y: yPosition},
            thickness: 1,
            color: black,
        })

        yPosition -= 30

        // Supplier section (Dodavatel) - Left column
        page.drawText("Dodavatel:", {
            x: 50,
            y: yPosition,
            size: 11,
            font: font,
            color: gray,
        })

        // Customer section (Zákazník) - Right column
        page.drawText("Zákazník:", {
            x: 320,
            y: yPosition,
            size: 11,
            font: font,
            color: gray,
        })

        yPosition -= 25

        // Supplier details
        page.drawText("ShipEx Logistic s.r.o.", {
            x: 50,
            y: yPosition,
            size: 12,
            font: boldFont,
            color: black,
        })

        // Customer details
        page.drawText("MINUTE VISION s.r.o.", {
            x: 320,
            y: yPosition,
            size: 12,
            font: boldFont,
            color: black,
        })

        yPosition -= 20

        // Supplier address
        page.drawText("Zelný trh 293/10", {
            x: 50,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        // Customer address
        page.drawText("Na Folimance 2155/15", {
            x: 320,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        yPosition -= 15

        page.drawText("60200, Brno", {
            x: 50,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        page.drawText("12000, Praha 2", {
            x: 320,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        yPosition -= 15

        page.drawText("Česká republika", {
            x: 50,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        page.drawText("Česká republika", {
            x: 320,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        yPosition -= 25

        // Supplier tax details
        page.drawText("IČO: 07491310  DIČ: CZ07491310", {
            x: 50,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        // Customer tax details
        page.drawText("IČO: 17833175", {
            x: 320,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        yPosition -= 15

        page.drawText("C 108436 vedená u Krajského soudu v Brně", {
            x: 50,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        page.drawText("DIČ: CZ17833175", {
            x: 320,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        // Horizontal line
        yPosition -= 30
        page.drawLine({
            start: {x: 50, y: yPosition},
            end: {x: width - 50, y: yPosition},
            thickness: 1,
            color: black,
        })

        yPosition -= 30

        // Banking information (left) and dates (right)
        page.drawText("Bankovní spojení:", {
            x: 50,
            y: yPosition,
            size: 11,
            font: boldFont,
            color: black,
        })

        page.drawText("Datum vystavení: 21.07.2025", {
            x: 320,
            y: yPosition,
            size: 10,
            font: boldFont,
            color: black,
        })

        yPosition -= 18

        page.drawText("285496379 / 0300 (ČSOB)", {
            x: 50,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        page.drawText("Datum zdanitelného plnění: -", {
            x: 320,
            y: yPosition,
            size: 10,
            font: boldFont,
            color: black,
        })

        yPosition -= 15

        page.drawText("7769530002 / 5500 (Raiffeisen bank)", {
            x: 50,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        page.drawText("Datum splatnosti: 28.07.2025", {
            x: 320,
            y: yPosition,
            size: 10,
            font: boldFont,
            color: black,
        })

        yPosition -= 18

        page.drawText("Variabilní symbol: 0861201", {
            x: 50,
            y: yPosition,
            size: 10,
            font: boldFont,
            color: black,
        })

        yPosition -= 15

        page.drawText("Typ platby: -", {
            x: 50,
            y: yPosition,
            size: 10,
            font: boldFont,
            color: black,
        })

        yPosition -= 15

        page.drawText("Pro správné přiřazení platby uvádějte správný variabilní symbol", {
            x: 50,
            y: yPosition,
            size: 9,
            font: font,
            color: gray,
        })

        // Horizontal line before table
        yPosition -= 25
        page.drawLine({
            start: {x: 50, y: yPosition},
            end: {x: width - 50, y: yPosition},
            thickness: 1,
            color: black,
        })

        yPosition -= 25

        // Items table
        const tableStartY = yPosition
        const tableHeight = 100
        const tableWidth = width - 100

        // Draw table border
        page.drawRectangle({
            x: 50,
            y: tableStartY - tableHeight,
            width: tableWidth,
            height: tableHeight,
            borderColor: black,
            borderWidth: 1,
        })

        // Table header background (light gray)
        page.drawRectangle({
            x: 50,
            y: tableStartY - 25,
            width: tableWidth,
            height: 25,
            color: lightGray,
            borderColor: black,
            borderWidth: 1,
        })

        // Table headers
        page.drawText("Popis položky", {
            x: 55,
            y: tableStartY - 18,
            size: 10,
            font: boldFont,
            color: black,
        })

        page.drawText("Množství", {
            x: 220,
            y: tableStartY - 18,
            size: 10,
            font: boldFont,
            color: black,
        })

        page.drawText("Jedn. cena bez DPH", {
            x: 280,
            y: tableStartY - 18,
            size: 10,
            font: boldFont,
            color: black,
        })

        page.drawText("DPH", {
            x: 390,
            y: tableStartY - 18,
            size: 10,
            font: boldFont,
            color: black,
        })

        page.drawText("Cena bez DPH", {
            x: 420,
            y: tableStartY - 18,
            size: 10,
            font: boldFont,
            color: black,
        })

        page.drawText("Cena s DPH", {
            x: 500,
            y: tableStartY - 18,
            size: 10,
            font: boldFont,
            color: black,
        })

        // Vertical lines for table columns
        const columnPositions = [215, 275, 385, 415, 495]
        columnPositions.forEach((x) => {
            page.drawLine({
                start: {x, y: tableStartY},
                end: {x, y: tableStartY - tableHeight},
                thickness: 1,
                color: black,
            })
        })

        // Table rows
        let rowY = tableStartY - 40

        // Row 1: Poštovné
        page.drawText("Poštovné (CZ - CZ)", {
            x: 55,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("1 ks", {
            x: 230,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("141.32 Kč", {
            x: 290,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("21%", {
            x: 390,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("141.32 Kč", {
            x: 425,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("171.00 Kč", {
            x: 500,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        // Horizontal line between rows
        rowY -= 15
        page.drawLine({
            start: {x: 50, y: rowY},
            end: {x: width - 50, y: rowY},
            thickness: 1,
            color: black,
        })

        rowY -= 10

        // Row 2: Vyzvednutí zásilky
        page.drawText("Vyzvednutí zásilky", {
            x: 55,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("1 ks", {
            x: 230,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("32.23 Kč", {
            x: 290,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("21%", {
            x: 390,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("32.23 Kč", {
            x: 425,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("39.00 Kč", {
            x: 500,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        // Horizontal line between rows
        rowY -= 15
        page.drawLine({
            start: {x: 50, y: rowY},
            end: {x: width - 50, y: rowY},
            thickness: 1,
            color: black,
        })

        rowY -= 10

        // Row 3: Zákaznická sleva
        page.drawText("Zákaznická sleva (5%)", {
            x: 55,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("1 ks", {
            x: 230,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("-7.44 Kč", {
            x: 290,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("21%", {
            x: 390,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("-7.44 Kč", {
            x: 425,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        page.drawText("-9.00 Kč", {
            x: 500,
            y: rowY,
            size: 9,
            font: font,
            color: black,
        })

        // VAT summary table
        yPosition = rowY - 40

        // Summary table border
        page.drawRectangle({
            x: 280,
            y: yPosition - 25,
            width: 265,
            height: 50,
            borderColor: black,
            borderWidth: 1,
        })

        // Summary table header
        page.drawRectangle({
            x: 280,
            y: yPosition,
            width: 265,
            height: 25,
            color: lightGray,
            borderColor: black,
            borderWidth: 1,
        })

        page.drawText("Základ DPH", {
            x: 320,
            y: yPosition - 15,
            size: 10,
            font: boldFont,
            color: black,
        })

        page.drawText("DPH", {
            x: 420,
            y: yPosition - 15,
            size: 10,
            font: boldFont,
            color: black,
        })

        page.drawText("Spolu", {
            x: 480,
            y: yPosition - 15,
            size: 10,
            font: boldFont,
            color: black,
        })

        // Vertical lines in summary table
        page.drawLine({
            start: {x: 400, y: yPosition},
            end: {x: 400, y: yPosition - 50},
            thickness: 1,
            color: black,
        })

        page.drawLine({
            start: {x: 460, y: yPosition},
            end: {x: 460, y: yPosition - 50},
            thickness: 1,
            color: black,
        })

        yPosition -= 40

        page.drawText("Celkem s DPH 21%", {
            x: 285,
            y: yPosition,
            size: 10,
            font: boldFont,
            color: black,
        })

        page.drawText("166.11 Kč", {
            x: 320,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        page.drawText("34.89 Kč", {
            x: 410,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        page.drawText("201.00 Kč", {
            x: 470,
            y: yPosition,
            size: 10,
            font: font,
            color: black,
        })

        // Total amount section
        yPosition -= 60

        page.drawText("Celkem k úhradě:", {
            x: 350,
            y: yPosition,
            size: 12,
            font: boldFont,
            color: black,
        })

        // Total amount box
        page.drawRectangle({
            x: 450,
            y: yPosition - 25,
            width: 95,
            height: 35,
            borderColor: black,
            borderWidth: 2,
        })

        page.drawText("201.00 Kč", {
            x: 460,
            y: yPosition - 15,
            size: 14,
            font: boldFont,
            color: black,
        })

        // Generate PDF
        const pdfBytes = await pdfDoc.save() as BlobPart;
        initClient(pdfBytes)
        // gapi.load('client:auth2', () => initClient(pdfBytes))
        // Download PDF
        // const blob = new Blob([pdfBytes], {type: "application/pdf"})
        // const url = URL.createObjectURL(blob)
        // window.open(url, "_blank")
        // const link = document.createElement("a")
        // link.href = url
        // link.download = "proforma-faktura-0861201.pdf"
        // document.body.appendChild(link)
        // link.click()
        // document.body.removeChild(link)
        // URL.revokeObjectURL(url)
    } catch (error) {
        console.error("Error generating PDF:", error)
    } finally {
        // setIsGenerating(false)
    }
};

export default function InvoiceGenerator() {
    const [isGenerating, setIsGenerating] = useState(false)


    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5"/>
                            PDF Faktura Generátor
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-gray-600">
                            <p>Tento nástroj vygeneruje proforma fakturu č. 0861201 od ShipEx Logistic s.r.o.</p>
                            <p className="mt-2">Faktura obsahuje:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Údaje dodavatele a zákazníka</li>
                                <li>Bankovní spojení a platební údaje</li>
                                <li>Položky s DPH kalkulací</li>
                                <li>Celkovou částku k úhradě: 201.00 Kč</li>
                            </ul>
                        </div>

                        <Button onClick={generatePDF} disabled={isGenerating} className="w-full" size="lg">
                            {isGenerating ? (
                                <>
                                    <div
                                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Generuji PDF...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4 mr-2"/>
                                    Stáhnout Proforma Fakturu
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

