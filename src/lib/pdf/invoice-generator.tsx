"use client"

import {PDFDocument, rgb} from "pdf-lib"
import fontkit from "@pdf-lib/fontkit";
import type {Order} from "@/lib/types";

import {createQrPaymentSvg} from '@tedyno/cz-qr-payment';

const account = '285496379/0300';

const convertToPng = async (svg: string): Promise<string> => {
    return await new Promise((resolve, reject) => {
        const svgBlob = new Blob([svg], {type: 'image/svg+xml'})
        const url = URL.createObjectURL(svgBlob)
        const img = new Image();
        let pngDataUrl
        img.onload = async () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(img, 0, 0)
            pngDataUrl = canvas.toDataURL('image/png');
            resolve(pngDataUrl)
        };
        img.src = url
    })
};


export const generatePDF = async (order: Order) => {
        const amount = 100
        const options = {
            VS: '0861201',
            CC: 'CZK',
            message: `Payment for test order #${order.id}`,
        };
        try {
            // Create a new PDF document
            const pdfDoc = await PDFDocument.create()
            const page = pdfDoc.addPage([595, 842]) // A4 size
            const svg = createQrPaymentSvg(amount, account, options);

            // Load fonts
            pdfDoc.registerFontkit(fontkit)
            // Load fonts
            const loadRegularFont = await fetch("/fonts/NotoSansRegular.ttf").then((res) => res.arrayBuffer())
            const loadBoldFont = await fetch("/fonts/NotoSansBold.ttf").then((res) => res.arrayBuffer())
            const font = await pdfDoc.embedFont(loadRegularFont)
            const boldFont = await pdfDoc.embedFont(loadBoldFont)
            const logoImageBytes = await fetch("/logo/company-logo.jpg").then((res) => res.arrayBuffer())
            const {width, height} = page.getSize()
            const pngDataUrl = await convertToPng(svg)

            const pngQrCode = await pdfDoc.embedPng(pngDataUrl);
            const dimQr = pngQrCode.scale(0.8)
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
                color: rgb(0.95, 0.95, 0.95),
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

            page.drawLine({
                start: {
                    y: yPosition - 30,
                    x: 0,
                },
                end: {
                    y: yPosition - 30,
                    x: 595,
                },
                thickness: 1,
                color: black,

            });

            page.drawImage(pngQrCode, {
                x: 595 - dimQr.width - 30,
                y: yPosition - 160,
                width: dimQr.width,
                height: dimQr.height,
            })
            // Generate PDF
            const pdfBytes = await pdfDoc.save() as BlobPart;
            return pdfBytes

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }
;

