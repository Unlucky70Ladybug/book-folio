class GenreStatisticSerializer < ActiveModel::Serializer
  attributes :id, :name
  # 本棚（bookshelves）を経由して、それぞれに紐づく本（book）を取得する
  has_many :books, serializer: BookSerializer do
    object.bookshelves.map(&:book)
  end
end
