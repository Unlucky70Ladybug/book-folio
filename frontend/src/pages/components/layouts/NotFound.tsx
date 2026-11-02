import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="hero min-h-[60vh] bg-base-100">
      <div className="hero-content w-full text-center">
        <div className="w-full max-w-3xl">
          <p className="text-8xl font-bold text-primary">404</p>
          <h1 className="mt-4 text-2xl font-bold">ページが見つかりません</h1>
          <p className="pt-2 pb-6 text-base-content/70">
            お探しのページは存在しないか、移動または削除された可能性があります。
            <br />
            URLに間違いがないかご確認ください。
          </p>
          <Link to="/" className="btn btn-primary">
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
