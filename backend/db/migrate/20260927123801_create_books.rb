class CreateBooks < ActiveRecord::Migration[8.0]
  def change
    create_table :books do |t|
      t.string :isbn, null: false
      t.string :title, null: false
      t.string :author, null: false
      t.string :item_url
      t.string :large_image_url
      t.datetime :fetched_at, null: false

    end
    add_index :books, :isbn, unique: true
  end
end
