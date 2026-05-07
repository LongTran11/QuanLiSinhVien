import { Bell, Search } from 'lucide-react'
import { useNotifStore } from '../../store'
import { useState } from 'react'
import { getInitials, formatTime } from '../../lib/utils'
import { currentUser } from '../../lib/mockData'
import { cn } from '../../lib/utils'
import { useNavigate } from 'react-router-dom'

export function Topbar() {
  const { notifications, markAllRead, markRead } = useNotifStore()
  const [showNotif, setShowNotif] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length
  const navigate = useNavigate()

  const notifIcon: Record<string, string> = {
    message: '💬',
    forum: '📢',
    grade: '📊',
    system: '🔔',
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 z-50">
      {/* Logo */}
      <div className="text-blue-600 font-bold text-lg tracking-tight w-60 shrink-0">
        📚 EduManager
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sinh viên, MSSV, email..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-100 rounded-full border border-transparent focus:border-blue-300 focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotif(v => !v); if (showNotif) markAllRead() }}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Bell size={18} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>
        {showNotif && (
          <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-semibold text-sm">Thông báo</span>
              <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Đọc tất cả</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => { markRead(n.id); if (n.link) navigate(n.link); setShowNotif(false) }}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors',
                    !n.read && 'bg-blue-50'
                  )}
                >
                  <span className="text-lg shrink-0">{notifIcon[n.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">{n.content}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatTime(n.createdAt)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
          {getInitials(currentUser.name)}
        </div>
        <div>
          <p className="text-sm font-medium leading-none text-gray-900">{currentUser.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">Cố vấn học tập</p>
        </div>
      </div>
    </header>
  )
}
