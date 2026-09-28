class Api::V1::BookshelvesController < ApplicationController
  before_action :authenticate_user!

  def index
    bookshelves = current_user.bookshelves.preload(:book).order(created_at: :desc)
    render json: bookshelves, each_serializer: BookshelfSerializer, root: "books", adapter: :json
  end
end
