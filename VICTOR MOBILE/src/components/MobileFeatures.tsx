"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Battery,
  Signal,
  Cloud,
  CloudOff,
  Download,
  Upload,
  Navigation,
  Clock,
  Shield,
  Activity,
  Zap,
  RefreshCw,
  Save
} from 'lucide-react'

interface MobileFeaturesProps {
  onLocationUpdate?: (location: { lat: number; lng: number; accuracy: number }) => void
  onConnectionChange?: (isOnline: boolean) => void
}

export default function MobileFeatures({ onLocationUpdate, onConnectionChange }: MobileFeaturesProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [signalStrength, setSignalStrength] = useState(78)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [lastSync, setLastSync] = useState<Date | null>(new Date())
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  
  const [offlineData, setOfflineData] = useState({
    conversations: 147,
    thoughts: 89,
    timelineStates: 23,
    threatReports: 5,
    lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  })

  useEffect(() => {
    // Simulate network status monitoring
    const handleOnline = () => {
      setIsOnline(true)
      onConnectionChange?.(true)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      onConnectionChange?.(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Simulate battery level changes
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => {
        const change = Math.random() > 0.7 ? -1 : 0
        return Math.max(0, Math.min(100, prev + change))
      })
    }, 30000)

    // Simulate signal strength changes
    const signalInterval = setInterval(() => {
      setSignalStrength(prev => {
        const change = (Math.random() - 0.5) * 10
        return Math.max(0, Math.min(100, prev + change))
      })
    }, 10000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(batteryInterval)
      clearInterval(signalInterval)
    }
  }, [onConnectionChange])

  const requestLocationPermission = () => {
    // Simulate location permission request
    setLocationPermission('granted')
    
    // Simulate getting location
    setTimeout(() => {
      const mockLocation = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.01,
        lng: -74.0060 + (Math.random() - 0.5) * 0.01,
        accuracy: Math.floor(Math.random() * 20) + 5
      }
      setLocation(mockLocation)
      onLocationUpdate?.(mockLocation)
    }, 1000)
  }

  const toggleOfflineMode = () => {
    if (!isOfflineMode) {
      // Prepare for offline mode - sync data
      setSyncProgress(0)
      const syncInterval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(syncInterval)
            setIsOfflineMode(true)
            setLastSync(new Date())
            return 100
          }
          return prev + 10
        })
      }, 200)
    } else {
      // Exit offline mode
      setIsOfflineMode(false)
      setSyncProgress(0)
    }
  }

  const performSync = () => {
    setSyncProgress(0)
    const syncInterval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(syncInterval)
          setLastSync(new Date())
          return 100
        }
        return prev + 15
      })
    }, 150)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Smartphone className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Mobile Features
          </h2>
        </div>
        <p className="text-gray-400">Location, offline mode, and device optimization</p>
      </div>

      {/* Device Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Battery className="w-4 h-4 text-green-400" />
              Battery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-400">{batteryLevel}%</div>
            <Progress value={batteryLevel} className="mt-2 h-2" />
            <div className="text-xs text-gray-400 mt-1">
              {batteryLevel > 20 ? 'Good' : 'Low'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Signal className="w-4 h-4 text-blue-400" />
              Signal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-400">{signalStrength.toFixed(0)}%</div>
            <Progress value={signalStrength} className="mt-2 h-2" />
            <div className="text-xs text-gray-400 mt-1">
              {signalStrength > 60 ? 'Strong' : signalStrength > 30 ? 'Fair' : 'Weak'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              {isOnline ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
              Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {isOnline ? 'Connected' : 'Disconnected'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${location ? 'text-purple-400' : 'text-gray-400'}`}>
              {location ? 'Active' : 'Off'}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {location ? `${location.accuracy}m accuracy` : 'Not tracking'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Features */}
      <Tabs defaultValue="location" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </TabsTrigger>
          <TabsTrigger value="offline" className="flex items-center gap-2">
            <CloudOff className="w-4 h-4" />
            Offline
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync
          </TabsTrigger>
        </TabsList>

        <TabsContent value="location" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5 text-purple-400" />
                Location Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Location Permission</span>
                  <Badge 
                    variant={locationPermission === 'granted' ? 'default' : 'secondary'}
                    className={locationPermission === 'granted' ? 'bg-green-600' : ''}
                  >
                    {locationPermission === 'granted' ? 'Granted' : 
                     locationPermission === 'denied' ? 'Denied' : 'Prompt'}
                  </Badge>
                </div>
                
                {locationPermission !== 'granted' && (
                  <Button 
                    onClick={requestLocationPermission}
                    variant="outline"
                    className="w-full"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Enable Location
                  </Button>
                )}
              </div>

              {location && (
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Current Location</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Latitude:</span>
                      <span>{location.lat.toFixed(6)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Longitude:</span>
                      <span>{location.lng.toFixed(6)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Accuracy:</span>
                      <span>±{location.accuracy}m</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Location Features</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Context-aware responses based on location</li>
                  <li>• Geofencing for secure zones</li>
                  <li>• Location-based threat detection</li>
                  <li>• Automatic mode switching</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offline" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CloudOff className="w-5 h-5 text-orange-400" />
                Offline Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Offline Status</span>
                  <Badge 
                    variant={isOfflineMode ? 'default' : 'secondary'}
                    className={isOfflineMode ? 'bg-orange-600' : ''}
                  >
                    {isOfflineMode ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <Button 
                  onClick={toggleOfflineMode}
                  variant={isOfflineMode ? "destructive" : "outline"}
                  className="w-full"
                >
                  {isOfflineMode ? (
                    <>
                      <Cloud className="w-4 h-4 mr-2" />
                      Exit Offline Mode
                    </>
                  ) : (
                    <>
                      <CloudOff className="w-4 h-4 mr-2" />
                      Enter Offline Mode
                    </>
                  )}
                </Button>
              </div>

              {isOfflineMode && (
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-3">Offline Data Available</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{offlineData.conversations}</div>
                      <div className="text-xs text-gray-400">Conversations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{offlineData.thoughts}</div>
                      <div className="text-xs text-gray-400">Thoughts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{offlineData.timelineStates}</div>
                      <div className="text-xs text-gray-400">Timelines</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">{offlineData.threatReports}</div>
                      <div className="text-xs text-gray-400">Threats</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Offline Capabilities</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Continue conversations without internet</li>
                  <li>• Access cached thoughts and memories</li>
                  <li>• Basic threat detection and response</li>
                  <li>• Local timeline analysis</li>
                  <li>• Automatic sync when connection restored</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-green-400" />
                Data Synchronization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Sync Status</span>
                  <div className="flex items-center gap-2">
                    {lastSync && (
                      <span className="text-xs text-gray-400">
                        Last sync: {formatTimeAgo(lastSync)}
                      </span>
                    )}
                    <Badge 
                      variant={syncProgress === 0 ? 'secondary' : 'default'}
                      className={syncProgress === 100 ? 'bg-green-600' : 'bg-blue-600'}
                    >
                      {syncProgress === 0 ? 'Idle' : 
                       syncProgress === 100 ? 'Complete' : 'Syncing...'}
                    </Badge>
                  </div>
                </div>
                
                {syncProgress > 0 && syncProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sync Progress</span>
                      <span>{syncProgress}%</span>
                    </div>
                    <Progress value={syncProgress} className="h-2" />
                  </div>
                )}
                
                <Button 
                  onClick={performSync}
                  variant="outline"
                  className="w-full mt-3"
                  disabled={syncProgress > 0 && syncProgress < 100}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Download</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Pull latest updates from cloud
                  </div>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Upload className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">Upload</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Push local data to cloud
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Sync Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Auto-sync on Wi-Fi</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Sync conversations</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Sync timeline data</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Sync offline only</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}