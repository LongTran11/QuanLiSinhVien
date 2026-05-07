import { useState } from 'react'
import { useStudentStore, useGradeStore, useAppStore } from '../../store'
import { StatusBadge, GpaBadge } from '../../components/shared/StatusBadge'
import { Avatar } from '../../components/shared/Avatar'
import { subjects, semesters } from '../../lib/mockData'
import { gpaColor } from '../../lib/utils'
import { X, Download } from 'lucide-react'

export default function Grades() {
  const { students } = useStudentStore()
  const { gradeSummaries, gradeEntries } = useGradeStore()
  const { currentClassId, currentSemesterId, setCurrentSemesterId } = useAppStore()
  const [detailId, setDetailId] = useState<string | null>(null)

  const classStudents = students.filter(s => s.classId === currentClassId)
  const summaries = gradeSummaries.filter(s =>
    classStudents.some(st => st.id === s.studentId)
  )

  const total = summaries.length
  const below2 = summaries.filter(s => s.gpa4 < 2).length
  const above35 = summaries.filter(s => s.gpa4 >= 3.5).length
  const avgGpa = total ? (summaries.reduce((a, s) => a + s.gpa4, 0) / total).toFixed(2) : '0.00'

  const detailStudent = detailId ? classStudents.find(s => s.id === detailId) : null
  const detailEntries = detailId ? gradeEntries.filter(g => g.studentId === detailId) : []

  const handleExport = () => {
    const rows = [
      ['MSSV', 'Tên sinh viên', 'GPA/4', 'GPA/10', 'Tín chỉ', 'Tình trạng'],
      ...classStudents.map(s => {
        const sum = summaries.find(g => g.studentId === s.id)
        return [s.id, s.name, sum?.gpa4.toFixed(2) ?? '', sum?.gpa10.toFixed(2) ?? '', sum?.totalCredits ?? '', s.status]
      })
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `bang_diem_${currentClassId}_${currentSemesterId}.csv`
    a.click()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng điểm</h1>
          <p className="text-sm text-gray-500 mt-0.5">Lớp {currentClassId}</p>
        </div>
        <div className="flex gap-3">
          <select
            value={currentSemesterId}
            onChange={e => setCurrentSemesterId(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-blue-400"
          >
            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Download size={16} /> Xuất CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Đã có điểm', value: total, color: 'text-gray-900' },
          { label: 'GPA dưới 2.0', value: below2, color: 'text-red-600' },
          { label: 'GPA trên 3.5', value: above35, color: 'text-green-600' },
          { label: 'GPA TB lớp', value: avgGpa, color: 'text-blue-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sinh viên</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">MSSV</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">TC tích lũy</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">GPA/4</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">GPA/10</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tình trạng</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
            </tr>
          </thead>
          <tbody>
            {classStudents.map((s, i) => {
              const sum = summaries.find(g => g.studentId === s.id)
              return (
                <tr key={s.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size="sm" />
                      <span className="font-medium text-sm text-gray-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{s.id}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{sum?.totalCredits ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    {sum ? <GpaBadge gpa={sum.gpa4} /> : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{sum ? sum.gpa10.toFixed(2) : '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDetailId(s.id)}
                      className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Grade Detail Modal */}
      {detailStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar name={detailStudent.name} />
                <div>
                  <h2 className="font-semibold text-base">{detailStudent.name}</h2>
                  <p className="text-xs text-gray-400">{detailStudent.id} — {semesters.find(s => s.id === currentSemesterId)?.name}</p>
                </div>
              </div>
              <button onClick={() => setDetailId(null)} className="p-1 rounded hover:bg-gray-100"><X size={18} /></button>
            </div>

            {/* Summary bar */}
            {(() => {
              const sum = summaries.find(g => g.studentId === detailStudent.id)
              return sum ? (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">GPA/4</p>
                    <p className={`text-xl font-bold ${gpaColor(sum.gpa4)}`}>{sum.gpa4.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">GPA/10</p>
                    <p className="text-xl font-bold text-gray-900">{sum.gpa10.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Tín chỉ</p>
                    <p className="text-xl font-bold text-gray-900">{sum.totalCredits}</p>
                  </div>
                </div>
              ) : null
            })()}

            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 rounded-lg">
                  <th className="text-left px-3 py-2 text-xs text-gray-500 font-semibold">Môn học</th>
                  <th className="text-right px-3 py-2 text-xs text-gray-500 font-semibold">TC</th>
                  <th className="text-right px-3 py-2 text-xs text-gray-500 font-semibold">Điểm/10</th>
                  <th className="text-right px-3 py-2 text-xs text-gray-500 font-semibold">Điểm/4</th>
                  <th className="text-right px-3 py-2 text-xs text-gray-500 font-semibold">Hạng</th>
                </tr>
              </thead>
              <tbody>
                {detailEntries.map(entry => {
                  const subj = subjects.find(s => s.id === entry.subjectId)
                  return subj ? (
                    <tr key={entry.subjectId} className="border-t border-gray-100">
                      <td className="px-3 py-2">{subj.name}</td>
                      <td className="px-3 py-2 text-right text-gray-500">{subj.credits}</td>
                      <td className="px-3 py-2 text-right font-medium">{entry.score10.toFixed(1)}</td>
                      <td className={`px-3 py-2 text-right font-bold ${gpaColor(entry.score4)}`}>{entry.score4.toFixed(1)}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${entry.score10 >= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {entry.letterGrade}
                        </span>
                      </td>
                    </tr>
                  ) : null
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
