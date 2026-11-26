class Api::V1::TimeLinesController < ApplicationController
  before_action :authenticate_user!

  def index
    bookshelves = Bookshelf.preload(:user, :book, :genres).order(created_at: :desc)
    current_user_following_ids = current_user.following.ids

    timelines = bookshelves.map do |bookshelf|
      {
        bookshelf: ActiveModelSerializers::SerializableResource.new(bookshelf, serializer: BookshelfSerializer).as_json,
        user: ActiveModelSerializers::SerializableResource.new(bookshelf.user, serializer: UserSerializer).as_json,
        follow_status: bookshelf.user_id == current_user.id ? nil : current_user_following_ids.include?(bookshelf.user_id)
      }
    end
    render json: { result: timelines }
  end
end
