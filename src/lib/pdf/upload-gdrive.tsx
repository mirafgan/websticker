"use client"
import {useEffect, useState} from "react";
import {UploadCloud} from "lucide-react";
import {Button} from "@/components/ui/button";
import type {Order} from "@/lib/types";
import {usePDFGenerator} from "@/hooks/use-pdf-generator";
import useConfirmationModal from "@/store/confirmation-modal-store";
import {generatePDF} from "@/lib/pdf/invoice-generator";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/drive.file';


let pdfBytes: BlobPart | undefined = undefined
export default function UploadToDrive({order}: { order: Order }) {
    const {openModal} = useConfirmationModal();
    const [tokenClient, setTokenClient] = useState<any>()
    const {isGenerating, generateInvoice} = usePDFGenerator();

    async function handleGeneratePDF(order: Order) {
        try {
            tokenClient?.requestAccessToken();
            pdfBytes = await generatePDF(order);
        } catch (e) {
            console.log("generateFromTemplate", e)
            try {
                await generateInvoice(order)
            } catch (e) {
                console.log("generateInvoice", e)
            }
        }
    }

    function uploadFileToDrive(pdfBytes: BlobPart, token: string, order: Order) {
        const blob = new Blob([pdfBytes], {type: 'application/pdf'});

        const metadata = {
            name: `factura-${order.id}-${Date.now()}.pdf`,
            mimeType: 'application/pdf',
        };


        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', blob);

        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({Authorization: 'Bearer ' + token}),
            body: form,
        }).then(res => res.json())
            .then(val => {
                openModal({
                    title: "Invoice successfully uploaded to Google Drive",
                    content: "Check your Google Drive",
                    isOpen: true,
                    onSubmit: null
                })
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        // @ts-ignore
        if (window.google?.accounts?.oauth2) {
            // @ts-ignore
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (response: any) => {
                    if (response.access_token && pdfBytes) {
                        uploadFileToDrive(pdfBytes, response.access_token, order)
                    } else {
                        console.error('Access token alınmadı:', response);
                    }
                }
            });
            setTokenClient(client);
        }
    }, []);

    return <Button
        variant="outline"
        size="sm"
        onClick={() => handleGeneratePDF(order)}
        disabled={isGenerating}
        className="h-8 w-8 p-0"
        title="Uploda GDrive"
    >
        <UploadCloud className="h-4 w-4"/>
    </Button>;
}
