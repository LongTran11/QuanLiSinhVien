import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { StudentStatus } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(-2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN')
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} ngày trước`
  return formatDate(iso)
}

export function statusLabel(status: StudentStatus): string {
  switch (status) {
    case 'normal': return 'Bình thường'
    case 'warn1': return 'Cảnh báo mức 1'
    case 'warn2': return 'Cảnh báo mức 2'
    case 'warn3': return 'Cảnh báo mức 3'
    case 'debt': return 'Nợ học phí'
    case 'suspended': return 'Đình chỉ'
    default: return ''
  }
}

export function statusColor(status: StudentStatus): string {
  switch (status) {
    case 'normal': return 'bg-green-100 text-green-800'
    case 'warn1': return 'bg-yellow-100 text-yellow-800'
    case 'warn2': return 'bg-orange-100 text-orange-800'
    case 'warn3': return 'bg-red-100 text-red-800'
    case 'debt': return 'bg-purple-100 text-purple-800'
    case 'suspended': return 'bg-gray-200 text-gray-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export function gpaColor(gpa: number): string {
  if (gpa >= 3.5) return 'text-green-600 font-semibold'
  if (gpa >= 2.5) return 'text-blue-600 font-semibold'
  if (gpa >= 2.0) return 'text-yellow-600 font-semibold'
  if (gpa >= 1.0) return 'text-orange-600 font-semibold'
  return 'text-red-600 font-semibold'
}

export function score10to4(s: number): number {
  if (s >= 9.0) return 4.0
  if (s >= 8.5) return 3.7
  if (s >= 8.0) return 3.5
  if (s >= 7.5) return 3.2
  if (s >= 7.0) return 3.0
  if (s >= 6.5) return 2.5
  if (s >= 6.0) return 2.0
  if (s >= 5.5) return 1.5
  if (s >= 5.0) return 1.0
  return 0.0
}
