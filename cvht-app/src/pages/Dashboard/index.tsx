import { useStudentStore, useGradeStore, useAppStore } from '../../store'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { Avatar } from '../../components/shared/Avatar'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const { students } = useStudentStore()
  const { gradeSummaries } = useGradeStore()
  const { currentClassId } = useAppStore()

  const classStudents = students.filter(s => s.classId === currentClassId)
  const classSummaries = gradeSummaries.filter(s =>
    classStudents.some(st => st.id === s.studentId)
  )

  const total = classStudents.length
  const warned = classStudents.filter(s => ['warn1','warn2','warn3'].includes(s.status)).length
  const debt = classStudents.filter(s => s.status === 'debt').length
  const avgGpa = classSummaries.length
    ? (classSummaries.reduce((a, s) => a + s.gpa4, 0) / classSummaries.length).toFixed(2)
    : '0.00'

  const gpaDistribution = [
    { range: '<1.0', count: classSummaries.filter(s => s.gpa4 < 1).length, fill: '#ef4444' },
    { range: '1.0-2.0', count: classSummaries.filter(s => s.gpa4 >= 1 && s.gpa4 < 2).length, fill: '#f97316' },
    { range: '2.0-2.5', count: classSummaries.filter(s => s.gpa4 >= 2 && s.gpa4 < 2.5).length, fill: '#eab308' },
    { range: '2.5-3.0', count: classSummaries.filter(s => s.gpa4 >= 2.5 && s.gpa4 < 3).length, fill: '#84cc16' },
    { range: '3.0-3.5', count: classSummaries.filter(s => s.gpa4 >= 3 && s.gpa4 < 3.5).length, fill: '#22c55e' },
    { range: '3.5-4.0', count: classSummaries.filter(s => s.gpa4 >= 3.5).length, fill: '#3b82f6' },
  ]

  const statusPie = [
    { name: 'Bình thường', value: classStudents.filter(s => s.status === 'normal').length, fill: '#22c55e' },
    { name: 'Cảnh báo', value: warned, fill: '#f97316' },
    { name: 'Nợ học phí', value: debt, fill: '#a855f7' },
  ].filter(d => d.value > 0)

  const warnStudents = classStudents
    .filter(s => ['warn1','warn2','warn3'].includes(s.status))
    .map(s => ({ ...s, summary: classSummaries.find(gs => gs.studentId === s.id) }))
    .sort((a, b) => (a.summary?.gpa4 ?? 0) - (b.summary?.gpa4 ?? 0))

  const semesterGpa = [
    { name: 'HK1/23', gpa: 2.72 },
    { name: 'HK2/23', gpa: 2.88 },
    { name: 'HK1/24', gpa: 3.00 },
    { name: 'HK2/24', gpa: parseFloat(avgGpa) },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Lớp {currentClassId} — HK2/2024</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Sĩ số', value: total, sub: 'sinh viên', color: 'text-gray-900' },
          { label: 'Cảnh báo học vụ', value: warned, sub: 'sinh viên', color: 'text-orange-600' },
          { label: 'Nợ học phí', value: debt, sub: 'sinh viên', color: 'text-purple-600' },
          { label: 'GPA trung bình', value: avgGpa, sub: 'thang 4', color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Phân bố GPA</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={gpaDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v} sinh viên`]} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {gpaDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Tình trạng SV</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusPie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                {statusPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} SV`, n]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* GPA trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">GPA theo kỳ</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={semesterGpa} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}`, 'GPA']} />
              <Bar dataKey="gpa" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Warning list */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Cảnh báo học vụ</h3>
          {warnStudents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Không có sinh viên cảnh báo 🎉</p>
          ) : (
            <div className="space-y-3">
              {warnStudents.map(s => (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.summary && (
                      <span className="text-sm font-bold text-red-600">{s.summary.gpa4.toFixed(2)}</span>
                    )}
                    <StatusBadge status={s.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
