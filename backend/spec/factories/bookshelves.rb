FactoryBot.define do
  factory :bookshelf do
    association :user
    association :book
    reading_status { Faker::Base.sample(Bookshelf.reading_statuses.keys) }
    preference_rating { Faker::Base.sample(Bookshelf.preference_ratings.keys) }
  end
end
