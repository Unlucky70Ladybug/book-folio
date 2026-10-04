class Post < ApplicationRecord
  belongs_to :bookshelves
  validate :has_spoiler_valid?

  private

  def has_spoile_valid?
    if !content.blank? && has_spoiler.nil?
      errors.add(:has_spoiler, "はタイトルが存在する場合に入力必須です")
    end
  end
end
