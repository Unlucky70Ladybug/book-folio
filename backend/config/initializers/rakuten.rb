RakutenWebService.configure do |c|
    c.application_id = ENV["RAKUTEN_BOOKS_APP_ID"]
    c.affiliate_id = ENV["RAKUTEN_BOOKS_ACCESS_KEY"]
end
