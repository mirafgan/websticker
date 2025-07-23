"use server"
import {cookies} from "next/headers";

export const setCookie = async (name: string, value: string) => {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    })
};

export async function removeCookie(key: string) {
    const cookieStore = await cookies();
    cookieStore.delete(key)
}