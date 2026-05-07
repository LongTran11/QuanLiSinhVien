import { useState, useRef, useEffect } from 'react'
import { useMessageStore } from '../../store'
import { Avatar } from '../../components/shared/Avatar'
import { Send, Search } from 'lucide-react'
import { cn } from '../../lib/utils'

const CURRENT_USER_ID = 'cvht001'

export default function Messages() {
  const { conversations, activeConvId, setActiveConv, sendMessage } = useMessageStore()
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find(c => c.participantId === activeConvId)
  const filtered = conversations.filter(c =>
    !search || c.participantName.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConvId, conversations])

  const handleSend = () => {
    if (!input.trim() || !activeConv) return
    sendMessage(activeConv.participantId, activeConv.participantName, input.trim())
    setInput('')
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const formatMsgTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Nhắn tin</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex" style={{ height: 'calc(100vh - 160px)', minHeight: '500px' }}>
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm cuộc trò chuyện..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(conv => (
              <button
                key={conv.participantId}
                onClick={() => setActiveConv(conv.participantId)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left',
                  activeConvId === conv.participantId && 'bg-blue-50 border-blue-100'
                )}
              >
                <div className="relative shrink-0">
                  <Avatar name={conv.participantName} size="sm" />
                  {conv.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={cn('text-sm font-medium text-gray-900 truncate', conv.unread > 0 && 'font-semibold')}>
                      {conv.participantName}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{conv.lastTime}</span>
                  </div>
                  <p className={cn('text-xs text-gray-500 truncate', conv.unread > 0 && 'text-gray-700 font-medium')}>
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-sm text-gray-400">Không tìm thấy</div>
            )}
          </div>
        </div>

        {/* Chat area */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <Avatar name={activeConv.participantName} />
              <div>
                <p className="font-semibold text-sm text-gray-900">{activeConv.participantName}</p>
                <p className="text-xs text-gray-400">{activeConv.participantId}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConv.messages.map((msg) => {
                const isMe = msg.senderId === CURRENT_USER_ID
                return (
                  <div key={msg.id} className={cn('flex items-end gap-2', isMe && 'flex-row-reverse')}>
                    {!isMe && <Avatar name={activeConv.participantName} size="sm" />}
                    <div className={cn(
                      'max-w-[65%] px-4 py-2.5 rounded-2xl text-sm',
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    )}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={cn('text-[10px] mt-1', isMe ? 'text-blue-200 text-right' : 'text-gray-400')}>
                        {formatMsgTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-full bg-gray-50 outline-none focus:border-blue-400 focus:bg-white transition-all"
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0',
                  input.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400'
                )}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-1">Chọn một cuộc trò chuyện</p>
              <p className="text-sm">để bắt đầu nhắn tin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
