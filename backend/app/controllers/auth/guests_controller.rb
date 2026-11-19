class Auth::GuestsController < ApplicationController
  def guest_sign_in
    user = User.guest
    render json: response.headers.merge!(user.create_new_auth_token)
  end
end
