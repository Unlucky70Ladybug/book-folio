class Api::V1::PreferencesController < ApplicationController
  before_action :authenticate_user!

  def index
    # 読み終わた本のみ取得
    # => { "unrated" => 12, "not_for_me" => 4, "normal" => 8, "interesting" => 6, "favorite" => 3 }
    books = current_user.bookshelves.eager_load(:book).where(reading_status: :finished).order(preference_rating: :desc)
    counts = books.group(:preference_rating).count
    total = counts.values.sum
    ratios = counts.transform_values { |c| total.zero? ? 0 : (c * 100.0 / total).round(1) }
     render json: books, each_serializer: PreferenceSerializer, root: "books", adapter: :json,
            meta: { total: total, counts: counts, ratios: ratios }, meta_key: :preference
  end
end
