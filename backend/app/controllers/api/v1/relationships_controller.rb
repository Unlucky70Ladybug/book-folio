class Api::V1::RelationshipsController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: {
      result: relationship_status(current_user)
    }
  end

  def show
    user = User.find(params[:id])
    render json: {
      result: relationship_status(user).merge(
        follow_status: current_user.following?(user)
      )
    }
  end

  def create
    user = User.find(relationship_params[:followed_id])
    relationship = current_user.follow(user)
    if relationship.persisted?
      render json: {
        result: relationship_status(user).merge(
          follow_status: current_user.following?(user)
        )
      }, status: :created
    else
      render json: { errors: relationship.errors.full_messages }, status: :unprocessable_content
    end
  end

  def destroy
    user = User.find(params[:id])
    relationship = current_user.unfollow(user)
    if relationship.destroyed?
      render json: {
        result: relationship_status(user).merge(
          follow_status: current_user.following?(user)
        )
      }
    else
      render json: { errors: relationship.errors.full_messages }, status: :unprocessable_content
    end
  end

  private

  def relationship_params
    params.require(:relationship).permit(:followed_id)
  end

  def relationship_status(user)
    {
      following: ActiveModelSerializers::SerializableResource.new(user.following, each_serializer: UserSerializer).as_json,
      followers: ActiveModelSerializers::SerializableResource.new(user.followers, each_serializer: UserSerializer).as_json
    }
  end
end
