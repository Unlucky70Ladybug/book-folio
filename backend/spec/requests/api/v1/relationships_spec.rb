require 'rails_helper'

RSpec.describe "Api::V1::Relationships", type: :request do
  let(:user) { create(:user) }
  let(:headers) { sign_in(user) }
  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v1/relationships" do
    context '未ログインの場合' do
      it '401が返ってくる' do
        get '/api/v1/relationships'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みの場合' do
      let(:other_user_1) { create(:user) }
      let(:other_user_2) { create(:user) }
      let(:other_user_3) { create(:user) }

      it '200が返ってくる' do
        get '/api/v1/relationships', headers: headers
        expect(response).to have_http_status(:ok)
      end

      it 'フォロー・フォロワーがいないとき' do
        get '/api/v1/relationships', headers: headers
        expect(json['result']['following']).to eq []
        expect(json['result']['followers']).to eq []

      end

      it 'フォローあり、フォロワーがいないとき' do
        create(:relationship, follower: user, followed: other_user_1)
        create(:relationship, follower: user, followed: other_user_2)
        get '/api/v1/relationships', headers: headers
        expect(json['result']['following'].map { |user| user['id'] }).to include(other_user_1.id, other_user_2.id)
        expect(json['result']['followers']).to eq []
      end

      it 'フォローなし、フォロワーがいるとき' do
        create(:relationship, follower: other_user_1, followed: user)
        create(:relationship, follower: other_user_2, followed: user)
        get '/api/v1/relationships', headers: headers
        expect(json['result']['following']).to eq []
        expect(json['result']['followers'].map { |user| user['id'] }).to include(other_user_1.id, other_user_2.id)
      end

      it 'フォロー・フォロワーがいるとき' do
        create(:relationship, follower: other_user_1, followed: user)
        create(:relationship, follower: other_user_2, followed: user)
        create(:relationship, follower: user, followed: other_user_3)
        get '/api/v1/relationships', headers: headers
        expect(json['result']['following'].map { |user| user['id'] }).to eq [other_user_3.id]
        expect(json['result']['followers'].map { |user| user['id'] }).to include(other_user_1.id, other_user_2.id)
        expect(json['result']['followers'].map { |user| user['id'] }).not_to include(other_user_3.id)
      end
    end
  end
end
