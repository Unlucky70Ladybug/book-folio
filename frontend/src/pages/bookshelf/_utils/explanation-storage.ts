const KEY = 'explanation_status'

// 本棚の説明モーダルを表示するかどうかのフラグ(表示制御のみに使う)
export const explanationStorage = {
  markAsShown: () => localStorage.setItem(KEY, 'true'),
  markAsGuest: () => localStorage.setItem(KEY, 'guest'),
  isShown: () => localStorage.getItem(KEY) === 'true',
  isGuest: () => localStorage.getItem(KEY) === 'guest',
  dismiss: () => localStorage.removeItem(KEY),
}
