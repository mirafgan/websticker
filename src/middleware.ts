import type {NextRequest} from "next/server"
import {NextResponse} from "next/server"
import {verifyJWT} from "@/lib/jwt/verifyJWT";


const publicRoutes = ["/", '/auth/login']

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const baseUrl = request.nextUrl.origin;
    if (request.method === "POST") {
        return NextResponse.next()
    }

    if (pathname.startsWith("/api/")) {
        return NextResponse.next()
    }

    if (request.method === "GET") {
        const token = request.cookies.get("Authorization")?.value
        const isPublicRoute = publicRoutes.includes(pathname)

        if (token) {
            try {
                const user = await verifyJWT(token);
                if (isPublicRoute) {
                    return NextResponse.redirect(`${baseUrl}/dashboard/orders`)
                }
                if (!user) {
                    console.error('Auth verification failed:')

                    const response = NextResponse.redirect(`${baseUrl}/auth/login`)

                    response.cookies.delete("Authorization")

                    return response
                }
                return NextResponse.next()

            } catch (error) {
                console.error('Auth verification failed:', error)

                const response = NextResponse.redirect(`${baseUrl}/auth/login`)

                response.cookies.delete("Authorization")

                return response
            }
        } else {
            if (isPublicRoute) {
                return NextResponse.next()
            } else {
                return NextResponse.redirect(`${baseUrl}/auth/login`)
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}