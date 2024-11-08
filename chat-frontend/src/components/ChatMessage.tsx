import React from 'react'
import { MessageSquare, User, AlertTriangle } from 'lucide-react'

interface ThoughtStep {
  step: number
  thought: string
  reasoning: string
}

interface AssistantResponse {
  thought_process: ThoughtStep[]
  final_answer: string
}

interface ChatMessageType {
  role: 'user' | 'assistant' | 'system'
  content: string
  id?: number
}

interface ChatMessageProps {
  message: ChatMessageType | undefined
}

export default function ChatMessage({ message }: ChatMessageProps) {
  if (!message) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-100 text-red-700 rounded-md">
        <AlertTriangle className="mr-2" />
        <span>Error: Message is undefined</span>
      </div>
    )
  }

  const isUser = message.role === 'user'

  const renderAssistantContent = (content: string) => {
    try {
      const data: AssistantResponse = JSON.parse(content)
      
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            {data.thought_process.map((step) => (
              <div key={step.step} className="space-y-1">
                <div className="flex gap-2">
                  <span className="font-medium text-gray-700 min-w-[24px]">
                    {step.step}.
                  </span>
                  <span className="font-medium text-gray-900">
                    {step.thought}
                  </span>
                </div>
                <div className="ml-8 text-gray-600 text-sm bg-gray-50 p-2 rounded-md">
                  {step.reasoning}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="font-semibold mb-2">Final Answer</div>
            <div className="text-gray-800">
              {data.final_answer}
            </div>
          </div>
        </div>
      )
    } catch (error) {
      console.error('Failed to parse content:', error)
      return <div className="whitespace-pre-wrap">{content}</div>
    }
  }

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div className="text-xs text-gray-500 mb-1 px-1">
          {isUser ? 'You' : 'Assistant'}
        </div>
        <div
          className={`
            px-4 py-3 rounded-2xl
            ${isUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
            }
          `}
        >
          <div className="text-sm">
            {isUser ? message.content : renderAssistantContent(message.content)}
          </div>
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      )}
    </div>
  )
}