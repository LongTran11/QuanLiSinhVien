import { useState, useEffect } from 'react'
import { useStudentStore, useAppStore } from '../../store'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { Avatar } from '../../components/shared/Avatar'
import { Search, Plus, Mail, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMessageStore } from '../../store'
import type { StudentStatus } from '../../types'

export default function Students() {
  const { students, fetchStudents, addStudent } = useStudentStore()
  const { currentClassId } = useAppStore()
  const { sendMessage } = useMessageStore()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StudentStatus | ''>('')
  const [showModal, setShowModal] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [showDetail, setShowDetail] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents({ classId: currentClassId, search, status: statusFilter })
  }, [currentClassId, search, statusFilter, fetchStudents])

  const detailStudent = showDetail ? students.find(s => s.id === showDetail) : null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liên lạc sinh viên</h1>
          <p className="text-sm text-gray-500 mt-0.5">Lớp {currentClassId} — {students.length} sinh viên</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Thêm sinh viên
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm tên, MSSV, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StudentStatus | '')}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-blue-400"
        >
          <option value="">Tất cả tình trạng</option>
          <option value="normal">Bình thường</option>
          <option value="warn1">Cảnh báo mức 1</option>
          <option value="warn2">Cảnh báo mức 2</option>
          <option value="warn3">Cảnh báo mức 3</option>
          <option value="debt">Nợ học phí</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sinh viên</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">MSSV</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">SĐT</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tình trạng</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size="sm" />
                    <button
                      className="font-medium text-sm text-gray-900 hover:text-blue-600 transition-colors"
                      onClick={() => setShowDetail(s.id)}
                    >
                      {s.name}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 font-mono">{s.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.phone}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { sendMessage(s.id, s.name, ''); navigate('/messages') }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      <Mail size={12} /> Nhắn tin
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-400">Không tìm thấy sinh viên nào trong lớp này</div>
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Thêm sinh viên vào lớp</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-gray-100"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-3">Nhập email sinh viên (mỗi dòng 1 email hoặc cách nhau bởi dấu phẩy)</p>
            <textarea
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="sv1@ut.edu.vn&#10;sv2@ut.edu.vn"
              className="w-full h-36 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-400 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Hủy</button>
              <button
                onClick={() => {
                  const emails = emailInput.split(/[\n,]/).map(e => e.trim()).filter(Boolean)
                  if (emails.length) {
                    // Gọi API tạo từng sinh viên
                    Promise.all(emails.map(email => 
                      addStudent({ email, name: email.split('@')[0], studentId: email.split('@')[0], classId: currentClassId })
                    )).then(() => {
                      setShowModal(false)
                      setEmailInput('')
                    })
                  }
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thêm {emailInput.split(/[\n,]/).filter(e => e.trim()).length} sinh viên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Thông tin sinh viên</h2>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="flex flex-col items-center mb-4">
              <Avatar name={detailStudent.name} size="lg" />
              <h3 className="font-semibold text-lg mt-2">{detailStudent.name}</h3>
              <p className="text-sm text-gray-500">{detailStudent.id}</p>
              <StatusBadge status={detailStudent.status} className="mt-2" />
            </div>
            <div className="space-y-2.5 text-sm">
              {[
                { label: 'Email', value: detailStudent.email },
                { label: 'SĐT', value: detailStudent.phone },
                { label: 'Ngày sinh', value: detailStudent.dob || '—' },
                { label: 'Địa chỉ', value: detailStudent.address || '—' },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="text-gray-900 font-medium">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { sendMessage(detailStudent.id, detailStudent.name, ''); navigate('/messages'); setShowDetail(null) }}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Mail size={14} /> Nhắn tin
              </button>
              <button onClick={() => setShowDetail(null)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
