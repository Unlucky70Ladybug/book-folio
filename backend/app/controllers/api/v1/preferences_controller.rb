class Api::V1::PreferencesController < ApplicationController
  before_action :authenticate_user!

  def index
    books = current_user.bookshelves.preload(:book).order(preference_rating: :desc)
    # => { "unrated" => 12, "not_for_me" => 4, "normal" => 8, "interesting" => 6, "favorite" => 3 }
    counts = current_user.bookshelves.group(:preference_rating).count
    total = counts.values.sum
    ratios = counts.transform_values { |c| total.zero? ? 0 : (c * 100.0 / total).round(1) }
     render json: books, each_serializer: PreferenceSerializer, root: "books", adapter: :json,
            meta: { total: total, counts: counts, ratios: ratios }, meta_key: :preference
  end
end
