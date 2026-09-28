class BookSerializer < ActiveModel::Serializer
  attributes :id, :isbn, :title, :author, :item_url, :large_image_url
end
