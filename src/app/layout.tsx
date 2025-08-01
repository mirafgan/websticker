import "@/styles/globals.css";

import type {Metadata} from "next";
import {Geist} from "next/font/google";

import {TRPCReactProvider} from "@/trpc/react";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "sonner";
import {Analytics} from "@vercel/analytics/next";
import ConfirmationModal from "@/components/modals/confirmation-modal";

export const metadata: Metadata = {
    title: " - Web Sticker",
    icons: [{rel: "icon", url: "/favicon.ico"}],
};

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${geist.variable}`}>
        <head>
            <meta name="google-signin-client_id"
                  content="210491408266-dmobt9824ns762fjhins8rlogqgdilr6.apps.googleusercontent.com"/>
        </head>
        <body>
        <ThemeProvider>
            <Toaster/>
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <ConfirmationModal/>
            <div id="g_id_onload"
                 data-client_id="210491408266-dmobt9824ns762fjhins8rlogqgdilr6.apps.googleusercontent.com"
                 data-callback="handleCredentialResponse">
            </div>
            <div className="g_id_signin" data-type="standard"></div>
        </ThemeProvider>
        <Analytics/>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        </body>
        </html>
    );
}
