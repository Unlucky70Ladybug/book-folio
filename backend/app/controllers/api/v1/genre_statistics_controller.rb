class Api::V1::GenreStatisticsController < ApplicationController
  before_action :authenticate_user!

  def index
    genres_books = Genre.eager_load(bookshelves: :book)
                  .where(bookshelves: { user_id: current_user.id })
    
    return render json: { genres_books: [], genre_statistics: [] } if genres_books.blank?

    total = genres_books.sum { |genre| genre.bookshelves.size }
    ratios = genres_books.map do |genre|
      books_count = genre.bookshelves.size
      {
        id: genre.id,
        name: genre.name,
        books_count: books_count,
        ratio: total.zero? ? 0 : (books_count * 100.0 / total).round(1)
      }
    end
    render json: genres_books, each_serializer: GenreStatisticSerializer, root: "genres_books", adapter: :json,
           meta: ratios, meta_key: :genre_statistics
  end
end
