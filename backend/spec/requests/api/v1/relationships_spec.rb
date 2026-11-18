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
        expect(json['result']['following'].map { |user| user['id'] }).to eq [ other_user_3.id ]
        expect(json['result']['followers'].map { |user| user['id'] }).to include(other_user_1.id, other_user_2.id)
        expect(json['result']['followers'].map { |user| user['id'] }).not_to include(other_user_3.id)
      end
    end
  end

  describe "GET /api/v1/relationships/:id" do
    let(:other_user_1) { create(:user) }
    let(:other_user_2) { create(:user) }
    let(:other_user_3) { create(:user) }

    context '未ログインの場合' do
      it '401が返ってくる' do
        get "/api/v1/relationships/#{other_user_1.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みの場合' do
      it '200が返ってくる' do
        get "/api/v1/relationships/#{other_user_1.id}", headers: headers
        expect(response).to have_http_status(:ok)
      end

      context 'カレントユーザーがフォローしているか' do
        it '対象ユーザーをフォローしていればtrue' do
          create(:relationship, follower: user, followed: other_user_1)
          get "/api/v1/relationships/#{other_user_1.id}", headers: headers
          expect(json['result']['follow_status']).to be true
        end

        it '対象ユーザーをフォローしていなければfalse' do
          get "/api/v1/relationships/#{other_user_1.id}", headers: headers
          expect(json['result']['follow_status']).to be false
        end

        it '対象ユーザーにフォローされているだけならfalse' do
          create(:relationship, follower: other_user_1, followed: user)
          get "/api/v1/relationships/#{other_user_1.id}", headers: headers
          expect(json['result']['follow_status']).to be false
        end
      end

      context '対象ユーザーのフォロー・フォロワー一覧' do
        it 'フォロー・フォロワーがいないとき空配列' do
          get "/api/v1/relationships/#{other_user_1.id}", headers: headers
          expect(json['result']['following']).to eq []
          expect(json['result']['followers']).to eq []
        end

        it '対象ユーザーの一覧が返る' do
          create(:relationship, follower: other_user_1, followed: other_user_2)
          create(:relationship, follower: other_user_3, followed: other_user_1)
          create(:relationship, follower: user, followed: other_user_3)

          get "/api/v1/relationships/#{other_user_1.id}", headers: headers
          expect(json['result']['following'].map { |user| user['id'] }).to eq [ other_user_2.id ]
          expect(json['result']['followers'].map { |user| user['id'] }).to eq [ other_user_3.id ]
        end

        it 'カレントユーザーが対象ユーザーをフォローすると、対象のfollowersに含まれる' do
          create(:relationship, follower: user, followed: other_user_1)
          get "/api/v1/relationships/#{other_user_1.id}", headers: headers
          expect(json['result']['followers'].map { |user| user['id'] }).to include(user.id)
        end
      end
    end
  end

  describe "POST /api/v1/relationships" do
    let(:other_user_1) { create(:user) }
    let(:other_user_2) { create(:user) }
    let(:other_user_3) { create(:user) }
    let(:params) { { relationship: { followed_id: other_user_1.id } } }
    let(:nonexistent_user_params) { { relationship: { followed_id: 0 } } }
    let(:self_follow_params) { { relationship: { followed_id: user.id } } }

    context '未ログインの場合' do
      it '401が返ってくる' do
        post '/api/v1/relationships', params: params, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン時の場合' do
      subject(:post_relationships) { post '/api/v1/relationships', params: params, headers: headers, as: :json }
      before {
        create(:relationship, follower: other_user_2, followed: other_user_1)
        create(:relationship, follower: other_user_1, followed: other_user_2)
        create(:relationship, follower: other_user_1, followed: other_user_3)
      }
      it '201が返ってくる' do
        post_relationships
        expect(response).to have_http_status(:created)
      end

      it 'フォローが成功する' do
        expect { post_relationships }.to change(Relationship, :count).by(1)
        expect(json['result']['following'].map { |user| user['id'] }).to match_array([ other_user_2.id, other_user_3.id ])
        expect(json['result']['followers'].map { |user| user['id'] }).to match_array([ other_user_2.id, user.id ])
        expect(json['result']['follow_status']).to be true
      end
      it 'すでにフォローしている' do
        create(:relationship, follower: user, followed: other_user_1)
        expect { post_relationships }.not_to change(Relationship, :count)
        expect(response).to have_http_status(:unprocessable_content)
      end
      it '存在しないユーザーをフォロー出来ない' do
        expect { post '/api/v1/relationships', params: nonexistent_user_params, headers: headers, as: :json }.not_to change(Relationship, :count)
        expect(response).to have_http_status(:not_found)
      end
      it '自分をフォローできない' do
        expect { post '/api/v1/relationships', params: self_follow_params, headers: headers, as: :json }.not_to change(Relationship, :count)
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "DELETE /api/v1/relationships/:id" do
    let(:other_user_1) { create(:user) }
    let(:other_user_2) { create(:user) }
    let(:other_user_3) { create(:user) }

    context '未ログインの場合' do
      it '401が返ってくる' do
        delete "/api/v1/relationships/#{other_user_1.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン時の場合' do
      subject(:delete_relationships) { delete "/api/v1/relationships/#{other_user_1.id}", headers: headers }

      context 'フォローしている場合' do
        before {
          create(:relationship, follower: user, followed: other_user_1)
          create(:relationship, follower: other_user_2, followed: other_user_1)
          create(:relationship, follower: other_user_1, followed: other_user_3)
        }

        it '200が返ってくる' do
          delete_relationships
          expect(response).to have_http_status(:ok)
        end

        it 'フォロー解除が成功する' do
          expect { delete_relationships }.to change(Relationship, :count).by(-1)
          expect(json['result']['following'].map { |user| user['id'] }).to match_array([ other_user_3.id ])
          expect(json['result']['followers'].map { |user| user['id'] }).to match_array([ other_user_2.id ])
          expect(json['result']['follow_status']).to be false
        end

        it '他のユーザーのフォロー関係は削除されない' do
          delete_relationships
          expect(Relationship.exists?(follower: other_user_2, followed: other_user_1)).to be true
          expect(Relationship.exists?(follower: other_user_1, followed: other_user_3)).to be true
        end
      end

      it 'フォローしていないユーザーは解除できない' do
        expect { delete_relationships }.not_to change(Relationship, :count)
        expect(response).to have_http_status(:not_found)
      end

      it '存在しないユーザーは解除できない' do
        expect { delete '/api/v1/relationships/0', headers: headers }.not_to change(Relationship, :count)
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
