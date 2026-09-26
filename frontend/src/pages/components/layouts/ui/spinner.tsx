type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const spinnerSize: Record<SpinnerSize, string> = {
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
  xl: 'loading-xl',
}

type SpinnerProps = {
  size?: SpinnerSize
  message?: string
}

// ローディング中に表示するスピナー
export default function Spinner({ size = 'lg', message }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-10"
    >
      <span className={`loading loading-spinner ${spinnerSize[size]} text-primary`} />
      <span className={message ? 'text-sm text-base-content/70' : 'sr-only'}>
        {message ?? '読み込み中'}
      </span>
    </div>
  )
}
