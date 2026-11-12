type FollowButtonProps = {
  onClick: () => void
  isLoading?: boolean
}

// フォローボタン(未フォロー時に表示)
export default function FollowButton({ onClick, isLoading = false }: FollowButtonProps) {
  return (
    <button
      type="button"
      className="btn btn-primary btn-sm min-w-28 rounded-full"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M10 5a.75.75 0 0 1 .75.75v3.5h3.5a.75.75 0 0 1 0 1.5h-3.5v3.5a.75.75 0 0 1-1.5 0v-3.5h-3.5a.75.75 0 0 1 0-1.5h3.5v-3.5A.75.75 0 0 1 10 5Z" />
        </svg>
      )}
      フォロー
    </button>
  )
}
