import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { getServerSession } from "@/server/auth"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

const UserCartBanner = async () => {
    const session = await getServerSession()
    const user = session?.user

    if (!user) {
        return (
            <Card className="w-full max-w-xs">
                <CardContent className="p-4 text-center text-muted-foreground">
                    Please log in to continue.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-xs">
            <CardContent className=" flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar>
                                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User avatar"} />
                                    <AvatarFallback>
                                        {user.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent><p className="text-sm">{user.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="grid gap-0.5">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <form action="/api/auth/signout" method="POST">
                    <Button variant="ghost" size="icon" type="submit" aria-label="Logout">
                        <LogOut className="h-4 w-4" />
                        <span className="sr-only">Logout</span>
                    </Button>
                </form>
            </CardContent>
        </Card >
    )
}

export default UserCartBanner


//   <TooltipProvider delayDuration={0}>
//         <Tooltip>
//             <TooltipTrigger asChild>
//                 <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={toggleTheme}
//                     aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
//                 >
//                     {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//                 </Button>
//             </TooltipTrigger>
//             <TooltipContent sideOffset={5}>{theme === "light" ? "Dark Mode" : "Light Mode"}</TooltipContent>
//         </Tooltip>
//     </TooltipProvider>