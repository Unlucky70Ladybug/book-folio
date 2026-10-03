require 'rails_helper'

RSpec.describe Bookshelf, type: :model do
  describe "Bookshelfモデル" do
    let(:user) { create(:user) }
    let(:book) { create(:book) }
    let(:reading_status) { Faker::Number.between(from: 0, to: 2) }
    let(:preference_rating) { Faker::Number.between(from: 0, to: 4) }
    let(:valid_bookshelf) { { user: user, book: book, reading_status: reading_status, preference_rating: preference_rating } }

    context "有効な場合" do
      it "全ての項目が正常値" do
        bookshelf = Bookshelf.new(user: user, book: book, reading_status: reading_status, preference_rating: preference_rating)
        expect(bookshelf).to be_valid
      end

      it "preference_ratingを指定しない場合はunratedになる" do
        bookshelf = Bookshelf.new(user: user, book: book, reading_status: reading_status)
        expect(bookshelf).to be_valid
        expect(bookshelf).to be_unrated
      end

      it "同じ本を別のユーザーが登録する場合" do
        Bookshelf.create!(valid_bookshelf)
        bookshelf = Bookshelf.new(valid_bookshelf.merge(user: create(:user)))
        expect(bookshelf).to be_valid
      end

      it "同じユーザーが別の本を登録する場合" do
        Bookshelf.create!(valid_bookshelf)
        bookshelf = Bookshelf.new(valid_bookshelf.merge(book: create(:book)))
        expect(bookshelf).to be_valid
      end
    end

    context "無効な場合" do
      it "userがない場合" do
        bookshelf = Bookshelf.new(valid_bookshelf.merge(user: nil))
        expect(bookshelf).to be_invalid
      end

      it "bookがない場合" do
        bookshelf = Bookshelf.new(valid_bookshelf.merge(book: nil))
        expect(bookshelf).to be_invalid
      end

      it "同じユーザーが同じ本を重複して登録する場合" do
        Bookshelf.create!(valid_bookshelf)
        bookshelf = Bookshelf.new(valid_bookshelf)
        expect(bookshelf).to be_invalid
      end

      it "reading_statusがない場合" do
        bookshelf = Bookshelf.new(valid_bookshelf.merge(reading_status: nil))
        expect(bookshelf).to be_invalid
      end

      it "preference_ratingがない場合" do
        bookshelf = Bookshelf.new(valid_bookshelf.merge(preference_rating: nil))
        expect(bookshelf).to be_invalid
      end

      it "reading_statusが定義外の値の場合" do
        expect { Bookshelf.new(valid_bookshelf.merge(reading_status: 3)) }.to raise_error(ArgumentError)
      end

      it "preference_ratingが定義外の値の場合" do
        expect { Bookshelf.new(valid_bookshelf.merge(preference_rating: 5)) }.to raise_error(ArgumentError)
      end
    end

    context "enumのテスト" do
      it "reading_statusが定義通りである" do
        expect(Bookshelf.reading_statuses).to eq({ "interested" => 0, "reading" => 1, "finished" => 2 })
      end

      it "preference_ratingが定義通りである" do
        expect(Bookshelf.preference_ratings).to eq({ "unrated" => 0, "not_for_me" => 1, "normal" => 2, "interesting" => 3, "favorite" => 4 })
      end
    end

    context "関連付け" do
      let(:bookshelf) { Bookshelf.create!(valid_bookshelf) }
      let(:genre) { create(:genre) }

      it "紐づくユーザーと本を取得できる" do
        expect(bookshelf.user).to eq(user)
        expect(bookshelf.book).to eq(book)
      end

      it "紐づくジャンルを取得できる" do
        BookGenre.create!(bookshelf: bookshelf, genre: genre)
        expect(bookshelf.genres).to include(genre)
      end

      it "本棚を削除すると紐づくbook_genresも削除される" do
        BookGenre.create!(bookshelf: bookshelf, genre: genre)
        expect { bookshelf.destroy }.to change(BookGenre, :count).by(-1)
      end

      it "本棚を削除してもジャンルは削除されない" do
        BookGenre.create!(bookshelf: bookshelf, genre: genre)
        expect { bookshelf.destroy }.not_to change(Genre, :count)
      end

      it "本棚を削除してもユーザーと本は削除されない" do
        bookshelf
        expect { bookshelf.destroy }.not_to change { [ User.count, Book.count ] }
      end
    end
  end
end
