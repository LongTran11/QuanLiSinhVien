import { useState, useRef } from 'react'
import { useStudentStore, useGradeStore } from '../../store'
import { Upload, CheckCircle2, AlertCircle, FileText, Users, BookOpen, Calendar } from 'lucide-react'
import { cn } from '../../lib/utils'

interface LogEntry {
  type: 'success' | 'error' | 'info'
  message: string
  time: string
}

export default function Admin() {
  const { students } = useStudentStore()
  const { gradeEntries } = useGradeStore()
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'success', message: 'Đã tải dữ liệu mẫu: 15 sinh viên lớp K23-CNTT-01', time: 'Hôm nay 08:00' },
    { type: 'success', message: 'Điểm HK2/2024 đã được cập nhật (150 entries)', time: 'Hôm nay 08:01' },
    { type: 'info', message: 'Hệ thống sẵn sàng', time: 'Hôm nay 08:02' },
  ])

  const ref1 = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const ref3 = useRef<HTMLInputElement>(null)
  const ref4 = useRef<HTMLInputElement>(null)

  const addLog = (type: LogEntry['type'], message: string) => {
    setLogs(prev => [{ type, message, time: new Date().toLocaleTimeString('vi-VN') }, ...prev])
  }

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.split('\n').filter(Boolean)
      addLog('success', `Upload ${type}: "${file.name}" — đọc được ${lines.length} dòng`)
    }
    reader.onerror = () => addLog('error', `Lỗi đọc file ${file.name}`)
    reader.readAsText(file)
    e.target.value = ''
  }

  const uploadCards = [
    { ref: ref1, icon: Users,     title: 'Danh sách sinh viên', desc: 'CSV: MSSV, Họ tên, Email, SĐT, Ngày sinh, Địa chỉ', type: 'Sinh viên', color: 'blue' },
    { ref: ref2, icon: BookOpen,  title: 'Bảng điểm',           desc: 'CSV: MSSV, Mã môn, Học kỳ, Điểm 10, Điểm 4',      type: 'Bảng điểm', color: 'green' },
    { ref: ref3, icon: Calendar,  title: 'Danh sách học kỳ',    desc: 'CSV: Mã HK, Tên HK, Ngày bắt đầu, Ngày kết thúc', type: 'Học kỳ',    color: 'purple' },
    { ref: ref4, icon: FileText,  title: 'Danh sách môn học',   desc: 'CSV: Mã môn, Tên môn, Số tín chỉ, Khoa',           type: 'Môn học',   color: 'orange' },
  ]

  const colorMap: Record<string, string> = {
    blue:   'bg-blue-50   text-blue-600   border-blue-200',
    green:  'bg-green-50  text-green-600  border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý cơ sở dữ liệu</h1>
        <p className="text-sm text-gray-500 mt-0.5">Import, export và quản lý dữ liệu hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Tổng sinh viên</p>
          <p className="text-3xl font-bold text-gray-900">{students.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Bản ghi điểm</p>
          <p className="text-3xl font-bold text-blue-600">{gradeEntries.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-semibold text-green-600">Hệ thống ổn định</p>
          </div>
        </div>
      </div>

      {/* Upload cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {uploadCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.type} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className={cn('p-3 rounded-xl border', colorMap[card.color])}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 mb-0.5">{card.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{card.desc}</p>
                  <input
                    ref={card.ref}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={e => handleCSV(e, card.type)}
                  />
                  <button
                    onClick={() => card.ref.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={13} /> Upload CSV
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* CSV format guide */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Định dạng file CSV mẫu</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1.5">users_student.csv</p>
            <pre className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono overflow-x-auto">{`MSSV,Ho_ten,Email,SDT,Ngay_sinh\n22020001,Nguyen Van An,sv@ut.edu.vn,...`}</pre>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1.5">scores.csv</p>
            <pre className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono overflow-x-auto">{`MSSV,Ma_mon,Hoc_ky,Diem_10\n22020001,INT1001,HK1-2024,8.5`}</pre>
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-gray-700">Log hoạt động</h3>
          <button onClick={() => setLogs([])} className="text-xs text-gray-400 hover:text-gray-600">Xóa log</button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm">
              {log.type === 'success' && <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />}
              {log.type === 'error'   && <AlertCircle  size={14} className="text-red-500   mt-0.5 shrink-0" />}
              {log.type === 'info'    && <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 mt-0.5 shrink-0" />}
              <span className={cn('flex-1', log.type === 'success' ? 'text-green-700' : log.type === 'error' ? 'text-red-700' : 'text-gray-500')}>
                {log.message}
              </span>
              <span className="text-xs text-gray-400 shrink-0">{log.time}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Chưa có log nào</p>}
        </div>
      </div>
    </div>
  )
}
