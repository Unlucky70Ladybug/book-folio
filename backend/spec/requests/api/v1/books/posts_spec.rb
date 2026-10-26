require 'rails_helper'

RSpec.describe "Api::V1::Books::Posts", type: :request do
  let(:user) { create(:user) }
  let(:headers) { sign_in(user) }
  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v1/books/:book_isbn/posts" do
    context '未ログインの場合' do
      it '401が返ってくる' do
        get '/api/v1/books/2/posts'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済みの場合' do
      context '存在しない本のURLを叩いたとき' do
        before { get '/api/v1/books/2/posts', headers: headers }

        it '200が返ってくる' do
          expect(response).to have_http_status(:ok)
        end

        it 'nullかつ、コメントの数が0' do
          expect(json['current_user_info']).to eq nil
          expect(json['posts']).to eq nil
          expect(json['post_count']).to eq 0
        end
      end

      context '本のコメントがないとき' do
        let!(:book) { create(:book) }
        let!(:bookshelf_1) { create(:bookshelf, book: book, user: user) }
        let!(:bookshelf_2) { create(:bookshelf, book: book, user: create(:user)) }

        before { get "/api/v1/books/#{book.isbn}/posts", headers: headers }

        it '自分の本棚情報が返り、コメントの数が0' do
          expect(json['current_user_info']['id']).to eq bookshelf_1.id
          expect(json['current_user_info']['post']).to eq nil
          expect(json['posts'].size).to eq 0
          expect(json['post_count']).to eq 0
        end
      end

      context '本のコメントがあるとき' do
        let!(:book) { create(:book) }
        let(:other_user_1) { create(:user) }
        let(:other_user_2) { create(:user) }

        context '自分はコメントしたが、他のユーザーはコメントしていないとき' do
          let!(:my_bookshelf) { create(:bookshelf, book: book, user: user) }
          let!(:my_post) { create(:post, bookshelf: my_bookshelf) }
          # コメントなしで本棚に登録だけしている他ユーザー
          let!(:other_bookshelf) { create(:bookshelf, book: book, user: other_user_1) }

          before { get "/api/v1/books/#{book.isbn}/posts", headers: headers }

          it '自分のコメントが返り、他ユーザーのコメント一覧は空' do
            expect(json['current_user_info']['id']).to eq my_bookshelf.id
            expect(json['current_user_info']['post']['id']).to eq my_post.id
            expect(json['posts'].size).to eq 0
            expect(json['post_count']).to eq 0
          end
        end

        context '自分はコメントしていないが、他のユーザーはコメントしているとき' do
          let!(:my_bookshelf) { create(:bookshelf, book: book, user: user) }
          let!(:post_1) { create(:post, bookshelf: create(:bookshelf, book: book, user: other_user_1)) }
          let!(:post_2) { create(:post, bookshelf: create(:bookshelf, book: book, user: other_user_2)) }

          before { get "/api/v1/books/#{book.isbn}/posts", headers: headers }

          it '自分の本棚の post は nil で、他ユーザーのコメントが返る' do
            expect(json['current_user_info']['id']).to eq my_bookshelf.id
            expect(json['current_user_info']['post']).to eq nil
            expect(json['posts'].map { |p| p['post']['id'] }).to match_array [ post_1.id, post_2.id ]
            expect(json['post_count']).to eq 2
          end
        end

        context '自分がコメントしており、他のユーザーもコメントしているとき' do
          let!(:my_bookshelf) { create(:bookshelf, book: book, user: user) }
          let!(:my_post) { create(:post, bookshelf: my_bookshelf) }
          let!(:post_1) { create(:post, bookshelf: create(:bookshelf, book: book, user: other_user_1)) }
          let!(:post_2) { create(:post, bookshelf: create(:bookshelf, book: book, user: other_user_2)) }

          before { get "/api/v1/books/#{book.isbn}/posts", headers: headers }

          it '自分のコメントは current_user_info に入り、posts には含まれない' do
            expect(json['current_user_info']['post']['id']).to eq my_post.id
            post_ids = json['posts'].map { |p| p['post']['id'] }
            expect(post_ids).to match_array [ post_1.id, post_2.id ]
            expect(post_ids).not_to include my_post.id
            expect(json['post_count']).to eq 2
          end
        end

        context '他の本にコメントしているユーザーがいるとき' do
          let!(:post_1) { create(:post, bookshelf: create(:bookshelf, book: book, user: other_user_1)) }
          # 別の本へのコメント
          let!(:other_book_post) { create(:post, bookshelf: create(:bookshelf, book: create(:book), user: other_user_2)) }

          before { get "/api/v1/books/#{book.isbn}/posts", headers: headers }

          it '他の本のコメントは表示されない' do
            expect(json['current_user_info']).to eq nil
            expect(json['posts'].map { |p| p['post']['id'] }).to eq [ post_1.id ]
            expect(json['posts'].map { |p| p['user']['id'] }).not_to include other_user_2.id
            expect(json['post_count']).to eq 1
          end
        end
      end

      context 'ユーザーごとの登録ジャンル' do
        let!(:book) { create(:book) }
        let(:other_user_1) { create(:user) }
        let(:other_user_2) { create(:user) }
        # ジャンルを宣言
        let!(:genre_mystery) { create(:genre, name: 'ミステリー') }
        let!(:genre_sf) { create(:genre, name: 'SF') }
        let!(:genre_horror) { create(:genre, name: 'ホラー') }

        let!(:bookshelf_1) { create(:bookshelf, book: book, user: other_user_1) }
        let!(:bookshelf_2) { create(:bookshelf, book: book, user: other_user_2) }
        let!(:post_1) { create(:post, bookshelf: bookshelf_1) }
        let!(:post_2) { create(:post, bookshelf: bookshelf_2) }

        before do
          # other_user_1 はジャンル1つ
          create(:book_genre, bookshelf: bookshelf_1, genre: genre_mystery)
          # other_user_2 はジャンル複数
          create(:book_genre, bookshelf: bookshelf_2, genre: genre_sf)
          create(:book_genre, bookshelf: bookshelf_2, genre: genre_horror)

          get "/api/v1/books/#{book.isbn}/posts", headers: headers
        end

        # user の id で該当ユーザーの要素を取り出す
        def find_post_by_user(user)
          json['posts'].find { |p| p['user']['id'] == user.id }
        end

        it '各ユーザーのコメントとあわせて、登録ジャンルが正しく表示される' do
          item = find_post_by_user(other_user_1)
          expect(item['post']['id']).to eq post_1.id
          expect(item['genres'].map { |g| g['name'] }).to eq [ 'ミステリー' ]
        end

        it '登録ジャンルが複数ある場合、正しく表示される' do
          item = find_post_by_user(other_user_2)
          expect(item['post']['id']).to eq post_2.id
          expect(item['genres'].map { |g| g['name'] }).to match_array [ 'SF', 'ホラー' ]
        end

        it '他のユーザーのジャンルが混ざらない' do
          expect(find_post_by_user(other_user_1)['genres'].map { |g| g['id'] }).not_to include(genre_sf.id, genre_horror.id)
          expect(find_post_by_user(other_user_2)['genres'].map { |g| g['id'] }).not_to include(genre_mystery.id)
        end
      end
    end
  end
end
