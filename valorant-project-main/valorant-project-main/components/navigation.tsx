"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, LogIn, MessageSquare } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useMatchmaking } from "@/hooks/useSocket"

export function Navigation() {
  const { user, userProfile, loading, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { socket, currentMatch } = useMatchmaking(userProfile?.id || null)

  // Track unread message count and recent messages
  const [unreadCount, setUnreadCount] = useState(0)
  const [recentMessages, setRecentMessages] = useState<any[]>([])

  // Listen for new messages globally
  useEffect(() => {
    if (!socket || !userProfile) return

    const handleNewMessage = (msg: any) => {
      // Only count messages from others
      if (msg.userId !== userProfile.id) {
        setUnreadCount(prev => prev + 1)
        setRecentMessages(prev => [msg, ...prev].slice(0, 5)) // Keep last 5 messages

        // Show toast notification
        toast({
          title: `New message from ${msg.username}`,
          description: msg.text?.substring(0, 50) + (msg.text?.length > 50 ? '...' : ''),
          duration: 4000,
        })
      }
    }

    socket.on('chat:message', handleNewMessage)

    return () => {
      socket.off('chat:message', handleNewMessage)
    }
  }, [socket, userProfile, toast])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      })
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userProfile?.in_game_name) {
      return userProfile.in_game_name.substring(0, 2).toUpperCase()
    }
    if (userProfile?.email) {
      return userProfile.email.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
            FIFTH<span className="text-valorant-red">.gg</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-valorant-red">
            Home
          </Link>
          <Link href="/find-players" className="text-sm font-medium transition-colors hover:text-valorant-red">
            Find Players
          </Link>
          {user && (
            <Link href="/profile" className="text-sm font-medium transition-colors hover:text-valorant-red">
              My Profile
            </Link>
          )}
        </div>

        {loading ? (
          <div className="h-9 w-9 rounded-full bg-card animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3">
            {/* Message Notification Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 hover:bg-valorant-red/10 hover:text-valorant-red focus:outline-none"
                >
                  <MessageSquare className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center bg-valorant-red hover:bg-valorant-red text-white text-xs px-1 rounded-full border-2 border-background"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount} new
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {recentMessages.length > 0 ? (
                  <>
                    {recentMessages.map((msg, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        asChild
                        className="cursor-pointer"
                      >
                        <Link
                          href={currentMatch?.id ? `/chat/${currentMatch.id}` : '/find-players'}
                          onClick={() => {
                            setUnreadCount(0)
                            setRecentMessages([])
                          }}
                          className="flex flex-col gap-1 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{msg.username}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {msg.text}
                          </p>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={currentMatch?.id ? `/chat/${currentMatch.id}` : '/find-players'}
                        className="text-center text-sm text-valorant-red font-semibold cursor-pointer"
                        onClick={() => {
                          setUnreadCount(0)
                          setRecentMessages([])
                        }}
                      >
                        View All Messages
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new messages
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-9 w-9 border-2 border-valorant-red/50 hover:border-valorant-red transition-colors">
                  <AvatarImage src={userProfile?.avatar_url || undefined} alt="User" />
                  <AvatarFallback className="bg-card text-sm">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile?.in_game_name || "Player"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProfile?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-valorant-red/50 hover:bg-valorant-red/10 hover:border-valorant-red"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
