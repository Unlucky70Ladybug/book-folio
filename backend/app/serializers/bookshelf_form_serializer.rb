class BookshelfFormSerializer < ActiveModel::Serializer
  attributes :id, :reading_status, :preference_rating

  has_many :genres, each_serializer: GenreSerializer
  has_one :post, serializer: PostSerializer
end
