import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Shield, Zap } from "lucide-react"
import { Hero } from "@/components/hero"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        videoSrc="/Valo_Gif.mp4"
        title={<span>Never queue as <span className="text-valorant-red">four</span> again.</span>}
        subtitle="Find your perfect fifth for Valorant competitive matches."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/find-players">
            <Button
              size="lg"
              className="bg-valorant-red hover:bg-valorant-red/90 text-white font-semibold px-8 py-6 text-lg glow-red hover:glow-red-lg transition-all duration-300"
            >
              Find Fifth Man
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Link href="/find-players?solo=true">
            <Button
              size="lg"
              className="bg-valorant-cyan hover:bg-valorant-cyan/90 text-white font-semibold px-8 py-6 text-lg glow-cyan hover:glow-cyan-lg transition-all duration-300"
            >
              I'm a Solo Player
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Features Section */}
      <section className="py-32 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-valorant-red/10 mb-4">
                <Users className="h-8 w-8 text-valorant-red" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">
                Advanced algorithm matches you with players of similar rank and playstyle.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-valorant-cyan/10 mb-4">
                <Shield className="h-8 w-8 text-valorant-cyan" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reputation System</h3>
              <p className="text-muted-foreground">Player ratings keep the community positive and toxic players out.</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-valorant-red/10 mb-4">
                <Zap className="h-8 w-8 text-valorant-red" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Queues</h3>
              <p className="text-muted-foreground">Find teammates in seconds and get back to grinding ranked.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
