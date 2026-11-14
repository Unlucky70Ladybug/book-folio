const KEY = 'explanation_status'

// 本棚の説明モーダルを表示するかどうかのフラグ(表示制御のみに使う)
export const explanationStorage = {
  mark: () => localStorage.setItem(KEY, 'true'),
  shouldShow: () => localStorage.getItem(KEY) === 'true',
  dismiss: () => localStorage.removeItem(KEY),
}
