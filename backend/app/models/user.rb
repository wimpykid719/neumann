class User < ApplicationRecord
  has_secure_password

  def update_token_version(token_version)
    update!(current_token_version: token_version)
  end
end
