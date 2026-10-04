class Post < ApplicationRecord
  belongs_to :bookshelf
  validate :has_spoiler_valid?

  private

  def has_spoiler_valid?
    if content.present? && has_spoiler.nil?
      errors.add(:base, "コメントがある場合はネタバレ有無を選択してください")
    end
  end
end
