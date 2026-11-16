namespace :rakuten_api do
  desc "保存済みの書籍情報を楽天APIから取り直して更新する"
  task refresh_books: :environment do
    Rails.logger.info("[rakuten_api:refresh_books] 開始")
    result = BookApis::BooksRefreshService.call
    Rails.logger.info("[rakuten_api:refresh_books] 終了 #{result}")

    # 失敗があればCron Jobを失敗扱いにする
    exit(1) if result[:failed].positive?
  end
end
