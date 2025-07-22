import QRCode from "qrcode"
import { getQRSettings } from "../config/qr-settings"

export interface QRCodeOptions {
    width?: number
    margin?: number
    errorCorrectionLevel?: "L" | "M" | "Q" | "H"
}

export class QRGenerator {
    static generateOrderTrackingURL(orderId: number, baseURL?: string): string {
        const settings = getQRSettings()
        const trackingBaseURL = baseURL || settings.baseURL
        return `${trackingBaseURL}${settings.trackingPath}/${orderId}`
    }

    static generateOrderVerificationURL(orderId: number, customerEmail: string, baseURL?: string): string {
        const settings = getQRSettings()
        const verificationBaseURL = baseURL || settings.baseURL
        const params = new URLSearchParams({
            order: orderId.toString(),
            email: customerEmail,
        })
        return `${verificationBaseURL}${settings.verificationPath}?${params.toString()}`
    }

    // Browser'da canvas kullanarak buffer oluştur
    static async generateQRBuffer(text: string, options?: QRCodeOptions): Promise<Uint8Array> {
        try {
            const settings = getQRSettings()

            const qrOptions = {
                width: options?.width || settings.qrCodeOptions.width,
                margin: options?.margin || settings.qrCodeOptions.margin,
                errorCorrectionLevel: options?.errorCorrectionLevel || settings.qrCodeOptions.errorCorrectionLevel,
                color: {
                    dark: "#000000",
                    light: "#FFFFFF",
                },
            }

            // Canvas oluştur
            const canvas = document.createElement("canvas")
            await QRCode.toCanvas(canvas, text, qrOptions)

            // Canvas'ı blob'a çevir
            return new Promise((resolve, reject) => {
                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        reject(new Error("Failed to create blob from canvas"))
                        return
                    }

                    try {
                        const arrayBuffer = await blob.arrayBuffer()
                        const uint8Array = new Uint8Array(arrayBuffer)
                        resolve(uint8Array)
                    } catch (error) {
                        reject(error)
                    }
                }, "image/png")
            })
        } catch (error) {
            console.error("Error generating QR code buffer:", error)
            throw new Error("Failed to generate QR code")
        }
    }

    static async generateQRDataURL(text: string, options?: QRCodeOptions): Promise<string> {
        try {
            const settings = getQRSettings()

            const qrOptions = {
                width: options?.width || settings.qrCodeOptions.width,
                margin: options?.margin || settings.qrCodeOptions.margin,
                errorCorrectionLevel: options?.errorCorrectionLevel || settings.qrCodeOptions.errorCorrectionLevel,
                color: {
                    dark: "#000000",
                    light: "#FFFFFF",
                },
            }

            const dataURL = await QRCode.toDataURL(text, qrOptions)
            return dataURL
        } catch (error) {
            console.error("Error generating QR code data URL:", error)
            throw new Error("Failed to generate QR code")
        }
    }

    // Alternative method using data URL and converting to buffer
    static async generateQRBufferFromDataURL(text: string, options?: QRCodeOptions): Promise<Uint8Array> {
        try {
            const dataURL = await this.generateQRDataURL(text, options)

            // Data URL'den base64 kısmını al
            const base64Data = dataURL.split(",")[1]

            // Base64'ü binary'ye çevir
            const binaryString = atob(base64Data)
            const bytes = new Uint8Array(binaryString.length)

            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
            }

            return bytes
        } catch (error) {
            console.error("Error generating QR buffer from data URL:", error)
            throw new Error("Failed to generate QR buffer")
        }
    }

    static async generateOrderQRCode(orderId: number, options?: QRCodeOptions): Promise<Uint8Array> {
        const trackingURL = this.generateOrderTrackingURL(orderId)
        return await this.generateQRBufferFromDataURL(trackingURL, options)
    }
}
