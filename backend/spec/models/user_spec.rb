require 'rails_helper'

RSpec.describe User, type: :model do
  describe "Userモデル" do
    let(:valid_user) { { name: "テストユーザー", email: "test@example.com", password: "password", password_confirmation: "password" } }

    context "有効な場合" do
      it "ユーザーアイコンなし" do
        user = User.new(valid_user)
        expect(user).to be_valid
      end

      it "ユーザーアイコンあり" do
        user = User.new(valid_user)
        user.avatar_image = File.open(Rails.root.join("spec/fixtures/files/10MB.png"))
        expect(user).to be_valid
      end
    end

    context "無効な場合" do
      it "nameが空の場合" do
        user = User.new(valid_user.merge(name: ""))
        expect(user).to be_invalid
      end

      it "パスワードがない場合" do
        user = User.new(valid_user.merge(password: ""))
        expect(user).to be_invalid
      end

      it "確認用のパスワードがない場合" do
        user = User.new(valid_user.merge(password_confirmation: ""))
        expect(user).to be_invalid
      end

      it "パスワードと確認用のパスワードが一致しない場合" do
        user = User.new(valid_user.merge(password_confirmation: "different_password"))
        expect(user).to be_invalid
      end

      it "ユーザーアイコンに使用する画像が大きい" do
        user = User.new(valid_user)
        user.avatar_image = File.open(Rails.root.join("spec/fixtures/files/20MB.png"))
        expect(user).to be_invalid
      end

      it "ユーザーアイコンに使用する画像の種類が異なる" do
        user = User.new(valid_user)
        user.avatar_image = File.open(Rails.root.join("spec/fixtures/files/coloring.svg"))
        expect(user).to be_invalid
      end
    end
  end
end
