"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase"
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

    const handleGoogleLogin = async () => {
        setIsLoading(true)

        try {
            await signInWithGoogle()
            toast({
                title: "Welcome!",
                description: "Successfully signed in with Google",
            })
            router.push("/find-players")
        } catch (error: any) {
            console.error("Google login error:", error)
            toast({
                title: "Login failed",
                description: error.message || "Failed to sign in with Google",
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

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="h-11 bg-input/30 border-border/50 hover:bg-input/50 hover:border-valorant-cyan/50 transition-all"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Google
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                            className="h-11 bg-input/30 border-border/50 hover:bg-input/50 hover:border-valorant-cyan/50 transition-all"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                            Discord
                        </Button>
                    </div>

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
