class Api::V1::AuthorStatisticsController < ApplicationController
  before_action :authenticate_user!

  def index
    bookshelves = current_user.bookshelves.preload(:book, :genres, :post)
    # { author => [bookshelf, bookshelf, ...] } にまとめる
    bookshelves_by_author = Hash.new { |hash, key| hash[key] = [] }
    bookshelves.each { |bookshelf| bookshelves_by_author[bookshelf.book.author] << bookshelf }
    # 冊数が多い順に並べる
    sorted = bookshelves_by_author.sort_by { |_, author_bookshelves| -author_bookshelves.size }

    total = bookshelves.size
    ratios = sorted.map do |author, author_bookshelves|
      books_count = author_bookshelves.size
      {
        author: author,
        bookshelves: ActiveModelSerializers::SerializableResource.new(author_bookshelves, each_serializer: BookshelfSerializer).as_json,
        books_count: books_count,
        ratio: total.zero? ? 0 : (books_count * 100.0 / total).round(1)
      }
    end

    render json: { result: ratios }
  end
end
