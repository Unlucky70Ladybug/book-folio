class Book < ApplicationRecord
  validates :isbn, presence: true, uniqueness: true
  validates :title, presence: true
  validates :author, presence: true
  validates :fetched_at, presence: true
end
