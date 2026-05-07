import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api'
import { saveAuth } from '../../lib/auth'
import { BookOpen, Lock, Mail, AlertCircle } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('cvht001@ut.edu.vn')
  const [password, setPassword] = useState('cvht123456')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await authApi.login(email, password) as { token: string; user: unknown }
      saveAuth(res.token, res.user)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">EduManager</h1>
          <p className="text-gray-500 mt-1">Hệ thống Quản lý Sinh viên CVHT</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Đăng nhập</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all"
                  placeholder="email@ut.edu.vn" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all"
                  placeholder="••••••••" />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm">
                <AlertCircle size={15} /> {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Tài khoản demo (sau khi seed):</p>
            {[
              { label: '👨‍🏫 CVHT', e: 'cvht001@ut.edu.vn', p: 'cvht123456' },
              { label: '🎓 Sinh viên', e: '22020001@ut.edu.vn', p: '22020001' },
            ].map(acc => (
              <button key={acc.e} onClick={() => { setEmail(acc.e); setPassword(acc.p) }}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-xs transition-colors flex items-center justify-between mb-1.5">
                <span className="font-medium">{acc.label}</span>
                <span className="text-gray-400 font-mono">{acc.e}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
