FactoryBot.define do
  factory :post do
    association :bookshelf
    content { "MyText" }
    has_spoiler { false }
  end
end
