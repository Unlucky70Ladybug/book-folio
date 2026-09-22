require 'rails_helper'

RSpec.describe 'Auth::Sessions', type: :request do
  let(:password) { 'password' }
  let(:user) { create(:user, password: password, password_confirmation: password, confirmed_at: Time.current) }

  describe 'POST /auth/sign_in' do
    context 'メールアドレスとパスワードが正しい場合' do
      it 'ログインに成功し、認証トークンが返る' do
        post '/auth/sign_in', params: { email: user.email, password: password }

        expect(response).to have_http_status(:ok)
        expect(response.headers['access-token']).to be_present
        expect(response.headers['client']).to be_present
        expect(response.headers['uid']).to eq(user.email)
      end
    end

    context 'パスワードが誤っている場合' do
      it 'ログインに失敗する' do
        post '/auth/sign_in', params: { email: user.email, password: 'wrong-password' }

        expect(response).to have_http_status(:unauthorized)
        expect(response.headers['access-token']).to be_blank
      end
    end

    context '存在しないメールアドレスの場合' do
      it 'ログインに失敗する' do
        post '/auth/sign_in', params: { email: 'unknown@example.com', password: password }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /auth/sign_out' do
    let(:user) { create(:user) }
    let(:headers) {sign_in(user)}

    it "ログアウトできる" do
      delete "/auth/sign_out", headers: headers
      expect(response).to have_http_status(:success)
    end

    it "ログアウト後は認証できない" do
      delete "/auth/sign_out", headers: headers
      get "/auth/validate_token", headers: headers
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
