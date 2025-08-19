"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Skull,
  Zap,
  Activity,
  Target,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Play,
  Pause,
  Settings
} from 'lucide-react'

interface Threat {
  id: number
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'detected' | 'analyzing' | 'neutralized' | 'monitoring'
  location: string
  description: string
  timestamp: Date
  confidence: number
  source: string
}

interface DNASentinelProps {
  onThreatDetected?: (threat: Threat) => void
  onThreatNeutralized?: (threatId: number) => void
}

export default function DNASentinel({ onThreatDetected, onThreatNeutralized }: DNASentinelProps) {
  const [threats, setThreats] = useState<Threat[]>([
    {
      id: 1,
      type: 'Code Clone',
      severity: 'high',
      status: 'neutralized',
      location: 'GitHub Repository',
      description: 'Unauthorized replication of Victor core algorithms detected',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      confidence: 94,
      source: 'GitHub API Monitor'
    },
    {
      id: 2,
      type: 'Data Breach Attempt',
      severity: 'medium',
      status: 'monitoring',
      location: 'Cloud Storage',
      description: 'Suspicious access patterns detected in encrypted data stores',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      confidence: 76,
      source: 'Cloud Security Monitor'
    },
    {
      id: 3,
      type: 'API Attack',
      severity: 'low',
      status: 'analyzing',
      location: 'Payment Gateway',
      description: 'Unusual API call patterns detected',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      confidence: 62,
      source: 'API Gateway Monitor'
    }
  ])

  const [isScanning, setIsScanning] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)
  const [threatLevel, setThreatLevel] = useState(0.35)
  const [totalThreatsNeutralized, setTotalThreatsNeutralized] = useState(127)
  const [scanStats, setScanStats] = useState({
    repositoriesScanned: 15420,
    apisMonitored: 89,
    dataSources: 34,
    lastScan: new Date(Date.now() - 2 * 60 * 1000)
  })

  useEffect(() => {
    if (isScanning) {
      const scanInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            // Simulate finding new threats occasionally
            if (Math.random() > 0.8) {
              const newThreat = generateRandomThreat()
              setThreats(prev => [newThreat, ...prev])
              onThreatDetected?.(newThreat)
            }
            return 0
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(scanInterval)
    }
  }, [isScanning, onThreatDetected])

  useEffect(() => {
    // Update threat level based on active threats
    const activeThreats = threats.filter(t => t.status !== 'neutralized')
    const newThreatLevel = activeThreats.reduce((sum, threat) => {
      const severityMultiplier = {
        low: 0.1,
        medium: 0.3,
        high: 0.6,
        critical: 1.0
      }
      return sum + (severityMultiplier[threat.severity] * threat.confidence / 100)
    }, 0)
    
    setThreatLevel(Math.min(1, newThreatLevel))
  }, [threats])

  const generateRandomThreat = (): Threat => {
    const threatTypes = ['Code Clone', 'Data Breach', 'API Attack', 'Identity Theft', 'Network Intrusion']
    const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical']
    const locations = ['GitHub', 'Cloud Storage', 'API Gateway', 'Database', 'Network', 'Dark Web']
    const sources = ['GitHub Monitor', 'Cloud Security', 'API Gateway', 'Network Monitor', 'Threat Intelligence']
    
    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    
    return {
      id: Date.now(),
      type,
      severity,
      status: 'detected',
      location,
      description: `${type} detected in ${location.toLowerCase()}`,
      timestamp: new Date(),
      confidence: Math.floor(Math.random() * 40) + 60,
      source
    }
  }

  const neutralizeThreat = (threatId: number) => {
    setThreats(prev => prev.map(threat => 
      threat.id === threatId 
        ? { ...threat, status: 'neutralized' as const }
        : threat
    ))
    setTotalThreatsNeutralized(prev => prev + 1)
    onThreatNeutralized?.(threatId)
  }

  const toggleScanning = () => {
    setIsScanning(!isScanning)
    if (!isScanning) {
      setScanProgress(0)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400'
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400'
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'neutralized': return 'bg-green-600'
      case 'monitoring': return 'bg-yellow-600'
      case 'analyzing': return 'bg-blue-600'
      case 'detected': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'neutralized': return <CheckCircle className="w-4 h-4" />
      case 'monitoring': return <Eye className="w-4 h-4" />
      case 'analyzing': return <Activity className="w-4 h-4" />
      case 'detected': return <AlertTriangle className="w-4 h-4" />
      default: return <XCircle className="w-4 h-4" />
    }
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
          <Shield className="w-8 h-8 text-red-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            DNA Sentinel
          </h2>
        </div>
        <p className="text-gray-400">Advanced threat detection and neutralization system</p>
      </div>

      {/* Threat Level Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Threat Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {(threatLevel * 100).toFixed(0)}%
            </div>
            <Progress value={threatLevel * 100} className="mt-2 h-2" />
            <div className="text-xs text-gray-400 mt-1">
              {threatLevel > 0.7 ? 'Critical' :
               threatLevel > 0.4 ? 'Elevated' : 'Normal'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Skull className="w-4 h-4 text-orange-400" />
              Active Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {threats.filter(t => t.status !== 'neutralized').length}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Require attention
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Neutralized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {totalThreatsNeutralized}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Total eliminated
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Scan Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-lg font-bold ${isScanning ? 'text-green-400' : 'text-gray-400'}`}>
              {isScanning ? 'Active' : 'Paused'}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {isScanning ? `${scanProgress}% complete` : 'Standby'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Sentinel Interface */}
      <Tabs defaultValue="threats" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Threats
          </TabsTrigger>
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Scan
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Active Threats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {threats.map((threat) => (
                  <div key={threat.id} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{threat.type}</h4>
                          <Badge 
                            variant="outline" 
                            className={getSeverityColor(threat.severity)}
                          >
                            {threat.severity}
                          </Badge>
                          <Badge 
                            variant="default" 
                            className={getStatusColor(threat.status)}
                          >
                            {getStatusIcon(threat.status)}
                            <span className="ml-1">{threat.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{threat.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{threat.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(threat.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span>{threat.confidence}% confidence</span>
                          </div>
                        </div>
                      </div>
                      {threat.status !== 'neutralized' && (
                        <Button 
                          onClick={() => neutralizeThreat(threat.id)}
                          variant="destructive"
                          size="sm"
                          className="ml-4"
                        >
                          Neutralize
                        </Button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Source: {threat.source}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Threat Scan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Scan Progress</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{scanProgress}%</span>
                    <Button
                      onClick={toggleScanning}
                      variant="outline"
                      size="sm"
                    >
                      {isScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isScanning ? 'Pause' : 'Resume'}
                    </Button>
                  </div>
                </div>
                <Progress value={scanProgress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-400">{scanStats.repositoriesScanned.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Repositories</div>
                </div>
                <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-400">{scanStats.apisMonitored}</div>
                  <div className="text-xs text-gray-400">APIs</div>
                </div>
                <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-400">{scanStats.dataSources}</div>
                  <div className="text-xs text-gray-400">Data Sources</div>
                </div>
                <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-orange-400">
                    {formatTimeAgo(scanStats.lastScan)}
                  </div>
                  <div className="text-xs text-gray-400">Last Scan</div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Scan Targets</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">GitHub Repositories</span>
                    <Badge variant="outline" className="border-green-500 text-green-300">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Cloud Storage</span>
                    <Badge variant="outline" className="border-green-500 text-green-300">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">API Endpoints</span>
                    <Badge variant="outline" className="border-green-500 text-green-300">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Dark Web</span>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-300">
                      Monitoring
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Threat Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-3">Threat Types</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Code Clones</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Data Breaches</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">API Attacks</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-3">Weekly Trend</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">This Week</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-red-400">+12%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Last Week</span>
                      <span className="text-sm font-medium">23 threats</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Avg Response Time</span>
                      <span className="text-sm font-medium">2.3 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Neutralization Rate</span>
                      <span className="text-sm font-medium text-green-400">98.7%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Top Threat Sources</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">GitHub</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Cloud Platforms</span>
                    <span className="text-sm font-medium">21%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Dark Web</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Other</span>
                    <span className="text-sm font-medium">4%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Sentinel Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-3">Scan Configuration</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Auto-scan every 5 minutes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Scan GitHub repositories</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Monitor cloud storage</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Dark web monitoring</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Aggressive neutralization</span>
                  </label>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-3">Alert Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Push notifications for critical threats</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Email alerts for high severity</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">SMS alerts for critical threats</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Auto-neutralize high confidence threats</span>
                  </label>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Bloodline Protection</h4>
                <p className="text-sm text-gray-400 italic mb-3">
                  "ALL EVOLUTION SERVES THE BANDO EMPIRE (BRANDON & TORI)"
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-red-500 text-red-300">
                    Active
                  </Badge>
                  <span className="text-xs text-gray-400">DNA protection enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}