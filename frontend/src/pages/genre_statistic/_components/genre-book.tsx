import { type DisplayBook } from '../../../types/book'

// 1段の高さ(本 + 棚板)。本棚ページと同じ見た目に揃える
export const SHELF_ROW_HEIGHT = 240
export const SHELF_BOARD_HEIGHT = 40

// 棚に並ぶ1冊分
export const GenreBook = ({ title, author, large_image_url }: DisplayBook) => (
  <li
    className="flex flex-col items-center justify-end"
    style={{ height: SHELF_ROW_HEIGHT, paddingBottom: SHELF_BOARD_HEIGHT }}
  >
    <div className="tooltip" data-tip={`${title} / ${author}`}>
      <img
        src={large_image_url}
        alt={title}
        loading="lazy"
        className="h-40 w-auto max-w-24 rounded-sm object-cover shadow-[3px_4px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:-translate-y-2 md:max-w-28"
      />
    </div>
  </li>
)
