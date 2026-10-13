class Api::V1::AuthorStatisticsController < ApplicationController
  before_action :authenticate_user!

  def index
    books = Book.joins(:bookshelves).where(bookshelves: { user_id: current_user.id })
    # 著作者が多い並べる
    author_books = books.group_by { |book| book.author }.sort_by { |author, author_by_books| -author_by_books.size }
    total = books.size
    ratios = author_books.map do |author, author_by_books|
      books_count = author_by_books.size
      {
        author: author,
        books: author_by_books,
        books_count: books_count,
        ratio: total.zero? ? 0 : (books_count * 100.0 / total).round(1)
      }
    end

    render json: { result: ratios }
  end
end
