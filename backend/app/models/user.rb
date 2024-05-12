class User < ApplicationRecord
  include Token::TokenService

  enum :provider, {
    default: 0,
    google: 1
  }, validate: true

  has_one :profile, dependent: :destroy
  has_secure_password
  has_many :likes, dependent: :destroy
  has_many :books, through: :likes, source: :likeable, source_type: Book.name

  validates :name, presence: true, length: { maximum: 50 },
                   format: { with: Constants::Regexps::NAME },
                   uniqueness: true
  validates :email, presence: true, length: { maximum: 255 },
                    format: { with: Constants::Regexps::EMAIL },
                    uniqueness: true
  validates :password, presence: true, length: { minimum: 8 },
                       format: { with: Constants::Regexps::VALID_PASSWORD_REGEX },
                       if: :password_required?
  validates :provider, presence: true, inclusion: { in: User.providers.keys }

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

    def from_google_oauth2(oauth2_params)
      user = User.where(email: oauth2_params[:email]).first

      if user
        raise Constants::Exceptions::SignUp, I18n.t('errors.request.not_signedup_google') unless user.google?
      else
        user = User.create!(
          name: SecureRandom.uuid,
          email: oauth2_params[:email],
          password: User.auto_create_password,
          provider: User.providers[oauth2_params[:provider]]
        )
        user.create_profile!(name: oauth2_params[:name], avatar_url: oauth2_params[:picture])
      end
      user
    end

    def auto_create_password(length = 20)
      # To calculate real characters, we must perform this operation.
      # See SecureRandom.urlsafe_base64
      rlength = (length * 3) / 4
      SecureRandom.urlsafe_base64(rlength).tr('lIO0', 'sxyz')
    end
  end

  private

  def password_required?
    @enforce_password_validation || password.present?
  end
end
