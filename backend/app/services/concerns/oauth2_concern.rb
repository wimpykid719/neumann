module Oauth2Concern
  def secret_key
    Oauth2Config.token_secret_signature_key
  end

  def algorithm
    Oauth2Config.token_signature_algorithm
  end

  def iss
    Oauth2Config.token_issuer
  end

  def aud
    Oauth2Config.token_audience
  end

  def token_lifetime
    Oauth2Config.access_token_lifetime
  end

  def header_fields
    {
      typ: 'JWT',
      alg: algorithm
    }
  end
end
