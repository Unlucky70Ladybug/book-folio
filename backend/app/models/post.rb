class Post < ApplicationRecord
  belongs_to :bookshelves
  validate :has_spoiler_valid?

  private

  def has_spoiler_valid?
    if content.present? && has_spoiler.nil?
      errors.add(:has_spoiler, "はコメントが存在する場合に入力必須です")
    end
  end
end
