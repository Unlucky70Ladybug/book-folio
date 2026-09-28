# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Userモデルにデータ登録する
User.create!(
  [
    { name: '山田 太郎', email: 'taro@example.com', password: "password", password_confirmation: "password", confirmed_at: Time.current },
    { name: '佐藤 花子', email: 'hanako@example.com', password: "password", password_confirmation: "password", confirmed_at: Time.current }
  ]
)

# Bookモデルにデータ登録する
Book.create!(
  [
    { isbn: "9784167923471", title: "死神の浮力", author: "伊坂 幸太郎", item_url: "https://books.rakuten.co.jp/rb/18115684/",  large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3471/9784167923471_1_10.jpg?_ex=200x200", fetched_at: Time.current },
    { isbn: "9784065358542", title: "方舟", author: "夕木 春央", item_url: "https://books.rakuten.co.jp/rb/17907792/",  large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/8542/9784065358542_1_3.jpg?_ex=200x200", fetched_at: Time.current }
  ]
)

# Bookshelfモデルにデータ登録する
taro = User.find_by!(email: 'taro@example.com')
hanako = User.find_by!(email: 'hanako@example.com')
book_1 = Book.find_by!(isbn: "9784167923471")
book_2 = Book.find_by!(isbn: "9784065358542")

Bookshelf.create!(
  [
    { user: taro, book: book_1, reading_status: :finished, preference_rating: :favorite },
    { user: taro, book: book_2, reading_status: :reading, preference_rating: :unrated },
    { user: hanako, book: book_1, reading_status: :interested, preference_rating: :unrated }
  ]
)
