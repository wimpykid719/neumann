class User < ApplicationRecord
  include Token::TokenService

  has_secure_password

  validates :name, presence: true, length: { maximum: 50 },
                   format: { with: Constants::Regexps::NAME },
                   uniqueness: true
  validates :email, presence: true, length: { maximum: 255 },
                    format: { with: Constants::Regexps::EMAIL },
                    uniqueness: true
  validates :password, presence: true, length: { minimum: 8 },
                       format: { with: Constants::Regexps::VALID_PASSWORD_REGEX },
                       if: :password_required?
  validates :profile_name, length: { maximum: 30 }
  validates :bio, length: { maximum: 180 }
  validates :x, length: { maximum: 50 }
  validates :instagram, length: { maximum: 50 }
  validates :facebook, length: { maximum: 50 }
  validates :linkedin, length: { maximum: 50 }
  validates :tiktok, length: { maximum: 50 },
                     format: { with: Constants::Regexps::TIKTOK }
  validates :youtube, length: { maximum: 50 },
                      format: { with: Constants::Regexps::YOUTUBE }
  validates :website, length: { maximum: 255 },
                      format: { with: Constants::Regexps::URL }

  def update_token_version(token_version)
    update!(current_token_version: token_version)
  end

  def enforce_password_validation
    @enforce_password_validation = true
  end

  # params[:id]をオーバライド
  def to_param
    name
  end

  class << self
    def logged_in_user(email:, password:)
      user_registered = User.find_by(email:)
      raise UserAuthConfig.not_found_exception_class unless user_registered&.authenticate(password)

      user_registered
    end
  end

  private

  def password_required?
    @enforce_password_validation || password.present?
  end
end
