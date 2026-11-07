class Api::V1::SearchBooksController < ApplicationController
  before_action :authenticate_user!

  # 外部書誌APIへのプロキシなので、未認証の連打で外部APIのquotaを食い潰されないようにする
  rate_limit to: 2, within: 2.second

  def search
    keyword = params[:keyword].to_s.strip
    return render json: { error: "検索内容を入れてください" }, status: :bad_request if keyword.blank?

    type = params[:type].presence_in(BookApis::RakutenService::SEARCH_TYPES) || "title"
    page = params.fetch(:page, 1).to_i
    cache_key = "rakuten_search/#{type}/#{keyword}/#{page}"
    books = Rails.cache.fetch(cache_key, expires_in: 10.minutes, race_condition_ttl: 5.minutes) do
      # キャッシュがない時だけ楽天APIを呼ぶ
      BookApis::RakutenService.search(keyword: keyword, type: type, page: page)
    end

    # books = BookApis::RakutenService.search(keyword: keyword, type: type, page: page)
    render json: { books: books }
  rescue BookApis::RakutenService::Error => e
    Rails.logger.error("[RakutenAPI] #{e.class}: #{e.message}")
    render json: { error: "書籍検索に失敗しました" }, status: :bad_gateway
  end
end
