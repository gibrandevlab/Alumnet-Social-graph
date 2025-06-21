"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Video, ChefHat, Users, MessageCircle, Camera } from "lucide-react"

// Data untuk social graph yang lebih realistis
const centralUser = {
  id: "main",
  name: "Sarah Johnson",
  avatar: "/placeholder.svg?height=80&width=80",
  x: 400,
  y: 300,
}

const connections = [
  {
    id: "friend1",
    type: "user",
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=60&width=60",
    relationship: "friend",
    x: 300,
    y: 150,
    icon: Users,
    color: "#3b82f6",
  },
  {
    id: "friend2",
    type: "user",
    name: "Maria Garcia",
    avatar: "/placeholder.svg?height=60&width=60",
    relationship: "friend",
    x: 300,
    y: 450,
    icon: Users,
    color: "#3b82f6",
  },
  {
    id: "spotify",
    type: "app",
    name: "Spotify",
    avatar: "/placeholder.svg?height=60&width=60",
    relationship: "listen",
    x: 150,
    y: 250,
    icon: Music,
    color: "#1db954",
    bgColor: "#1db954",
  },
  {
    id: "netflix",
    type: "app",
    name: "Netflix",
    avatar: "/placeholder.svg?height=60&width=60",
    relationship: "watch",
    x: 550,
    y: 400,
    icon: Video,
    color: "#e50914",
    bgColor: "#e50914",
  },
  {
    id: "cooking",
    type: "activity",
    name: "Cooking",
    avatar: "/placeholder.svg?height=60&width=60",
    relationship: "cook",
    x: 600,
    y: 200,
    icon: ChefHat,
    color: "#10b981",
    bgColor: "#10b981",
  },
  {
    id: "photography",
    type: "activity",
    name: "Photography",
    avatar: "/placeholder.svg?height=60&width=60",
    relationship: "like",
    x: 500,
    y: 100,
    icon: Camera,
    color: "#8b5cf6",
    bgColor: "#8b5cf6",
  },
  {
    id: "friend3",
    type: "user",
    name: "David Kim",
    avatar: "/placeholder.svg?height=60&width=60",
    relationship: "friend",
    x: 200,
    y: 380,
    icon: Users,
    color: "#3b82f6",
  },
]

// Generate network background points
const generateNetworkPoints = (width: number, height: number) => {
  const points = []
  const spacing = 60
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      points.push({
        x: x + Math.random() * 20 - 10,
        y: y + Math.random() * 20 - 10,
      })
    }
  }
  return points
}

