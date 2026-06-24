import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { Star } from 'lucide-react'

export function VoiceReviews() {
  const { dailyData } = useApp()
  const { reviews } = dailyData.customerVoice

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="评论详情" />

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card-elevated p-4 mb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-body-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                {review.platform}
              </span>
              <span className="text-body-sm text-gray-400">{review.date}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                />
              ))}
            </div>

            {/* Content */}
            <p className="text-body-sm text-gray-700 leading-relaxed mb-3">{review.content}</p>

            {/* Tags */}
            {review.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {review.tags.map((tag) => (
                  <span key={tag} className="text-caption bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
