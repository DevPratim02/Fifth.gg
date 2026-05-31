"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Star, Copy, CheckCircle2, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { useChat, useMatchmaking } from "@/hooks/useSocket"
import { useRouter, useParams } from "next/navigation"
import { getMatch } from "@/lib/api"

export default function ChatPage() {
  const { userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Use the match ID from params as the room ID
  const roomId = params?.id as string

  // Initialize chat hook
  const {
    messages,
    sendMessage,
    sendTyping,
    typingUsers,
    isConnected
  } = useChat(
    roomId,
    userProfile?.id || null,
    userProfile?.in_game_name || userProfile?.email?.split('@')[0] || "User"
  )

  const { endMatch } = useMatchmaking(userProfile?.id || null)

  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { socket } = useMatchmaking(userProfile?.id || null)

  const [matchData, setMatchData] = useState<any>(null)

  useEffect(() => {
    if (roomId && !isNaN(Number(roomId))) {
      getMatch(Number(roomId)).then(data => {
        if (data && data.match) setMatchData(data.match)
      }).catch(err => console.log("Chat room load info:", err))
    }
  }, [roomId])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !userProfile) {
      router.push('/login')
    }
  }, [authLoading, userProfile, router])

  // Listen for match ended event globally
  useEffect(() => {
    if (!socket) return;
    
    const handleMatchEnded = (data: any) => {
      if (String(data.matchId) === roomId) {
        toast({
          title: "Match Ended",
          description: "This match has been ended by a participant.",
          variant: "destructive"
        })
        router.push("/find-players")
      }
    }
    
    socket.on('match:ended', handleMatchEnded)
    
    return () => {
      socket.off('match:ended', handleMatchEnded)
    }
  }, [socket, roomId, router, toast])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, typingUsers])

  const handleSend = () => {
    if (!input.trim() || !isConnected) return
    sendMessage(input)
    setInput("")
    sendTyping(false)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)

    // Clear existing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    // Send typing started
    sendTyping(true)

    // Set timeout to stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false)
    }, 2000)
  }

  const shareRiotId = () => {
    // In a real app, this would get the user's actual Riot ID
    // Construct Riot ID from in_game_name and tagline
    const riotId = userProfile?.in_game_name && userProfile?.tagline
      ? `${userProfile.in_game_name}#${userProfile.tagline.replace('#', '')}`
      : "No Riot ID Set"
    navigator.clipboard.writeText(riotId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEndMatch = () => {
    if (roomId && !isNaN(Number(roomId))) {
      endMatch(Number(roomId))
      router.push("/profile")
    }
  }

  // Formatting timestamp
  const formatTime = (isoString?: string) => {
    if (!isoString) return ""
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/cham.gif')" }} />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">


        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Player Info Card (Left Side) */}
          <Card className="h-fit sticky top-20 hidden lg:block">
            <CardHeader className="pb-4 border-b border-white/10">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-lg text-valorant-red uppercase tracking-wider">
                  {matchData ? "SQUAD DEPLOYED" : "CHAT LOBBY"}
                </h3>
                {matchData && <span className="text-xs text-muted-foreground uppercase">{matchData.game_mode} • {matchData.status}</span>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {matchData ? (
                <div className="space-y-3">
                  {matchData.participants?.map((p: any) => (
                    <div key={p.user_id} className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-white/5">
                      <div className="h-10 w-10 rounded bg-valorant-red text-white flex items-center justify-center font-bold shrink-0">
                        {p.in_game_name ? p.in_game_name[0].toUpperCase() : '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-white truncate">{p.in_game_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.tagline}</p>
                      </div>
                      {userProfile?.id === p.user_id && <Badge variant="secondary" className="text-[10px] h-4 bg-valorant-cyan/20 text-valorant-cyan ml-auto">YOU</Badge>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-lg bg-valorant-red/20 flex items-center justify-center text-xl font-bold">
                    {userProfile?.in_game_name?.[0] || "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {userProfile?.in_game_name || "You"}
                    </h3>
                    <Badge variant="secondary" className="bg-valorant-cyan/20 text-valorant-cyan border-valorant-cyan/30 mt-1">
                      Online
                    </Badge>
                  </div>
                </div>
              )}

              <div className="h-px bg-white/10 my-4" />

              <div className="text-sm text-muted-foreground">
                This is a secure chat room. Co-ordinate strats here.
              </div>

              <Button onClick={shareRiotId} className="w-full bg-valorant-red hover:bg-valorant-red/90 font-semibold">
                {copied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Copy Riot ID
                  </>
                )}
              </Button>

              <Button onClick={handleEndMatch} variant="outline" className="w-full border-valorant-red text-valorant-red hover:bg-valorant-red hover:text-white font-semibold">
                End Match
              </Button>

              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertDescription className="text-xs">
                  <span className="font-semibold">⚠️ Play fair.</span> Toxic behavior lowers reputation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="flex flex-col h-[calc(100vh-12rem)]">
            {/* Messages */}
            <CardContent ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground mt-10">
                  No messages yet. Say hello to your team!
                </div>
              )}

              {messages.map((msg) => {
                const isMe = msg.userId === userProfile?.id
                return (
                  <div key={msg.id || Math.random()} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] space-y-1`}>
                      {!isMe && <p className="text-xs text-muted-foreground ml-1">{msg.username}</p>}
                      <div
                        className={`rounded-lg p-3 ${isMe ? "bg-valorant-red text-white" : "bg-card border border-border"
                          }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <p className={`text-[10px] text-muted-foreground ${isMe ? "text-right" : "text-left"}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              })}

              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-card/50 border border-border/50 rounded-lg p-2 text-xs text-muted-foreground italic">
                    {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input Area */}
            <CardContent className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={isConnected ? "Type your message..." : "Connecting..."}
                  disabled={!isConnected}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!isConnected || !input.trim()}
                  className="bg-valorant-red hover:bg-valorant-red/90"
                >
                  {isConnected ? <Send className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
