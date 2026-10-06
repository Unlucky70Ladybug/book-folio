require 'rails_helper'

RSpec.describe Post, type: :model do
  describe "Postモデル" do
    let(:bookshelf) { create(:bookshelf) }
    let(:content) { Faker::Lorem.sentence }

    context "有効な場合" do
      it "正常なコメント、ネタバレあり" do
        valid_post = Post.new(bookshelf: bookshelf, content: content, has_spoiler: true)
        expect(valid_post).to be_valid
      end

      it "正常なコメント、ネタバレなし" do
        valid_post = Post.new(bookshelf: bookshelf, content: content, has_spoiler: false)
        expect(valid_post).to be_valid
      end
    end

    context "無効な場合" do
      it "コメントあり、ネタバレの設定なし" do
        valid_post = Post.new(bookshelf: bookshelf, content: content, has_spoiler: nil)
        expect(valid_post).to be_invalid
      end

      it "コメントなし、ネタバレの設定あり" do
        valid_post = Post.new(bookshelf: bookshelf, content: "", has_spoiler: true)
        expect(valid_post).to be_invalid
      end

      it "コメントなし、ネタバレの設定あり" do
        valid_post = Post.new(bookshelf: bookshelf, content: "", has_spoiler: false)
        expect(valid_post).to be_invalid
      end

      it "コメントなし、ネタバレの設定なし" do
        valid_post = Post.new(bookshelf: bookshelf, content: "", has_spoiler: nil)
        expect(valid_post).to be_invalid
      end
    end
  end
end
