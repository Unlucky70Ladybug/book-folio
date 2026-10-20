class Api::V1::Books::PostsController < ApplicationController
  before_action :authenticate_user!

  def index
    book = Book.find_by(isbn: params[:book_isbn])
    return render json: { current_user_info: nil, posts: nil} unless book
    bookshelves = book.bookshelves
                      .where.not(user: current_user)
                      .where.associated(:post)
                      .preload(:user, :genres, :post)
    current_user_info = current_user.bookshelves.preload(:genres, :post).find_by(book_id: book.id)

    render json: {
      current_user_info: current_user_info && BookshelfFormSerializer.new(current_user_info).as_json,
      posts: bookshelves && ActiveModelSerializers::SerializableResource.new(bookshelves, each_serializer: PostsIndexSerializer).as_json
  }
  end
end
