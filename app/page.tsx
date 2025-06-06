"use client"

import { useState } from "react"
import Link from "next/link"
import OrbBackground from "@/components/orb-background"
import Sidebar from "@/components/sidebar"
import { InfoBox } from "@/components/info-box"
import { ChatbotButton } from "@/components/chatbot-button"
import { ChatbotModal } from "@/components/chatbot-modal"
import { CloudFog, Map, FileText, Bot } from "lucide-react"
import ShinyText from "@/components/ShinyText"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"


export default function Home() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen)
  }

  return (
    <BackgroundBeamsWithCollision
      beamColor1="rgba(255, 153, 0, 0.15)"
      beamColor2="rgba(255, 0, 0, 0.15)"
      beamColor3="rgba(255, 102, 0, 0.15)"
      beamCount={15}
    >
      <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-black/50 backdrop-blur-sm text-white">
        {/* Chatbot Button */}
        <div className="absolute top-6 left-6 z-50">
          <ChatbotButton onClick={toggleChatbot} />
        </div>

        {/* Chatbot Modal */}
        {isChatbotOpen && <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />}

        {/* Sidebar */}
        <div className="absolute right-0 top-0 h-full z-40">
          <Sidebar />
        </div>

        {/* Main Content Section */}
        <section className="z-50 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 items-center gap-16 px-6 pt-34 pb-10 relative overflow-visible">
          {/* Left: Orb-wrapped Alertic */}
          <div className="relative flex items-center justify-center w-full h-[24rem] md:h-[32rem] overflow-visible">
            <div className="absolute inset-0">
              <OrbBackground hoverIntensity={2.33} rotateOnHover={true} hue={36} forceHoverState={false} />
            </div>
            <h1 className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500 leading-tight">
              <ShinyText text="Alertic" disabled={false} speed={3} className="custom-class" />
            </h1>
          </div>

          {/* Right: Text Content */}
          <div className="text-left space-y-6 md:pl-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-snug">
              Real-time disaster alerts and community reporting
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
              Stay informed about natural disasters, localized weather, contribute to community reports, and get
              AI-powered assistance during emergencies.
            </p>
          </div>
        </section>

        {/* Info Boxes Section */}
        <section className="z-30 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-16">
          <Link href="/weather">
            <InfoBox
              icon={<CloudFog className="h-6 w-6 text-red-500" />}
              title="Weather"
              description="View weather predictions at your place of choice"
            />
          </Link>
          <Link href="/map">
            <InfoBox
              icon={<Map className="h-6 w-6 text-blue-500" />}
              title="Map"
              description="Interactive map of disasters and reports"
            />
          </Link>
          <Link href="/reports">
            <InfoBox  
              icon={<FileText className="h-6 w-6 text-green-500" />}
              title="Reports"
              description="Community submitted disaster reports"
            />
          </Link>     
          <Link href="/ai-help">
            <InfoBox
              icon={<Bot className="h-6 w-6 text-purple-500" />}
              title="AI Help"
              description="Get emergency tips and preparedness guides"
            />
          </Link>
        </section>
      </main>
    </BackgroundBeamsWithCollision>
  )
}