export default function AdvancedSocialGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Generate and draw network background
    const networkPoints = generateNetworkPoints(canvas.width, canvas.height)

    // Draw network connections
    ctx.strokeStyle = "#e0d4f7"
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.3

    networkPoints.forEach((point, i) => {
      networkPoints.slice(i + 1).forEach((otherPoint) => {
        const distance = Math.sqrt((point.x - otherPoint.x) ** 2 + (point.y - otherPoint.y) ** 2)
        if (distance < 100) {
          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
          ctx.lineTo(otherPoint.x, otherPoint.y)
          ctx.stroke()
        }
      })
    })

    // Draw network points
    ctx.globalAlpha = 0.6
    ctx.fillStyle = "#c4b5fd"
    networkPoints.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
      ctx.fill()
    })

    ctx.globalAlpha = 1

    // Draw connections to central user
    connections.forEach((connection) => {
      ctx.strokeStyle = connection.color
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centralUser.x, centralUser.y)
      ctx.lineTo(connection.x, connection.y)
      ctx.stroke()

      // Draw relationship label
      const midX = (centralUser.x + connection.x) / 2
      const midY = (centralUser.y + connection.y) / 2

      // Label background
      ctx.fillStyle = connection.color
      ctx.font = "12px sans-serif"
      const textWidth = ctx.measureText(connection.relationship).width
      const padding = 8

      ctx.beginPath()
      ctx.roundRect(midX - textWidth / 2 - padding, midY - 8, textWidth + padding * 2, 16, 8)
      ctx.fill()

      // Label text
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(connection.relationship, midX, midY)
    })

    // Draw connection nodes
    connections.forEach((connection) => {
      const isHovered = hoveredNode === connection.id
      const isSelected = selectedNode === connection.id
      const nodeSize = isHovered || isSelected ? 35 : 30

      // Node background
      if (connection.type === "app" || connection.type === "activity") {
        ctx.fillStyle = connection.bgColor || connection.color
      } else {
        ctx.fillStyle = "#ffffff"
      }

      ctx.strokeStyle = connection.color
      ctx.lineWidth = isSelected ? 4 : 2
      ctx.beginPath()
      ctx.arc(connection.x, connection.y, nodeSize, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Node icon/initial
      ctx.fillStyle = connection.type === "user" ? connection.color : "white"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      if (connection.type === "user") {
        const initials = connection.name
          .split(" ")
          .map((n) => n[0])
          .join("")
        ctx.fillText(initials, connection.x, connection.y)
      } else {
        // For apps/activities, we'll draw a simple icon representation
        ctx.fillText(connection.name[0], connection.x, connection.y)
      }
    })

    // Draw central user node
    const centralSize = selectedNode === "main" ? 50 : 45
    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(centralUser.x, centralUser.y, centralSize, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Central user initials
    ctx.fillStyle = "#3b82f6"
    ctx.font = "bold 18px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const centralInitials = centralUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
    ctx.fillText(centralInitials, centralUser.x, centralUser.y)

    // Add click handler
    const handleCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const clickY = event.clientY - rect.top

      // Check central user
      const centralDistance = Math.sqrt((clickX - centralUser.x) ** 2 + (clickY - centralUser.y) ** 2)
      if (centralDistance <= 45) {
        setSelectedNode("main")
        return
      }

      // Check connections
      connections.forEach((connection) => {
        const distance = Math.sqrt((clickX - connection.x) ** 2 + (clickY - connection.y) ** 2)
        if (distance <= 30) {
          setSelectedNode(connection.id)
        }
      })
    }

    const handleCanvasMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      let hovering = null

      // Check central user
      const centralDistance = Math.sqrt((mouseX - centralUser.x) ** 2 + (mouseY - centralUser.y) ** 2)
      if (centralDistance <= 45) {
        hovering = "main"
      }

      // Check connections
      connections.forEach((connection) => {
        const distance = Math.sqrt((mouseX - connection.x) ** 2 + (mouseY - connection.y) ** 2)
        if (distance <= 30) {
          hovering = connection.id
        }
      })

      setHoveredNode(hovering)
      canvas.style.cursor = hovering ? "pointer" : "default"
    }

    canvas.addEventListener("click", handleCanvasClick)
    canvas.addEventListener("mousemove", handleCanvasMouseMove)

    return () => {
      canvas.removeEventListener("click", handleCanvasClick)
      canvas.removeEventListener("mousemove", handleCanvasMouseMove)
    }
  }, [selectedNode, hoveredNode])

  const selectedConnection = connections.find((c) => c.id === selectedNode)
  const selectedData = selectedNode === "main" ? centralUser : selectedConnection

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Social Graph</h1>
          <p className="text-lg text-gray-600">Memahami Koneksi dan Relasi dalam Jaringan Sosial</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Graph */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <canvas ref={canvasRef} className="w-full h-[600px] bg-gradient-to-br from-purple-50 to-pink-50" />

                  {/* Legend */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <h3 className="font-semibold text-sm mb-2">Jenis Koneksi</h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Teman</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Aktivitas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Platform</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Selected Node Info */}
            {selectedData ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedData.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedData.name}</CardTitle>
                      {selectedConnection && (
                        <Badge variant="secondary" className="mt-1">
                          {selectedConnection.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedNode === "main" ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Pengguna utama dalam jaringan sosial ini</p>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="font-semibold text-blue-600">
                            {connections.filter((c) => c.type === "user").length}
                          </div>
                          <div className="text-xs text-blue-600">Teman</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <div className="font-semibold text-green-600">
                            {connections.filter((c) => c.type === "activity").length}
                          </div>
                          <div className="text-xs text-green-600">Aktivitas</div>
                        </div>
                      </div>
                    </div>
                  ) : selectedConnection ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge style={{ backgroundColor: selectedConnection.color }} className="text-white">
                          {selectedConnection.relationship}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedConnection.type === "user"
                          ? "Terhubung sebagai teman dalam jaringan sosial"
                          : selectedConnection.type === "app"
                            ? "Platform yang digunakan untuk berbagi konten"
                            : "Aktivitas yang diminati dan dibagikan"}
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Klik pada node untuk melihat detail</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Network Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistik Jaringan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Koneksi</span>
                  <span className="font-medium">{connections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Teman</span>
                  <span className="font-medium">{connections.filter((c) => c.type === "user").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Platform</span>
                  <span className="font-medium">{connections.filter((c) => c.type === "app").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Aktivitas</span>
                  <span className="font-medium">{connections.filter((c) => c.type === "activity").length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button className="w-full" size="lg">
              <MessageCircle className="h-4 w-4 mr-2" />
              Buka Detail
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
