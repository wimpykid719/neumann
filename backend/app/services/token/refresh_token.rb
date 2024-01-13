require 'jwt'

module Token
  class RefreshToken
    include UserAuth::TokenConcern

    attr_reader :user_id, :payload, :token

    def initialize(user_id)
      @user_id = encrypt_for(user_id)
      @payload = claims
      @token = JWT.encode(@payload, secret_key, algorithm, header_fields)
    end

    class << self
      def decode(token)
        JWT.decode(token.to_s, UserAuthConfig.token_secret_signature_key, true).first
      end
    end

    private

    # リフレッシュトークンの有効期限
    def token_lifetime
      UserAuthConfig.refresh_token_lifetime
    end

    # 有効期限をUnixtimeで返す(必須)
    def token_expiration
      token_lifetime.from_now.to_i
    end

    # エンコード時のデフォルトクレーム
    def claims
      {
        user_claim => @user_id,
        exp: token_expiration
      }
    end
  end
end
