import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, MessageCircle, Mail, BarChart2, Database, ChevronDown, LogOut } from 'lucide-react'
import { useAppStore } from '../../store'
import { cn } from '../../lib/utils'
import { useState } from 'react'
import { clearAuth } from '../../lib/auth'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/contacts', label: 'Liên lạc', icon: Users },
  { to: '/grades', label: 'Bảng điểm', icon: BookOpen },
  { to: '/forum', label: 'Diễn đàn', icon: MessageCircle },
  { to: '/messages', label: 'Nhắn tin', icon: Mail },
  { to: '/stats', label: 'Thống kê', icon: BarChart2 },
  { to: '/admin', label: 'Quản lý CSDL', icon: Database },
]

export function Sidebar() {
  const navigate = useNavigate()
  const { currentClassId, setCurrentClassId, classes, addClass } = useAppStore()
  const [showClassMenu, setShowClassMenu] = useState(false)
  const [newClass, setNewClass] = useState('')

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-60 bg-white border-r border-gray-200 flex flex-col z-40 overflow-y-auto">
      {/* ... (phần Class selector giữ nguyên) ... */}
      <div className="p-3 border-b border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 px-2">Lớp quản lý</p>
        <button
          onClick={() => setShowClassMenu(v => !v)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <span>{currentClassId}</span>
          <ChevronDown size={14} className={cn('transition-transform', showClassMenu && 'rotate-180')} />
        </button>
        {showClassMenu && (
          <div className="mt-1 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            {classes.map(c => (
              <button
                key={c.id}
                onClick={() => { setCurrentClassId(c.id); setShowClassMenu(false) }}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-50',
                  c.id === currentClassId ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
                )}
              >
                {c.name}
              </button>
            ))}
            <div className="border-t border-gray-100 p-2 flex gap-2">
              <input
                value={newClass}
                onChange={e => setNewClass(e.target.value)}
                placeholder="Tên lớp mới..."
                className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-400"
                onKeyDown={e => {
                  if (e.key === 'Enter' && newClass.trim()) {
                    addClass(newClass.trim())
                    setNewClass('')
                  }
                }}
              />
              <button
                onClick={() => { if (newClass.trim()) { addClass(newClass.trim()); setNewClass('') } }}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Tạo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
