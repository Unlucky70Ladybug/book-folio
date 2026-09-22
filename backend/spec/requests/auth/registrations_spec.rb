require "rails_helper"

RSpec.describe "Auth::Registrations", type: :request do
  describe "POST /auth (サインアップ)" do
    let(:valid_params) do
      {
        name: "テストユーザー",
        email: "test@example.com",
        password: "password",
        password_confirmation: "password"
      }
    end

    context "有効なパラメータの場合" do
      it "ユーザーが新規作成される" do
        expect do
          post "/auth", params: valid_params
        end.to change(User, :count).by(1)
      end

      it "ステータスコード200が返る" do
        post "/auth", params: valid_params
        expect(response).to have_http_status(:ok)
      end

      it "作成直後は未確認ステータスになる" do
        post "/auth", params: valid_params
        expect(User.last.confirmed_at).to be_nil
      end
    end

    context "nameが空の場合" do
      it "ユーザーが作成されない" do
        expect do
          post "/auth", params: valid_params.merge(name: "")
        end.not_to change(User, :count)
      end

      it "ステータスコード422が返る" do
        post "/auth", params: valid_params.merge(name: "")
        expect(response).to have_http_status(:unprocessable_content)
      end
    end

    context "emailが空の場合" do
      it "ユーザーが作成されない" do
        expect do
          post "/auth", params: valid_params.merge(email: "")
        end.not_to change(User, :count)
      end

      it "ステータスコード422が返る" do
        post "/auth", params: valid_params.merge(email: "")
        expect(response).to have_http_status(:unprocessable_content)
      end
    end

    context "emailがすでに登録されている場合" do
      before { create(:user, email: "test@example.com") }

      it "ユーザーが作成されない" do
        expect do
          post "/auth", params: valid_params
        end.not_to change(User, :count)
      end

      it "ステータスコード422が返る" do
        post "/auth", params: valid_params
        expect(response).to have_http_status(:unprocessable_content)
      end
    end

    context "passwordとpassword_confirmationが一致しない場合" do
      it "ユーザーが作成されない" do
        expect do
          post "/auth", params: valid_params.merge(password_confirmation: "different")
        end.not_to change(User, :count)
      end

      it "ステータスコード422が返る" do
        post "/auth", params: valid_params.merge(password_confirmation: "different")
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end
end
