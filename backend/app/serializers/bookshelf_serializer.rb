class BookshelfSerializer < ActiveModel::Serializer
  attributes :id, :reading_status, :preference_rating

  belongs_to :book, serializer: BookSerializer
  has_many :genres, each_serializer: GenreSerializer
  has_one :post, serializer: PostSerializer
end
