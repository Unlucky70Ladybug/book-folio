type UnFollowButtonProps = {
  onClick: () => void
  isLoading?: boolean
}

// フォロー解除ボタン(フォロー中に表示)
// 通常は「フォロー中」と表示し、ホバー・フォーカス時に「フォロー解除」へ切り替えて誤操作を防ぐ
export default function UnFollowButton({ onClick, isLoading = false }: UnFollowButtonProps) {
  return (
    <button
      type="button"
      className="group btn btn-soft btn-primary btn-sm min-w-28 rounded-full border-primary/30 transition-colors hover:btn-error hover:border-error/40 focus-visible:btn-error focus-visible:border-error/40"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
      aria-label="フォロー解除"
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner loading-xs" />
          解除中
        </>
      ) : (
        <>
          {/* 通常時: チェックアイコン + フォロー中 */}
          <span className="inline-flex items-center gap-1 group-hover:hidden group-focus-visible:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clipRule="evenodd"
              />
            </svg>
            フォロー中
          </span>
          {/* ホバー・フォーカス時: バツアイコン + フォロー解除 */}
          <span className="hidden items-center gap-1 group-hover:inline-flex group-focus-visible:inline-flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
            フォロー解除
          </span>
        </>
      )}
    </button>
  )
}
