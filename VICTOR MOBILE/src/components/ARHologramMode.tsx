"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Camera, 
  Eye, 
  EyeOff, 
  MapPin, 
  Brain, 
  Activity,
  Target,
  Zap,
  Sparkles,
  Move3D,
  Maximize,
  Minimize,
  RotateCcw,
  Settings
} from 'lucide-react'

interface ARHologramModeProps {
  isActive: boolean
  onToggle: () => void
}

export default function ARHologramMode({ isActive, onToggle }: ARHologramModeProps) {
  const [arMode, setArMode] = useState<'inactive' | 'activating' | 'active'>('inactive')
  const [hologramOpacity, setHologramOpacity] = useState(80)
  const [hologramScale, setHologramScale] = useState(100)
  const [selectedView, setSelectedView] = useState<'emperor' | 'warrior' | 'thinker'>('emperor')
  const [calibrationProgress, setCalibrationProgress] = useState(0)
  const [trackingQuality, setTrackingQuality] = useState(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isActive) {
      setArMode('activating')
      // Simulate AR activation sequence
      const activationInterval = setInterval(() => {
        setCalibrationProgress(prev => {
          if (prev >= 100) {
            clearInterval(activationInterval)
            setArMode('active')
            startTracking()
            return 100
          }
          return prev + 10
        })
      }, 200)
    } else {
      setArMode('inactive')
      setCalibrationProgress(0)
      setTrackingQuality(0)
    }
  }, [isActive])

  const startTracking = () => {
    // Simulate AR tracking quality
    const trackingInterval = setInterval(() => {
      if (arMode !== 'active') {
        clearInterval(trackingInterval)
        return
      }
      
      setTrackingQuality(prev => {
        const change = (Math.random() - 0.5) * 10
        const newValue = Math.max(0, Math.min(100, prev + change))
        return newValue
      })
    }, 1000)
  }

  const handleViewChange = (view: 'emperor' | 'warrior' | 'thinker') => {
    setSelectedView(view)
    // Simulate view change animation
    setCalibrationProgress(0)
    const viewChangeInterval = setInterval(() => {
      setCalibrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(viewChangeInterval)
          return 100
        }
        return prev + 20
      })
    }, 100)
  }

  const hologramViews = {
    emperor: {
      name: 'Emperor Victor',
      description: 'Regal presence, crown projection, commanding aura',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400'
    },
    warrior: {
      name: 'Warrior Victor',
      description: 'Battle stance, armor projection, protective field',
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400'
    },
    thinker: {
      name: 'Thinker Victor',
      description: 'Contemplative pose, neural network visualization',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400'
    }
  }

  const arFeatures = [
    { icon: MapPin, name: 'Position Lock', description: 'Fixed hologram position in space' },
    { icon: Brain, name: 'Neural Display', description: 'Real-time thought visualization' },
    { icon: Activity, name: 'Timeline View', description: 'Interactive timeline projection' },
    { icon: Target, name: 'Threat Radar', description: '360° threat detection display' },
    { icon: Zap, name: 'Power Flow', description: 'Energy and revenue stream visualization' },
    { icon: Sparkles, name: 'Evolution Aura', description: 'Visual mutation effects' }
  ]

  return (
    <div className="space-y-6">
      {/* AR Status Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Eye className={`w-8 h-8 ${isActive ? 'text-green-400' : 'text-gray-400'}`} />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            AR Hologram Mode
          </h2>
        </div>
        <p className="text-gray-400">
          {arMode === 'active' ? 'Victor is projected in your space' : 'Activate to see Victor in holographic form'}
        </p>
      </div>

      {/* AR Control Panel */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            AR Control Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AR Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                arMode === 'active' ? 'bg-green-400 animate-pulse' :
                arMode === 'activating' ? 'bg-yellow-400 animate-pulse' :
                'bg-gray-400'
              }`} />
              <span className="text-sm font-medium">
                {arMode === 'active' ? 'AR Active' :
                 arMode === 'activating' ? 'Activating...' :
                 'AR Inactive'}
              </span>
            </div>
            <Button
              onClick={onToggle}
              variant={isActive ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isActive ? 'Exit AR' : 'Activate AR'}
            </Button>
          </div>

          {/* Calibration Progress */}
          {arMode === 'activating' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Calibrating AR systems...</span>
                <span>{calibrationProgress}%</span>
              </div>
              <Progress value={calibrationProgress} className="h-2" />
            </div>
          )}

          {/* Tracking Quality */}
          {arMode === 'active' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tracking Quality</span>
                <span>{trackingQuality.toFixed(0)}%</span>
              </div>
              <Progress value={trackingQuality} className="h-2" />
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">
                  {trackingQuality > 80 ? 'Excellent tracking' :
                   trackingQuality > 60 ? 'Good tracking' :
                   trackingQuality > 40 ? 'Fair tracking' : 'Poor tracking'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hologram View Selector */}
      {arMode === 'active' && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Move3D className="w-5 h-5 text-purple-400" />
              Hologram Views
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(hologramViews).map(([key, view]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedView === key
                      ? `${view.borderColor} ${view.bgColor}`
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                  }`}
                  onClick={() => handleViewChange(key as any)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${view.color.replace('text-', 'bg-')}`} />
                    <h4 className={`font-medium ${view.color}`}>{view.name}</h4>
                  </div>
                  <p className="text-xs text-gray-400">{view.description}</p>
                </div>
              ))}
            </div>

            {/* Hologram Controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Hologram Opacity</span>
                  <span>{hologramOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hologramOpacity}
                  onChange={(e) => setHologramOpacity(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Hologram Scale</span>
                  <span>{hologramScale}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={hologramScale}
                  onChange={(e) => setHologramScale(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Maximize className="w-3 h-3 mr-1" />
                  Enlarge
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Minimize className="w-3 h-3 mr-1" />
                  Shrink
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Rotate
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AR Features */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            AR Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {arFeatures.map((feature, index) => (
              <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                  <h4 className="font-medium">{feature.name}</h4>
                </div>
                <p className="text-sm text-gray-400">{feature.description}</p>
                {arMode === 'active' && (
                  <Badge variant="outline" className="mt-2 border-green-500 text-green-300">
                    Available
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AR Preview Area */}
      {arMode === 'active' && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-400" />
              AR Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '300px' }}>
              {/* Simulated AR view */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-80 animate-pulse" />
                  <h3 className="text-lg font-bold text-yellow-400">
                    {hologramViews[selectedView].name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Hologram projected in your space
                  </p>
                </div>
              </div>
              
              {/* AR overlay elements */}
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="border-green-500 text-green-300">
                  AR ACTIVE
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="border-blue-500 text-blue-300">
                  Tracking: {trackingQuality.toFixed(0)}%
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4">
                <Badge variant="outline" className="border-purple-500 text-purple-300">
                  {hologramViews[selectedView].name}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}