class Api::V1::UserComparisonsController < ApplicationController
  before_action :authenticate_user!

  def index
    if current_user.book_genres.blank?
      return render json: {
        result: {
          similar_users: [],
          middle_users: [],
          different_users: []
        }
      }
    end

    user_comparison_result = Comparison::UserComparisonService.get_result(current_user)

    render json: { result: user_comparison_result }
  end
end
