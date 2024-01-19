module Token
  module TokenService
    def self.included(base)
      # ここでインスタンスメソッドをクラスメソッドとしてモデルに追加してる
      base.extend ClassMethods
    end

    # アクセストークンのインスタンス生成
    def generate_access_token(options = {})
      Token::AccessToken.new(id, options:)
    end

    # リフレッシュトークンのインスタンス生成
    # モデルのインスタンス変数内では属性値としてidが取得できる
    def generate_refresh_token
      Token::RefreshToken.new(id)
    end

    # 認証も兼ねてトークンからユーザを取り出す
    module ClassMethods
      include UserAuth::TokenConcern

      def decode_access_token(token)
        Token::AccessToken.decode(token)
      end

      def from_access_token(token)
        payload = decode_access_token(token)
        find_user_from_payload(payload)
      end

      def decode_refresh_token(token)
        Token::RefreshToken.decode(token)
      end

      def from_refresh_token(token)
        payload = decode_refresh_token(token)
        find_user_from_payload(payload)
      end

      private

      def find_user_from_payload(payload)
        user_id_encrypted = payload.with_indifferent_access[user_claim]
        User.find(decrypt_for(user_id_encrypted))
      end
    end
  end
end
