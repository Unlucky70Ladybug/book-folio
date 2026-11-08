class Api::V1::RelationshipsController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: {
        result: {
          following_count: current_user.following.count,
          followers_count: current_user.followers.count,
        }
      }
  end

  def show
    user = User.find(params[:id])
    render json: {
        result: {
          following_count: user.following.count,
          followers_count: user.followers.count,
        }
      }
  end

  def create
    user = User.find(params[:followed_id])
    current_user.follow(user)
  end

  def destroy
    user = User.find(params[:followed_id])
    current_user.unfollow(user)
  end
end
