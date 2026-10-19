require 'rails_helper'

RSpec.describe "Api::V1::UserComparisons", type: :request do
  let(:user) { create(:user) }
  let(:headers) { sign_in(user) }
  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v1/user_comparisons" do
    context '未ログインの場合' do
      it '401が返ってくる' do
        get '/api/v1/user_comparisons'
        expect(response).to have_http_status(:unauthorized)
      end
    end
    context 'ログイン済みの場合' do
      before { get '/api/v1/user_comparisons', headers: headers }

      it '200が返ってくる' do
        expect(response).to have_http_status(:ok)
      end

      context '本棚に本が登録されていない場合' do
        it '結果が空で返ってくる' do
          expect(json['result']['similar_users']).to eq []
          expect(json['result']['middle_users']).to eq []
          expect(json['result']['different_users']).to eq []
        end
      end

      context '本棚に本が登録されている場合' do
        def add_bookshelves(user, genre_counts)
          genre_counts.each do |genre, count|
            count.times do
              create(:bookshelf, user: user, book: create(:book), genres: [ genre ])
            end
          end
          user
        end

        # ジャンル
        let(:sf)     { create(:genre, name: "SF") }
        let(:horror) { create(:genre, name: "ホラー") }

        # 返信されるユーザー作成
        let!(:similar_user)   { add_bookshelves(create(:user), { sf => 3, horror => 1 }) } # スコア：75
        let!(:middle_user)    { add_bookshelves(create(:user), { sf => 1, horror => 1 }) } # スコア：50
        let!(:different_user) { add_bookshelves(create(:user), { sf => 1, horror => 3 }) } # スコア：25

        # 取得できないユーザー
        let!(:high_score_user) { add_bookshelves(create(:user), { sf => 9, horror => 1 }) } # スコア：90
        let!(:low_score_user) { add_bookshelves(create(:user), { sf => 1, horror => 9 }) } # スコア：10

        # 境界値のユーザー
        let!(:score_80_user) { add_bookshelves(create(:user), { sf => 4, horror => 1 }) } # スコア：80
        let!(:score_60_user) { add_bookshelves(create(:user), { sf => 3, horror => 2 }) } # スコア：60
        let!(:score_40_user) { add_bookshelves(create(:user), { sf => 2, horror => 3 }) } # スコア：40
        let!(:score_20_user) { add_bookshelves(create(:user), { sf => 1, horror => 4 }) } # スコア：20

        before {
          # 　カレントユーザーはSF100%
          create(:bookshelf, user: user, book: create(:book), genres: [ sf ])
          get '/api/v1/user_comparisons', headers: headers
        }

        it 'ユーザー診断結果から取得できるユーザー' do
          expect(json['result']['similar_users'].map { |similar_user| similar_user['id'] }).to include(similar_user.id)
          expect(json['result']['middle_users'].map { |middle_user| middle_user['id'] }).to include(middle_user.id)
          expect(json['result']['different_users'].map { |different_user| different_user['id'] }).to include(different_user.id)
        end

        it 'ユーザー診断結果から取得できないユーザー' do
          expect(json['result']['similar_users'].map { |similar_user| similar_user['id'] }).not_to include(high_score_user.id, low_score_user.id)
          expect(json['result']['middle_users'].map { |middle_user| middle_user['id'] }).not_to include(high_score_user.id, low_score_user.id)
          expect(json['result']['different_users'].map { |different_user| different_user['id'] }).not_to include(high_score_user.id, low_score_user.id)
        end

        it 'スコアが境界値のユーザーが正しい区分に含まれる' do
          expect(json['result']['similar_users'].map { |similar_user| similar_user['id'] }).to include(score_80_user.id, score_60_user.id)
          expect(json['result']['middle_users'].map { |middle_user| middle_user['id'] }).not_to include(score_60_user.id, score_40_user.id)
          expect(json['result']['different_users'].map { |different_user| different_user['id'] }).to include(score_40_user.id, score_20_user.id)
        end

        it 'ユーザー診断結果からカレントユーザーが取得されていないこと' do
          expect(json['result']['similar_users'].map { |similar_user| similar_user['id'] }).not_to include(user.id)
          expect(json['result']['middle_users'].map { |middle_user| middle_user['id'] }).not_to include(user.id)
          expect(json['result']['different_users'].map { |different_user| different_user['id'] }).not_to include(user.id)
        end

        context '各区分に該当するユーザーが6人以上いる場合' do
          # 各区分に5人ずつ追加
          let!(:extra_similar_users)   { 5.times { add_bookshelves(create(:user), { sf => 7, horror => 3 }) } } # スコア：70
          let!(:extra_middle_users)    { 5.times { add_bookshelves(create(:user), { sf => 1, horror => 1 }) } } # スコア：50
          let!(:extra_different_users) { 5.times { add_bookshelves(create(:user), { sf => 3, horror => 7 }) } } # スコア：30

          before { get '/api/v1/user_comparisons', headers: headers }

          it '各区分で最大5人まで取得される' do
            expect(json['result']['similar_users'].size).to eq 5
            expect(json['result']['middle_users'].size).to eq 5
            expect(json['result']['different_users'].size).to eq 5
          end
        end
      end
    end
  end
end
