"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { getMatchHistory } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [available, setAvailable] = useState(true)
  const [matchHistory, setMatchHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !userProfile) {
      router.push('/login')
    }
  }, [authLoading, userProfile, router])

  // Fetch match history
  useEffect(() => {
    const fetchHistory = async () => {
      if (userProfile?.id) {
        try {
          const response = await getMatchHistory(userProfile.id)
          setMatchHistory(response.matches || [])
        } catch (error) {
          console.error("Failed to fetch match history:", error)
        } finally {
          setLoadingHistory(false)
        }
      }
    }

    if (userProfile) {
      fetchHistory()
    }
  }, [userProfile])

  if (authLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-valorant-red" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/omen.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />

      {/* Overlay to improve readability */}
      <div className="absolute inset-0 bg-black/60" style={{ zIndex: 1 }} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 inline-block bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg border border-valorant-red/30">
          My <span className="text-valorant-red">Profile</span>
        </h1>

        {/* Player Card */}
        <Card className="mb-6 border-valorant-red/30">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="h-24 w-24 rounded-xl bg-valorant-red/20 flex items-center justify-center text-4xl font-bold flex-shrink-0">
                {userProfile.in_game_name?.[0] || userProfile.email?.[0] || "?"}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-3xl font-bold">
                    {userProfile.in_game_name || "Agent"}
                    <span className="text-muted-foreground text-xl">#{userProfile.id}</span>
                  </h2>
                  <p className="text-muted-foreground mt-1">{userProfile.email}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-valorant-cyan/20 text-valorant-cyan border-valorant-cyan/30 text-base px-3 py-1">
                    {userProfile.ranks?.[0]?.current_rank || "Unranked"}
                  </Badge>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    MMR: {userProfile.ranks?.[0]?.mmr || "N/A"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-card/50 rounded-lg p-4 border border-border">
                <Label htmlFor="availability" className="cursor-pointer">
                  <div className="text-sm font-semibold">Matchmaking Status</div>
                  <div className="text-xs text-muted-foreground">{available ? "Ready" : "Busy"}</div>
                </Label>
                <Switch id="availability" checked={available} onCheckedChange={setAvailable} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match History */}
        <h2 className="text-2xl font-bold mb-4">Match History</h2>
        {loadingHistory ? (
          <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
        ) : matchHistory.length === 0 ? (
          <Card className="bg-black/40 border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              No matches played yet. Go find a game!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matchHistory.map((match: any) => (
              <Card key={match.id} className="bg-card/80 backdrop-blur">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg uppercase">{match.game_mode}</p>
                    <p className="text-sm text-muted-foreground">ID: {match.id}</p>
                  </div>
                  <Badge variant={match.status === 'completed' ? 'default' : 'secondary'}>
                    {match.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
