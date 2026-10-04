require 'rails_helper'

RSpec.describe Book, type: :model do
  describe "Bookモデル" do
    let(:valid_isbn) { Faker::Number.number(digits: 13).to_s }
    let(:valid_tite) { Faker::Lorem.sentence(word_count: 4) }
    let(:valid_author) { Faker::Name.name }
    let(:valid_item_url) { Faker::Internet.url }
    let(:valid_large_image_url) { Faker::Internet.url }
    let(:valid_fetched_at) { Time.current }
    let(:valid_book) { { isbn: valid_isbn, title: valid_tite, author: valid_author, item_url: valid_item_url, large_image_url: valid_large_image_url, fetched_at: valid_fetched_at } }

    context "有効な場合" do
      it "全てのカラムが正常値" do
        book = Book.new(isbn: valid_isbn, title: valid_tite, author: valid_author, item_url: valid_item_url, large_image_url: valid_large_image_url, fetched_at: valid_fetched_at)
        expect(book).to be_valid
      end

      it "item_urlがない場合" do
        book = Book.new(valid_book.merge(item_url: nil))
        expect(book).to be_valid
      end

      it "large_image_urlがない場合" do
        book = Book.new(valid_book.merge(large_image_url: nil))
        expect(book).to be_valid
      end
    end

    context "無効な場合" do
      it "isbnが空の場合" do
        book = Book.new(valid_book.merge(isbn: ""))
        expect(book).to be_invalid
      end

      it "isbnが重複している場合" do
        Book.create!(valid_book)
        book = Book.new(attributes_for(:book).merge(isbn: valid_book[:isbn]))
        expect(book).to be_invalid
      end

      it "titleが空の場合" do
        book = Book.new(valid_book.merge(title: ""))
        expect(book).to be_invalid
      end

      it "authorが空の場合" do
        book = Book.new(valid_book.merge(author: ""))
        expect(book).to be_invalid
      end

      it "fetched_atがない場合" do
        book = Book.new(valid_book.merge(fetched_at: nil))
        expect(book).to be_invalid
      end
    end

    context "関連付け" do
      it "本を削除すると紐づく本棚も削除される" do
        book = Book.create!(valid_book)
        create(:bookshelf, user: create(:user), book: book)
        expect { book.destroy }.to change(Bookshelf, :count).by(-1)
      end
    end
  end
end
