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

      
    end
  end
end
