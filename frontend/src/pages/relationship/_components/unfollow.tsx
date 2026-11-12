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
      className="group btn btn-outline btn-sm min-w-28 rounded-full hover:btn-error focus-visible:btn-error"
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
          <span className="group-hover:hidden group-focus-visible:hidden">フォロー中</span>
          <span className="hidden group-hover:inline group-focus-visible:inline">フォロー解除</span>
        </>
      )}
    </button>
  )
}
