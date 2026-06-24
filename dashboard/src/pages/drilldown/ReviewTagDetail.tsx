import { useParams } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { DrillDownHeader } from '@/components/DrillDownHeader'

export function ReviewTagDetail() {
  const { tag } = useParams<{ tag: string }>()
  const { dailyData } = useApp()
  const { reviewTags } = dailyData.customerVoice

  const decodedTag = decodeURIComponent(tag || '')
  const tagData = reviewTags.find(t => t.tag === decodedTag)
  const tagReviews = tagData?.reviews || []

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader
        title={`"${decodedTag}" 评价详情`}
      />

      {/* Review Details List */}
      {tagReviews.length > 0 && (
        <div className="space-y-4">
          {tagReviews.map((review, idx) => (
            <div key={idx} className="card-elevated p-4 mb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="card-title">{review.username}</div>
                  <div className="metric-label mt-0.5">{review.date}</div>
                </div>
                <div className="text-caption text-gray-600 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                  {review.platform}
                </div>
              </div>
              <div className="text-body-sm text-gray-700 leading-relaxed">{review.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
