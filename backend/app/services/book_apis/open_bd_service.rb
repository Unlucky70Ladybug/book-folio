module BookApis
  class OpenBdService
    require "net/http"
    require "uri"
    require "json"

    ENDPOINT = "https://api.openbd.jp/v1/get"

    def self.search(isbn, item = {})
      uri = URI.parse("#{ENDPOINT}?isbn=#{isbn}")
      response = HttpClient.get(uri)

      return nil unless response.is_a?(Net::HTTPSuccess)

      summary = JSON.parse(response.body)&.first&.dig("summary")
      return nil unless summary

      item[:isbn] = summary["isbn"] if item[:isbn].blank?
      item[:title] = summary["title"] if item[:title].blank?
      item[:author] = summary["author"].gsub(",", " ") if item[:author].blank?
      item[:publisher] = summary["publisher"] if item[:publisher].blank?
      item[:image_url] = summary["cover"] if item[:image_url].blank?
      item
    rescue StandardError => e
      Rails.logger.error("[OpenBdService] #{e.class}: #{e.message}")
      nil
    end
  end
end
