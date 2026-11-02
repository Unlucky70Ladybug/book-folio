import { useRef } from 'react'
import { Link } from 'react-router-dom'
import TermsOfServiceModal from './components/terms-of-service'
import PrivacyPolicyModal from './components/privacy-policy'

const Footer = () => {
  const TermsOfServiceRef = useRef<HTMLDialogElement>(null)
  const PrivacyPolicyRef = useRef<HTMLDialogElement>(null)

  return (
    <footer className="flex w-full items-center justify-between bg-base-100 border-t border-base-300 px-4 sm:px-8 py-4">
      {/* 左端 */}
      <div>
        <Link to="/" className="text-lg font-medium tracking-wide text-primary">
          BookFolio
        </Link>
      </div>

      {/* 右端 */}
      <div className="flex items-center gap-4">
        {/* Rakuten Web Services Attribution Snippet FROM HERE */}
        <a href="https://developers.rakuten.com/" target="_blank">
          Supported by Rakuten Developers
        </a>
        {/* Rakuten Web Services Attribution Snippet FROM HERE */}

        <button
          type="button"
          className="link link-hover link-primary text-sm"
          onClick={() => TermsOfServiceRef.current?.showModal()}
        >
          利用規約
        </button>
        <TermsOfServiceModal dialogRef={TermsOfServiceRef} />

        <button
          type="button"
          className="link link-hover link-primary text-sm"
          onClick={() => PrivacyPolicyRef.current?.showModal()}
        >
          プライバシーポリシー
        </button>
        <PrivacyPolicyModal dialogRef={PrivacyPolicyRef} />
      </div>
    </footer>
  )
}

export default Footer
