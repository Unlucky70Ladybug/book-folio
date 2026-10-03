type IconProps = { className?: string }

// 文字の「+」「✕」はフォント次第で中心からズレるため、SVGで描く
export const PlusIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const CloseIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
