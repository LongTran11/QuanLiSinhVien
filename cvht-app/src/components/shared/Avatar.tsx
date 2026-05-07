import { getInitials, cn } from '../../lib/utils'

const colors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
]

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const colorIndex = name.charCodeAt(0) % colors.length
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-[10px]'
    : size === 'lg' ? 'w-12 h-12 text-base'
    : 'w-9 h-9 text-xs'

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-semibold shrink-0',
      sizeClass,
      colors[colorIndex],
      className
    )}>
      {getInitials(name)}
    </div>
  )
}
