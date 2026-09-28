class Bookshelf < ApplicationRecord
  belongs_to :user
  belongs_to :book

  enum :reading_status, { interested: 0, reading: 1, finished: 2 }
  enum :preference_rating, { unrated: 0, not_for_me: 1, normal: 2, interesting: 3, favorite: 4 }

  validates :book_id, uniqueness: { scope: :user_id }
  validates :reading_status, presence: true
  validates :preference_rating, presence: true
end
