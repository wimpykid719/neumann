class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user, only: [:show, :update, :destroy]
  include LoginResponseConcern

  rescue_from Constants::Exceptions::TokenVersion do |error|
    unauthorized_user(error.message)
  end
  rescue_from Constants::Exceptions::OldPassword, with: :old_password_wrong
  rescue_from ActiveRecord::RecordInvalid do |error|
    status_unprocessable_entity(error.message)
  end
  rescue_from ActiveRecord::RecordNotFound, with: :status_not_found_user

  def show
    render json: @current_user.as_json(
      only: [:name, :email],
      include: {
        profile: {
          only: [
            :name,
            :bio,
            :x_twitter,
            :instagram,
            :facebook,
            :linkedin,
            :tiktok,
            :youtube,
            :website,
            :avatar_url
          ]
        }
      }
    )
  end

  def create
    user = User.create!(create_params)
    user.create_provider!(kind: Provider.kinds['default'])
    user.create_profile!

    render status: :created, json: login_response_with_cookie(user)
  end

  def update
    user = @current_user
    update_hash = update_email_password(
      update_params[:new_email],
      update_params[:new_password]
    )

    if update_hash[:password]
      check_password(user, update_params[:old_password])
      user.enforce_password_validation
      update_hash[:current_token_version] = User.new_token_version
    end

    update_user_response(user, update_hash)
  end

  def destroy
    user = @current_user
    delete_session if user.destroy

    head(:no_content) if cookies[UserAuthConfig.session_key].nil?
  end

  private

  def create_params
    params.require(:user).permit(:name, :email, :password)
  end

  def update_params
    params.require(:user).permit(:new_email, :new_password, :old_password)
  end

  def update_email_password(new_email, new_password)
    update_hash = {}
    update_hash[:email] = new_email unless new_email.empty?
    update_hash[:password] = new_password unless new_password.empty?
    update_hash
  end

  def update_response_email(new_email)
    render status: :ok, json: { email: new_email }
  end

  def update_response_password
    head(:no_content)
  end

  def update_response(update_hash)
    if update_hash[:email]
      update_response_email(update_hash[:email])
    else
      update_response_password
    end
  end

  def update_user_response(user, update_hash)
    user.update!(update_hash)
    update_response(update_hash)
  end

  def check_password(user, password)
    return if user&.authenticate(password)

    raise Constants::Exceptions::OldPassword
  end

  def old_password_wrong
    render status: :unauthorized, json: { error: { message: I18n.t('errors.request.old_password_wrong') } }
  end
end
