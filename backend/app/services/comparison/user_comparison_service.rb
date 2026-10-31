module Comparison
  class UserComparisonService
    class << self

      def get_result(target_user)
        users = User.eager_load(:book_genres).where.not(book_genres: nil)
        # { user_id => { user:, book_genres: } }
        user_book_genres = users.to_h do |user|
          [ user.id, { user: user, book_genres: ratios_book_genres(user.book_genres) } ]
        end

        # 自分のジャンル割合を取り出す
        # 例： {1=>50.0, 3=>20.0, ...}
        mine   = user_book_genres.delete(target_user.id)[:book_genres]
        # 例 自分以外のHash 配列： [{ user: <User>, book_genres: {1=>50.0, ...} }, ...]
        others = user_book_genres.values

        other_users_score = others.map do |other|
          other_score = mine.sum do | target_user_book_genres_id, target_user_book_genres_value |
            #  other[:book_genres][:target_user_book_genres_id]が存在しないとき0とする
            [ target_user_book_genres_value, other[:book_genres].fetch(target_user_book_genres_id, 0) ].min
          end
          { user: other[:user], score: other_score.round }
        end.sort_by { |other| -other[:score] } # 最後にスコアが高い順にする

        user_comparison_result = { similar_users: similar_users(other_users_score), middle_users: middle_users(other_users_score), different_users: different_users(other_users_score) }

        # Hash の各値（User の配列）をそれぞれ UserSerializer でシリアライズする
        serialized_result = user_comparison_result.transform_values do |users|
          # ユーザーのid,name,avatar_imageのみに絞る
          ActiveModelSerializers::SerializableResource.new(users, each_serializer: UserSerializer).as_json
        end

        return serialized_result
      end

      private
      def ratios_book_genres(book_genres)
        total = book_genres.size
        book_genres.map(&:genre_id).tally.transform_values { |count| (count * 100.0 / total).round(1) }
      end

      def similar_users(other_users)
        # score が 60以上80以下のユーザーを先頭から5人取得
        other_users.select { |other_user| 60 <= other_user[:score] && other_user[:score] <= 80 }
                  .first(5)
                  .map { |other_user| other_user[:user] }
      end

      def middle_users(other_users)
        # score が 50付近のユーザーを5人取得
        other_users.select { |other_user| 40 < other_user[:score] && other_user[:score] < 60 }
                  .sort_by { |other_user| (other_user[:score] - 50).abs }
                  .first(5)
                  .map { |other_user| other_user[:user] }
      end

      def different_users(other_users)
        # score が 20以上40以下のユーザーを先頭から5人取得
        other_users.select { |other_user| 20 <= other_user[:score] && other_user[:score] <= 40 }
                  .last(5)
                  .map { |other_user| other_user[:user] }
      end
    end

  end
end
