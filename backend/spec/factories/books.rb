FactoryBot.define do
  factory :book do
    isbn { Faker::Number.number(digits: 13).to_s }
    title { Faker::Lorem.sentence(word_count: 4) }
    author { Faker::Name.name }
    item_url { Faker::Internet.url }
    large_image_url { Faker::Internet.url }
    fetched_at { Time.current }
  end
end
