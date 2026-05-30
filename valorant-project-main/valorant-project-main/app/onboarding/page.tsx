"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { updateUserProfile } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function OnboardingPage() {
    const { userProfile, loading: authLoading } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const [ign, setIgn] = useState("")
    const [tagline, setTagline] = useState("")
    const [loading, setLoading] = useState(false)

    // Redirect if not logged in, or if already onboarding complete
    useEffect(() => {
        if (!authLoading) {
            if (!userProfile) {
                router.push("/login")
            } else if (userProfile.in_game_name && userProfile.tagline) {
                router.push("/find-players")
            }
        }
    }, [authLoading, userProfile, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userProfile) return

        if (!ign || !tagline) {
            toast({ title: "Error", description: "Please fill all fields", variant: "destructive" })
            return
        }

        setLoading(true)
        try {
            await updateUserProfile(userProfile.id, {
                inGameName: ign,
                tagline: tagline.replace('#', '')
            })

            toast({ title: "Success", description: "Profile updated! Welcome agent." })
            // Force reload to ensure context updates
            window.location.href = "/find-players"
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Failed to update profile", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    if (authLoading || !userProfile) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-valorant-red" /></div>
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-top" style={{ backgroundImage: "url('/jett-onboarding.png')" }} />
            <div className="absolute inset-0 bg-black/40" />

            <Card className="max-w-md w-full border-valorant-red/30 relative z-10 bg-background/95 backdrop-blur">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold uppercase tracking-widest text-valorant-red">Agent Registration</CardTitle>
                    <CardDescription>Enter your Riot ID to begin operations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="ign">Riot ID Name</Label>
                            <Input
                                id="ign"
                                value={ign}
                                onChange={(e) => setIgn(e.target.value)}
                                placeholder="e.g. TenZ"
                                required
                                className="bg-secondary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tagline">Tagline</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground font-bold text-lg">#</span>
                                <Input
                                    id="tagline"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value.replace('#', ''))}
                                    placeholder="NA1"
                                    required
                                    className="bg-secondary/50"
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-valorant-red hover:bg-valorant-red/90 font-bold mt-4" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" /> : "INITIALIZE PROTOCOL"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
