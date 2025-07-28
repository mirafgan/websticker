"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Download, FileText} from "lucide-react"
import {PDFDocument, rgb} from "pdf-lib"
import fontkit from '@pdf-lib/fontkit'

export default function InvoiceGenerator() {
    const [isGenerating, setIsGenerating] = useState(false)

    const generatePDF = async () => {
        setIsGenerating(true)

        try {
            // Vytvoření nového PDF dokumentu

            const pdfDoc = await PDFDocument.create()
            const page = pdfDoc.addPage([595.28, 841.89]) // A4 rozměry
            pdfDoc.registerFontkit(fontkit)

            // Načtení fontů - použijeme font s podporou UTF-8
            const fontUrl =
                "https://fonts.gstatic.com/s/notosans/v36/o-0IIpQlx3QUlC5A4PNb4j5Ba_2c7A.ttf"
            const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer())
            const font = await pdfDoc.embedFont(fontBytes)

            const boldFontUrl =
                'https://fonts.gstatic.com/s/notosans/v40/o-0IIpQlx3QUlC5A4PNb4j5Ba_2c7A.ttf'
            const boldFontBytes = await fetch(boldFontUrl).then((res) => res.arrayBuffer())
            const boldFont = await pdfDoc.embedFont(boldFontBytes)

            const {width, height} = page.getSize()

            // Hlavička
            page.drawText("Proforma faktura0861201", {
                x: 50,
                y: height - 50,
                size: 18,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            // Dodavatel sekce
            let yPosition = height - 100
            page.drawText("Dodavatel:", {
                x: 50,
                y: yPosition,
                size: 12,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            yPosition -= 20
            page.drawText("ShipEx Logistic s.r.o.", {
                x: 50,
                y: yPosition,
                size: 11,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Zelný trh 293/10", {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("60200, Brno", {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Česká republika", {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("IČO: 07491310   DIČ: CZ07491310", {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("C 108436 vedená u Krajského soudu v Brně", {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            // Zákazník sekce
            yPosition = height - 100
            page.drawText("Zákazník:", {
                x: 320,
                y: yPosition,
                size: 12,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            yPosition -= 20
            page.drawText("MINUTE VISION s.r.o.", {
                x: 320,
                y: yPosition,
                size: 11,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Na Folimance 2155/15", {
                x: 320,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("12000, Praha 2", {
                x: 320,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Česká republika", {
                x: 320,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("IČO: 17833175", {
                x: 320,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("DIČ: CZ17833175", {
                x: 320,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            // Bankovní spojení a platební údaje
            yPosition = height - 280
            page.drawText("Bankovní spojení:", {
                x: 50,
                y: yPosition,
                size: 11,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("285496379 / 0300 (ČSOB)", {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("7769530002 / 5500 (Raiffeisen bank)", {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 20
            page.drawText("Variabilní symbol: 0861201", {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Typ platby: -", {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Pro správné přiřazení platby uvádějte správný variabilní symbol", {
                x: 50,
                y: yPosition,
                size: 9,
                font: font,
                color: rgb(0, 0, 0),
            })

            // Datumy
            yPosition = height - 280
            page.drawText("Datum vystavení: 21.07.2025", {
                x: 320,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Datum zdanitelného plnění: -", {
                x: 320,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Datum splatnosti: 28.07.2025", {
                x: 320,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            // Tabulka hlavička
            yPosition = height - 420

            // Kreslení čar pro tabulku
            page.drawLine({
                start: {x: 50, y: yPosition + 5},
                end: {x: 545, y: yPosition + 5},
                thickness: 1,
                color: rgb(0, 0, 0),
            })

            page.drawText("Popis položky", {
                x: 55,
                y: yPosition - 10,
                size: 10,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            page.drawText("Množství", {
                x: 200,
                y: yPosition - 10,
                size: 10,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            page.drawText("Jedn. cena bez DPH", {
                x: 260,
                y: yPosition - 10,
                size: 10,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            page.drawText("DPH", {
                x: 370,
                y: yPosition - 10,
                size: 10,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            page.drawText("Cena bez DPH", {
                x: 400,
                y: yPosition - 10,
                size: 10,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            page.drawText("Cena s DPH", {
                x: 480,
                y: yPosition - 10,
                size: 10,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            yPosition -= 25
            page.drawLine({
                start: {x: 50, y: yPosition + 5},
                end: {x: 545, y: yPosition + 5},
                thickness: 1,
                color: rgb(0, 0, 0),
            })

            // Položky tabulky
            yPosition -= 15
            page.drawText("Poštovné (CZ - CZ)", {
                x: 55,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("1 ks", {
                x: 200,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("141.32 Kč", {
                x: 260,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("21%", {
                x: 370,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("141.32 Kč", {
                x: 400,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("171.00 Kč", {
                x: 480,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Vyzvednutí zásilky", {
                x: 55,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("1 ks", {
                x: 200,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("32.23 Kč", {
                x: 260,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("21%", {
                x: 370,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("32.23 Kč", {
                x: 400,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("39.00 Kč", {
                x: 480,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Zákaznická sleva (5%)", {
                x: 55,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("1 ks", {
                x: 200,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("-7.44 Kč", {
                x: 260,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("21%", {
                x: 370,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("-7.44 Kč", {
                x: 400,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("-9.00 Kč", {
                x: 480,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            yPosition -= 25
            page.drawLine({
                start: {x: 50, y: yPosition + 5},
                end: {x: 545, y: yPosition + 5},
                thickness: 1,
                color: rgb(0, 0, 0),
            })

            // Souhrn DPH
            yPosition -= 20
            page.drawText("Základ DPH", {
                x: 350,
                y: yPosition,
                size: 10,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            page.drawText("DPH", {
                x: 430,
                y: yPosition,
                size: 10,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            page.drawText("Spolu", {
                x: 480,
                y: yPosition,
                size: 10,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            yPosition -= 15
            page.drawText("Celkem s DPH 21%", {
                x: 250,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("166.11 Kč", {
                x: 350,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("34.89 Kč", {
                x: 430,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            page.drawText("201.00 Kč", {
                x: 480,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            // Celkem k úhradě
            yPosition -= 30
            page.drawText("Celkem k úhradě:", {
                x: 350,
                y: yPosition,
                size: 12,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            yPosition -= 20
            page.drawText("201.00 Kč", {
                x: 450,
                y: yPosition,
                size: 14,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            // Tečkovaná čára
            yPosition -= 30
            let dotX = 50
            while (dotX < 545) {
                page.drawText(".", {
                    x: dotX,
                    y: yPosition,
                    size: 10,
                    font: font,
                    color: rgb(0, 0, 0),
                })
                dotX += 10
            }

            // Patička
            yPosition -= 30
            page.drawText("Dodavatel", {
                x: 50,
                y: yPosition,
                size: 11,
                font: boldFont,
                color: rgb(0, 0, 0),
            })

            yPosition -= 20
            page.drawText("Email: info@shipex.cz   Telefon: +420 730 779 555   Web: www.shipex.cz", {
                x: 50,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
            })

            // Uložení PDF
            const pdfBytes = await pdfDoc.save()

            // Stažení PDF
            const blob = new Blob([pdfBytes], {type: "application/pdf"})
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "proforma-faktura-0861201.pdf"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Chyba při generování PDF:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-6 w-6"/>
                            Generátor Proforma Faktury
                        </CardTitle>
                        <CardDescription>
                            Vygeneruje a stáhne proforma fakturu č. 0861201 ve formátu PDF pomocí pdf-lib knihovny.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">Detaily faktury:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Číslo faktury: 0861201</li>
                                <li>• Dodavatel: ShipEx Logistic s.r.o.</li>
                                <li>• Zákazník: MINUTE VISION s.r.o.</li>
                                <li>• Celková částka: 201.00 Kč</li>
                                <li>• Datum splatnosti: 28.07.2025</li>
                            </ul>
                        </div>

                        <Button onClick={generatePDF} disabled={isGenerating} className="w-full" size="lg">
                            <Download className="mr-2 h-4 w-4"/>
                            {isGenerating ? "Generuji PDF..." : "Vygenerovat a stáhnout PDF"}
                        </Button>

                        <p className="text-sm text-gray-600 text-center">PDF bude automaticky staženo po
                            vygenerování</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
