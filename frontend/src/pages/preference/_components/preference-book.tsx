import { type BookshelfForPreference } from '../../../types/bookshelf'

// 1段の高さ(本 + 棚板)。本棚ページと同じ見た目に揃える
export const SHELF_ROW_HEIGHT = 240
export const SHELF_BOARD_HEIGHT = 40

// 棚に並ぶ1冊分
export const PreferenceBook = ({ book }: BookshelfForPreference) => (
  <li
    className="flex flex-col items-center justify-end"
    style={{ height: SHELF_ROW_HEIGHT, paddingBottom: SHELF_BOARD_HEIGHT }}
  >
    <div className="tooltip" data-tip={`${book.title} / ${book.author}`}>
      <img
        src={book.large_image_url}
        alt={book.title}
        loading="lazy"
        className="h-40 w-auto max-w-24 rounded-sm object-cover shadow-[3px_4px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:-translate-y-2 md:max-w-28"
      />
    </div>
  </li>
)
