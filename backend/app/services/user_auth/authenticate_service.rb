module UserAuth
  module AuthenticateService
    include UserAuthConcern

    # 認証（トークンの持ち主を判定）
    # 認証済みのユーザーが居ればtrue、存在しない場合は401を返す
    def authenticate_user
      current_user.present? || unauthorized_user
    end

    private

    # access_tokenから有効なユーザーを取得する
    def fetch_user_from_access_token
      User.from_access_token(token_from_request_headers)
    rescue UserAuthConfig.not_found_exception_class,
           JWT::DecodeError,
           JWT::EncodeError
      nil
    end

    # tokenのユーザーを返す
    def current_user
      return nil unless token_from_request_headers

      @current_user ||= fetch_user_from_access_token
    end
  end
end
