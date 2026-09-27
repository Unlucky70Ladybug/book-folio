require 'rails_helper'

RSpec.describe "Api::V1::SearchBooks", type: :request do
  describe "Get /api/v1/search" do
    let(:user) { create(:user) }
    let(:headers) { sign_in(user) }

    context '未ログインの場合' do
      it '401が返る' do
        get '/api/v1/search', params: { keyword: 'こころ', type: 'title' }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'タイトル検索' do
      before do
        sign_in(user)
      end

      it 'タイトルで検索し、正常に検索結果が返ってくる場合' do
        sleep 1
        get '/api/v1/search', headers: headers, params: { keyword: 'こころ', type: 'title' }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        books = json['books']
        expect(books.length).to be <= 20
        expect(books.first['isbn']).to be_present
        expect(books.first['title']).to be_present
        expect(books.first['author']).to be_present
        expect(books.first['publisher']).to be_present
        expect(books.first['sales_date']).to be_present
        expect(books.first['size']).to be_present
        expect(books.first['image_url']).to be_present
        expect(books.first['item_url']).to be_present
        expect(books.first['review_count']).to be_present
      end

      it 'タイトルで検索し、検索結果がない場合' do
        sleep 1
        get '/api/v1/search', headers: headers, params: { keyword: '1234567890', type: 'title' }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        books = json['books']
        expect(books.length).to be == 0
        expect(json['books']).to be_empty
      end
    end

    context '著者検索' do
      before do
        sign_in(user)
      end

      it '著者で検索し、正常に検索結果が返ってくる場合' do
        sleep 1
        get '/api/v1/search', headers: headers, params: { keyword: '伊坂幸太郎', type: 'author' }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        books = json['books']
        expect(books.length).to be <= 20
        expect(books.first['isbn']).to be_present
        expect(books.first['title']).to be_present
        expect(books.first['author']).to be_present
        expect(books.first['publisher']).to be_present
        expect(books.first['sales_date']).to be_present
        expect(books.first['size']).to be_present
        expect(books.first['image_url']).to be_present
        expect(books.first['item_url']).to be_present
        expect(books.first['review_count']).to be_present
      end

      it 'タイトルで検索し、検索結果がない場合' do
        sleep 1
        get '/api/v1/search', headers: headers, params: { keyword: 'hogehogehoge', type: 'author' }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        books = json['books']
        expect(books.length).to be == 0
        expect(json['books']).to be_empty
      end
    end

    context 'ISBN検索' do
      before do
        sign_in(user)
      end

      it 'ISBNで検索し、正常に検索結果が返ってくる場合' do
        sleep 1
        get '/api/v1/search', headers: headers, params: { keyword: '9784757506206', type: 'isbn' }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        books = json['books']
        expect(books.length).to be == 1
        expect(books.first['isbn']).to be_present
        expect(books.first['title']).to be_present
        expect(books.first['author']).to be_present
        expect(books.first['publisher']).to be_present
        expect(books.first['sales_date']).to be_present
        expect(books.first['size']).to be_present
        expect(books.first['image_url']).to be_present
        expect(books.first['item_url']).to be_present
        expect(books.first['review_count']).to be_present
      end

      it 'ISBNで検索し、検索結果がない場合' do
        sleep 1
        get '/api/v1/search', headers: headers, params: { keyword: 'hogehogehoge', type: 'isbn' }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        books = json['books']
        expect(books.length).to be == 0
        expect(json['books']).to be_empty
      end

      it 'ISBNで検索し、楽天ブックスAPIでは該当せず、OpenBDでのみ検索できる場合' do
        sleep 1
        get '/api/v1/search', headers: headers, params: { keyword: '9784063584882', type: 'isbn' }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        books = json['books']
        expect(books.length).to be == 1
        expect(books.first['isbn']).to be_present
        expect(books.first['title']).to be_present
        expect(books.first['author']).to be_present
        expect(books.first['publisher']).to be_present
      end
    end
  end
end
