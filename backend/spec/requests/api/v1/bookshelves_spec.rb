require 'rails_helper'

RSpec.describe "Api::V1::Bookshelves", type: :request do
  let(:user) { create(:user) }
  let(:headers) { sign_in(user) }
  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v1/bookshelves" do
    context '未ログインの場合' do
      it '401が返ってくる' do
        get '/api/v1/bookshelves'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みの場合' do
      context '本棚に本が登録されている場合' do
        let(:genre) { create(:genre, name: 'SF') }
        let(:old_book) { create(:book) }
        let(:new_book) { create(:book) }
        let!(:old_bookshelf) do
          create(:bookshelf, user: user, book: old_book, genres: [ genre ],
                             reading_status: :reading, preference_rating: :favorite, created_at: 2.days.ago)
        end
        let!(:new_bookshelf) { create(:bookshelf, user: user, book: new_book, created_at: 1.day.ago) }
        let!(:other_bookshelf) { create(:bookshelf, user: create(:user), book: old_book, created_at: 1.day.ago) }

        before { get '/api/v1/bookshelves', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '自分の本棚が登録の新しい順で返ってくる' do
          expect(json['books'].map { |bookshelf| bookshelf['id'] }).to eq [ new_bookshelf.id, old_bookshelf.id ]
        end

        it '他ユーザーの本棚は返ってこない' do
          expect(json['books'].map { |bookshelf| bookshelf['id'] }).not_to include other_bookshelf.id
        end

        it '本棚・本・ジャンルの情報が返ってくる' do
          expect(json['books'].last).to eq({
            'id' => old_bookshelf.id,
            'reading_status' => 'reading',
            'preference_rating' => 'favorite',
            'book' => {
              'id' => old_book.id,
              'isbn' => old_book.isbn,
              'title' => old_book.title,
              'author' => old_book.author,
              'item_url' => old_book.item_url,
              'large_image_url' => old_book.large_image_url
            },
            'genres' => [ { 'id' => genre.id, 'name' => 'SF' } ]
          })
        end
      end

      context '本棚に本が登録されていない場合' do
        before { get '/api/v1/bookshelves', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it '空の配列が返ってくる' do
          expect(json['books']).to eq []
        end
      end
    end
  end

  describe "POST /api/v1/bookshelves" do
    subject(:post_bookshelf) { post '/api/v1/bookshelves', params: params, headers: headers, as: :json }
    let(:user) { create(:user) }
    let(:headers) { sign_in(user) }
    let(:genre) { create(:genre, name: 'SF') }
    let(:other_genre) { create(:genre, name: 'ビジネス') }
    let(:genre_ids) { [ genre.id, other_genre.id ] }
    let(:book_params) do
      {
        isbn: '9784101010137',
        title: 'こころ',
        author: '夏目漱石',
        item_url: 'https://example.com/items/9784101010137',
        large_image_url: 'https://example.com/images/9784101010137.jpg'
      }
    end
    let(:params) do
      {
        bookshelf: {
          reading_status: 'reading',
          preference_rating: 'favorite',
          genre_ids: genre_ids,
          book: book_params
        }
      }
    end

    context '未ログインの場合' do
      let(:headers) { {} }

      it '401が返ってくる' do
        post_bookshelf
        expect(response).to have_http_status(:unauthorized)
      end

      it '本棚が作成されない' do
        expect { post_bookshelf }.not_to change(Bookshelf, :count)
      end
    end

    context 'ログイン時の場合' do
      context 'まだ誰も登録していない本の場合' do
        it '201が返ってくる' do
          post_bookshelf
          expect(response).to have_http_status(:created)
        end

        it '本と本棚が作成される' do
          expect { post_bookshelf }.to change(Book, :count).by(1).and change(Bookshelf, :count).by(1)
        end

        it '送信した内容で本が保存される' do
          post_bookshelf
          expect(Book.last).to have_attributes(book_params)
        end

        it '送信した内容で自分の本棚に保存される' do
          post_bookshelf
          bookshelf = user.bookshelves.last
          expect(bookshelf).to have_attributes(reading_status: 'reading', preference_rating: 'favorite')
          expect(bookshelf.book.isbn).to eq book_params[:isbn]
          expect(bookshelf.genres).to eq([ genre, other_genre ])
        end
      end

      context '他ユーザーが登録済みの本の場合' do
        let!(:book) { create(:book, isbn: book_params[:isbn], title: '登録済みのタイトル') }

        before { create(:bookshelf, user: create(:user), book: book) }

        it '201が返ってくる' do
          post_bookshelf
          expect(response).to have_http_status(:created)
        end

        it '本棚が作成される' do
          expect { post_bookshelf }.to change(Bookshelf, :count).by(1)
        end

        it '本は新たに作成されない' do
          expect { post_bookshelf }.not_to change(Book, :count)
        end

        it '既存の本が自分の本棚に登録される' do
          post_bookshelf
          expect(user.bookshelves.last.book).to eq book
        end

        it '既存の本の情報は上書きされない' do
          post_bookshelf
          expect(book.reload.title).to eq '登録済みのタイトル'
        end
      end
    end

    context '既に登録済みの本の場合' do
      before do
        book = create(:book, isbn: book_params[:isbn])
        create(:bookshelf, user: user, book: book)
      end

      it '422が返ってくる' do
        post_bookshelf
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'エラーメッセージが返ってくる' do
        post_bookshelf
        expect(json['error']).to eq '既に登録されています'
      end

      it '本棚が作成されない' do
        expect { post_bookshelf }.not_to change(Bookshelf, :count)
      end
    end

    context 'ジャンルが不正な場合' do
      shared_examples '不正なジャンルとして登録に失敗する' do
        it '422が返ってくる' do
          post_bookshelf
          expect(response).to have_http_status(:unprocessable_content)
        end

        it 'エラーメッセージが返ってくる' do
          post_bookshelf
          expect(json['error']).to eq '不正なジャンルです'
        end

        it '本棚が作成されない' do
          expect { post_bookshelf }.not_to change(Bookshelf, :count)
        end
      end

      context 'ジャンルが空の場合' do
        let(:genre_ids) { [] }

        it_behaves_like '不正なジャンルとして登録に失敗する'
      end

      context 'ジャンルが送信されていない場合' do
        let(:params) { { bookshelf: { reading_status: 'reading', preference_rating: 'favorite', book: book_params } } }

        it_behaves_like '不正なジャンルとして登録に失敗する'
      end

      context 'ジャンルIDに数値以外が含まれる場合' do
        let(:genre_ids) { [ genre.id, 'abc' ] }

        it_behaves_like '不正なジャンルとして登録に失敗する'
      end

      context 'ジャンルIDに0が含まれる場合' do
        let(:genre_ids) { [ genre.id, 0 ] }

        it_behaves_like '不正なジャンルとして登録に失敗する'
      end

      context '存在しないジャンルIDの場合' do
        let(:genre_ids) { [ Genre.maximum(:id).to_i + 1 ] }

        it '404が返ってくる' do
          post_bookshelf
          expect(response).to have_http_status(:not_found)
        end

        it '本棚が作成されない' do
          expect { post_bookshelf }.not_to change(Bookshelf, :count)
        end
      end
    end
  end

  describe "PATCH /api/v1/bookshelves/:id" do
    subject(:patch_bookshelf) do
      patch "/api/v1/bookshelves/#{target_bookshelf.id}", params: params, headers: headers, as: :json
    end

    let(:user) { create(:user) }
    let(:headers) { sign_in(user) }
    let(:old_genre) { create(:genre, name: 'ホラー') }
    let(:genre) { create(:genre, name: 'SF') }
    let(:other_genre) { create(:genre, name: 'ビジネス') }
    let(:new_genre_ids) { [ genre.id, other_genre.id ] }
    let!(:bookshelf) do
      create(:bookshelf, user: user, book: create(:book), genres: [ old_genre ],
                         reading_status: :interested, preference_rating: :unrated)
    end
    let(:target_bookshelf) { bookshelf }
    let(:reading_status) { 'finished' }
    let(:params) do
      {
        bookshelf: {
          id: target_bookshelf.id,
          reading_status: reading_status,
          preference_rating: 'favorite',
          genre_ids: new_genre_ids
        }
      }
    end

    shared_examples '本棚が更新されない' do
      it '本棚が更新されない' do
        patch_bookshelf
        expect(target_bookshelf.reload).to have_attributes(reading_status: 'interested', preference_rating: 'unrated')
        expect(target_bookshelf.genres).to contain_exactly(old_genre)
      end
    end

    context '未ログインの場合' do
      let(:headers) { {} }

      it '401が返ってくる' do
        patch_bookshelf
        expect(response).to have_http_status(:unauthorized)
      end

      it_behaves_like '本棚が更新されない'
    end

    context 'ログイン時' do
      it '200が返ってくる' do
        patch_bookshelf
        expect(response).to have_http_status(:ok)
      end

      it '読書状況と好み評価が更新される' do
        patch_bookshelf
        expect(bookshelf.reload).to have_attributes(reading_status: 'finished', preference_rating: 'favorite')
      end

      it 'ジャンルが送信した内容に置き換わる' do
        patch_bookshelf
        expect(bookshelf.reload.genres).to eq([ genre, other_genre ])
      end
    end

    context '他ユーザーの本棚の場合' do
      let!(:other_user_bookshelf) do
        create(:bookshelf, user: create(:user), book: create(:book), genres: [ old_genre ],
                           reading_status: :interested, preference_rating: :unrated)
      end
      let(:target_bookshelf) { other_user_bookshelf }

      it '404が返ってくる' do
        patch_bookshelf
        expect(response).to have_http_status(:not_found)
      end

      it_behaves_like '本棚が更新されない'
    end

    context '読書状況が空の場合' do
      let(:reading_status) { nil }

      it '422が返ってくる' do
        patch_bookshelf
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'エラーメッセージが返ってくる' do
        patch_bookshelf
        expect(json['error']).to eq '更新に失敗しました'
      end
    end

    context 'ジャンルが不正な場合' do
      shared_examples '不正なジャンルとして更新に失敗する' do
        it '422が返ってくる' do
          patch_bookshelf
          expect(response).to have_http_status(:unprocessable_content)
        end

        it 'エラーメッセージが返ってくる' do
          patch_bookshelf
          expect(json['error']).to eq '不正なジャンルです'
        end

        it_behaves_like '本棚が更新されない'
      end

      context 'ジャンルが空の場合' do
        let(:new_genre_ids) { [] }

        it_behaves_like '不正なジャンルとして更新に失敗する'
      end

      context 'ジャンルが送信されていない場合' do
        let(:params) { { bookshelf: { id: bookshelf.id, reading_status: 'finished', preference_rating: 'favorite' } } }

        it_behaves_like '不正なジャンルとして更新に失敗する'
      end

      context 'ジャンルIDに数値以外が含まれる場合' do
        let(:new_genre_ids) { [ genre.id, 'abc' ] }

        it_behaves_like '不正なジャンルとして更新に失敗する'
      end

      context 'ジャンルIDに0が含まれる場合' do
        let(:new_genre_ids) { [ genre.id, 0 ] }

        it_behaves_like '不正なジャンルとして更新に失敗する'
      end

      context '存在しないジャンルIDの場合' do
        let(:new_genre_ids) { [ Genre.maximum(:id).to_i + 1 ] }

        it '404が返ってくる' do
          patch_bookshelf
          expect(response).to have_http_status(:not_found)
        end

        it_behaves_like '本棚が更新されない'
      end
    end
  end
end
