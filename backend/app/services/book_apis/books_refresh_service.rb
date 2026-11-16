module BookApis
  # 保存済みの書籍情報を楽天APIから取り直し、最新の状態に更新する
  #
  #   更新状況を返す
  #   # => { updated: 10, skipped: 1, failed: 0 }
  class BooksRefreshService
    # この時間より前に取得した書籍を更新対象にする
    STALE_AFTER = 3.months
    # 楽天APIのリクエスト制限（1秒に1回）に合わせた待機時間
    REQUEST_INTERVAL = 1

    def self.call(...)
      new(...).call
    end

    def initialize(stale_after: STALE_AFTER, interval: REQUEST_INTERVAL, logger: Rails.logger)
      @stale_after = stale_after
      @interval = interval
      @logger = logger
    end

    def call
      result = { updated: 0, skipped: 0, failed: 0 }
      # fid_eachでメモリ消費を抑える
      target_books.find_each.with_index do |book, index|
        sleep(@interval) if index.positive?
        result[refresh(book)] += 1
      end

      result
    end

    private

    def target_books
      Book.where(fetched_at: ...@stale_after.ago)
    end

    # 1冊分の更新。1冊の失敗でバッチ全体を止めないよう、例外はここで捕まえる
    def refresh(book)
      data = RakutenService.search(keyword: book.isbn, type: "isbn").first
      if data.nil?
        @logger.warn("[BooksRefresh] 該当なし isbn=#{book.isbn}")
        return :skipped
      end

      # 取得できなかった項目は既存の値を残す
      book.update!(
        title: data[:title],
        author: data[:author],
        item_url: data[:item_url],
        large_image_url: data[:image_url],
        fetched_at: Time.current
      )
      :updated
    rescue StandardError => e
      @logger.error("[BooksRefresh] 失敗 isbn=#{book.isbn} #{e.class}: #{e.message}")
      :failed
    end
  end
end
