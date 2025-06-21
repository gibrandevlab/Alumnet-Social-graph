"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Target,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Search,
  Play,
  Pause,
  Settings,
  Maximize,
  Minimize,
  Focus,
  X,
} from "lucide-react"

// Data dummy untuk users (alumni) - diperbanyak untuk testing large network
const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    jurusan: "Teknik Informatika",
    angkatan: "2018",
    pekerjaan: "Software Engineer",
    perusahaan: "Google",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Alex Chen",
    email: "alex@example.com",
    jurusan: "Sistem Informasi",
    angkatan: "2017",
    pekerjaan: "Product Manager",
    perusahaan: "Microsoft",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "maria@example.com",
    jurusan: "Teknik Informatika",
    angkatan: "2018",
    pekerjaan: "UX Designer",
    perusahaan: "Adobe",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david@example.com",
    jurusan: "Teknik Komputer",
    angkatan: "2019",
    pekerjaan: "Data Scientist",
    perusahaan: "Netflix",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa@example.com",
    jurusan: "Sistem Informasi",
    angkatan: "2017",
    pekerjaan: "Tech Lead",
    perusahaan: "Spotify",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 6,
    name: "John Smith",
    email: "john@example.com",
    jurusan: "Teknik Informatika",
    angkatan: "2016",
    pekerjaan: "Senior Developer",
    perusahaan: "Amazon",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 7,
    name: "Emma Brown",
    email: "emma@example.com",
    jurusan: "Teknik Komputer",
    angkatan: "2019",
    pekerjaan: "DevOps Engineer",
    perusahaan: "Tesla",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 8,
    name: "Michael Davis",
    email: "michael@example.com",
    jurusan: "Sistem Informasi",
    angkatan: "2018",
    pekerjaan: "Cybersecurity Analyst",
    perusahaan: "IBM",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  // Tambahan alumni untuk testing large network
  {
    id: 9,
    name: "Jennifer Wilson",
    email: "jennifer@example.com",
    jurusan: "Teknik Informatika",
    angkatan: "2019",
    pekerjaan: "Frontend Developer",
    perusahaan: "Facebook",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 10,
    name: "Robert Taylor",
    email: "robert@example.com",
    jurusan: "Sistem Informasi",
    angkatan: "2016",
    pekerjaan: "System Architect",
    perusahaan: "Oracle",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 11,
    name: "Amanda Lee",
    email: "amanda@example.com",
    jurusan: "Teknik Komputer",
    angkatan: "2020",
    pekerjaan: "Mobile Developer",
    perusahaan: "Uber",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 12,
    name: "Kevin Zhang",
    email: "kevin@example.com",
    jurusan: "Teknik Informatika",
    angkatan: "2017",
    pekerjaan: "AI Engineer",
    perusahaan: "OpenAI",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 13,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    jurusan: "Teknik Informatika",
    angkatan: "2019",
    pekerjaan: "Backend Developer",
    perusahaan: "Stripe",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 14,
    name: "Sara Martinez",
    email: "sara@example.com",
    jurusan: "Sistem Informasi",
    angkatan: "2020",
    pekerjaan: "Data Analyst",
    perusahaan: "Airbnb",
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

// Data relasi yang lebih kompleks
const relasiAlumni = [
  // Sarah's connections
  { id: 1, alumni_utama_id: 1, alumni_teman_id: 2, tipe_hubungan: "teman", deskripsi: "Teman sekelas" },
  { id: 2, alumni_utama_id: 1, alumni_teman_id: 3, tipe_hubungan: "teman", deskripsi: "Teman satu jurusan" },
  { id: 3, alumni_utama_id: 1, alumni_teman_id: 4, tipe_hubungan: "kolega", deskripsi: "Rekan kerja project" },
  { id: 4, alumni_utama_id: 1, alumni_teman_id: 6, tipe_hubungan: "mentor", deskripsi: "Senior yang membimbing" },
  { id: 5, alumni_utama_id: 1, alumni_teman_id: 9, tipe_hubungan: "teman", deskripsi: "Teman organisasi" },

  // Alex's connections
  { id: 6, alumni_utama_id: 2, alumni_teman_id: 1, tipe_hubungan: "teman", deskripsi: "Teman sekelas" },
  { id: 7, alumni_utama_id: 2, alumni_teman_id: 5, tipe_hubungan: "kolega", deskripsi: "Partner bisnis" },
  { id: 8, alumni_utama_id: 2, alumni_teman_id: 7, tipe_hubungan: "teman", deskripsi: "Teman organisasi" },
  { id: 9, alumni_utama_id: 2, alumni_teman_id: 10, tipe_hubungan: "mentor", deskripsi: "Mentor karir" },

  // Maria's connections
  { id: 10, alumni_utama_id: 3, alumni_teman_id: 1, tipe_hubungan: "teman", deskripsi: "Teman satu jurusan" },
  { id: 11, alumni_utama_id: 3, alumni_teman_id: 4, tipe_hubungan: "teman", deskripsi: "Teman dekat" },
  { id: 12, alumni_utama_id: 3, alumni_teman_id: 8, tipe_hubungan: "kolega", deskripsi: "Kolaborasi project" },
  { id: 13, alumni_utama_id: 3, alumni_teman_id: 9, tipe_hubungan: "teman", deskripsi: "Teman satu angkatan" },
  { id: 14, alumni_utama_id: 3, alumni_teman_id: 12, tipe_hubungan: "kolega", deskripsi: "Kolaborasi AI project" },

  // David's connections
  { id: 15, alumni_utama_id: 4, alumni_teman_id: 1, tipe_hubungan: "kolega", deskripsi: "Rekan kerja project" },
  { id: 16, alumni_utama_id: 4, alumni_teman_id: 3, tipe_hubungan: "teman", deskripsi: "Teman dekat" },
  { id: 17, alumni_utama_id: 4, alumni_teman_id: 7, tipe_hubungan: "teman", deskripsi: "Teman satu angkatan" },
  { id: 18, alumni_utama_id: 4, alumni_teman_id: 11, tipe_hubungan: "mentor", deskripsi: "Membimbing junior" },

  // Lisa's connections
  { id: 19, alumni_utama_id: 5, alumni_teman_id: 2, tipe_hubungan: "kolega", deskripsi: "Partner bisnis" },
  { id: 20, alumni_utama_id: 5, alumni_teman_id: 6, tipe_hubungan: "mentor", deskripsi: "Mentor karir" },
  { id: 21, alumni_utama_id: 5, alumni_teman_id: 12, tipe_hubungan: "kolega", deskripsi: "Tech collaboration" },

  // John's connections
  { id: 22, alumni_utama_id: 6, alumni_teman_id: 1, tipe_hubungan: "lainnya", deskripsi: "Membimbing junior" },
  { id: 23, alumni_utama_id: 6, alumni_teman_id: 5, tipe_hubungan: "lainnya", deskripsi: "Membimbing junior" },
  { id: 24, alumni_utama_id: 6, alumni_teman_id: 10, tipe_hubungan: "teman", deskripsi: "Teman satu angkatan" },

  // Emma's connections
  { id: 25, alumni_utama_id: 7, alumni_teman_id: 2, tipe_hubungan: "teman", deskripsi: "Teman organisasi" },
  { id: 26, alumni_utama_id: 7, alumni_teman_id: 4, tipe_hubungan: "teman", deskripsi: "Teman satu angkatan" },
  { id: 27, alumni_utama_id: 7, alumni_teman_id: 11, tipe_hubungan: "teman", deskripsi: "Teman satu angkatan" },

  // Michael's connections
  { id: 28, alumni_utama_id: 8, alumni_teman_id: 3, tipe_hubungan: "kolega", deskripsi: "Kolaborasi project" },
  { id: 29, alumni_utama_id: 8, alumni_teman_id: 10, tipe_hubungan: "kolega", deskripsi: "Security collaboration" },

  // Jennifer's connections
  { id: 30, alumni_utama_id: 9, alumni_teman_id: 1, tipe_hubungan: "teman", deskripsi: "Teman organisasi" },
  { id: 31, alumni_utama_id: 9, alumni_teman_id: 3, tipe_hubungan: "teman", deskripsi: "Teman satu angkatan" },
  { id: 32, alumni_utama_id: 9, alumni_teman_id: 11, tipe_hubungan: "teman", deskripsi: "Teman dekat" },
  { id: 33, alumni_utama_id: 9, alumni_teman_id: 12, tipe_hubungan: "kolega", deskripsi: "Frontend-AI collaboration" },

  // Robert's connections
  { id: 34, alumni_utama_id: 10, alumni_teman_id: 2, tipe_hubungan: "lainnya", deskripsi: "Membimbing junior" },
  { id: 35, alumni_utama_id: 10, alumni_teman_id: 6, tipe_hubungan: "teman", deskripsi: "Teman satu angkatan" },
  { id: 36, alumni_utama_id: 10, alumni_teman_id: 8, tipe_hubungan: "kolega", deskripsi: "Security collaboration" },

  // Amanda's connections
  { id: 37, alumni_utama_id: 11, alumni_teman_id: 4, tipe_hubungan: "lainnya", deskripsi: "Dibimbing senior" },
  { id: 38, alumni_utama_id: 11, alumni_teman_id: 7, tipe_hubungan: "teman", deskripsi: "Teman satu angkatan" },
  { id: 39, alumni_utama_id: 11, alumni_teman_id: 9, tipe_hubungan: "teman", deskripsi: "Teman dekat" },

  // Kevin's connections
  { id: 40, alumni_utama_id: 12, alumni_teman_id: 3, tipe_hubungan: "kolega", deskripsi: "AI-UX collaboration" },
  { id: 41, alumni_utama_id: 12, alumni_teman_id: 5, tipe_hubungan: "kolega", deskripsi: "Tech collaboration" },
  { id: 42, alumni_utama_id: 12, alumni_teman_id: 9, tipe_hubungan: "kolega", deskripsi: "AI-Frontend collaboration" },

  // Sarah Williams connections
  { id: 43, alumni_utama_id: 13, alumni_teman_id: 1, tipe_hubungan: "teman", deskripsi: "Teman satu nama" },
  { id: 44, alumni_utama_id: 13, alumni_teman_id: 12, tipe_hubungan: "kolega", deskripsi: "Backend-AI collaboration" },

  // Sara Martinez connections
  { id: 45, alumni_utama_id: 14, alumni_teman_id: 1, tipe_hubungan: "teman", deskripsi: "Teman satu nama" },
  { id: 46, alumni_utama_id: 14, alumni_teman_id: 4, tipe_hubungan: "kolega", deskripsi: "Data collaboration" },
]

// Helper function to get connections for a user
const getUserConnections = (userId: number) => {
  const connections = []

  // Get outgoing connections (alumni_utama_id = userId)
  const outgoing = relasiAlumni.filter((rel) => rel.alumni_utama_id === userId)
  outgoing.forEach((rel) => {
    const targetUser = users.find((u) => u.id === rel.alumni_teman_id)
    if (targetUser) {
      connections.push({
        user: targetUser,
        relation: rel,
        direction: "outgoing",
      })
    }
  })

  // Get incoming connections (alumni_teman_id = userId)
  const incoming = relasiAlumni.filter((rel) => rel.alumni_teman_id === userId)
  incoming.forEach((rel) => {
    const sourceUser = users.find((u) => u.id === rel.alumni_utama_id)
    if (sourceUser) {
      // Check if we already have this connection from outgoing
      const exists = connections.find((conn) => conn.user.id === sourceUser.id)
      if (!exists) {
        connections.push({
          user: sourceUser,
          relation: rel,
          direction: "incoming",
        })
      }
    }
  })

  return connections
}

// Relationship type styling
const relationshipStyles = {
  teman: { color: "#3b82f6", icon: Users, label: "Teman" },
  kolega: { color: "#10b981", icon: Briefcase, label: "Kolega" },
  mentor: { color: "#8b5cf6", icon: GraduationCap, label: "Mentor" },
  lainnya: { color: "#f59e0b", icon: Heart, label: "Lainnya" },
}

// Node class for force-directed layout
class Node {
  id: number
  x: number
  y: number
  vx = 0
  vy = 0
  fx?: number // fixed x position
  fy?: number // fixed y position
  size: number
  isCenter: boolean
  isFocused = false
  user: any
  connections: any[]

  constructor(id: number, x: number, y: number, size: number, isCenter: boolean, user: any) {
    this.id = id
    this.x = x
    this.y = y
    this.size = size
    this.isCenter = isCenter
    this.user = user
    this.connections = getUserConnections(id)
  }
}

// Link class for connections
class Link {
  source: Node
  target: Node
  strength: number
  distance: number
  relation: any
  isFocused = false

  constructor(source: Node, target: Node, relation: any) {
    this.source = source
    this.target = target
    this.relation = relation
    this.strength = 0.3
    this.distance = this.isCenter() ? 150 : 100
  }

  isCenter(): boolean {
    return this.source.isCenter || this.target.isCenter
  }
}

// Force-directed layout simulation
class ForceSimulation {
  nodes: Node[] = []
  links: Link[] = []
  alpha = 1
  alphaMin = 0.001
  alphaDecay = 0.0228
  velocityDecay = 0.4
  width: number
  height: number
  isRunning = false

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  addNode(node: Node) {
    this.nodes.push(node)
  }

  addLink(link: Link) {
    this.links.push(link)
  }

  restart() {
    this.alpha = 1
    this.isRunning = true
  }

  stop() {
    this.isRunning = false
  }

  tick() {
    if (!this.isRunning || this.alpha < this.alphaMin) {
      this.isRunning = false
      return false
    }

    // Apply forces
    this.applyLinkForce()
    this.applyCollisionForce()
    this.applyCenterForce()
    this.applyBoundaryForce()

    // Update positions
    this.nodes.forEach((node) => {
      if (node.fx !== undefined) {
        node.x = node.fx
        node.vx = 0
      } else {
        node.vx *= this.velocityDecay
        node.x += node.vx
      }

      if (node.fy !== undefined) {
        node.y = node.fy
        node.vy = 0
      } else {
        node.vy *= this.velocityDecay
        node.y += node.vy
      }
    })

    this.alpha += (this.alphaMin - this.alpha) * this.alphaDecay
    return true
  }

  applyLinkForce() {
    this.links.forEach((link) => {
      const dx = link.target.x - link.source.x
      const dy = link.target.y - link.source.y
      const distance = Math.sqrt(dx * dx + dy * dy) || 1

      const force = (distance - link.distance) * link.strength * this.alpha
      const fx = (dx / distance) * force
      const fy = (dy / distance) * force

      link.target.vx -= fx
      link.target.vy -= fy
      link.source.vx += fx
      link.source.vy += fy
    })
  }

  applyCollisionForce() {
    const quad = this.buildQuadTree()

    this.nodes.forEach((node) => {
      quad.visit((quad: any, x1: number, y1: number, x2: number, y2: number) => {
        if (quad.point && quad.point !== node) {
          const dx = node.x - quad.point.x
          const dy = node.y - quad.point.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const minDistance = node.size + quad.point.size + 10 // 10px padding

          if (distance < minDistance && distance > 0) {
            const force = (minDistance - distance) * 0.5
            const fx = (dx / distance) * force
            const fy = (dy / distance) * force

            node.vx += fx
            node.vy += fy
            quad.point.vx -= fx
            quad.point.vy -= fy
          }
        }
        return x1 > node.x + 100 || x2 < node.x - 100 || y1 > node.y + 100 || y2 < node.y - 100
      })
    })
  }

  applyCenterForce() {
    const centerX = this.width / 2
    const centerY = this.height / 2
    const strength = 0.01

    this.nodes.forEach((node) => {
      if (!node.isCenter) {
        node.vx += (centerX - node.x) * strength
        node.vy += (centerY - node.y) * strength
      }
    })
  }

  applyBoundaryForce() {
    const margin = 50

    this.nodes.forEach((node) => {
      if (node.x < margin) {
        node.vx += (margin - node.x) * 0.1
      } else if (node.x > this.width - margin) {
        node.vx += (this.width - margin - node.x) * 0.1
      }

      if (node.y < margin) {
        node.vy += (margin - node.y) * 0.1
      } else if (node.y > this.height - margin) {
        node.vy += (this.height - margin - node.y) * 0.1
      }
    })
  }

  buildQuadTree() {
    // Simplified quadtree implementation
    const tree = {
      nodes: this.nodes,
      visit: (callback: any) => {
        this.nodes.forEach((node) => {
          callback({ point: node }, 0, 0, this.width, this.height)
        })
      },
    }
    return tree
  }

  clear() {
    this.nodes = []
    this.links = []
  }
}

// Background particles
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string

  constructor(width: number, height: number) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.size = Math.random() * 3 + 1
    this.opacity = Math.random() * 0.5 + 0.1
    this.color = `hsl(${Math.random() * 60 + 240}, 70%, 70%)`
  }

  update(width: number, height: number) {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > width) this.vx *= -1
    if (this.y < 0 || this.y > height) this.vy *= -1
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()
  }
}

