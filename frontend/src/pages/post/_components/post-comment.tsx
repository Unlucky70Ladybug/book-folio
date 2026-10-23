import { useLayoutEffect, useRef, useState } from 'react'

type PostCommentProps = {
  content: string
  hasSpoiler: boolean
}

// 他のユーザーのコメント本文。ネタバレはぼかし、長文は折りたたんで表示する
export const PostComment = ({ content, hasSpoiler }: PostCommentProps) => {
  const [isRevealed, setIsRevealed] = useState(!hasSpoiler)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  // 折りたたんだ状態で本文がはみ出しているときだけ「つづきを読む」を出す
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el || isExpanded) return

    const measure = () => setIsOverflowing(el.scrollHeight > el.clientHeight)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [content, isExpanded])

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="relative w-full">
        <p
          ref={textRef}
          className={`text-sm break-words whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-4'} ${
            isRevealed ? '' : 'pointer-events-none blur-sm select-none'
          }`}
          aria-hidden={!isRevealed}
        >
          {content}
        </p>

        {!isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              className="btn btn-xs btn-warning btn-soft"
              onClick={() => setIsRevealed(true)}
            >
              ネタバレを含むコメントを表示する
            </button>
          </div>
        )}
      </div>

      {isRevealed && isOverflowing && !isExpanded && (
        <button
          type="button"
          className="btn btn-link btn-xs px-0"
          onClick={() => setIsExpanded(true)}
        >
          つづきを読む
        </button>
      )}
    </div>
  )
}
