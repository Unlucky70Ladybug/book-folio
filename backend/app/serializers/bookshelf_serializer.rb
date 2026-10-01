class BookshelfSerializer < ActiveModel::Serializer
  attributes :id, :reading_status, :preference_rating

  belongs_to :book, serializer: BookSerializer
  has_many :genres, through: :book_genres, source: :genre, each_serializer: GenreSerializer
end
