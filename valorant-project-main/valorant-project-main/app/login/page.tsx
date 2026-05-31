"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { signInWithEmail } from "@/lib/firebase"
import { useAuth } from "@/lib/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await signInWithEmail(email, password)
            toast({
                title: "Welcome back!",
                description: "Successfully signed in to Fifth.gg",
            })
            router.push("/find-players")
        } catch (error: any) {
            console.error("Login error:", error)
            toast({
                title: "Login failed",
                description: error.message || "Invalid email or password",
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

            {/* Animated Gradient Orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-valorant-red/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-valorant-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Login Card */}
            <Card className="relative z-10 w-full max-w-md p-8 bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-valorant-red to-valorant-cyan bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground">Sign in to find your fifth</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
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

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-valorant-cyan transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 h-12 bg-input/50 border-border/50 focus:border-valorant-cyan focus:ring-valorant-cyan/20 transition-all"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-border/50 bg-input/50 text-valorant-cyan focus:ring-valorant-cyan/20 cursor-pointer"
                                    disabled={isLoading}
                                />
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                    Remember me
                                </span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-valorant-cyan hover:text-valorant-cyan/80 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gradient-to-r from-valorant-red to-valorant-red/90 hover:from-valorant-red/90 hover:to-valorant-red text-white font-semibold text-lg glow-red hover:glow-red-lg transition-all duration-300 group"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>


                    {/* Sign Up Link */}
                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link
                            href="/signup"
                            className="text-valorant-cyan hover:text-valorant-cyan/80 font-semibold transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    )
}
