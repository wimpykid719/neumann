class User < ApplicationRecord
  include Token::TokenService

  has_one :profile, dependent: :destroy
  has_one :provider, dependent: :destroy
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
      raise Constants::Exceptions::SignUp, I18n.t('errors.request.not_signedup_google') if user && !user.provider.google?

      uid = oauth2_params[:sub]
      user_google = Provider.find_by(uid:)&.user

      if user_google
        raise Constants::Exceptions::SignUp, I18n.t('errors.request.not_signedup_google') unless user_google.provider.google?
      else
        user_google = User.create!(
          name: SecureRandom.uuid,
          email: oauth2_params[:email],
          password: User.auto_create_password
        )
        user_google.create_provider!(kind: Provider.kinds[oauth2_params[:provider]], uid:)
        user_google.create_profile!(name: oauth2_params[:name], avatar_url: oauth2_params[:picture])
      end
      user_google
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
