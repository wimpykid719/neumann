module UserAuth
  module TokenConcern
    # エンコードキー
    def secret_key
      UserAuthConfig.token_secret_signature_key
    end

    # アルゴリズム
    def algorithm
      UserAuthConfig.token_signature_algorithm
    end

    # user識別クレーム
    def user_claim
      UserAuthConfig.user_claim
    end

    # 暗号化クラスの生成
    # Doc: https://api.rubyonrails.org/v6.1.0/classes/ActiveSupport/MessageEncryptor.html
    # key_generatorメソッドのsecretはsecret_key_baseが使われる
    # 参考: https://techracho.bpsinc.jp/hachi8833/2017_10_24/46809
    def crypt
      salt = 'signed user id'
      key_length = ActiveSupport::MessageEncryptor.key_len
      secret = Rails.application.key_generator.generate_key(salt, key_length)
      ActiveSupport::MessageEncryptor.new(secret)
    end

    # user_id暗号化
    def encrypt_for(user_id)
      return unless user_id

      crypt.encrypt_and_sign(user_id.to_s, purpose: :authorization)
    end

    # user_id複合化(複合エラーの場合はnilを返す)
    def decrypt_for(user_id)
      return unless user_id

      crypt.decrypt_and_verify(user_id.to_s, purpose: :authorization)
    rescue ActiveSupport::MessageEncryptor::InvalidMessage
      nil
    end

    def new_token_version
      Digest::MD5.hexdigest(SecureRandom.uuid)
    end

    # エンコード時のヘッダー
    # Doc: https://openid-foundation-japan.github.io/draft-ietf-oauth-json-web-token-11.ja.html#typHdrDef
    def header_fields
      {
        typ: 'JWT',
        alg: algorithm
      }
    end
  end
end
