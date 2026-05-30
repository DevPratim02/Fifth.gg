"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const { user, userProfile, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!loading) {
            const publicRoutes = ["/login", "/signup", "/forgot-password"];
            const isPublicRoute = publicRoutes.includes(pathname);

            if (!user) {
                // If user is not logged in and not on a public route, redirect to signup
                if (!isPublicRoute) {
                    router.push("/signup");
                }
            } else if (userProfile) {
                // Check if profile is complete (has in_game_name and tagline)
                const isProfileComplete = userProfile.in_game_name && userProfile.tagline;
                const isOnboardingPage = pathname === "/onboarding";

                // If profile incomplete and not on onboarding page, redirect to onboarding
                if (!isProfileComplete && !isOnboardingPage) {
                    router.push("/onboarding");
                } else if (isProfileComplete && isPublicRoute) {
                    // If profile is complete and they try to go to auth pages, take them to matchmaking
                    router.push("/find-players");
                }
            }
        }
    }, [user, userProfile, loading, pathname, router]);

    return <>{children}</>
}
