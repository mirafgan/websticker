"use client"
import { useTheme } from 'next-themes'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Moon, Sun } from 'lucide-react'

const ThemeButton = () => {
    const { theme, setTheme } = useTheme()
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    >
                        {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>{theme === "light" ? "Dark Mode" : "Light Mode"}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ThemeButton
