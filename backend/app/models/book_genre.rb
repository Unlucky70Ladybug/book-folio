class BookGenre < ApplicationRecord
  belongs_to :bookshelf
  belongs_to :genre

  validates :bookshelf_id, uniqueness: { scope: :genre_id }
end
