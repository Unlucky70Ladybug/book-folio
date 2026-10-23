class PostsIndexSerializer < ActiveModel::Serializer
  belongs_to :user, serializer: UserSerializer
  has_many :genres, each_serializer: GenreSerializer
  has_one :post, serializer: PostSerializer
end
