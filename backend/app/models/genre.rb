class Genre < ApplicationRecord
  has_many :book_genres, dependent: :destroy
  has_many :link_bookshelves, through: :book_genres, source: :bookshelf

  validates :name, presence: true, uniqueness: true
end
