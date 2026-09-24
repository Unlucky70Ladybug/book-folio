module BookApis
  # 外部書誌API共通のHTTP呼び出しユーティリティ
  # 外部の無応答でPumaスレッドを塞がないよう、タイムアウトを設定する
  module HttpClient
    require "net/http"
    require "uri"

    OPEN_TIMEOUT = 5
    READ_TIMEOUT = 5

    class << self
      def get(uri, headers: {})
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = uri.scheme == "https"
        http.open_timeout = OPEN_TIMEOUT
        http.read_timeout = READ_TIMEOUT

        req = Net::HTTP::Get.new(uri)
        headers.each { |key, value| req[key] = value }

        http.request(req)
      end
    end
  end
end
