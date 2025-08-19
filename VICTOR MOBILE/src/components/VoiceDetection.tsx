"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Activity,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface VoiceDetectionProps {
  onWakeWordDetected: () => void
  onVoiceCommand: (command: string) => void
}

export default function VoiceDetection({ onWakeWordDetected, onVoiceCommand }: VoiceDetectionProps) {
  const [isListening, setIsListening] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [wakeWordDetected, setWakeWordDetected] = useState(false)
  const [lastCommand, setLastCommand] = useState('')
  const [voiceMode, setVoiceMode] = useState<'inactive' | 'listening' | 'processing'>('inactive')
  const [recognitionSupported, setRecognitionSupported] = useState(true)
  
  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('')

          // Check for wake word "Hey Victor"
          if (transcript.toLowerCase().includes('hey victor') && !wakeWordDetected) {
            setWakeWordDetected(true)
            setVoiceMode('listening')
            onWakeWordDetected()
            
            // Reset wake word detection after 5 seconds
            setTimeout(() => {
              setWakeWordDetected(false)
              setVoiceMode('inactive')
            }, 5000)
          }

          // Process voice commands when wake word is detected
          if (wakeWordDetected && transcript.trim()) {
            setLastCommand(transcript)
            onVoiceCommand(transcript)
            setVoiceMode('processing')
            
            setTimeout(() => {
              setVoiceMode('listening')
            }, 2000)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'no-speech') {
            // Restart recognition
            recognitionRef.current.start()
          }
        }
      } else {
        setRecognitionSupported(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [wakeWordDetected, onWakeWordDetected, onVoiceCommand])

  // Initialize audio context for visualization
  const initAudioContext = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      
      source.connect(analyser)
      analyser.fftSize = 256
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      
      visualizeAudio()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  // Visualize audio levels
  const visualizeAudio = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)
    
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    setAudioLevel(average)

    animationFrameRef.current = requestAnimationFrame(visualizeAudio)
  }

  const toggleListening = async () => {
    if (!recognitionSupported) return

    if (!isListening) {
      try {
        await initAudioContext()
        recognitionRef.current.start()
        setIsListening(true)
        setVoiceMode('inactive')
      } catch (error) {
        console.error('Error starting voice recognition:', error)
      }
    } else {
      recognitionRef.current.stop()
      setIsListening(false)
      setVoiceMode('inactive')
      setAudioLevel(0)
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }

  const getStatusColor = () => {
    switch (voiceMode) {
      case 'listening':
        return 'text-green-400'
      case 'processing':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = () => {
    switch (voiceMode) {
      case 'listening':
        return <Brain className="w-4 h-4" />
      case 'processing':
        return <Activity className="w-4 h-4" />
      default:
        return <Volume2 className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    switch (voiceMode) {
      case 'listening':
        return 'Listening for commands...'
      case 'processing':
        return 'Processing command...'
      default:
        return 'Say "Hey Victor" to wake me'
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-400" />
          Voice Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <Badge 
            variant={wakeWordDetected ? "default" : "secondary"}
            className={wakeWordDetected ? "bg-green-600" : ""}
          >
            {wakeWordDetected ? "Wake Word Active" : "Standby"}
          </Badge>
        </div>

        {/* Audio Level Visualization */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Audio Level</span>
            <span>{Math.round(audioLevel)}</span>
          </div>
          <Progress value={audioLevel} className="h-2" />
        </div>

        {/* Control Button */}
        <Button
          onClick={toggleListening}
          variant={isListening ? "default" : "outline"}
          className="w-full flex items-center gap-2"
          disabled={!recognitionSupported}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          {isListening ? "Stop Listening" : "Start Voice Detection"}
        </Button>

        {!recognitionSupported && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            Speech recognition not supported in this browser
          </div>
        )}

        {/* Last Command */}
        {lastCommand && (
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Last Command</span>
            </div>
            <p className="text-sm text-gray-300 italic">"{lastCommand}"</p>
          </div>
        )}

        {/* Voice Commands Help */}
        <div className="bg-slate-700/30 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Voice Commands
          </h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• "Hey Victor" - Wake me up</li>
            <li>• "Show me the dashboard" - Open dashboard</li>
            <li>• "How was your night?" - Status report</li>
            <li>• "Activate AR mode" - Enable hologram</li>
            <li>• "Scan for threats" - Security check</li>
            <li>• "What's my fitness score?" - Empire metrics</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}