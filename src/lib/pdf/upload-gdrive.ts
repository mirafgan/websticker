"use client"
const CLIENT_ID = '210491408266-dmobt9824ns762fjhins8rlogqgdilr6.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCrJQGmTfVXRE19ImxQ2-OrBpq3BpmdeL8';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
//
// declare global {
//     interface Window {
//         google: {
//             accounts: {
//                 id: {
//                     initialize: (config: any) => void
//                     prompt: (callback?: (notification: any) => void) => void
//                 }
//             }
//         }
//     }
// }

export function initClient(pdfBytes: BlobPart) {
    function handleCredentialResponse({credential}: { credential: string }) {
        uploadFileToDrive(pdfBytes, credential)
    }

    if (typeof window !== undefined) {
        window?.google?.accounts.id.initialize({

            client_id: CLIENT_ID,
            callback: handleCredentialResponse
        });
        window?.google?.accounts.id.prompt();
    }

}


function uploadFileToDrive(pdfBytes: BlobPart, credential: string) {
    const blob = new Blob([pdfBytes], {type: 'application/pdf'});
    const metadata = {
        name: 'test.pdf',
        mimeType: 'application/pdf',
    };

    // const accessToken = gapi.auth.getToken().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', blob);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
        method: 'POST',
        headers: new Headers({Authorization: 'Bearer ' + credential}),
        body: form,
    }).then(res => res.json())
        .then(val => console.log('Uploaded file ID:', val.id))
        .catch(err => console.log(err));
}
