import { type CSSProperties } from 'react'

// 1段の高さ(本 + 棚板)。背景の棚板の間隔と本の配置をこの値で揃える
export const SHELF_ROW_HEIGHT = 240
export const SHELF_BOARD_HEIGHT = 40

// 木目の背板と、一定間隔で並ぶ棚板を背景として描画する
export const shelfStyle: CSSProperties = {
  backgroundImage: [
    // 棚板(上面のハイライト + 前面 + 下の影)
    `repeating-linear-gradient(to bottom,
      transparent 0 ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT}px,
      #e0a96d ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT}px ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT + 6}px,
      #b87a42 ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT + 6}px ${SHELF_ROW_HEIGHT - 4}px,
      #7a4b24 ${SHELF_ROW_HEIGHT - 4}px ${SHELF_ROW_HEIGHT}px)`,
    // 背板の木目
    'repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 9px, rgba(255,255,255,0.03) 9px 11px, transparent 11px 23px)',
    // 背板の奥行き(上下を少し暗く)
    'linear-gradient(to bottom, rgba(60,30,10,0.25), transparent 15%, transparent 85%, rgba(60,30,10,0.2))',
  ].join(','),
  backgroundColor: '#a86d3a',
  minHeight: SHELF_ROW_HEIGHT,
}
