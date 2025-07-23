import {jwtVerify} from "jose";

export const verifyJWT = async (token: string) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    try {
        const {payload} = await jwtVerify(token, secret)
        return payload
    } catch (e) {
        console.error("JWT Doğrulama Hatası:", e)
        return null
    }
}