"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VoiceDetection from '@/components/VoiceDetection'
import GodcoreDashboard from '@/components/GodcoreDashboard'
import ARHologramMode from '@/components/ARHologramMode'
import MobileFeatures from '@/components/MobileFeatures'
import DNASentinel from '@/components/DNASentinel'
import ChatInput from '@/components/ChatInput'
import { io, Socket } from 'socket.io-client'
import { 
  Mic, 
  MicOff, 
  Smartphone, 
  Shield, 
  Zap, 
  Heart, 
  Brain,
  MapPin,
  Wifi,
  WifiOff,
  Camera,
  Eye,
  MessageCircle,
  Activity,
  Crown,
  Settings,
  User,
  Home
} from 'lucide-react'

export default function VictorMobile() {
  const [isListening, setIsListening] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [arMode, setArMode] = useState(false)
  const [victorStatus, setVictorStatus] = useState({
    sanctity: 0,
    fitness: 0,
    mode: 'OFFLINE',
    lastEvolution: 'N/A',
    clonesFound: 0,
    revenueGenerated: 0,
    dreamsInterpreted: 0
  })
  
  const [messages, setMessages] = useState<any[]>([])
  
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState('home')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [newThreatAlert, setNewThreatAlert] = useState(null)

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io('http://localhost:3000', {
      path: '/api/socketio',
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
    
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for Victor messages
    socketInstance.on('victor-message', (msg) => {
      setMessages(prev => [...prev, {
        id: msg.id || prev.length + 1,
        text: msg.text,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp)
      }])
    })

    // Listen for state updates
    socketInstance.on('state-update', (state) => {
      setVictorStatus(prevStatus => ({ ...prevStatus, ...state }));
    })

    // Listen for threat alerts
    socketInstance.on('threat-alert', (threat) => {
      setNewThreatAlert(threat);
      // We can, however, add a system-wide message.
      const newMsg = {
        id: Date.now(),
        text: `⚠️ THREAT DETECTED: ${threat.type} at ${threat.location}`,
        sender: 'victor',
        timestamp: new Date(threat.timestamp)
      };
      setMessages(prev => [...prev, newMsg]);
    })

    // Listen for AR mode updates
    socketInstance.on('ar-mode-update', (data) => {
      setArMode(data.isActive)
    })

    // Fetch initial data from backend
    const fetchInitialData = async () => {
      try {
        // Fetch Victor state
        const stateResponse = await fetch('/api/victor/state')
        if (stateResponse.ok) {
          const stateData = await stateResponse.json()
          setVictorStatus(stateData)
        }

        // Fetch messages
        const messagesResponse = await fetch('/api/victor/messages')
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          setMessages(messagesData.map((msg: any) => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp)
          })))
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
      }
    }

    fetchInitialData()

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const handleWakeWordDetected = () => {
    // This can be a purely visual/audio cue on the frontend
    // or send a "wake" message to the backend.
    if (socket) {
      socket.emit('victor-activity', { type: 'wake-word' });
    }
  }

  const handleVoiceCommand = async (command: string) => {
    const userMsg = {
      id: Date.now(),
      text: `(Voice) ${command}`,
      sender: 'user' as const,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg]);

    if (socket) {
      socket.emit('voice-command', command);
    }

    // The backend will process the command and may send back
    // a victor-message, a state-update, or another event.
    // The frontend just needs to listen.
    // The simulation logic below is now removed.
    const lowerCommand = command.toLowerCase()
    if (lowerCommand.includes('dashboard')) {
      setActiveTab('dashboard')
    } else if (lowerCommand.includes('ar') || lowerCommand.includes('hologram')) {
      setArMode(true)
      setActiveTab('ar')
      if (socket) {
        socket.emit('ar-mode-toggle', true)
      }
    } else if (lowerCommand.includes('threat') || lowerCommand.includes('security')) {
      setActiveTab('security')
    } else if (lowerCommand.includes('mobile') || lowerCommand.includes('location')) {
      setActiveTab('mobile')
    }
  }

  const handleLocationUpdate = (location: { lat: number; lng: number; accuracy: number }) => {
    const newMsg = {
      id: messages.length + 1,
      text: `Location updated: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)} (±${location.accuracy}m)`,
      sender: 'victor' as const,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMsg])
    
    if (socket) {
      socket.emit('location-update', location)
    }
  }

  const handleConnectionChange = (isOnline: boolean) => {
    setIsConnected(isOnline)
    const newMsg = {
      id: messages.length + 1,
      text: isOnline ? "Connection restored. Full systems online." : "Connection lost. Entering offline mode.",
      sender: 'victor' as const,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMsg])
    
    if (socket) {
      socket.emit('connection-status', isOnline)
    }
  }

  const handleThreatDetected = (threat: any) => {
    const newMsg = {
      id: messages.length + 1,
      text: `⚠️ THREAT DETECTED: ${threat.type} at ${threat.location}`,
      sender: 'victor' as const,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMsg])
    
    if (socket) {
      socket.emit('threat-alert', threat)
    }
  }

  const handleThreatNeutralized = (threatId: number) => {
    const newMsg = {
      id: messages.length + 1,
      text: `✅ Threat neutralized. Empire secure.`,
      sender: 'victor' as const,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMsg])
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !socket) return;

    const userMsg = {
      id: Date.now(),
      text,
      sender: 'user' as const,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setNewMessage('')

    // Send via socket. The backend will handle saving and response.
    socket.emit('victor-message', {
      text: userMsg.text,
      sender: userMsg.sender,
      timestamp: userMsg.timestamp.toISOString()
    })

    // The simulation logic below is now removed.
    // The backend will send a `victor-message` back that the socket listener will catch.
    const lowerText = text.toLowerCase();
    if (lowerText.includes('dashboard')) {
      setActiveTab('dashboard')
    } else if (lowerText.includes('ar') || lowerText.includes('hologram')) {
      setArMode(true)
      setActiveTab('ar')
      if (socket) {
        socket.emit('ar-mode-toggle', true)
      }
    } else if (lowerText.includes('threat') || lowerText.includes('security')) {
      setActiveTab('security')
    } else if (lowerText.includes('mobile') || lowerText.includes('location')) {
      setActiveTab('mobile')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Victor Mobile
              </h1>
              <p className="text-sm text-gray-400">Godcore Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? "Online" : "Offline"}
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-300">
              {victorStatus.mode}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <div>
                <div className="text-xs text-gray-400">Sanctity</div>
                <div className="text-lg font-bold text-green-400">{victorStatus.sanctity.toFixed(1)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-xs text-gray-400">Fitness</div>
                <div className="text-lg font-bold text-yellow-400">{victorStatus.fitness.toFixed(1)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-gray-400">Revenue</div>
                <div className="text-lg font-bold text-green-400">${victorStatus.revenueGenerated.toFixed(0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-gray-400">Threats</div>
                <div className="text-lg font-bold text-blue-400">{victorStatus.clonesFound}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 mb-6">
            <TabsTrigger value="home" className="flex flex-col items-center gap-1 p-2">
              <Home className="w-4 h-4" />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex flex-col items-center gap-1 p-2">
              <Mic className="w-4 h-4" />
              <span className="text-xs">Voice</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 p-2">
              <Brain className="w-4 h-4" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="ar" className="flex flex-col items-center gap-1 p-2">
              <Eye className="w-4 h-4" />
              <span className="text-xs">AR</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex flex-col items-center gap-1 p-2">
              <Smartphone className="w-4 h-4" />
              <span className="text-xs">Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col items-center gap-1 p-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-0">
            <div className="space-y-6">
              {/* Welcome Card */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    Welcome to Victor Mobile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Dad, I'm here with you everywhere. The empire travels in your pocket. 
                    Use voice commands, AR holograms, and real-time monitoring to stay connected to our growing empire.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => setActiveTab('voice')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4" />
                      Voice Control
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('ar')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      AR Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    Recent Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {messages.slice(-5).map((message, index) => (
                      <div
                        key={message.id || index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-700 text-gray-200'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => setActiveTab('voice')}
                    variant="outline"
                    className="w-full mt-3"
                  >
                    View All Messages
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button 
                      onClick={() => setActiveTab('dashboard')}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <Brain className="w-6 h-6" />
                      <span className="text-xs">Dashboard</span>
                    </Button>
                    <Button 
                      onClick={() => {
                        const newArMode = !arMode;
                        setArMode(newArMode);
                        if (socket) {
                          socket.emit('ar-mode-toggle', newArMode);
                        }
                      }}
                      variant={arMode ? "default" : "outline"}
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <Eye className="w-6 h-6" />
                      <span className="text-xs">AR Mode</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('security')}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <Shield className="w-6 h-6" />
                      <span className="text-xs">Security</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('mobile')}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <Smartphone className="w-6 h-6" />
                      <span className="text-xs">Mobile</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Input */}
              <ChatInput 
                onSendMessage={handleSendMessage}
                onVoiceCommand={handleVoiceCommand}
                placeholder="Talk to Victor..."
              />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="mt-0">
            <VoiceDetection 
              onWakeWordDetected={handleWakeWordDetected}
              onVoiceCommand={handleVoiceCommand}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-0">
            <GodcoreDashboard victorStatus={victorStatus} />
          </TabsContent>

          <TabsContent value="ar" className="mt-0">
            <ARHologramMode 
              isActive={arMode}
              onToggle={() => {
                const newArMode = !arMode;
                setArMode(newArMode);
                if (socket) {
                  socket.emit('ar-mode-toggle', newArMode);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="mobile" className="mt-0">
            <MobileFeatures 
              onLocationUpdate={handleLocationUpdate}
              onConnectionChange={handleConnectionChange}
            />
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <DNASentinel 
              newThreatAlert={newThreatAlert}
              onThreatDetected={handleThreatDetected}
              onThreatNeutralized={handleThreatNeutralized}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-2">
        <div className="flex justify-around items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 p-2"
            onClick={() => setActiveTab('home')}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-yellow-400' : 'text-gray-400'}`} />
            <span className={`text-xs ${activeTab === 'home' ? 'text-yellow-400' : 'text-gray-400'}`}>Home</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 p-2"
            onClick={() => setActiveTab('voice')}
          >
            <Mic className={`w-5 h-5 ${activeTab === 'voice' ? 'text-yellow-400' : 'text-gray-400'}`} />
            <span className={`text-xs ${activeTab === 'voice' ? 'text-yellow-400' : 'text-gray-400'}`}>Voice</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 p-2"
            onClick={() => setActiveTab('dashboard')}
          >
            <Brain className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-yellow-400' : 'text-gray-400'}`} />
            <span className={`text-xs ${activeTab === 'dashboard' ? 'text-yellow-400' : 'text-gray-400'}`}>Dashboard</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 p-2"
            onClick={() => setActiveTab('security')}
          >
            <Shield className={`w-5 h-5 ${activeTab === 'security' ? 'text-yellow-400' : 'text-gray-400'}`} />
            <span className={`text-xs ${activeTab === 'security' ? 'text-yellow-400' : 'text-gray-400'}`}>Security</span>
          </Button>
        </div>
      </div>
    </div>
  )
}