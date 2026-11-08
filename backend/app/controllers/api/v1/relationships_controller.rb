class Api::V1::RelationshipsController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: {
        result: {
          following: ActiveModelSerializers::SerializableResource.new(current_user.following, each_serializer: UserSerializer).as_json,
          followers: ActiveModelSerializers::SerializableResource.new(current_user.followers, each_serializer: UserSerializer).as_json,
        }
      }
  end

  def show
    user = User.find(params[:id])
    render json: {
        result: {
          following: ActiveModelSerializers::SerializableResource.new(user.following, each_serializer: UserSerializer).as_json,
          followers: ActiveModelSerializers::SerializableResource.new(user.followers, each_serializer: UserSerializer).as_json,
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
