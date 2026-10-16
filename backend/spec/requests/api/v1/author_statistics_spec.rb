require 'rails_helper'

RSpec.describe "Api::V1::AuthorStatistics", type: :request do
  let(:user) { create(:user) }
  let(:headers) { sign_in(user) }
  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v1/genre_statistics" do
    context '未ログインの場合' do
      it '401が返ってくる' do
        get '/api/v1/bookshelves'
        expect(response).to have_http_status(:unauthorized)
      end
    end

  end
end
