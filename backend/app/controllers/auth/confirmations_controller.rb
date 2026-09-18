# Auth::ConfirmationsControllerクラスはDeviseTokenAuth::ConfirmationsControllerを継承する
class Auth::ConfirmationsController < DeviseTokenAuth::ConfirmationsController
  private

  # redirect_urlはconfig.redirect_whitelistで許可済みのURLのみ渡ってくるため、
  # 別ホスト(フロントエンド)へのリダイレクトを許可する
  def redirect_options
    { allow_other_host: true }
  end
end
