"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import  Sidebar  from "@/components/sidebar"
import { ChatbotButton } from "@/components/chatbot-button"
import { ChatbotModal } from "@/components/chatbot-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] bg-gray-900 rounded-lg flex items-center justify-center">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  ),
})

interface AlertData {
  id: number
  type: string
  severity: string
  description: string
  lat: number
  lon: number
  timestamp: string
}

interface ReportData {
  id: number
  user_id: number
  description: string
  lat: number
  lon: number
  category: string
  image_url?: string
  timestamp: string
  reportType?: string
}

export default function MapPage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch reports from API
        const reportsResponse = await fetch("/api/get_reports")

        if (!reportsResponse.ok) {
          throw new Error("Failed to fetch reports")
        }

        const reportsData = await reportsResponse.json()

        // Transform the data to match the expected format
        const formattedReports = (reportsData.reports || []).map((report: any) => ({
          id: report.id,
          user_id: 1, // Default user ID
          description: report.description,
          lat: report.latitude,
          lon: report.longitude,
          category: report.category,
          reportType: report.reportType || "Localised Weather", // Default to Localised Weather if not specified
          timestamp: new Date().toISOString(),
        }))

        setReports(formattedReports)

        // For demo purposes, set some sample alerts
        setAlerts([
          {
            id: 1,
            type: "Flood",
            severity: "High",
            description: "Flash flooding in downtown area",
            lat: 40.7128,
            lon: -74.006,
            timestamp: new Date().toISOString(),
          },
          {
            id: 2,
            type: "Wildfire",
            severity: "Extreme",
            description: "Rapidly spreading wildfire near residential areas",
            lat: 34.0522,
            lon: -118.2437,
            timestamp: new Date().toISOString(),
          },
        ])
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load map data. Please try again later.")

        // Set empty arrays if there's an error
        setReports([])
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen)
  }

  return (
    <main className="flex min-h-screen relative bg-black">
      {/* Chatbot Button */}
      <div className="absolute top-6 left-6 z-50">
        <ChatbotButton onClick={toggleChatbot} />
      </div>

      {/* Chatbot Modal */}
      {isChatbotOpen && <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />}

      {/* Sidebar Navigation */}
      <div className="absolute right-0 top-0 h-full z-40">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-0 mr-16">
        <h1 className="text-3xl font-bold mb-6">Interactive Disaster Map</h1>

        

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Live Disaster Map</CardTitle>
            <CardDescription>View active alerts and community reports. Click on markers for details.</CardDescription>
          </CardHeader>
          <CardContent>
            <MapComponent alerts={alerts} reports={reports} />
          </CardContent>
        </Card>

        
      </div>
    </main>
  )
}
