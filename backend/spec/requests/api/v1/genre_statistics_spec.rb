require 'rails_helper'

RSpec.describe "Api::V1::GenreStatistics", type: :request do
  let(:user) { create(:user) }
  let(:headers) { sign_in(user) }
  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v1/genre_statistics" do
    context '未ログインの場合' do
      it '401が返ってくる' do
        get '/api/v1/genre_statistics'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みの場合' do
      context '本棚に登録している本がない場合' do
        before { get '/api/v1/genre_statistics', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '空の配列が返ってくる' do
          expect(json['genres_books']).to eq []
          expect(json['genre_statistics']).to eq []
        end
      end

      context 'ジャンル未設定の本しかない場合' do
        before do
          create(:bookshelf, user: user, book: create(:book))
          get '/api/v1/genre_statistics', headers: headers
        end

        it '空の配列が返ってくる' do
          expect(json['genres_books']).to eq []
          expect(json['genre_statistics']).to eq []
        end
      end

      context '本棚に本が登録されている場合' do
        # ジャンル
        let(:sf)      { create(:genre, name: "SF") }
        let(:mystery) { create(:genre, name: "ミステリー") }
        let(:horror) { create(:genre, name: "ホラー") }
        let(:politics_economy) { create(:genre, name: "政治・経済") }
        # 本棚登録
        let!(:bookshelf_1) { create(:bookshelf, user: user, book: create(:book), genres: [ sf ]) }
        let!(:bookshelf_2) { create(:bookshelf, user: user, book: create(:book), genres: [ sf, mystery ]) }
        let!(:bookshelf_3) { create(:bookshelf, user: user, book: create(:book), genres: [ horror ]) }
        let!(:bookshelf_4) { create(:bookshelf, user: user, book: create(:book), genres: [ politics_economy ]) }
        # 他のユーザー
        let!(:orther_bookshelf) { create(:bookshelf, user: create(:user), book: create(:book), genres: [ sf ]) }
        let!(:other_only_bookshelf) { create(:bookshelf, user: create(:user), book: create(:book), genres: [ create(:genre, name: "歴史") ]) }

        before { get '/api/v1/genre_statistics', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '本棚に登録したジャンルが返ってくる' do
          expect(json['genres_books'].map { |genres_book| genres_book['name'] }).to match_array [ sf.name, mystery.name, horror.name, politics_economy.name ]
        end

        it '本棚に登録した本がジャンル別に返ってくる' do
          # { "SF" => [book_id, ...], ... } の形に変換して比較
          books_by_genre = json['genres_books'].to_h do |genres_book|
            [ genres_book['name'], genres_book['books'].map { |book| book['id'] } ]
          end
          expect(books_by_genre[sf.name]).to match_array [ bookshelf_1.book.id, bookshelf_2.book.id ]
          expect(books_by_genre[mystery.name]).to match_array [ bookshelf_2.book.id ]
          expect(books_by_genre[horror.name]).to match_array [ bookshelf_3.book.id ]
          expect(books_by_genre[politics_economy.name]).to match_array [ bookshelf_4.book.id ]
        end

        it '本棚に登録した本のジャンル別統計結果が返ってくる' do
          result_genre_statistics = json['genre_statistics'].to_h do |genre_statistic|
            [ genre_statistic['name'], { books_count: genre_statistic['books_count'], ratio: genre_statistic['ratio'] } ]
          end
          # SF
          expect(result_genre_statistics[sf.name][:books_count]).to eq 2
          expect(result_genre_statistics[sf.name][:ratio]).to eq 40
          # ミステリー
          expect(result_genre_statistics[mystery.name][:books_count]).to eq 1
          expect(result_genre_statistics[mystery.name][:ratio]).to eq 20
          # ホラー
          expect(result_genre_statistics[horror.name][:books_count]).to eq 1
          expect(result_genre_statistics[horror.name][:ratio]).to eq 20
          # 政治・経済
          expect(result_genre_statistics[politics_economy.name][:books_count]).to eq 1
          expect(result_genre_statistics[politics_economy.name][:ratio]).to eq 20
        end

        it 'カレントユーザー以外の結果は帰ってこない' do
           books_by_genre = json['genres_books'].to_h do |genres_book|
            [ genres_book['name'], genres_book['books'].map { |book| book['id'] } ]
          end
          expect(books_by_genre[sf.name]).not_to include(orther_bookshelf.book.id)
        end

        it '他ユーザーのみが登録したジャンルは返ってこない' do
          expect(json['genres_books'].map { |genres_book| genres_book['name'] }).not_to include "歴史"
          expect(json['genre_statistics'].map { |genre_statistic| genre_statistic['name'] }).not_to include "歴史"
        end
      end
    end
  end
end
