export interface QRCodeSettings {
    baseURL: string
    trackingPath: string
    verificationPath: string
    qrCodeOptions: {
        width: number
        margin: number
        errorCorrectionLevel: "L" | "M" | "Q" | "H"
    }
}

export const defaultQRSettings: QRCodeSettings = {
    baseURL: "https://your-domain.com", // Dəyişiləcək
    trackingPath: "/track",
    verificationPath: "/verify",
    qrCodeOptions: {
        width: 120,
        margin: 1,
        errorCorrectionLevel: "M",
    },
}

// Environment variables'dan ayarları al
export const getQRSettings = (): QRCodeSettings => {
    return {
        baseURL: process.env.NEXT_PUBLIC_QR_BASE_URL || defaultQRSettings.baseURL,
        trackingPath: process.env.NEXT_PUBLIC_QR_TRACKING_PATH || defaultQRSettings.trackingPath,
        verificationPath: process.env.NEXT_PUBLIC_QR_VERIFICATION_PATH || defaultQRSettings.verificationPath,
        qrCodeOptions: defaultQRSettings.qrCodeOptions,
    }
}
