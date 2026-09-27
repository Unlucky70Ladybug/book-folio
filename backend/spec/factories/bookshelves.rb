FactoryBot.define do
  factory :bookshelf do
    user { nil }
    book { nil }
    reading_status { 1 }
    preference_rating { 1 }
  end
end
