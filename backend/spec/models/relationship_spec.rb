require 'rails_helper'

RSpec.describe Relationship, type: :model do
  describe "Relationshipモデル" do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }

    context "有効な場合" do
      it "正常に登録できる" do
        relationship = Relationship.new(follower: user, followed: other_user)
        expect(relationship).to be_valid
      end

      it "相互フォロー可能" do
        relationship_1 = Relationship.new(follower: user, followed: other_user)
        relationship_2 = Relationship.new(follower: other_user, followed: user)
        expect(relationship_1).to be_valid
        expect(relationship_2).to be_valid
      end
    end

    context "無効な場合" do
      it "フォローする人がいない" do
        relationship = Relationship.new(follower: nil, followed: other_user)
        expect(relationship).to be_invalid
        expect(relationship.errors[:follower]).to be_present
      end

      it "フォローされる人がいない" do
        relationship = Relationship.new(follower: user, followed: nil)
        expect(relationship).to be_invalid
        expect(relationship.errors[:followed]).to be_present
      end

      it "すでにフォローしている" do
        Relationship.create!(follower: user, followed: other_user)
        relationship = Relationship.new(follower: user, followed: other_user)
        expect(relationship).to be_invalid
        expect(relationship.errors[:followed]).to be_present
      end

      it "自分をフォローしようとする" do
        relationship = Relationship.new(follower: user, followed: user)
        expect(relationship).to be_invalid
        expect(relationship.errors[:followed]).to be_present
      end
    end
  end
end
