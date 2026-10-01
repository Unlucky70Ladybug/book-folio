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
[
  { name: '山田 太郎', email: 'taro@example.com' },
  { name: '佐藤 花子', email: 'hanako@example.com' }
].each do |attrs|
  User.find_or_create_by!(email: attrs[:email]) do |user|
    user.name = attrs[:name]
    user.password = "password"
    user.password_confirmation = "password"
    user.confirmed_at = Time.current
  end
end

# Bookモデルにデータ登録する
[
  { isbn: "9784167923471", title: "死神の浮力", author: "伊坂 幸太郎", item_url: "https://books.rakuten.co.jp/rb/18115684/",  large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3471/9784167923471_1_10.jpg?_ex=200x200" },
  { isbn: "9784065358542", title: "方舟", author: "夕木 春央", item_url: "https://books.rakuten.co.jp/rb/17907792/",  large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/8542/9784065358542_1_3.jpg?_ex=200x200" },
  { isbn: "9784150313005", title: "死刑にいたる病", author: "櫛木 理宇", item_url: "https://books.rakuten.co.jp/rb/15121229/",  large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3005/9784150313005_1_2.jpg?_ex=200x200" }
].each do |attrs|
  Book.find_or_create_by!(isbn: attrs[:isbn]) do |book|
    book.assign_attributes(attrs.except(:isbn))
    book.fetched_at = Time.current
  end
end

# Genreモデルにデータ登録する
[
  "ミステリー・サスペンス", "SF", "ファンタジー", "ホラー", "恋愛", "青春",
  "時代小説", "ヒューマンドラマ", "絵本・児童書", "エッセイ",
  "ノンフィクション・ドキュメンタリー", "ビジネス・経済", "自己啓発",
  "科学・テクノロジー", "歴史・社会", "哲学・思想", "その他"
].each do |genre_name|
  Genre.find_or_create_by!(name: genre_name)
end

# Bookshelfモデルにデータ登録する
taro = User.find_by!(email: 'taro@example.com')
hanako = User.find_by!(email: 'hanako@example.com')
book_1 = Book.find_by!(isbn: "9784167923471")
book_2 = Book.find_by!(isbn: "9784065358542")
book_3 = Book.find_by!(isbn: "9784150313005")

[
  { user: taro, book: book_1, reading_status: :finished, preference_rating: :favorite },
  { user: taro, book: book_2, reading_status: :reading, preference_rating: :unrated },
  { user: taro, book: book_3, reading_status: :finished, preference_rating: :interesting },
  { user: hanako, book: book_1, reading_status: :interested, preference_rating: :unrated }
].each do |attrs|
  Bookshelf.find_or_create_by!(user: attrs[:user], book: attrs[:book]) do |bookshelf|
    bookshelf.reading_status = attrs[:reading_status]
    bookshelf.preference_rating = attrs[:preference_rating]
  end
end

# BookGenreモデルにデータ登録する
taro_book_1 = Bookshelf.find_by!(user: taro, book: book_1)
taro_book_2 = Bookshelf.find_by!(user: taro, book: book_2)
taro_book_3 = Bookshelf.find_by!(user: taro, book: book_3)
hanako_book_1 = Bookshelf.find_by!(user: hanako, book: book_1)

mystery = Genre.find_by!(name: "ミステリー・サスペンス")
fantasy = Genre.find_by!(name: "ファンタジー")
horror  = Genre.find_by!(name: "ホラー")

[
  { bookshelf: taro_book_1, genre: fantasy },
  { bookshelf: taro_book_2, genre: mystery },
  { bookshelf: taro_book_3, genre: mystery },
  { bookshelf: taro_book_3, genre: horror },
  { bookshelf: hanako_book_1, genre: fantasy }
].each do |attrs|
  BookGenre.find_or_create_by!(attrs)
end
