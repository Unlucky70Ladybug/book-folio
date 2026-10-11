require 'rails_helper'

RSpec.describe "Api::V1::Preferences", type: :request do
  let(:user) { create(:user) }
  let(:headers) { sign_in(user) }
  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v1/preferences" do
    let(:genre) { create(:genre) }
    let(:book_1) { create(:book) }
    let(:book_2) { create(:book) }
    let(:book_3) { create(:book) }

    context '未ログインの場合' do
      it '401が返ってくる' do
        get '/api/v1/preferences'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みの場合' do
      context '診断される書籍が登録されている場合' do
        let!(:bookshelf_1) do
          create(:bookshelf, user: user, book: book_1, genres: [ genre ],
                    reading_status: :finished, preference_rating: :favorite, created_at: 2.days.ago)
        end
        let!(:bookshelf_2) do
          create(:bookshelf, user: user, book: book_2, genres: [ genre ],
                  reading_status: :reading, preference_rating: :unrated, created_at: 1.day.ago)
        end

        let!(:bookshelf_3) do
          create(:bookshelf, user: user, book: book_3, genres: [ genre ],
                  reading_status: :finished, preference_rating: :unrated, created_at: 1.day.ago)
        end

        let!(:other_bookshelf_1) do
           create(:bookshelf, user: create(:user), book: book_1, genres: [ genre ],
                   reading_status: :finished, preference_rating: :favorite, created_at: 1.day.ago)
        end

        before { get '/api/v1/preferences', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '書籍が新しい順で返ってくる' do
          expect(json['books'].map { |bookshelf| bookshelf['id'] }).to eq [ bookshelf_1.id, bookshelf_3.id ]
        end

        it '読み終わっていない書籍は返ってこない' do
          expect(json['books'].map { |bookshelf| bookshelf['id'] }).not_to include bookshelf_2.id
        end

        it '他ユーザーの書籍は返ってこない' do
          expect(json['books'].map { |bookshelf| bookshelf['id'] }).not_to include other_bookshelf_1.id
        end

        it '読み終わった書籍の合計が返ってくる' do
          expect(json['preference']['total']).to eq 2
        end

        it '好み評価ごとの冊数が返ってくる' do
          expect(json['preference']['counts']).to eq({ 'favorite' => 1, 'unrated' => 1 })
        end

        it '好み評価ごとの割合が返ってくる' do
          expect(json['preference']['ratios']).to eq({ 'favorite' => 50.0, 'unrated' => 50.0 })
        end
      end

      context '診断される書籍が登録されていない場合' do
        before { get '/api/v1/preferences', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '書籍が空で返ってくる' do
          expect(json['books']).to eq []
        end

        it '合計が0で返ってくる' do
          expect(json['preference']['total']).to eq 0
        end

        it '冊数と割合が空で返ってくる' do
          expect(json['preference']['counts']).to eq({})
          expect(json['preference']['ratios']).to eq({})
        end
      end
    end
  end

  describe "GET /api/v1/preferences/undiagnosed" do
    let(:genre) { create(:genre) }
    let(:book_1) { create(:book) }
    let(:book_3) { create(:book) }

    context '未ログインの場合' do
      it '401が返ってくる' do
        get '/api/v1/preferences/undiagnosed'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みの場合' do
      context '診断される書籍が登録されている場合' do
        let!(:bookshelf_1) do
          create(:bookshelf, user: user, book: book_1, genres: [ genre ],
                    reading_status: :finished, preference_rating: :favorite, created_at: 2.days.ago)
        end

        let!(:bookshelf_3) do
          create(:bookshelf, user: user, book: book_3, genres: [ genre ],
                  reading_status: :finished, preference_rating: :unrated, created_at: 1.day.ago)
        end

        let!(:other_bookshelf_1) do
           create(:bookshelf, user: create(:user), book: book_1, genres: [ genre ],
                   reading_status: :finished, preference_rating: :favorite, created_at: 1.day.ago)
        end

        before { get '/api/v1/preferences/undiagnosed', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '読み終わっていて、好みが未登録の書籍が返ってくる' do
          expect(json['books'].map { |bookshelf| bookshelf['id'] }).to eq [ bookshelf_3.id ]
        end

        it '好みが登録されている書籍は返ってこない' do
          expect(json['books'].map { |bookshelf| bookshelf['id'] }).not_to include bookshelf_1.id
        end

        it '他ユーザーの書籍は返ってこない' do
          expect(json['books'].map { |bookshelf| bookshelf['id'] }).not_to include other_bookshelf_1.id
        end
      end
    end
  end

  describe "PATCH /api/v1/preferences/:id" do
    let(:genre) { create(:genre) }
    let(:book_1) { create(:book) }
    let(:book_2) { create(:book) }
    let!(:target_bookshelf) do
      create(:bookshelf, user: user, book: book_1, genres: [ genre ],
                reading_status: :finished, preference_rating: :unrated, created_at: 2.days.ago)
    end
    let!(:other_target_bookshelf) do
       create(:bookshelf, user: create(:user), book: book_1, genres: [ genre ],
               reading_status: :finished, preference_rating: :favorite, created_at: 1.day.ago)
    end
    let(:new_preference_rating) { 'favorite' }
    let(:invalid_preference_rating) { 'invalid' }
    let(:valid_params) { { preference: { preference_rating: new_preference_rating } } }
    let(:invalid_params) { { preference: { preference_rating: invalid_preference_rating } } }

    context '未ログインの場合' do
      it '401が返ってくる' do
        patch "/api/v1/preferences/#{target_bookshelf.id}", params: valid_params, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みの場合' do
      let(:target_id) { target_bookshelf.id }
      let(:params) { valid_params }

      before { patch "/api/v1/preferences/#{target_id}", params: params, headers: headers, as: :json }

      context '現在と異なる好み評価を送った場合' do
        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '好み評価が更新される' do
          expect(target_bookshelf.reload.preference_rating).to eq new_preference_rating
        end
      end

      context '現在と同じ好み評価を送った場合' do
        let(:new_preference_rating) { 'unrated' }

        it '422が返ってくる' do
          expect(response).to have_http_status(:unprocessable_content)
        end

        it 'エラーメッセージが返ってくる' do
          expect(json['error']).to eq '不正な評価です'
        end
      end

      context '存在しない好み評価を送った場合' do
        let(:params) { invalid_params }

        it '422が返ってくる' do
          expect(response).to have_http_status(:unprocessable_content)
        end

        it 'エラーメッセージが返ってくる' do
          expect(json['errors']).to be_present
        end

        it '好み評価が更新されない' do
          expect(target_bookshelf.reload.preference_rating).to eq 'unrated'
        end
      end

      context '好み評価のパラメータがない場合' do
        let(:params) { {} }

        it '400が返ってくる' do
          expect(response).to have_http_status(:bad_request)
        end
      end

      context '他ユーザーの書籍を指定した場合' do
        let(:target_id) { other_target_bookshelf.id }
        let(:new_preference_rating) { 'normal' }

        it '404が返ってくる' do
          expect(response).to have_http_status(:not_found)
        end

        it '好み評価が更新されない' do
          expect(other_target_bookshelf.reload.preference_rating).to eq 'favorite'
        end
      end

      context '存在しない書籍を指定した場合' do
        let(:target_id) { 0 }

        it '404が返ってくる' do
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end
end
