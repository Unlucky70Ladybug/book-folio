class RemoveDefaultFromReadingStatus < ActiveRecord::Migration[8.0]
  def change
    change_column_default :bookshelves, :reading_status, from: 0, to: nil
    change_column_null :bookshelves, :reading_status, false
  end
end
