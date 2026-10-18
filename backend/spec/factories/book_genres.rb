FactoryBot.define do
  factory :book_genre do
    association :bookshelf
    association :genre
  end
end
