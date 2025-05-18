"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GoogleGenAI } from "@google/genai";

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Yo! I'm your AI wingman for emergencies. What’s going down? Hit me up and I got you.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const genAI = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    genAI.current = new GoogleGenAI({
      apiKey:
        process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY ||
        "AIzaSyD_3T15tOy3CUHoGKRhXVsUtQZQe-Q68k0",
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const prompt = `You're a helpful, intelligent AI assistant. You can answer any question clearly and accurately, including real-time data like weather, current events, or live updates. Keep your tone natural, friendly, and respectful—like a helpful human, not a robot.
          
Always reply in short, crisp bullet points (no paragraphs). The user sees your message in a small textbox, so make every word count. Avoid bold text or special formatting. Don't try to sound overly casual—just speak clearly and helpfully.

Here's what the user said: "${input}". Now, respond in a useful, to-the-point way.`;

      const model = genAI.current?.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const response = await model;
      let botResponse = response?.text || "";

      if (!botResponse || botResponse.trim() === "") {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes("flood")) {
          botResponse =
            "Alright, flood alert. Don’t mess around—head to high ground ASAP. Skip the hero move; don’t drive or walk in that water. Stay sharp. Need details for your area?";
        } else if (
          lowerInput.includes("fire") ||
          lowerInput.includes("wildfire")
        ) {
          botResponse =
            "Fire in the area? Bounce if you’ve been told to. Shut windows, kill the gas and power, and don’t try to be a firefighter. You good or need evacuation tips?";
        } else if (lowerInput.includes("hurricane")) {
          botResponse =
            "Hurricane incoming? If you’ve got an evac order, don’t wait. If not, bunker down—stay inside, stay away from glass. Prep your go-bag. Wanna know what to pack?";
        } else if (lowerInput.includes("earthquake")) {
          botResponse =
            "Earthquake vibes? Drop, cover, and hold on like a pro. Indoors? Stay there. Outdoors? Keep clear of sketchy buildings. Need prep tips for aftershocks?";
        } else if (
          lowerInput.includes("help") ||
          lowerInput.includes("emergency")
        ) {
          botResponse =
            "If this is real-time danger, stop typing and call 911, bro. If it’s info you want, I’m here—just say what’s up.";
        } else {
          botResponse =
            "Hmm, I don’t have the deets on that yet. Wanna try rewording it, or should I connect you with someone who does?";
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling Google Gemini API:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Something glitched on my side. Hit send again or give it a sec. I'm still locked in.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove as any);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove as any);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-[9999] w-96 h-[500px] shadow-xl"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <Card className="flex flex-col h-full border border-white/10 bg-black/90 backdrop-blur-lg overflow-hidden">
        <div
          className="p-3 bg-gradient-to-r from-purple-900 to-blue-900 flex justify-between items-center cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-400 animate-pulse" />
            <h3 className="font-semibold text-white">Emergency Help Bot</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-white"
                )}
              >
                <p>{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg p-3 flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking hard...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-white/10">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's the situation? Spill it."
              className="bg-gray-900 border-gray-700"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
