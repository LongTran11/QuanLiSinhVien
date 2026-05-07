import { useStudentStore, useGradeStore, useAppStore } from '../../store'
import { StatusBadge, GpaBadge } from '../../components/shared/StatusBadge'
import { Avatar } from '../../components/shared/Avatar'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell,
} from 'recharts'

export default function Stats() {
  const { students } = useStudentStore()
  const { gradeSummaries } = useGradeStore()
  const { currentClassId } = useAppStore()

  const classStudents = students.filter(s => s.classId === currentClassId)
  const summaries = gradeSummaries.filter(s =>
    classStudents.some(st => st.id === s.studentId)
  )

  const semesterTrend = [
    { name: 'HK1/23', gpa: 2.72, warned: 8, debt: 4 },
    { name: 'HK2/23', gpa: 2.88, warned: 7, debt: 3 },
    { name: 'HK1/24', gpa: 3.00, warned: 6, debt: 3 },
    { name: 'HK2/24', gpa: parseFloat((summaries.reduce((a, s) => a + s.gpa4, 0) / (summaries.length || 1)).toFixed(2)), warned: classStudents.filter(s => ['warn1','warn2','warn3'].includes(s.status)).length, debt: classStudents.filter(s => s.status === 'debt').length },
  ]

  const gpaRanges = [
    { range: 'Xuất sắc (3.6-4.0)', count: summaries.filter(s => s.gpa4 >= 3.6).length, fill: '#3b82f6' },
    { range: 'Giỏi (3.2-3.6)', count: summaries.filter(s => s.gpa4 >= 3.2 && s.gpa4 < 3.6).length, fill: '#22c55e' },
    { range: 'Khá (2.5-3.2)', count: summaries.filter(s => s.gpa4 >= 2.5 && s.gpa4 < 3.2).length, fill: '#84cc16' },
    { range: 'TB (2.0-2.5)', count: summaries.filter(s => s.gpa4 >= 2.0 && s.gpa4 < 2.5).length, fill: '#eab308' },
    { range: 'Yếu (<2.0)', count: summaries.filter(s => s.gpa4 < 2.0).length, fill: '#ef4444' },
  ]

  const warnStudents = classStudents
    .filter(s => ['warn1','warn2','warn3'].includes(s.status))
    .map(s => ({ ...s, summary: summaries.find(g => g.studentId === s.id) }))
    .sort((a, b) => (a.summary?.gpa4 ?? 0) - (b.summary?.gpa4 ?? 0))

  const topStudents = [...classStudents]
    .map(s => ({ ...s, summary: summaries.find(g => g.studentId === s.id) }))
    .sort((a, b) => (b.summary?.gpa4 ?? 0) - (a.summary?.gpa4 ?? 0))
    .slice(0, 5)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thống kê học vụ</h1>
        <p className="text-sm text-gray-500 mt-0.5">Lớp {currentClassId}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* GPA Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">GPA trung bình theo kỳ</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={semesterTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}`, 'GPA TB']} />
              <Line type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Warned trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Cảnh báo học vụ theo kỳ</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={semesterTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="warned" name="Cảnh báo" fill="#f97316" radius={[3, 3, 0, 0]} />
              <Bar dataKey="debt" name="Nợ HP" fill="#a855f7" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* GPA distribution pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Phân loại học lực</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={gpaRanges} cx="50%" cy="50%" outerRadius={65} dataKey="count">
                {gpaRanges.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} SV`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-1">
            {gpaRanges.map(r => (
              <div key={r.range} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.fill }} />
                  <span className="text-gray-600 truncate">{r.range.split(' ')[0]}</span>
                </div>
                <span className="font-medium text-gray-800">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top students */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Top 5 GPA cao nhất</h3>
          <div className="space-y-2.5">
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-500'}`}>
                  {i + 1}
                </span>
                <Avatar name={s.name} size="sm" />
                <span className="text-sm text-gray-800 flex-1 truncate">{s.name}</span>
                {s.summary && <GpaBadge gpa={s.summary.gpa4} />}
              </div>
            ))}
          </div>
        </div>

        {/* Warning detail */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">SV cần hỗ trợ</h3>
          {warnStudents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Không có 🎉</p>
          ) : (
            <div className="space-y-2.5">
              {warnStudents.slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={s.name} size="sm" />
                    <span className="text-sm text-gray-800 truncate">{s.name}</span>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full warning table */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Danh sách cảnh báo chi tiết</h3>
        {warnStudents.length === 0 ? (
          <p className="text-center py-6 text-sm text-gray-400">Không có sinh viên bị cảnh báo 🎉</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2.5 text-xs text-gray-500 font-semibold uppercase">Sinh viên</th>
                <th className="text-left px-3 py-2.5 text-xs text-gray-500 font-semibold uppercase">MSSV</th>
                <th className="text-right px-3 py-2.5 text-xs text-gray-500 font-semibold uppercase">GPA/4</th>
                <th className="text-right px-3 py-2.5 text-xs text-gray-500 font-semibold uppercase">TC tích lũy</th>
                <th className="text-left px-3 py-2.5 text-xs text-gray-500 font-semibold uppercase">Mức cảnh báo</th>
              </tr>
            </thead>
            <tbody>
              {warnStudents.map(s => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar name={s.name} size="sm" />
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500 font-mono">{s.id}</td>
                  <td className="px-3 py-2.5 text-right">
                    {s.summary ? <GpaBadge gpa={s.summary.gpa4} /> : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-700">{s.summary?.totalCredits ?? '—'}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
