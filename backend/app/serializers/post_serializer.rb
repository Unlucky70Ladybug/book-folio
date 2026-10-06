class PostSerializer < ActiveModel::Serializer
  attributes :id, :content, :has_spoiler
end
