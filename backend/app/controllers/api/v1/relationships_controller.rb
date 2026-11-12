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
          follow_status: current_user.following?(user)
        }
      }
  end

  def create
    user = User.find(relationship_params[:followed_id])
    current_user.follow(user)
    render json: {
      result: {
        following: ActiveModelSerializers::SerializableResource.new(user.following, each_serializer: UserSerializer).as_json,
        followers: ActiveModelSerializers::SerializableResource.new(user.followers, each_serializer: UserSerializer).as_json,
        follow_status: current_user.following?(user)
      }
    }
  end

  def destroy
    user = User.find(params[:id])
    current_user.unfollow(user)
    render json: {
      result: {
        following: ActiveModelSerializers::SerializableResource.new(user.following, each_serializer: UserSerializer).as_json,
        followers: ActiveModelSerializers::SerializableResource.new(user.followers, each_serializer: UserSerializer).as_json,
        follow_status: current_user.following?(user)
      }
    }
  end

  private

  def relationship_params
    params.require(:relationship).permit(:followed_id)
  end
end
