module Oauth2Config
  mattr_accessor :access_token_lifetime
  self.access_token_lifetime = 5.minute

  mattr_accessor :token_issuer
  self.token_issuer = "#{ENV['BASE_URL']} - Backend"

  mattr_accessor :token_audience
  self.token_audience = "#{ENV['BASE_URL']} - Backend"

  mattr_accessor :token_signature_algorithm
  self.token_signature_algorithm = 'HS256'

  mattr_accessor :token_secret_signature_key
  self.token_secret_signature_key = ENV['STATE_SECRET']
end
