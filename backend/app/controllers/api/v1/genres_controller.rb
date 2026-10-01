class Api::V1::GenresController < ApplicationController
  before_action :authenticate_user!

  def index
    genres = Genre.order(:id)
    render json: genres, each_serializer: GenreSerializer, root: "genres", adapter: :json
  end
end
