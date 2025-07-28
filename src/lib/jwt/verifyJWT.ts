import {jwtVerify} from "jose";

export type JWT_ERRORS_TYPE = "JWT_INVALID" | "JWT_EMPTY"

export class JWTVerifyError extends Error {
    constructor(public readonly code: JWT_ERRORS_TYPE) {
        super();
    }
}

/*

    ssh -i cert.pem user@hostname-or-ip -L 5432:localhost:5432

*/


export const verifyJWT = async (token: string) => {

    if (!token) {
        throw new JWTVerifyError("JWT_EMPTY");
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const {payload} = await jwtVerify(token, secret)
        return payload
    } catch (e) {
        console.error(e);
        throw new JWTVerifyError("JWT_INVALID")
    }
}

function ReturnMSG({code}: JWTVerifyError) {
    switch (code) {
        case "JWT_INVALID":
            return "Invalid JWT"
        case "JWT_EMPTY":
            return "JWT is empty"
    }
}
