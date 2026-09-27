class AddDefaultToBookshelves < ActiveRecord::Migration[8.0]
  def change
    change_column_default :bookshelves, :reading_status, 0
    change_column_default :bookshelves, :preference_rating, 0
  end
end
