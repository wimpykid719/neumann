module UserAuth
  module SessionService
    include UserAuthConcern

    # セッションユーザーが居ればtrue、存在しない場合は401を返す
    def sessionize_user
      session_user.present? || unauthorized_user
    end

    private

    # refresh_tokenから有効なユーザーを取得する
    def fetch_user_from_refresh_token
      User.from_refresh_token(cookies[UserAuthConfig.session_key])
    # ここで有効期限, jwtの改竄エラーは継承先とされる例外をキャッチすることで握り潰される
    rescue UserAuthConfig.not_found_exception_class,
           JWT::DecodeError,
           JWT::EncodeError
      nil
    end

    # refresh_tokenのユーザーを返す
    def session_user
      return nil unless cookies[UserAuthConfig.session_key]

      @session_user ||= fetch_user_from_refresh_token
    end
  end
end
