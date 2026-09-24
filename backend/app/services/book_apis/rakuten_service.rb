module BookApis
  # 楽天ブックス書籍検索APIを呼び出し、アプリで扱いやすい形の書籍データに変換する
  #
  #   BookApis::RakutenService.search(keyword: "ハリー・ポッター", type: "title", page: 1)
  #   # => [{ isbn: "...", title: "...", author: "...", ... }, ...]
  class RakutenService

    # `rescue BookApis::RakutenService::Error` と書くだけで「楽天API由来のエラー」だけを捕まえられる
    class Error < StandardError; end

    ENDPOINT = "https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404"
    SEARCH_TYPES = %w[title author isbn].freeze
    BOOKS_GENRE_ID = "001004008"
    HITS_PER_PAGE = 20

    class << self
      # 処理の流れ: 検索パラメータ組み立て → API呼び出し → レスポンスを書籍データへ変換
      def search(keyword:, type: "title", page: 1)
        params = build_search_params(keyword, type, page)
        response_body = fetch(params)
        response_body.fetch("Items").map { |item| to_book(item) }
      end

      private

      # ---- リクエストの組み立て ----

      def build_search_params(keyword, type, page)
        keyword_param(keyword, type).merge(
          booksGenreId: BOOKS_GENRE_ID,
          hits: HITS_PER_PAGE,
          page: page
        )
      end

      # 検索種別ごとに楽天APIのパラメータへ振り分ける
      def keyword_param(keyword, type)
        case type
        when "author" then { author: keyword }
        when "isbn"   then { isbn: normalize_isbn(keyword) }
        else               { title: keyword }
        end
      end

      # ハイフン・空白を除去（楽天APIは数字のみのISBNを要求する）
      def normalize_isbn(keyword)
        keyword.to_s.gsub(/[-\s]/, "")
      end

      # 全リクエスト共通の認証・フォーマット指定
      # formatVersion=2 にすると Items が書籍ハッシュの配列で返ってくる
      def auth_params
        {
          applicationId: application_id,
          accessKey: access_key,
          formatVersion: 2
        }
      end

      def request_headers
        {
          Accept: "application/json",
          Origin: Rails.env.production? ? ENV.fetch("FRONTEND_URL") : "https://example.com"
        }
      end

      # API呼び出し
      def fetch(params)

        uri = URI.parse(ENDPOINT)
        uri.query = URI.encode_www_form(auth_params.merge(params)) # ?key=value&... の形に変換

        response = HttpClient.get(uri, headers: request_headers)
        raise Error unless response.is_a?(Net::HTTPSuccess)

        JSON.parse(response.body)
      end

      # レスポンスの変換
      # 楽天APIのキー名を、アプリ内で使うキー名に揃える
      def to_book(item)
        {
          isbn: item["isbn"],
          title: item["title"],
          author: item["author"],
          publisher: item["publisherName"],
          sales_date: item["salesDate"],
          image_url: item["largeImageUrl"],
          item_url: item["itemUrl"]
        }
      end

      # APIキー
      def application_id
        ENV["RAKUTEN_BOOKS_APP_ID"]
      end

      def access_key
        ENV["RAKUTEN_BOOKS_ACCESS_KEY"]
      end
    end
  end
end
