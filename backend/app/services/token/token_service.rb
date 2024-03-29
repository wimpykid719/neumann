module Token
  module TokenService
    def self.included(base)
      # ここでインスタンスメ・クラスメソッドとしてモデルに追加してる
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

    def delete_token_version
      update!(current_token_version: nil)
    end

    # 認証も兼ねてトークンからユーザを取り出す
    module ClassMethods
      include TokenConcern

      def decode_access_token(token)
        Token::AccessToken.decode(token)
      end

      # rubocop:disable Style/IfUnlessModifier
      def from_access_token(token)
        payload = decode_access_token(token)
        user = find_user_from_payload(payload)
        unless verify_token_version?(payload['version'], user)
          raise Constants::Exceptions::TokenVersion, I18n.t('errors.request.password_changed')
        end

        user
      end

      def decode_refresh_token(token)
        Token::RefreshToken.decode(token)
      end

      def from_refresh_token(token)
        payload = decode_refresh_token(token)
        user = find_user_from_payload(payload)
        unless verify_token_version?(payload['version'], user)
          raise Constants::Exceptions::TokenVersion, I18n.t('errors.request.password_changed')
        end

        user
      end
      # rubocop:enable Style/IfUnlessModifier

      private

      def find_user_from_decrypted_id(user_id_encrypted)
        User.find(decrypt_for(user_id_encrypted))
      end

      def find_user_from_payload(payload)
        user_id_encrypted = payload.with_indifferent_access[user_claim]
        find_user_from_decrypted_id(user_id_encrypted)
      end

      def verify_token_version?(token_version, user)
        token_version == user.current_token_version
      end
    end
  end
end
