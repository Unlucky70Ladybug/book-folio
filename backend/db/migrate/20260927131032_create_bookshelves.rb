class CreateBookshelves < ActiveRecord::Migration[8.0]
  def change
    create_table :bookshelves do |t|
      t.references :user, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true
      t.integer :reading_status, null: false
      t.integer :preference_rating, null:false

      t.timestamps
    end
    add_index :bookshelves, [:user_id, :book_id], unique: true
  end
end
