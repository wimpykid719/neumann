class User < ApplicationRecord
  has_secure_password

  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, length: { maximum: 255 },
                    format: { with: Constants::Regexps::EMAIL },
                    uniqueness: true
  validates :password, presence: true, length: { minimum: 8 },
                       format: { with: Constants::Regexps::VALID_PASSWORD_REGEX }

  def update_token_version(token_version)
    update!(current_token_version: token_version)
  end
end
