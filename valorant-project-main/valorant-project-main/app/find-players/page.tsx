"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Loader2, UserPlus, Check, X, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"
import { useMatchmaking } from "@/hooks/useSocket"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"



export default function FindPlayersPage() {
  const { userProfile } = useAuth()
  const {
    socket,
    matchStatus,
    currentMatch,
    joinQueue,
    leaveQueue,
    acceptMatch,
    declineMatch,
    error
  } = useMatchmaking(userProfile?.id || null)

  // Unread Messages State
  const [unreadUsers, setUnreadUsers] = useState<Set<number>>(new Set())

  // Listen for new messages while in the Match List
  useEffect(() => {
    if (currentMatch?.id && socket && userProfile) {
      socket.emit('chat:join', { roomId: String(currentMatch.id), userId: userProfile.id })

      const handleMessage = (msg: any) => {
        if (msg.userId !== userProfile.id) {
          setUnreadUsers(prev => {
            const next = new Set(prev)
            next.add(msg.userId)
            return next
          })
          toast({
            title: "New Message",
            description: `${msg.username || 'Agent'} sent: ${msg.text ? msg.text.substring(0, 20) : 'message'}...`,
            duration: 3000
          })
        }
      }

      socket.on('chat:message', handleMessage)

      return () => {
        socket.off('chat:message', handleMessage)
      }
    }
  }, [currentMatch, socket, userProfile])



  const { toast } = useToast()
  const router = useRouter()


  // UI States
  const [searchTime, setSearchTime] = useState(0)

  const [selectedRank, setSelectedRank] = useState("any")
  const [rankTier, setRankTier] = useState([2])
  const [selectedGameMode, setSelectedGameMode] = useState("competitive")
  const [selectedServer, setSelectedServer] = useState("mumbai")

  // Dropdown states
  const [serverOpen, setServerOpen] = useState(false)
  const [rankOpen, setRankOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)

  // Refs
  const serverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rankTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const languageTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Timer logic
  useEffect(() => {
    if (matchStatus === 'searching') {
      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        setSearchTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setSearchTime(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [matchStatus])

  // Error handling
  useEffect(() => {
    if (error) {
      toast({
        title: "Matchmaking Error",
        description: error,
        variant: "destructive"
      })
    }
  }, [error, toast])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (serverTimeoutRef.current) clearTimeout(serverTimeoutRef.current)
      if (rankTimeoutRef.current) clearTimeout(rankTimeoutRef.current)
      if (languageTimeoutRef.current) clearTimeout(languageTimeoutRef.current)
    }
  }, [])

  const handleSearchToggle = () => {
    if (matchStatus === 'idle' || matchStatus === 'found' || matchStatus === 'accepted' || matchStatus === 'started') {
      if (!userProfile) {
        toast({
          title: "Authentication Required",
          description: "Please log in to find players",
          variant: "destructive"
        })
        return
      }
      joinQueue(selectedGameMode, selectedRank, selectedServer)
    } else {
      leaveQueue()
    }
  }

  // Handler for mouse leave with delay
  const handleMouseLeave = (
    setOpen: (open: boolean) => void,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, 500)
  }

  const handleMouseEnter = (timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const isSearching = matchStatus === 'searching'
  const isMatchFound = matchStatus === 'found' || matchStatus === 'accepted' || matchStatus === 'started'

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/new.png')" }} />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 inline-block bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg border border-valorant-red/30">
          Find Your <span className="text-valorant-red">Fifth</span>
        </h1>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Filters Panel */}
          <Card className="h-fit sticky top-20">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Search Filters</h3>
              </div>

              <div className="space-y-2">
                <Label>Game Mode</Label>
                <Select
                  value={selectedGameMode}
                  onValueChange={setSelectedGameMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="competitive">Competitive</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Server</Label>
                <Select value={selectedServer} onValueChange={setSelectedServer} open={serverOpen} onOpenChange={setServerOpen}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent onMouseLeave={() => handleMouseLeave(setServerOpen, serverTimeoutRef)} onMouseEnter={() => handleMouseEnter(serverTimeoutRef)}>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="singapore">Singapore</SelectItem>
                    <SelectItem value="hongkong">Hong Kong</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rank</Label>
                <Select value={selectedRank} onValueChange={setSelectedRank} open={rankOpen} onOpenChange={setRankOpen}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent onMouseLeave={() => handleMouseLeave(setRankOpen, rankTimeoutRef)} onMouseEnter={() => handleMouseEnter(rankTimeoutRef)}>
                    <SelectItem value="any">Any Rank</SelectItem>
                    <SelectItem value="iron">Iron</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                    <SelectItem value="ascendant">Ascendant</SelectItem>
                    <SelectItem value="immortal">Immortal</SelectItem>
                    <SelectItem value="radiant">Radiant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedRank !== "any" && (
                <div className="space-y-2">
                  <Label>Rank Tier</Label>
                  <div className="px-2">
                    <Slider value={rankTier} onValueChange={setRankTier} min={1} max={3} step={1} className="mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  defaultValue="english"
                  open={languageOpen}
                  onOpenChange={setLanguageOpen}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    onMouseLeave={() => handleMouseLeave(setLanguageOpen, languageTimeoutRef)}
                    onMouseEnter={() => handleMouseEnter(languageTimeoutRef)}
                  >
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className={`w-full font-semibold transition-all ${isSearching
                  ? "bg-secondary hover:bg-secondary/80"
                  : "bg-valorant-red hover:bg-valorant-red/90 glow-red hover:glow-red-lg"
                  }`}
                onClick={handleSearchToggle}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancel Search
                  </>
                ) : (
                  "Start Search"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="space-y-6 max-w-2xl">
            {isSearching && (
              <Card className="border-valorant-cyan/50">
                <CardContent className="p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-valorant-cyan" />
                  <p className="text-lg font-semibold">Searching for players...</p>
                  <p className="text-sm text-muted-foreground mt-1">Time elapsed: {searchTime}s</p>
                </CardContent>
              </Card>
            )}

            {/* Match Found UI - Shows only when match is found */}
            {/* Match Found UI - Vertical List of Players */}
            {isMatchFound && currentMatch && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-black/60 p-4 rounded-lg border-l-4 border-valorant-red mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <span className="text-valorant-red">●</span> Match Found
                    </h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                      {currentMatch.gameMode} • {currentMatch.participants?.length || 0} Agents
                    </p>
                  </div>
                </div>

                {currentMatch.participants?.map((p: any) => (
                  <Card key={p.user_id} className="border-white/10 bg-black/40 hover:bg-black/60 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded bg-valorant-red text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-valorant-red/20 shrink-0">
                          {p.in_game_name ? p.in_game_name[0].toUpperCase() : '?'}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white leading-none">
                            {p.in_game_name}
                            {userProfile?.id === p.user_id && <Badge className="ml-2 h-5 text-[10px] bg-valorant-cyan text-black border-none">YOU</Badge>}
                          </h3>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{p.tagline || 'Ready'}</p>
                        </div>
                      </div>

                      <Link href={`/chat/${currentMatch.id}`} className="relative">
                        <Button className={`relative transition-all font-semibold uppercase tracking-wider text-xs h-10 px-6 ${unreadUsers.has(p.user_id)
                          ? "bg-valorant-red hover:bg-valorant-red/90 text-white border border-valorant-red animate-pulse"
                          : "bg-white/10 hover:bg-valorant-red text-white hover:text-white border border-white/20"
                          }`}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          {unreadUsers.has(p.user_id) ? "New Message!" : "Message"}
                          {unreadUsers.has(p.user_id) && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                          )}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  )
}