export default function InteractiveSocialGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const simulationRef = useRef<ForceSimulation>()

  // Layout state
  const [centerUserId, setCenterUserId] = useState<number>(1)
  const [selectedUser, setSelectedUser] = useState<number | null>(1)
  const [hoveredUser, setHoveredUser] = useState<number | null>(null)

  // Focus mode state
  const [focusMode, setFocusMode] = useState<boolean>(false)
  const [focusNodes, setFocusNodes] = useState<number[]>([])

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  // Simulation controls
  const [isSimulationRunning, setIsSimulationRunning] = useState(true)
  const [simulationSpeed, setSimulationSpeed] = useState(1)

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("")
  const [filterJurusan, setFilterJurusan] = useState<string>("all")
  const [filterAngkatan, setFilterAngkatan] = useState<string>("all")

  // Canvas interaction state
  const [scale, setScale] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStarted, setDragStarted] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 })
  const [draggedNode, setDraggedNode] = useState<Node | null>(null)

  // Animation state
  const [pulseTime, setPulseTime] = useState(0)

  // Click debounce
  const [lastClickTime, setLastClickTime] = useState(0)

  // Search results - untuk card list
  const searchResults = useMemo(() => {
    if (!searchTerm) return []

    return users
      .filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.jurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.pekerjaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.perusahaan.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesSearch
      })
      .sort((a, b) => {
        // Sort by name similarity
        const aNameMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase())
        const bNameMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase())
        if (aNameMatch && !bNameMatch) return -1
        if (!aNameMatch && bNameMatch) return 1
        return a.name.localeCompare(b.name)
      })
  }, [searchTerm])

  // Visible users - filter berdasarkan dropdown
  const visibleUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesJurusan = filterJurusan === "all" || user.jurusan === filterJurusan
      const matchesAngkatan = filterAngkatan === "all" || user.angkatan === filterAngkatan
      return matchesJurusan && matchesAngkatan
    })
  }, [filterJurusan, filterAngkatan])

  // Get unique values for filters
  const uniqueJurusan = useMemo(() => [...new Set(users.map((u) => u.jurusan))], [])
  const uniqueAngkatan = useMemo(() => [...new Set(users.map((u) => u.angkatan))], [])

  // Canvas dimensions based on fullscreen
  const canvasWidth = isFullscreen ? window.innerWidth : 800
  const canvasHeight = isFullscreen ? window.innerHeight - 80 : 600

  // Initialize simulation
  useEffect(() => {
    simulationRef.current = new ForceSimulation(canvasWidth, canvasHeight)
    setupSimulation()
  }, [canvasWidth, canvasHeight])

  // Setup simulation with current data
  const setupSimulation = useCallback(() => {
    if (!simulationRef.current) return

    const simulation = simulationRef.current
    simulation.clear()

    // Create nodes
    const nodeMap = new Map<number, Node>()

    visibleUsers.forEach((user) => {
      const isCenter = user.id === centerUserId
      const isFocused = focusMode && focusNodes.includes(user.id)
      const size = isCenter ? 30 : isFocused ? 25 : 20

      // Random initial position
      const x = Math.random() * (canvasWidth - 200) + 100
      const y = Math.random() * (canvasHeight - 200) + 100

      const node = new Node(user.id, x, y, size, isCenter, user)
      node.isFocused = isFocused

      // Fix center node position
      if (isCenter) {
        node.fx = canvasWidth / 2
        node.fy = canvasHeight / 2
      }

      // Fix focus nodes positions
      if (focusMode && focusNodes.length === 2 && isFocused) {
        const focusIndex = focusNodes.indexOf(user.id)
        const spacing = 200
        node.fx = canvasWidth / 2 + (focusIndex === 0 ? -spacing / 2 : spacing / 2)
        node.fy = canvasHeight / 2
      }

      nodeMap.set(user.id, node)
      simulation.addNode(node)
    })

    // Create links
    relasiAlumni.forEach((relation) => {
      const sourceNode = nodeMap.get(relation.alumni_utama_id)
      const targetNode = nodeMap.get(relation.alumni_teman_id)

      if (sourceNode && targetNode) {
        const link = new Link(sourceNode, targetNode, relation)

        // Mark focus links
        if (focusMode && focusNodes.length === 2) {
          link.isFocused = focusNodes.includes(sourceNode.id) && focusNodes.includes(targetNode.id)
        }

        simulation.addLink(link)
      }
    })

    simulation.restart()
  }, [visibleUsers, centerUserId, focusMode, focusNodes, canvasWidth, canvasHeight])

  // Update simulation when data changes
  useEffect(() => {
    setupSimulation()
  }, [setupSimulation])

  // Initialize particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: 30 }, () => new Particle(canvasWidth, canvasHeight))
  }, [canvasWidth, canvasHeight])

  // Pulse animation for center nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTime((prev) => prev + 0.1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Transform screen coordinates to canvas coordinates
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number) => {
      return {
        x: (screenX - panX) / scale,
        y: (screenY - panY) / scale,
      }
    },
    [scale, panX, panY],
  )

  // Get node at position
  const getNodeAtPosition = useCallback((canvasX: number, canvasY: number) => {
    if (!simulationRef.current) return null

    let closestNode = null
    let closestDistance = Number.POSITIVE_INFINITY

    simulationRef.current.nodes.forEach((node) => {
      const distance = Math.sqrt((canvasX - node.x) ** 2 + (canvasY - node.y) ** 2)
      const hitRadius = node.size + 8

      if (distance <= hitRadius && distance < closestDistance) {
        closestDistance = distance
        closestNode = node
      }
    })

    return closestNode
  }, [])

  // Zoom functions
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.15, 4))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.15, 0.2))
  }, [])

  // Handle user click
  const handleUserClick = useCallback(
    (userId: number) => {
      const now = Date.now()
      if (now - lastClickTime < 300) return

      setLastClickTime(now)

      if (focusMode) {
        // Focus mode: select two nodes
        if (focusNodes.includes(userId)) {
          // Remove from focus
          setFocusNodes((prev) => prev.filter((id) => id !== userId))
        } else if (focusNodes.length < 2) {
          // Add to focus
          setFocusNodes((prev) => [...prev, userId])
        } else {
          // Replace first node
          setFocusNodes([focusNodes[1], userId])
        }
      } else {
        // Normal mode: set as center
        setCenterUserId(userId)
        setSelectedUser(userId)
      }
    },
    [focusMode, focusNodes, lastClickTime],
  )

  // Toggle focus mode
  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => !prev)
    if (!focusMode) {
      setFocusNodes([])
    }
  }, [focusMode])

  // Toggle simulation
  const toggleSimulation = useCallback(() => {
    if (!simulationRef.current) return

    if (isSimulationRunning) {
      simulationRef.current.stop()
      setIsSimulationRunning(false)
    } else {
      simulationRef.current.restart()
      setIsSimulationRunning(true)
    }
  }, [isSimulationRunning])

  // Reset view
  const resetView = useCallback(() => {
    setScale(1)
    setPanX(0)
    setPanY(0)
  }, [])

  // Center view
  const centerView = useCallback(() => {
    setPanX(0)
    setPanY(0)
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  // Handle search result click
  const handleSearchResultClick = useCallback((userId: number) => {
    setCenterUserId(userId)
    setSelectedUser(userId)
    setSearchTerm("") // Clear search
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return

      switch (event.key) {
        case "+":
        case "=":
          event.preventDefault()
          zoomIn()
          break
        case "-":
          event.preventDefault()
          zoomOut()
          break
        case "0":
          event.preventDefault()
          resetView()
          break
        case "c":
          event.preventDefault()
          centerView()
          break
        case "f":
          event.preventDefault()
          toggleFocusMode()
          break
        case " ":
          event.preventDefault()
          toggleSimulation()
          break
        case "Escape":
          if (isFullscreen) {
            toggleFullscreen()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [zoomIn, zoomOut, resetView, centerView, toggleFocusMode, toggleSimulation, isFullscreen, toggleFullscreen])

  // Background animation
  useEffect(() => {
    const backgroundCanvas = backgroundCanvasRef.current
    if (!backgroundCanvas) return

    const ctx = backgroundCanvas.getContext("2d")
    if (!ctx) return

    backgroundCanvas.width = canvasWidth
    backgroundCanvas.height = canvasHeight

    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Gradient background
      const gradient = ctx.createRadialGradient(
        canvasWidth / 2,
        canvasHeight / 2,
        0,
        canvasWidth / 2,
        canvasHeight / 2,
        canvasWidth / 2,
      )
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.1)")
      gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.05)")
      gradient.addColorStop(1, "rgba(16, 185, 129, 0.02)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.update(canvasWidth, canvasHeight)
        particle.draw(ctx)
      })

      // Draw connecting lines between particles
      ctx.strokeStyle = "rgba(139, 92, 246, 0.1)"
      ctx.lineWidth = 1
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const distance = Math.sqrt((particle.x - otherParticle.x) ** 2 + (particle.y - otherParticle.y) ** 2)
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [canvasWidth, canvasHeight])

  // Main canvas rendering and simulation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !simulationRef.current) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    let animationId: number

    const animate = () => {
      // Run simulation step
      if (isSimulationRunning && simulationRef.current) {
        for (let i = 0; i < simulationSpeed; i++) {
          if (!simulationRef.current.tick()) break
        }
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Apply transformations
      ctx.save()
      ctx.translate(panX, panY)
      ctx.scale(scale, scale)

      // Draw links
      if (simulationRef.current) {
        simulationRef.current.links.forEach((link) => {
          const relationStyle = relationshipStyles[link.relation.tipe_hubungan as keyof typeof relationshipStyles]

          // Focus mode styling
          if (focusMode) {
            if (link.isFocused) {
              ctx.strokeStyle = "#dc2626" // Red for focus connection
              ctx.lineWidth = 6 / scale
              ctx.globalAlpha = 1
            } else {
              ctx.strokeStyle = relationStyle.color
              ctx.lineWidth = 1 / scale
              ctx.globalAlpha = 0.2 // Dim other connections
            }
          } else {
            ctx.strokeStyle = relationStyle.color
            ctx.lineWidth = (link.isCenter() ? 4 : 2) / scale
            ctx.globalAlpha = 0.6
          }

          ctx.beginPath()
          ctx.moveTo(link.source.x, link.source.y)
          ctx.lineTo(link.target.x, link.target.y)
          ctx.stroke()
        })
      }

      ctx.globalAlpha = 1

      // Draw nodes
      if (simulationRef.current) {
        simulationRef.current.nodes.forEach((node) => {
          const isHovered = hoveredUser === node.id
          const isSelected = selectedUser === node.id
          const isCenter = node.isCenter
          const isFocused = node.isFocused
          const isSearchResult = searchTerm ? searchResults.some((result) => result.id === node.id) : false
          const nodeSize = node.size / scale

          // Focus mode dimming
          const shouldDim = focusMode && !isFocused && !isCenter
          const alpha = shouldDim ? 0.3 : 1

          ctx.globalAlpha = alpha

          // Special glow for focus nodes
          if (isFocused && focusMode) {
            const focusGlowSize = nodeSize * 1.8
            const focusGradient = ctx.createRadialGradient(node.x, node.y, nodeSize, node.x, node.y, focusGlowSize)
            focusGradient.addColorStop(0, "rgba(220, 38, 38, 0.4)")
            focusGradient.addColorStop(0.7, "rgba(220, 38, 38, 0.2)")
            focusGradient.addColorStop(1, "rgba(220, 38, 38, 0)")

            ctx.fillStyle = focusGradient
            ctx.beginPath()
            ctx.arc(node.x, node.y, focusGlowSize, 0, 2 * Math.PI)
            ctx.fill()
          }

          // Special glow for search results
          if (isSearchResult && !isCenter && !isFocused) {
            const searchGlowSize = nodeSize * 1.8
            const searchGradient = ctx.createRadialGradient(node.x, node.y, nodeSize, node.x, node.y, searchGlowSize)
            searchGradient.addColorStop(0, "rgba(34, 197, 94, 0.4)")
            searchGradient.addColorStop(0.7, "rgba(34, 197, 94, 0.2)")
            searchGradient.addColorStop(1, "rgba(34, 197, 94, 0)")

            ctx.fillStyle = searchGradient
            ctx.beginPath()
            ctx.arc(node.x, node.y, searchGlowSize, 0, 2 * Math.PI)
            ctx.fill()
          }

          // Glow effect for center nodes
          if (isCenter) {
            const pulseScale = 1 + Math.sin(pulseTime) * 0.1
            const glowSize = nodeSize * pulseScale * 1.5

            const gradient = ctx.createRadialGradient(node.x, node.y, nodeSize, node.x, node.y, glowSize)
            gradient.addColorStop(0, "rgba(29, 78, 216, 0.3)")
            gradient.addColorStop(0.7, "rgba(29, 78, 216, 0.1)")
            gradient.addColorStop(1, "rgba(29, 78, 216, 0)")

            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(node.x, node.y, glowSize, 0, 2 * Math.PI)
            ctx.fill()

            ctx.shadowColor = "#1d4ed8"
            ctx.shadowBlur = 20 / scale
          }

          // Node background
          if (isCenter) {
            const nodeGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize)
            nodeGradient.addColorStop(0, "#ffffff")
            nodeGradient.addColorStop(0.7, "#f0f9ff")
            nodeGradient.addColorStop(1, "#dbeafe")
            ctx.fillStyle = nodeGradient
          } else if (isFocused) {
            // Red background for focus nodes
            const focusBgGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize)
            focusBgGradient.addColorStop(0, "#ffffff")
            focusBgGradient.addColorStop(0.7, "#fef2f2")
            focusBgGradient.addColorStop(1, "#fecaca")
            ctx.fillStyle = focusBgGradient
          } else if (isSearchResult) {
            // Green background for search results
            const searchBgGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize)
            searchBgGradient.addColorStop(0, "#ffffff")
            searchBgGradient.addColorStop(0.7, "#f0fdf4")
            searchBgGradient.addColorStop(1, "#dcfce7")
            ctx.fillStyle = searchBgGradient
          } else {
            ctx.fillStyle = "#ffffff"
          }

          // Node border
          if (isCenter) {
            ctx.strokeStyle = "#1d4ed8"
            ctx.lineWidth = 6 / scale
          } else if (isFocused) {
            ctx.strokeStyle = "#dc2626" // Red border for focus nodes
            ctx.lineWidth = 4 / scale
          } else if (isSearchResult) {
            ctx.strokeStyle = "#22c55e" // Green border for search results
            ctx.lineWidth = 4 / scale
          } else {
            ctx.strokeStyle = "#6b7280"
            ctx.lineWidth = (isSelected ? 4 : 3) / scale
          }

          // Hover effect
          if (isHovered && !isCenter && !isFocused) {
            ctx.shadowColor = ctx.strokeStyle
            ctx.shadowBlur = 15 / scale
            ctx.lineWidth = 5 / scale
          }

          ctx.beginPath()
          ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI)
          ctx.fill()
          ctx.stroke()

          // Reset shadow
          ctx.shadowBlur = 0

          // User initials
          ctx.fillStyle = isCenter ? "#1d4ed8" : isFocused ? "#dc2626" : isSearchResult ? "#22c55e" : ctx.strokeStyle
          ctx.font = `bold ${(isCenter ? 14 : isFocused ? 12 : isSearchResult ? 12 : 10) / scale}px sans-serif`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"

          const initials = node.user.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
          ctx.fillText(initials, node.x, node.y)

          // User name - always show for center, focus, search results, or hovered
          if (isCenter || isFocused || isSearchResult || isHovered) {
            ctx.fillStyle = isCenter ? "#1f2937" : isFocused ? "#7f1d1d" : isSearchResult ? "#166534" : "#374151"
            ctx.font = `bold ${(isCenter ? 12 : isFocused ? 10 : isSearchResult ? 10 : 8) / scale}px sans-serif`

            let displayName = node.user.name
            if (displayName.length > 15 && !isCenter && !isFocused && !isSearchResult) {
              displayName = displayName.substring(0, 12) + "..."
            }

            ctx.fillText(
              displayName,
              node.x,
              node.y + (nodeSize + (isCenter ? 20 : isFocused ? 18 : isSearchResult ? 18 : 15)) / scale,
            )

            // Additional info for center nodes, focus nodes, search results, or hovered nodes
            if (isCenter || isFocused || isSearchResult || isHovered) {
              ctx.font = `${(isCenter ? 10 : 8) / scale}px sans-serif`
              ctx.fillStyle = "#6b7280"
              ctx.fillText(
                `${node.user.jurusan} '${node.user.angkatan}`,
                node.x,
                node.y + (nodeSize + (isCenter ? 35 : isFocused ? 30 : isSearchResult ? 30 : 25)) / scale,
              )
              if (isCenter || isFocused || isSearchResult) {
                ctx.fillText(`${node.user.pekerjaan}`, node.x, node.y + (nodeSize + (isCenter ? 50 : 42)) / scale)
                if (isCenter) {
                  ctx.fillText(`${node.user.perusahaan}`, node.x, node.y + (nodeSize + 65) / scale)
                }
              }
            }
          }

          ctx.globalAlpha = 1
        })
      }

      ctx.restore()

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Mouse event handlers
    const handleMouseDown = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      const canvasPos = screenToCanvas(mouseX, mouseY)

      setMouseDownPos({ x: mouseX, y: mouseY })
      setDragStarted(false)

      const clickedNode = getNodeAtPosition(canvasPos.x, canvasPos.y)

      if (clickedNode) {
        setDraggedNode(clickedNode)
        setIsDragging(false)
        canvas.style.cursor = "grabbing"
      } else {
        setIsDragging(true)
        setLastMousePos({ x: mouseX, y: mouseY })
        canvas.style.cursor = "grabbing"
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      const canvasPos = screenToCanvas(mouseX, mouseY)

      if (draggedNode) {
        // Drag node
        const dragDistance = Math.sqrt((mouseX - mouseDownPos.x) ** 2 + (mouseY - mouseDownPos.y) ** 2)
        if (dragDistance > 5) {
          setDragStarted(true)
          draggedNode.fx = canvasPos.x
          draggedNode.fy = canvasPos.y
          if (simulationRef.current) {
            simulationRef.current.alpha = 0.3 // Reheat simulation
          }
        }
      } else if (isDragging) {
        // Pan canvas
        const dragDistance = Math.sqrt((mouseX - mouseDownPos.x) ** 2 + (mouseY - mouseDownPos.y) ** 2)
        if (dragDistance > 5) {
          setDragStarted(true)
        }

        const deltaX = mouseX - lastMousePos.x
        const deltaY = mouseY - lastMousePos.y
        setPanX((prev) => prev + deltaX)
        setPanY((prev) => prev + deltaY)
        setLastMousePos({ x: mouseX, y: mouseY })
      } else {
        // Check hover
        const hovering = getNodeAtPosition(canvasPos.x, canvasPos.y)
        setHoveredUser(hovering?.id || null)
        canvas.style.cursor = hovering ? "pointer" : "grab"
      }
    }

    const handleMouseUp = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      const canvasPos = screenToCanvas(mouseX, mouseY)

      if (draggedNode) {
        if (!dragStarted) {
          // Click without drag
          handleUserClick(draggedNode.id)
        } else {
          // Release dragged node
          draggedNode.fx = undefined
          draggedNode.fy = undefined
        }
        setDraggedNode(null)
      } else if (isDragging) {
        setIsDragging(false)
      }

      setDragStarted(false)
      canvas.style.cursor = "grab"
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      const scaleFactor = event.deltaY > 0 ? 0.95 : 1.05
      const newScale = Math.max(0.2, Math.min(4, scale * scaleFactor))

      const scaleChange = newScale / scale
      setPanX((prev) => mouseX - (mouseX - prev) * scaleChange)
      setPanY((prev) => mouseY - (mouseY - prev) * scaleChange)
      setScale(newScale)
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [
    canvasWidth,
    canvasHeight,
    scale,
    panX,
    panY,
    isDragging,
    dragStarted,
    lastMousePos,
    mouseDownPos,
    draggedNode,
    hoveredUser,
    selectedUser,
    pulseTime,
    isSimulationRunning,
    simulationSpeed,
    handleUserClick,
    screenToCanvas,
    getNodeAtPosition,
    searchTerm,
    searchResults,
    focusMode,
    focusNodes,
  ])

  const centerUserData = users.find((u) => u.id === centerUserId)
  const centerConnections = useMemo(() => {
    return getUserConnections(centerUserId)
  }, [centerUserId])

  const focusUserData = useMemo(() => {
    return focusNodes.map((id) => users.find((u) => u.id === id)).filter(Boolean)
  }, [focusNodes])

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 z-50">
        {/* Fullscreen Header */}
        <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left: Search and Filters */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari alumni..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Select value={filterJurusan} onValueChange={setFilterJurusan}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Semua Jurusan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jurusan</SelectItem>
                  {uniqueJurusan.map((jurusan) => (
                    <SelectItem key={jurusan} value={jurusan}>
                      {jurusan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterAngkatan} onValueChange={setFilterAngkatan}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Semua Angkatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Angkatan</SelectItem>
                  {uniqueAngkatan.map((angkatan) => (
                    <SelectItem key={angkatan} value={angkatan}>
                      Angkatan {angkatan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Center: Mode Indicators */}
            <div className="flex items-center gap-4">
              {focusMode && (
                <Badge variant="destructive" className="flex items-center gap-2">
                  <Focus className="h-4 w-4" />
                  Focus Mode ({focusNodes.length}/2)
                </Badge>
              )}

              <Badge variant="outline" className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSimulationRunning ? "bg-green-500" : "bg-red-500"}`}></div>
                {isSimulationRunning ? "Running" : "Paused"}
              </Badge>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleFocusMode}
                variant={focusMode ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Focus className="h-4 w-4" />
                Focus
              </Button>

              <Button
                onClick={toggleSimulation}
                variant={isSimulationRunning ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                {isSimulationRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isSimulationRunning ? "Pause" : "Resume"}
              </Button>

              <Button onClick={toggleFullscreen} variant="outline" size="sm">
                <Minimize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Fullscreen Canvas */}
        <div className="absolute inset-0 pt-20">
          {/* Background Canvas */}
          <canvas ref={backgroundCanvasRef} className="absolute inset-0 w-full h-full" />

          {/* Main Canvas */}
          <canvas ref={canvasRef} className="relative w-full h-full cursor-grab" />

          {/* Canvas Controls */}
          <div className="absolute top-24 right-4 flex flex-col gap-2">
            <Button size="sm" variant="outline" onClick={zoomIn} className="bg-white/90 backdrop-blur-sm">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={zoomOut} className="bg-white/90 backdrop-blur-sm">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={centerView} className="bg-white/90 backdrop-blur-sm">
              <Target className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={resetView} className="bg-white/90 backdrop-blur-sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Results Overlay */}
          {searchTerm && searchResults.length > 0 && (
            <div className="absolute top-24 left-4 w-80 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Search className="h-4 w-4 text-green-600" />
                  Hasil Pencarian ({searchResults.length})
                </h3>
              </div>
              <div className="p-2 space-y-1">
                {searchResults.slice(0, 10).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-green-50 cursor-pointer border border-transparent hover:border-green-200 transition-colors"
                    onClick={() => handleSearchResultClick(user.id)}
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-green-500">
                      <AvatarFallback className="text-xs bg-green-100 text-green-700">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-green-800 truncate">{user.name}</div>
                      <div className="text-xs text-green-600 truncate">
                        {user.jurusan} '{user.angkatan} • {user.pekerjaan}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{user.perusahaan}</div>
                    </div>
                  </div>
                ))}
                {searchResults.length > 10 && (
                  <div className="text-xs text-gray-500 text-center py-2">
                    +{searchResults.length - 10} alumni lainnya
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Focus Mode Info */}
          {focusMode && focusUserData.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-red-200 p-4">
              <h3 className="font-semibold text-sm text-red-800 mb-3 flex items-center gap-2">
                <Focus className="h-4 w-4" />
                Focus Mode
              </h3>
              <div className="space-y-2">
                {focusUserData.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 ring-2 ring-red-500">
                      <AvatarFallback className="text-xs bg-red-100 text-red-700">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-xs text-red-800">{user.name}</div>
                      <div className="text-xs text-red-600">
                        {user.jurusan} '{user.angkatan}
                      </div>
                    </div>
                  </div>
                ))}
                {focusNodes.length === 2 && (
                  <div className="mt-2 pt-2 border-t border-red-200">
                    <div className="text-xs text-red-600">
                      Menampilkan koneksi antara {focusUserData[0]?.name} dan {focusUserData[1]?.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
            <h3 className="font-semibold text-sm mb-2">Legend</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Center Node</span>
              </div>
              {focusMode && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Focus Node</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Search Result</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span>Regular Node</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <h4 className="font-semibold text-xs mb-1">Hubungan</h4>
              {Object.entries(relationshipStyles).map(([key, style]) => {
                const IconComponent = style.icon
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: style.color }}></div>
                    <IconComponent className="h-3 w-3" style={{ color: style.color }} />
                    <span>{style.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Zoom indicator */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
            Zoom: {Math.round(scale * 100)}%
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dynamic Social Graph Alumni</h1>
          <p className="text-lg text-gray-600">
            Force-directed layout dengan collision detection • Drag nodes • Focus mode • Fullscreen
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari alumni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterJurusan} onValueChange={setFilterJurusan}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Jurusan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jurusan</SelectItem>
              {uniqueJurusan.map((jurusan) => (
                <SelectItem key={jurusan} value={jurusan}>
                  {jurusan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterAngkatan} onValueChange={setFilterAngkatan}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Angkatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Angkatan</SelectItem>
              {uniqueAngkatan.map((angkatan) => (
                <SelectItem key={angkatan} value={angkatan}>
                  Angkatan {angkatan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={toggleFocusMode}
            variant={focusMode ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Focus className="h-4 w-4" />
            Focus Mode
          </Button>

          <Button
            onClick={toggleSimulation}
            variant={isSimulationRunning ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {isSimulationRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isSimulationRunning ? "Pause" : "Resume"}
          </Button>

          <Button onClick={toggleFullscreen} variant="outline" className="flex items-center gap-2">
            <Maximize className="h-4 w-4" />
            Fullscreen
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Graph */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative">
                {/* Background Canvas */}
                <canvas ref={backgroundCanvasRef} className="absolute inset-0 w-full h-[600px]" />

                {/* Main Canvas */}
                <canvas ref={canvasRef} className="relative w-full h-[600px] cursor-grab" />

                {/* Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={zoomIn} className="bg-white/90 backdrop-blur-sm">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={zoomOut} className="bg-white/90 backdrop-blur-sm">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={centerView} className="bg-white/90 backdrop-blur-sm">
                    <Target className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetView} className="bg-white/90 backdrop-blur-sm">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Simulation Status */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${isSimulationRunning ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                    ></div>
                    <span className="text-sm font-medium">
                      {isSimulationRunning ? "Simulation Running" : "Simulation Paused"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Nodes: {simulationRef.current?.nodes.length || 0} • Links:{" "}
                    {simulationRef.current?.links.length || 0}
                  </div>
                  {focusMode && (
                    <div className="text-xs text-red-600 mt-1">Focus Mode: {focusNodes.length}/2 selected</div>
                  )}
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <h3 className="font-semibold text-sm mb-2">Legend</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Center Node</span>
                    </div>
                    {focusMode && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Focus Node</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Search Result</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span>Regular Node</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <h4 className="font-semibold text-xs mb-1">Hubungan</h4>
                    {Object.entries(relationshipStyles).map(([key, style]) => {
                      const IconComponent = style.icon
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: style.color }}></div>
                          <IconComponent className="h-3 w-3" style={{ color: style.color }} />
                          <span>{style.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Zoom indicator */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                  Zoom: {Math.round(scale * 100)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Simulation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Simulation Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant={isSimulationRunning ? "default" : "secondary"}>
                    {isSimulationRunning ? "Running" : "Paused"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Speed: {simulationSpeed}x</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={simulationSpeed}
                    onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <Button onClick={toggleSimulation} className="w-full" size="sm">
                  {isSimulationRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isSimulationRunning ? "Pause" : "Resume"} Simulation
                </Button>
              </CardContent>
            </Card>

            {/* Focus Mode Panel */}
            {focusMode && (
              <Card className="border-2 border-red-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Focus className="h-5 w-5 text-red-600" />
                      Focus Mode
                    </CardTitle>
                    <Button onClick={toggleFocusMode} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-red-600">Klik 2 node untuk melihat koneksi di antara mereka</div>
                    {focusUserData.length > 0 && (
                      <div className="space-y-2">
                        {focusUserData.map((user, index) => (
                          <div key={user.id} className="flex items-center gap-3 p-2 bg-red-50 rounded">
                            <Avatar className="h-8 w-8 ring-2 ring-red-500">
                              <AvatarFallback className="text-xs bg-red-200 text-red-700">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-red-800">{user.name}</div>
                              <div className="text-xs text-red-600">
                                {user.jurusan} '{user.angkatan}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setFocusNodes((prev) => prev.filter((id) => id !== user.id))}
                              className="text-xs"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {focusNodes.length === 2 && (
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <div className="font-bold text-lg text-red-600">
                          {
                            relasiAlumni.filter(
                              (rel) =>
                                (focusNodes.includes(rel.alumni_utama_id) &&
                                  focusNodes.includes(rel.alumni_teman_id)) ||
                                (focusNodes.includes(rel.alumni_teman_id) && focusNodes.includes(rel.alumni_utama_id)),
                            ).length
                          }
                        </div>
                        <div className="text-sm text-red-600">Koneksi Langsung</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Center User Info */}
            {centerUserData && !focusMode && (
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-500">
                      <AvatarImage src={centerUserData.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {centerUserData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{centerUserData.name}</CardTitle>
                      <Badge variant="default" className="bg-blue-600">
                        🎯 CENTER
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p>
                        <strong>Jurusan:</strong> {centerUserData.jurusan}
                      </p>
                      <p>
                        <strong>Angkatan:</strong> {centerUserData.angkatan}
                      </p>
                      <p>
                        <strong>Pekerjaan:</strong> {centerUserData.pekerjaan}
                      </p>
                      <p>
                        <strong>Perusahaan:</strong> {centerUserData.perusahaan}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="font-bold text-xl text-blue-600">{centerConnections.length}</div>
                      <div className="text-sm text-blue-600">Total Koneksi</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Results */}
            {searchTerm && searchResults.length > 0 && (
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-600" />
                    Hasil Pencarian ({searchResults.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-green-600 mb-2">Klik untuk jadikan center node</div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.slice(0, 10).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-green-50 cursor-pointer border border-green-200 hover:border-green-300 transition-colors"
                        onClick={() => handleSearchResultClick(user.id)}
                      >
                        <Avatar className="h-8 w-8 ring-2 ring-green-500">
                          <AvatarFallback className="text-xs bg-green-100 text-green-700">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-green-800 truncate">{user.name}</div>
                          <div className="text-xs text-green-600 truncate">
                            {user.jurusan} '{user.angkatan} • {user.pekerjaan}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{user.perusahaan}</div>
                        </div>
                      </div>
                    ))}
                    {searchResults.length > 10 && (
                      <div className="text-xs text-gray-500 text-center pt-2">
                        +{searchResults.length - 10} alumni lainnya
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Search Results */}
            {searchTerm && searchResults.length === 0 && (
              <Card className="border-2 border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center text-orange-600">
                    <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Tidak ada alumni yang cocok dengan pencarian "{searchTerm}"</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kontrol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <div>
                  🎯 <strong>Klik node:</strong> {focusMode ? "Pilih untuk focus (max 2)" : "Set sebagai center"}
                </div>
                <div>
                  🖱️ <strong>Drag node:</strong> Pindahkan posisi
                </div>
                <div>
                  🖱️ <strong>Drag canvas:</strong> Pan view
                </div>
                <div>
                  🔍 <strong>Scroll:</strong> Zoom
                </div>
                <div>
                  ⌨️ <strong>Space:</strong> Pause/Resume simulation
                </div>
                <div>
                  ⌨️ <strong>F:</strong> Toggle Focus mode
                </div>
                <div>
                  ⌨️ <strong>Esc:</strong> Exit fullscreen
                </div>
                <div>
                  ⚡ <strong>Force-directed:</strong> Auto layout dengan collision detection
                </div>
              </CardContent>
            </Card>

            {/* Network Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Network Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Alumni</span>
                  <span className="font-medium">{visibleUsers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Connections</span>
                  <span className="font-medium">{simulationRef.current?.links.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Simulation Alpha</span>
                  <span className="font-medium">{(simulationRef.current?.alpha || 0).toFixed(3)}</span>
                </div>
                {focusMode && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Focus Nodes</span>
                    <span className="font-medium text-red-600">{focusNodes.length}/2</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
