class BookUndiagnosedSerializer < ActiveModel::Serializer
  attributes :id, :reading_status, :preference_rating

  belongs_to :book, serializer: BookSerializer
  has_many :genres, each_serializer: GenreSerializer
end
