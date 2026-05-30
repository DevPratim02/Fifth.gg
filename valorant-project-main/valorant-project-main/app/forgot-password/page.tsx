"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Mail, ArrowRight, Loader2 } from "lucide-react"
import { forgotPassword } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const { toast } = useToast()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await forgotPassword(email)
            toast({
                title: "Reset link sent",
                description: "Check your email for instructions to reset your password.",
            })
            setIsSent(true)
        } catch (error: any) {
            console.error("Reset password error:", error)
            toast({
                title: "Error",
                description: error.message || "Failed to send reset email",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
            {/* Animated Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute z-0 w-full h-full object-cover"
            >
                <source src="/Valo_Gif.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

            {/* Login Card */}
            <Card className="relative z-10 w-full max-w-md p-8 bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-valorant-red to-valorant-cyan bg-clip-text text-transparent">
                            Reset Password
                        </h1>
                        <p className="text-muted-foreground">Enter your email to receive a reset link</p>
                    </div>

                    {isSent ? (
                        <div className="space-y-6 text-center">
                            <div className="bg-secondary/50 p-4 rounded-lg border border-border/50">
                                <Mail className="h-10 w-10 mx-auto text-valorant-cyan mb-2" />
                                <p className="text-sm">We have sent a password reset link to <span className="font-bold text-foreground">{email}</span></p>
                            </div>
                            <Button asChild className="w-full bg-valorant-red hover:bg-valorant-red/90 font-semibold">
                                <Link href="/login">Return to Login</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-valorant-cyan transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="agent@valorant.gg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 bg-input/50 border-border/50 focus:border-valorant-cyan focus:ring-valorant-cyan/20 transition-all"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-valorant-red to-valorant-red/90 hover:from-valorant-red/90 hover:to-valorant-red text-white font-semibold text-lg glow-red hover:glow-red-lg transition-all duration-300 group"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Send Reset Link
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    )}

                    {!isSent && (
                        <div className="text-center text-sm">
                            <Link
                                href="/login"
                                className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}
