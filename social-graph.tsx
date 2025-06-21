"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, MessageCircle, Heart, Share2, Filter, MoreHorizontal } from "lucide-react"

// Sample data for social graph
const users = [
  {
    id: 1,
    name: "Alice Johnson",
    username: "@alice",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 1234,
    following: 567,
    posts: 89,
    connections: [2, 3, 5],
  },
  {
    id: 2,
    name: "Bob Smith",
    username: "@bob",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 2341,
    following: 432,
    posts: 156,
    connections: [1, 3, 4, 6],
  },
  {
    id: 3,
    name: "Carol Davis",
    username: "@carol",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 3456,
    following: 234,
    posts: 234,
    connections: [1, 2, 4, 5],
  },
  {
    id: 4,
    name: "David Wilson",
    username: "@david",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 567,
    following: 789,
    posts: 67,
    connections: [2, 3, 6],
  },
  {
    id: 5,
    name: "Eva Brown",
    username: "@eva",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 4567,
    following: 123,
    posts: 345,
    connections: [1, 3, 6],
  },
  {
    id: 6,
    name: "Frank Miller",
    username: "@frank",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 890,
    following: 456,
    posts: 123,
    connections: [2, 4, 5],
  },
]

const posts = [
  {
    id: 1,
    userId: 1,
    content: "Just launched my new project! 🚀",
    likes: 45,
    comments: 12,
    shares: 8,
    timestamp: "2h ago",
  },
  { id: 2, userId: 2, content: "Beautiful sunset today 🌅", likes: 123, comments: 23, shares: 15, timestamp: "4h ago" },
  {
    id: 3,
    userId: 3,
    content: "Working on something exciting...",
    likes: 67,
    comments: 8,
    shares: 4,
    timestamp: "6h ago",
  },
  { id: 4, userId: 5, content: "Coffee and code ☕️💻", likes: 89, comments: 15, shares: 6, timestamp: "8h ago" },
]

export default function SocialGraph() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("graph")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Draw social graph on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate positions for nodes
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.3

    const nodePositions = users.map((user, index) => {
      const angle = (index / users.length) * 2 * Math.PI
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        user,
      }
    })

    // Draw connections
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 2
    users.forEach((user) => {
      const userPos = nodePositions.find((pos) => pos.user.id === user.id)
      if (!userPos) return

      user.connections.forEach((connectionId) => {
        const connectionPos = nodePositions.find((pos) => pos.user.id === connectionId)
        if (!connectionPos) return

        ctx.beginPath()
        ctx.moveTo(userPos.x, userPos.y)
        ctx.lineTo(connectionPos.x, connectionPos.y)
        ctx.stroke()
      })
    })

    // Draw nodes
    nodePositions.forEach(({ x, y, user }) => {
      // Node circle
      ctx.fillStyle = selectedUser === user.id ? "#3b82f6" : "#f1f5f9"
      ctx.strokeStyle = selectedUser === user.id ? "#1d4ed8" : "#cbd5e1"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(x, y, 25, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // User initials
      ctx.fillStyle = selectedUser === user.id ? "#ffffff" : "#475569"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
      ctx.fillText(initials, x, y)
    })

    // Add click handler
    const handleCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const clickY = event.clientY - rect.top

      nodePositions.forEach(({ x, y, user }) => {
        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2)
        if (distance <= 25) {
          setSelectedUser(user.id)
        }
      })
    }

    canvas.addEventListener("click", handleCanvasClick)
    return () => canvas.removeEventListener("click", handleCanvasClick)
  }, [selectedUser])

  const selectedUserData = selectedUser ? users.find((u) => u.id === selectedUser) : null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Graph</h1>
          <p className="text-gray-600">Explore connections and interactions in your social network</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="graph">Network Graph</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="feed">Activity Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="graph" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Graph Visualization */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Network Visualization</CardTitle>
                    <CardDescription>Click on nodes to explore connections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <canvas ref={canvasRef} className="w-full h-96 border rounded-lg cursor-pointer" />
                  </CardContent>
                </Card>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                {selectedUserData ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedUserData.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {selectedUserData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{selectedUserData.name}</CardTitle>
                          <CardDescription>{selectedUserData.username}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="font-semibold text-lg">{selectedUserData.followers.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Followers</div>
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{selectedUserData.following.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Following</div>
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{selectedUserData.posts}</div>
                          <div className="text-sm text-gray-600">Posts</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Connections</h4>
                        <div className="space-y-2">
                          {selectedUserData.connections.map((connectionId) => {
                            const connection = users.find((u) => u.id === connectionId)
                            return connection ? (
                              <div key={connection.id} className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={connection.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {connection.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{connection.name}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Select a user from the graph to view details</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Network Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Network Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Users</span>
                      <span className="font-medium">{users.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Connections</span>
                      <span className="font-medium">
                        {users.reduce((acc, user) => acc + user.connections.length, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Connections</span>
                      <span className="font-medium">
                        {(users.reduce((acc, user) => acc + user.connections.length, 0) / users.length).toFixed(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.username}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                      <div>
                        <div className="font-medium">{user.followers.toLocaleString()}</div>
                        <div className="text-gray-600">Followers</div>
                      </div>
                      <div>
                        <div className="font-medium">{user.following.toLocaleString()}</div>
                        <div className="text-gray-600">Following</div>
                      </div>
                      <div>
                        <div className="font-medium">{user.posts}</div>
                        <div className="text-gray-600">Posts</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Follow
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feed" className="space-y-6">
            <div className="max-w-2xl mx-auto space-y-4">
              {posts.map((post) => {
                const author = users.find((u) => u.id === post.userId)
                return author ? (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{author.name}</h4>
                            <span className="text-sm text-gray-600">{author.username}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-400">{post.timestamp}</span>
                          </div>
                          <p className="mb-3">{post.content}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <button className="flex items-center gap-1 hover:text-red-500">
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-500">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments}
                            </button>
                            <button className="flex items-center gap-1 hover:text-green-500">
                              <Share2 className="h-4 w-4" />
                              {post.shares}
                            </button>
                            <button className="ml-auto">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
