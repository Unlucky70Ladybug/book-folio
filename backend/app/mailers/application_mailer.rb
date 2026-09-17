class ApplicationMailer < ActionMailer::Base
  # Resendに登録済みのドメイン使用するまた、devise.rbに揃える
  default from: "noreply@bookfolio.jp"
  layout "mailer"
end
