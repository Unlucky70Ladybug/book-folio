class Api::V1::Books::PostsController < ApplicationController
  before_action :authenticate_user!

  def index
    book = Book.find_by(isbn: params[:book_isbn])
    return render json: { current_user_info: nil, book: nil, posts: nil, post_count: 0 } unless book
    bookshelves = book.bookshelves
                      .where.not(user: current_user)
                      .where.associated(:post)
                      .preload(:user, :genres, :post)
    current_user_info = current_user.bookshelves.preload(:genres, :post).find_by(book_id: book.id)

    render json: {
      current_user_info: ActiveModelSerializers::SerializableResource.new(current_user_info, serializer: BookshelfFormSerializer).as_json,
      book: BookSerializer.new(book).as_json,
      posts: ActiveModelSerializers::SerializableResource.new(bookshelves, each_serializer: PostsIndexSerializer).as_json,
      post_count: bookshelves.size
  }
  end
end
