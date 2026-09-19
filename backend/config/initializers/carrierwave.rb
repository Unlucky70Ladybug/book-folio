CarrierWave.configure do |config|
  # 本番はS3(fog_public false)の署名付きURLを使うため asset_host は設定しない
  config.asset_host = "http://localhost:3000" unless Rails.env.production?
  config.storage = :file
  config.cache_storage = :file
end
