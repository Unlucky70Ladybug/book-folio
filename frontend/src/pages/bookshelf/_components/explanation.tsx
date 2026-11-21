import { useRef, useEffect, useState } from 'react'
import { explanationStorage } from '../_utils/explanation-storage'
import searchDemo from '../../../assets/explanation/検索.mp4'
import searchRegistrationDemo from '../../../assets/explanation/登録.mp4'
import searchResult from '../../../assets/explanation/本の初回追加結果.png'

type Slide = {
  type: 'video' | 'image'
  src: string
  title: string
  description: string
}

// 説明スライドの内容(文章はテスト用)
const slides: Slide[] = [
  {
    type: 'video',
    src: searchDemo,
    title: '本を検索する',
    description: '左上の検索バーでタイトルや著者名を入力すると、登録したい本を探すことができます。',
  },
  {
    type: 'video',
    src: searchRegistrationDemo,
    title: '本棚に登録する',
    description:
      '検索結果から本を選び、読書状況・ジャンルを選択し登録ボタンを押すと本棚に追加されます。',
  },
  {
    type: 'image',
    src: searchResult,
    title: '本棚を確認する',
    description: '登録した本は、本棚に並びます。さっそく最初の一冊を追加してみましょう!',
  },
]

type ExplanationProps = {
  bookshelvesLength: number
}

const Explanation = ({ bookshelvesLength }: ExplanationProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null) // スライド全体
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  // ゲストログイン: 必ず表示 / 通常ログイン: 本棚に本が1冊もないときだけ表示
  const [isOpen, setIsOpen] = useState(
    () => explanationStorage.isGuest() || (explanationStorage.isShown() && bookshelvesLength === 0),
  )
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal()
  }, [isOpen])

  // 表示中のスライドの動画だけを最初から自動再生し、他は停止する
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === current) {
        // 動画を最初から再生する
        video.currentTime = 0
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [current, isOpen])

  const handleClose = () => {
    explanationStorage.dismiss()
    setIsOpen(false)
  }

  // 指定したスライドまで横スライドさせる(URLのハッシュは変えない)
  const goTo = (index: number) => {
    const carousel = carouselRef.current
    if (!carousel) return
    const next = (index + slides.length) % slides.length
    carousel.scrollTo({ left: carousel.clientWidth * next, behavior: 'smooth' })
  }

  // スワイプ操作も含め、スクロール位置から現在のスライドを判定する
  const handleScroll = () => {
    const carousel = carouselRef.current
    if (!carousel) return
    const index = Math.round(carousel.scrollLeft / carousel.clientWidth)
    if (index !== current) setCurrent(index)
  }

  if (!isOpen) return null

  return (
    <dialog ref={dialogRef} className="modal" onClose={handleClose}>
      <div className="modal-box w-11/12 max-w-5xl p-3 sm:p-4">
        {/* 進捗(ステップ)と閉じるボタン */}
        <div className="mb-2 flex items-center gap-2">
          <ul className="steps flex-1">
            {slides.map((slide, i) => (
              <li
                key={slide.title}
                className={`step cursor-pointer text-xs sm:text-sm ${i <= current ? 'step-primary' : ''}`}
                onClick={() => goTo(i)}
              >
                {slide.title}
              </li>
            ))}
          </ul>
          <form method="dialog">
            <button className="btn" aria-label="説明を閉じる">
              ✕ 閉じる
            </button>
          </form>
        </div>

        <div ref={carouselRef} className="carousel w-full" onScroll={handleScroll}>
          {slides.map((slide, i) => (
            <div key={slide.title} className="carousel-item w-full flex-col items-center gap-2">
              {/* 説明文(メディアの上) */}
              <div role="note" className="w-full rounded-box bg-base-200 px-4 py-2 text-center">
                <p>{slide.description}</p>
              </div>

              {/* 動画・画像(中央配置) + 前後ボタン */}
              <div className="relative flex h-[65vh] w-full items-center justify-center">
                {slide.type === 'video' ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el
                    }}
                    className="max-h-full w-auto max-w-full rounded-box bg-base-200"
                    controls
                    playsInline
                    muted
                    autoPlay={i === 0}
                    loop
                  >
                    <source src={slide.src} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="max-h-full w-auto max-w-full rounded-box object-contain"
                  />
                )}
                <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 justify-between">
                  <button
                    type="button"
                    className="btn btn-circle"
                    onClick={() => goTo(i - 1)}
                    aria-label="前のスライド"
                  >
                    ❮
                  </button>
                  <button
                    type="button"
                    className="btn btn-circle"
                    onClick={() => goTo(i + 1)}
                    aria-label="次のスライド"
                  >
                    ❯
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 背景クリックで閉じる(onCloseが呼ばれる) */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default Explanation
