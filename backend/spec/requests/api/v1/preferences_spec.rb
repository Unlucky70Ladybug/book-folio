require 'rails_helper'

RSpec.describe "Api::V1::Preferences", type: :request do
  let(:user) { create(:user) }
  let(:headers) { sign_in(user) }
  let(:json) { JSON.parse(response.body) }

  describe "PATCH /api/v1/preferences/:id" do
    let!(:bookshelf) do
      create(:bookshelf, user: user, reading_status: :finished, preference_rating: :unrated)
    end
    let!(:post_record) { create(:post, bookshelf: bookshelf) }
    let(:params) { { preference: { preference_rating: 'favorite' } } }

    context '未ログインの場合' do
      it '401が返ってくる' do
        patch "/api/v1/preferences/#{bookshelf.id}", params: params
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みの場合' do
      it '好み評価のみ更新され、コメントは残る' do
        patch "/api/v1/preferences/#{bookshelf.id}", params: params, headers: headers
        expect(response).to have_http_status(:ok)
        expect(bookshelf.reload).to be_favorite
        expect(bookshelf.reading_status).to eq 'finished'
        expect(bookshelf.post).to eq post_record
      end

      it '不正な評価の場合は422が返ってくる' do
        patch "/api/v1/preferences/#{bookshelf.id}",
              params: { preference: { preference_rating: 'invalid' } }, headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
        expect(bookshelf.reload).to be_unrated
      end

      it '他のユーザーの本は更新できない' do
        other_bookshelf = create(:bookshelf, user: create(:user), preference_rating: :unrated)
        patch "/api/v1/preferences/#{other_bookshelf.id}", params: params, headers: headers
        expect(response).to have_http_status(:not_found)
        expect(other_bookshelf.reload).to be_unrated
      end
    end
  end
end
