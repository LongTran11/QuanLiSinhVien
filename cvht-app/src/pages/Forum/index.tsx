import { useState } from 'react'
import { useForumStore, useAppStore } from '../../store'
import { Avatar } from '../../components/shared/Avatar'
import { formatTime } from '../../lib/utils'
import { Heart, MessageSquare, Send } from 'lucide-react'
import { cn } from '../../lib/utils'

const CURRENT_USER_ID = 'cvht001'
const CURRENT_USER_NAME = 'TRẦN ĐỨC LONG'

export default function Forum() {
  const { posts, addPost, likePost, addComment } = useForumStore()
  const { currentClassId } = useAppStore()
  const [content, setContent] = useState('')
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})

  const classPosts = posts.filter(p => p.classId === currentClassId)

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      return next
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Diễn đàn lớp</h1>
        <p className="text-sm text-gray-500 mt-0.5">{currentClassId}</p>
      </div>

      {/* Post composer */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
        <div className="flex gap-3">
          <Avatar name={CURRENT_USER_NAME} />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Đăng thông báo, tài liệu, câu hỏi lên diễn đàn lớp..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-400 resize-none min-h-[80px] transition-colors"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2">
                <span className="text-xs text-gray-400 bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">Cố vấn học tập</span>
              </div>
              <button
                onClick={() => { if (content.trim()) { addPost(content.trim()); setContent('') } }}
                disabled={!content.trim()}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  content.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                <Send size={14} /> Đăng bài
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {classPosts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p>Chưa có bài đăng nào trong lớp này</p>
          </div>
        )}
        {classPosts.map(post => {
          const isLiked = post.likes.includes(CURRENT_USER_ID)
          const showComments = expandedComments.has(post.id)
          return (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-4">
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={post.authorName} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900">{post.authorName}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      post.authorRole === 'cvht'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    )}>
                      {post.authorRole === 'cvht' ? 'Cố vấn học tập' : 'Sinh viên'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{formatTime(post.createdAt)}</p>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => likePost(post.id, CURRENT_USER_ID)}
                  className={cn(
                    'flex items-center gap-1.5 text-sm transition-colors',
                    isLiked ? 'text-red-500 font-medium' : 'text-gray-500 hover:text-red-400'
                  )}
                >
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                  {post.likes.length}
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <MessageSquare size={16} />
                  {post.comments.length} bình luận
                </button>
              </div>

              {/* Comments */}
              {showComments && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                  {post.comments.map(c => (
                    <div key={c.id} className="flex gap-2.5">
                      <Avatar name={c.authorName} size="sm" />
                      <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-gray-700">{c.authorName}</span>
                          <span className="text-xs text-gray-400">{formatTime(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{c.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Comment input */}
                  <div className="flex gap-2.5 mt-2">
                    <Avatar name={CURRENT_USER_NAME} size="sm" />
                    <div className="flex-1 flex gap-2">
                      <input
                        value={commentInputs[post.id] || ''}
                        onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Viết bình luận..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && commentInputs[post.id]?.trim()) {
                            addComment(post.id, CURRENT_USER_ID, CURRENT_USER_NAME, commentInputs[post.id].trim())
                            setCommentInputs(prev => ({ ...prev, [post.id]: '' }))
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (commentInputs[post.id]?.trim()) {
                            addComment(post.id, CURRENT_USER_ID, CURRENT_USER_NAME, commentInputs[post.id].trim())
                            setCommentInputs(prev => ({ ...prev, [post.id]: '' }))
                          }
                        }}
                        className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
