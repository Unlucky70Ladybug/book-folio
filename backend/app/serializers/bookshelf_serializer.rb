class BookshelfSerializer < ActiveModel::Serializer
  attributes :id, :reading_status, :preference_rating

  belongs_to :book, serializer: BookSerializer
end
