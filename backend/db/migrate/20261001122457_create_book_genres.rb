class CreateBookGenres < ActiveRecord::Migration[8.0]
  def change
    create_table :book_genres do |t|
      t.references :bookshelf, null: false, foreign_key: true
      t.references :genre, null: false, foreign_key: true

    end
    add_index :book_genres, [ :bookshelf_id, :genre_id ], unique: true
  end
end
