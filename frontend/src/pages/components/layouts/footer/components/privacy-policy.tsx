import { type RefObject } from 'react'

type Props = {
  dialogRef: RefObject<HTMLDialogElement | null>
}

export default function PrivacyPolicyModal({ dialogRef }: Props) {
  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box flex h-[95vh] max-h-[95vh] max-w-2xl flex-col">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            aria-label="閉じる"
          >
            ✕
          </button>
        </form>

        <h3 className="text-lg font-bold">プライバシーポリシー</h3>

        <div className="mt-4 flex-1 space-y-6 overflow-y-auto pr-2 text-sm leading-loose">
          <p>
            BookFolio（以下、「当サービス」）は、本ウェブサイト上で提供するサービスにおける、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」）を定めます。
          </p>

          <section>
            <h4 className="mb-2 font-bold">第1条（取得する情報）</h4>
            <p>
              当サービスは、ユーザーが利用登録をする際に氏名、メールアドレスなどの個人情報をお尋ねすることがあります。
            </p>
          </section>

          <section>
            <h4 className="mb-2 font-bold">第2条（利用目的）</h4>
            <p>当サービスが個人情報を収集・利用する目的は、以下のとおりです。</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>当サービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに回答するため</li>
              <li>上記の利用目的に付随する目的</li>
            </ul>
          </section>

          <section>
            <h4 className="mb-2 font-bold">第3条（第三者提供の禁止）</h4>
            <p>
              当サービスは、法令に基づく場合を除き、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。
            </p>
          </section>
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-primary">閉じる</button>
          </form>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button aria-label="閉じる">close</button>
      </form>
    </dialog>
  )
}
