"use client"

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {type FormEvent, useState} from "react";
import {Eye, EyeOff, Store} from "lucide-react";
import {useRouter} from "next/navigation";
import {api} from "@/trpc/react";
import {toast} from "sonner";
import {setCookie} from "@/actions/cookie-action";


export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter();
    const loginMutation = api.auth.login.useMutation({
        onSuccess: (ctx) => {
            if (ctx?.token) {
                ctx?.token && setCookie("Authorization", ctx?.token ?? '');
                toast("Login successfully. Redirecting to dashboard")
                router.refresh();
                return
            }
            toast("Email or Password is wrong")
        },
        onError: async (ctx) => {
            const zodErrors = ctx.data?.zodError?.fieldErrors
            if (zodErrors)
                for (const key in zodErrors) {
                    await new Promise((resolve) => {
                        setTimeout(() => resolve((() => {
                            return toast(`${key}: ${zodErrors?.[key]?.[0]} \n`)
                        })()), 1000)
                    })
                }
        }
    });

    const {isPending: loading, isSuccess} = loginMutation
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            loginMutation.mutate({email, password})

        } catch (e) {
            // toast({value: "Email or Password is wrong"})
            console.log(e)
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <Store className="w-6 h-6 text-white"/>
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                <CardDescription>Sign in to your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                            </Button>
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}