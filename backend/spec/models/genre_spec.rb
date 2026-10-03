require 'rails_helper'

RSpec.describe Genre, type: :model do
  describe "Genreモデル" do
    let(:genre_name) { Faker::Book.genre }

    context "有効な場合" do
      it "正常なジャンル名" do
        valid_genre = Genre.new(name: genre_name)
        expect(valid_genre).to be_valid
      end
    end

    context "無効な場合" do
      it "nameが空の場合" do
        genre = Genre.new(name: "")
        expect(genre).to be_invalid
      end

      it "nameがない場合" do
        genre = Genre.new(name: nil)
        expect(genre).to be_invalid
      end

      it "nameが重複している場合" do
        Genre.create!(name: genre_name)
        genre = Genre.new(name: genre_name)
        expect(genre).to be_invalid
      end
    end

    context "関連付け" do
      let(:genre) { Genre.create!(name: genre_name) }
      let(:bookshelf) { create(:bookshelf, user: create(:user), book: create(:book)) }

      it "紐づく本棚を取得できる" do
        BookGenre.create!(bookshelf: bookshelf, genre: genre)
        expect(genre.bookshelves).to include(bookshelf)
        expect(bookshelf.genres).to include(genre)
      end

      it "ジャンルを削除すると紐づくbook_genresも削除される" do
        BookGenre.create!(bookshelf: bookshelf, genre: genre)
        expect { genre.destroy }.to change(BookGenre, :count).by(-1)
      end

      it "ジャンルを削除しても本棚は削除されない" do
        BookGenre.create!(bookshelf: bookshelf, genre: genre)
        expect { genre.destroy }.not_to change(Bookshelf, :count)
      end
    end
  end
end
