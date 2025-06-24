"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import { ChatbotButton } from "@/components/chatbot-button"
import { ChatbotModal } from "@/components/chatbot-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Shield, Heart, Home } from "lucide-react"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"

export default function AIHelpPage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen)
  }

  return (
    <div className="relative min-h-screen bg-black">
      <BackgroundBeamsWithCollision
        beamColor1="rgba(139, 92, 246, 0.08)"
        beamColor2="rgba(59, 130, 246, 0.08)"
        beamColor3="rgba(16, 185, 129, 0.08)"
        beamCount={10}
        className="fixed inset-0 -z-10"
      >
        {/* Add any valid children content here */}
        <div className="hidden" />
      </BackgroundBeamsWithCollision>
      <main className="flex min-h-screen relative backdrop-blur-sm z-10">
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
          <div className="flex items-center gap-3 mb-6">
            <Bot className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Emergency Help</h1>
          </div>

          <p className="text-gray-400 mb-8 max-w-3xl">
            Get AI-powered assistance for emergency situations, preparedness guides, and safety tips. Use the chatbot
            for personalized help or browse the guides below.
          </p>

          <Tabs defaultValue="emergency" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="preparedness">Preparedness</TabsTrigger>
              <TabsTrigger value="first-aid">First Aid</TabsTrigger>
            </TabsList>

            <TabsContent value="emergency">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/60 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      Flood Safety
                    </CardTitle>
                    <CardDescription>What to do during a flood</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Move to higher ground immediately</p>
                    <p>• Do not walk, swim, or drive through flood waters</p>
                    <p>• Stay off bridges over fast-moving water</p>
                    <p>• Evacuate if told to do so</p>
                    <p>• Return home only when authorities say it is safe</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/60 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-orange-500" />
                      Wildfire Safety
                    </CardTitle>
                    <CardDescription>What to do during a wildfire</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Evacuate immediately if authorities recommend it</p>
                    <p>• Have emergency supplies and medications ready</p>
                    <p>• Wear protective clothing and footwear</p>
                    <p>• Turn off gas, power, and water if time allows</p>
                    <p>• Stay informed through emergency alerts</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preparedness">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/60 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-green-500" />
                      Emergency Kit
                    </CardTitle>
                    <CardDescription>Essential items for your emergency kit</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Water (one gallon per person per day for several days)</p>
                    <p>• Non-perishable food (at least a three-day supply)</p>
                    <p>• Battery-powered or hand crank radio</p>
                    <p>• Flashlight and extra batteries</p>
                    <p>• First aid kit and medications</p>
                    <p>• Whistle to signal for help</p>
                    <p>• Dust mask, plastic sheeting, and duct tape</p>
                    <p>• Moist towelettes, garbage bags, and plastic ties</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/60 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-teal-500" />
                      Family Emergency Plan
                    </CardTitle>
                    <CardDescription>Creating a family emergency plan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Identify evacuation routes from your home</p>
                    <p>• Establish meeting places: near home and outside neighborhood</p>
                    <p>• Choose an out-of-town contact person</p>
                    <p>• Document emergency contact information</p>
                    <p>• Plan for pets and those with special needs</p>
                    <p>• Know emergency plans for school and workplace</p>
                    <p>• Practice your plan regularly</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="first-aid">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/60 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      CPR Basics
                    </CardTitle>
                    <CardDescription>Basic CPR steps for adults</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Check if the person is responsive</p>
                    <p>• Call emergency services (911)</p>
                    <p>• Place the person on their back on a firm surface</p>
                    <p>• Begin chest compressions: Push hard and fast in the center of the chest</p>
                    <p>• Aim for a rate of 100-120 compressions per minute</p>
                    <p>• Allow the chest to completely recoil between compressions</p>
                    <p>• Continue until help arrives or the person shows signs of life</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/60 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      Treating Shock
                    </CardTitle>
                    <CardDescription>How to recognize and treat shock</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>• Look for: Pale skin, rapid breathing, weakness, confusion</p>
                    <p>• Call emergency services (911) immediately</p>
                    <p>• Have the person lie down on their back</p>
                    <p>• Elevate the legs about 12 inches if no head, neck, or back injuries</p>
                    <p>• Keep the person warm with blankets or coats</p>
                    <p>• Do not give food or drink</p>
                    <p>• Monitor breathing and consciousness until help arrives</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
    
  )
}
