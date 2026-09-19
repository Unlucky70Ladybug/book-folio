class Auth::SessionsController < ApplicationController
  def index
    if current_user
      render json: {
        is_login: true,
        user: {
          id: current_user.id,
          name: current_user.name,
          avatarImage: current_user.avatar_image.url
        }
      }
    else
      render json: {
        is_login: false,
        message: "ユーザーが存在しません"
      }
    end
  end
end
