import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div>
      <h1>404 - ページが見つかりません</h1>
      <p>お探しのページは存在しません。</p>
      <Link to="/">ホームに戻る</Link>
    </div>
  )
}

export default NotFound
