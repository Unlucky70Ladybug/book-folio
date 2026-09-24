class Api::V1::SearchBooksController < ApplicationController
  before_action :authenticate_user!

  # 外部書誌APIへのプロキシなので、未認証の連打で外部APIのquotaを食い潰されないようにする
  rate_limit to: 30, within: 1.minute

  def search
    keyword = params[:keyword].to_s.strip
    type = params[:type].presence_in(BookApis::RakutenService::SEARCH_TYPES) || "title"

    return render json: { error: "キーワードを入力してください" }, status: :bad_request if keyword.blank?

    books = BookApis::RakutenService.search(keyword: keyword, type: type, page: params.fetch(:page, 1).to_i)
    render json: { books: books }
  rescue BookApis::RakutenService::Error => e
    Rails.logger.error("[RakutenAPI] #{e.class}: #{e.message}")
    render json: { error: "書籍検索に失敗しました" }, status: :bad_gateway
  end
end
