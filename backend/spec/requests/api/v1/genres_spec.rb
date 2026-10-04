require 'rails_helper'

RSpec.describe "Api::V1::Genres", type: :request do
  describe "GET /api/v1/genres" do
    let(:user) { create(:user) }
    let(:headers) { sign_in(user) }
    let(:json) { JSON.parse(response.body) }

    context '未ログインの場合' do
      it '401が返ってくる' do
        get '/api/v1/genres'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログインした場合' do
      context 'ジャンルが登録されている場合' do
        let!(:novel) { create(:genre, name: 'SF') }
        let!(:business) { create(:genre, name: 'ビジネス') }
        let!(:comic) { create(:genre, name: 'ホラー') }

        before { get '/api/v1/genres', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '全てのジャンルがid順で返ってくる' do
          expect(json['genres'].map { |genre| genre['id'] }).to eq [ novel.id, business.id, comic.id ]
        end

        it 'idとnameのみが返ってくる' do
          expect(json['genres'].first).to eq({ 'id' => novel.id, 'name' => 'SF' })
        end
      end

      context 'ジャンルが登録されていない場合' do
        before { get '/api/v1/genres', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '空の配列が返ってくる' do
          expect(json['genres']).to eq []
        end
      end
    end
  end
end
