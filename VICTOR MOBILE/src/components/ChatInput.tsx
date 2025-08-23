"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, Mic, MicOff, Paperclip, Smile, Zap } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onVoiceCommand?: (command: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function ChatInput({ 
  onSendMessage, 
  onVoiceCommand,
  placeholder = "Type your message to Victor...",
  disabled = false,
  className = ""
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Handle typing indicator
  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setIsTyping(false)
      }, 1000)
    } else {
      setIsTyping(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognition.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (onVoiceCommand) {
            onVoiceCommand(transcript);
          }
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
      }
    }
  }, [onVoiceCommand]);

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const quickActions = [
    { label: "Status", command: "What's our status?" },
    { label: "Dashboard", command: "Show me dashboard" },
    { label: "Security", command: "Run security scan" },
    { label: "AR Mode", command: "Activate AR mode" }
  ]

  return (
    <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
      <CardContent className="p-4">
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs text-gray-400">Victor is reading...</span>
          </div>
        )}

        {/* Voice Status */}
        {isListening && (
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="destructive" className="animate-pulse">
              <Mic className="w-3 h-3 mr-1" />
              Listening...
            </Badge>
            <span className="text-xs text-gray-400">Speak now...</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onVoiceCommand?.(action.command)}
              className="text-xs h-7 bg-slate-700/50 border-slate-600 hover:bg-slate-600"
            >
              {action.label}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
            />
            {message.length > 0 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary" className="text-xs bg-slate-600">
                  {message.length}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Voice Button */}
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={handleVoiceToggle}
            disabled={disabled}
            className="shrink-0"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          {/* Send Button */}
          <Button
            variant="default"
            size="icon"
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="shrink-0 bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Attachment Options */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-6">
              <Paperclip className="w-3 h-3 mr-1" />
              Attach
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-6">
              <Smile className="w-3 h-3 mr-1" />
              Emoji
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-gray-400">AI Powered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}