class Api::V1::UserComparisonsController < ApplicationController
  before_action :authenticate_user!

  def index
    users = User.preload(:book_genres)
    # { user_id => { user:, book_genres: } }
    user_book_genres = users.to_h do |user|
      [user.id, { user: user, book_genres: ratios_book_genres(user.book_genres) }]
    end

    # 自分のみを取り出す
    mine   = user_book_genres.delete(current_user.id)[:book_genres] # 例： {1=>50.0, 3=>20.0, ...}
    # 例 自分以外のHash 配列： [{ user: <User>, book_genres: {1=>50.0, ...} }, ...]
    others = user_book_genres.values

    uses_score = others.map do |other|
      other_score = mine.sum do | current_user_book_genres_id, current_user_book_genres_value |
        #  other[:book_genres][:current_user_book_genres_id]が存在しないとき0とする
        [current_user_book_genres_value, other[:book_genres].fetch(current_user_book_genres_id, 0)].min
      end
      { user: other[:user], score: other_score.round }
    end.sort_by { |other| -other[:score] }

    render json: { user_book_genres: user_book_genres, mine: mine, others: others, uses_score: uses_score }
  end

  private
  def ratios_book_genres(book_genres)
    total = book_genres.size
    book_genres.map(&:genre_id).tally.transform_values { |count| (count * 100.0 / total).round(1) }
  end

end
