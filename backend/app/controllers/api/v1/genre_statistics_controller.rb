class Api::V1::GenreStatisticsController < ApplicationController
  before_action :authenticate_user!

  def index
    bookshelves = current_user.bookshelves.preload(:book, :genres, :post).order(preference_rating: :desc)
    return render json: { genres_books: [], genre_statistics: [] } if bookshelves.blank?

    # { genre => [bookshelf, bookshelf, ...] } にまとめる
    bookshelves_by_genre = Hash.new { |hash, key| hash[key] = [] }
    bookshelves.each do |bookshelf|
      bookshelf.genres.each { |genre| bookshelves_by_genre[genre] << bookshelf }
    end

    # ジャンルごとの本を返す
    genres_books = bookshelves_by_genre.map do |genre, genre_bookshelves|
      {
        id: genre.id,
        name: genre.name,
        bookshelves: ActiveModelSerializers::SerializableResource.new(genre_bookshelves, each_serializer: BookshelfSerializer).as_json
      }
    end.sort_by { |genre| -genre[:bookshelves].size }

    # ジャンルごとに分類された本棚の総数（重複を含む）
    total = bookshelves_by_genre.values.sum(&:size)
    ratios = bookshelves_by_genre.map do |genre, genre_bookshelves|
      {
        id: genre.id,
        name: genre.name,
        books_count: genre_bookshelves.size,
        ratio: total.zero? ? 0 : (genre_bookshelves.size * 100.0 / total).round(1)
      }
    end.sort_by { |genre| -genre[:ratio] }

    render json: { genres_books: genres_books, genre_statistics: ratios }
  end
end
