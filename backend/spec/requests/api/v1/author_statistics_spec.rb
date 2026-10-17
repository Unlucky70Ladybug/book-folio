require 'rails_helper'

RSpec.describe "Api::V1::AuthorStatistics", type: :request do
  let(:user) { create(:user) }
  let(:headers) { sign_in(user) }
  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v1/author_statistics" do
    context '未ログインの場合' do
      it '401が返ってくる' do
        get '/api/v1/author_statistics'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みの場合' do
      context '本棚に登録している本がない場合' do
        before { get '/api/v1/author_statistics', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '空の配列が返ってくる' do
          expect(json['result']).to eq []
        end
      end

      context '本棚に登録している本がある場合' do
        # 本作成
        let!(:book_1) { create(:book, author: "author_1") }
        let!(:book_2) { create(:book, author: "author_1") }
        let!(:book_3) { create(:book, author: "author_1") }
        let!(:book_4) { create(:book, author: "author_2") }
        let!(:book_5) { create(:book, author: "author_2") }
        let!(:book_6) { create(:book, author: "author_3") }
        # 本棚に登録
        let!(:bookshelf_1) { create(:bookshelf, user: user, book: book_1) }
        let!(:bookshelf_2) { create(:bookshelf, user: user, book: book_2) }
        let!(:bookshelf_3) { create(:bookshelf, user: user, book: book_3) }
        let!(:bookshelf_4) { create(:bookshelf, user: user, book: book_4) }
        let!(:bookshelf_5) { create(:bookshelf, user: user, book: book_5) }
        let!(:bookshelf_6) { create(:bookshelf, user: user, book: book_6) }

        before { get '/api/v1/author_statistics', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '著作者別に返ってくる' do
          expect(json['result'].map { |ratio| ratio['author'] }).to eq [ book_1.author, book_4.author, book_6.author ]
        end

        it '著作者別の本数が返ってくる' do
          expect(json['result'].map { |ratio| ratio['books_count'] }).to eq [ 3, 2, 1 ]
        end

        it '著作者別の統計が返ってくる' do
          expect(json['result'].map { |ratio| ratio['ratio'] }).to eq [ 50, 33.3, 16.7 ]
        end

        it '著作者別の本が返ってくる' do
          expect(json['result'].first['books'].map { |book| book['id'] }).to match_array [ book_1.id, book_2.id, book_3.id ]
        end
      end

      context '他のユーザーが本を登録している場合' do
        let(:other_user) { create(:user) }
        let!(:my_book) { create(:book, author: "author_1") }
        let!(:other_book) { create(:book, author: "author_2") }
        let!(:my_bookshelf) { create(:bookshelf, user: user, book: my_book) }
        let!(:other_bookshelf_1) { create(:bookshelf, user: other_user, book: other_book) }
        # 同じ本を他ユーザーも登録している
        let!(:other_bookshelf_2) { create(:bookshelf, user: other_user, book: my_book) }

        before { get '/api/v1/author_statistics', headers: headers }

        it '自分の本だけが集計される' do
          expect(json['result'].map { |ratio| ratio['author'] }).to eq [ "author_1" ]
          expect(json['result'].first['books_count']).to eq 1
          expect(json['result'].first['ratio']).to eq 100.0
        end
      end
    end
  end
end
