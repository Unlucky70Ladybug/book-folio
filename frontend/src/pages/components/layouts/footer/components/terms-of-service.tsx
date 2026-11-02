import { type RefObject } from 'react'

type Props = {
  dialogRef: RefObject<HTMLDialogElement | null>
}

export default function TermsOfServiceModal({ dialogRef }: Props) {
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

        <h3 className="text-lg font-bold">利用規約</h3>

        <div className="mt-4 flex-1 space-y-6 overflow-y-auto pr-2 text-sm leading-loose">
          <p>
            この利用規約（以下、「本規約」）は、BookFolio（以下、「当サービス」）の利用条件を定めるものです。登録ユーザーの皆さまには、本規約に従って当サービスをご利用いただきます。
          </p>

          <section>
            <h4 className="mb-2 font-bold">第1条（適用）</h4>
            <p>
              本規約は、ユーザーと当サービスとの間の利用に関わる一切の関係に適用されるものとします。
            </p>
          </section>

          <section>
            <h4 className="mb-2 font-bold">第2条（利用登録）</h4>
            <p>
              当サービスにおいては、登録希望者が本規約に同意の上、本アプリ作成者の定める方法によって利用登録を申請し、当サービスがこれを承認することによって、利用登録が完了するものとします。
            </p>
          </section>

          <section>
            <h4 className="mb-2 font-bold">第3条（禁止事項）</h4>
            <p>ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当サービスの運営を妨害するおそれのある行為</li>
              <li>その他、当サービスが不適切と判断する行為</li>
            </ul>
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
