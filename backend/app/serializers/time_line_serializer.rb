class TimeLineSerializer < ActiveModel::Serializer
  attributes :id, :reading_status, :preference_rating, :created_at

  belongs_to :book, serializer: BookSerializer
  has_many :genres, each_serializer: GenreSerializer
  has_one :post, serializer: PostSerializer
end
