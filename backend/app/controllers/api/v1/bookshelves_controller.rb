class Api::V1::BookshelvesController < ApplicationController
  before_action :authenticate_user!

  def index
    bookshelves = current_user.bookshelves.preload(:book).order(created_at: :desc)
    render json: bookshelves, each_serializer: BookshelfSerializer, root: "books", adapter: :json
  end

  def create
    # 「!」を付けることで、念のためバリデーションに引っかかることにする
    book = Book.find_or_create_by!(isbn: bookshelf_params[:book][:isbn]) do | new_book |
      new_book.title = bookshelf_params[:book][:title]
      new_book.author = bookshelf_params[:book][:author]
      new_book.item_url = bookshelf_params[:book][:item_url]
      new_book.large_image_url = bookshelf_params[:book][:large_image_url]
      new_book.fetched_at = Time.current
    end

    if current_user.bookshelves.exists?(book: book)
      return render json: { error: "既に登録されています" }, status: :unprocessable_entity
    end

    bookshelf =  current_user.bookshelves.build(book: book, reading_status: bookshelf_params[:reading_status], preference_rating: bookshelf_params[:preference_rating] )

    if bookshelf.save
      render json: { book: book }, status: :created
    else
      render json: { error: "既に登録されています" }, status: :unprocessable_entity
    end
  end

  private

  def bookshelf_params
    params.require(:bookshelf).permit(
      :reading_status,
      :preference_rating,
      book: [
        :isbn,
        :title,
        :author,
        :item_url,
        :large_image_url
      ]
    )
  end
end
