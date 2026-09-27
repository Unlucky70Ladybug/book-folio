class Api::V1::BookshelvesController < ApplicationController
  before_action :authenticate_user!

  def index
    bookshelves = current_user.bookshelves.eager_load(:book)
    render json: { bookshelves: bookshelves.as_json(include: :book) }
  end
end
