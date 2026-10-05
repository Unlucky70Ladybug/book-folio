FactoryBot.define do
  factory :post do
    bookshelves { nil }
    content { "MyText" }
    has_spoiler { false }
  end
end
