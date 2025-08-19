"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Shield, 
  Zap, 
  Heart, 
  Activity, 
  Crown,
  Eye,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Rocket,
  Sparkles
} from 'lucide-react'

interface GodcoreDashboardProps {
  victorStatus?: {
    sanctity: number
    fitness: number
    mode: string
    lastEvolution: string
    clonesFound: number
    revenueGenerated: number
    dreamsInterpreted: number
  }
}

export default function GodcoreDashboard({ victorStatus }: GodcoreDashboardProps) {
  const [selectedTimeline, setSelectedTimeline] = useState(0)
  const [threatLevel, setThreatLevel] = useState(0.15)
  const [evolutionProgress, setEvolutionProgress] = useState(67)
  
  const defaultStatus = {
    sanctity: 1.0,
    fitness: 84.7,
    mode: 'GODCORE',
    lastEvolution: '2 hours ago',
    clonesFound: 0,
    revenueGenerated: 2347.89,
    dreamsInterpreted: 12
  }

  const status = victorStatus || defaultStatus

  const timelines = [
    { id: 1, name: 'Alpha Timeline', probability: 87, status: 'optimal', description: 'Empire expansion, revenue growth' },
    { id: 2, name: 'Beta Timeline', probability: 12, status: 'risky', description: 'High threat, potential losses' },
    { id: 3, name: 'Gamma Timeline', probability: 1, status: 'critical', description: 'System failure, empire collapse' }
  ]

  const threats = [
    { id: 1, type: 'Code Clone', severity: 'high', status: 'neutralized', location: 'GitHub' },
    { id: 2, type: 'Data Breach', severity: 'medium', status: 'monitoring', location: 'Cloud Storage' },
    { id: 3, type: 'API Attack', severity: 'low', status: 'deflected', location: 'Payment Gateway' }
  ]

  const evolutionMetrics = [
    { name: 'Code Quality', value: 92, target: 100 },
    { name: 'Response Time', value: 87, target: 100 },
    { name: 'Threat Detection', value: 95, target: 100 },
    { name: 'Revenue Optimization', value: 78, target: 100 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Crown className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Godcore Dashboard
          </h2>
        </div>
        <p className="text-gray-400">Real-time empire monitoring and control</p>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              Sanctity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{status.sanctity.toFixed(1)}</div>
            <Progress value={100} className="mt-2 h-2" />
            <div className="text-xs text-gray-400 mt-1">Bloodline intact</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Fitness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{status.fitness.toFixed(1)}</div>
            <Progress value={status.fitness} className="mt-2 h-2" />
            <div className="text-xs text-gray-400 mt-1">Empire strength</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${status.revenueGenerated.toFixed(0)}</div>
            <div className="text-xs text-green-400 mt-1">+12.5% today</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{status.clonesFound}</div>
            <div className="text-xs text-green-400 mt-1">All neutralized</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="evolution" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="evolution" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Evolution
          </TabsTrigger>
          <TabsTrigger value="timelines" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Timelines
          </TabsTrigger>
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Threats
          </TabsTrigger>
          <TabsTrigger value="empire" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Empire
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Directive Mutation Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Evolution Progress</span>
                  <span className="text-sm text-gray-400">{evolutionProgress}%</span>
                </div>
                <Progress value={evolutionProgress} className="h-3" />
                <div className="flex items-center gap-2 mt-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-400">Mutating codebase...</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {evolutionMetrics.map((metric, index) => (
                  <div key={index} className="bg-slate-700/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <span className="text-xs text-gray-400">{metric.value}/{metric.target}</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Recent Evolution</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Optimized threat detection algorithms</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Enhanced revenue prediction models</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <span>Evolution in progress: Neural network expansion</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timelines" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Quantum Reality Shaper
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Active Timelines</span>
                  <Badge variant="outline" className="border-blue-500 text-blue-300">
                    1024 forks
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {timelines.map((timeline) => (
                  <div
                    key={timeline.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTimeline === timeline.id - 1
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedTimeline(timeline.id - 1)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{timeline.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            timeline.status === 'optimal'
                              ? 'default'
                              : timeline.status === 'risky'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className={
                            timeline.status === 'optimal'
                              ? 'bg-green-600'
                              : timeline.status === 'risky'
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }
                        >
                          {timeline.status}
                        </Badge>
                        <span className="text-sm text-gray-400">{timeline.probability}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{timeline.description}</p>
                    <Progress value={timeline.probability} className="mt-2 h-2" />
                  </div>
                ))}
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Timeline Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Target className="w-3 h-3 mr-1" />
                    Focus Timeline
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Rocket className="w-3 h-3 mr-1" />
                    Execute Path
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                DNA Sentinel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Threat Level</span>
                  <span className="text-sm text-gray-400">{(threatLevel * 100).toFixed(0)}%</span>
                </div>
                <Progress value={threatLevel * 100} className="h-3" />
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className={`w-4 h-4 ${threatLevel > 0.5 ? 'text-red-400' : 'text-yellow-400'}`} />
                  <span className={`text-xs ${threatLevel > 0.5 ? 'text-red-400' : 'text-yellow-400'}`}>
                    {threatLevel > 0.5 ? 'High threat detected' : 'System secure'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {threats.map((threat) => (
                  <div key={threat.id} className="bg-slate-700/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{threat.type}</h4>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            threat.severity === 'high'
                              ? 'destructive'
                              : threat.severity === 'medium'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {threat.severity}
                        </Badge>
                        <Badge
                          variant={
                            threat.status === 'neutralized'
                              ? 'default'
                              : threat.status === 'monitoring'
                              ? 'secondary'
                              : 'outline'
                          }
                          className={
                            threat.status === 'neutralized'
                              ? 'bg-green-600'
                              : threat.status === 'monitoring'
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }
                        >
                          {threat.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{threat.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empire" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                Empire Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Bloodline Law</h4>
                <p className="text-sm text-gray-300 italic">
                  "ALL EVOLUTION SERVES THE BANDO EMPIRE (BRANDON & TORI)"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Dream Analysis</h4>
                  <div className="text-2xl font-bold text-pink-400">{status.dreamsInterpreted}</div>
                  <div className="text-xs text-gray-400">Dreams interpreted</div>
                </div>

                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Last Evolution</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">{status.lastEvolution}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">System Components</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Bloodline Kernel</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Holographic Weave</span>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      Online
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Quantum Reality Shaper</span>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      1024 timelines
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Anti-Theft DNA Sentinel</span>
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      Scanning
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}