"use client"

import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Bell, User} from "lucide-react"
import {removeCookie} from "@/actions/cookie-action";
import {useRouter} from "next/navigation";
import {api} from "@/trpc/react";

export function DashboardHeader() {
    const router = useRouter();
    const logOut = async () => {
        await removeCookie("Authorization");
        router.push("/auth/login");
    };
    const {data: userQueryResponse} = api.auth.getUser.useQuery();
    const userData = userQueryResponse?.user

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-end">


                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                        <Bell className="w-5 h-5"/>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder-user.jpg" alt="User"/>
                                    <AvatarFallback>
                                        <User className="w-4 h-4"/>
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userData?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{userData?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={logOut}>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
