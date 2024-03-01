class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user, only: [:show]
  include LoginResponseConcern

  rescue_from Constants::Exceptions::TokenVersion do |error|
    unauthorized_user(error.message)
  end
  rescue_from ActiveRecord::RecordInvalid do |error|
    status_unprocessable_entity(error.message)
  end
  rescue_from ActiveRecord::RecordNotFound, with: :status_not_found_user

  def show
    render json: @current_user.as_json(
      only: [:name, :email],
      include: { profile: { only: :profile_name } }
    )
  end

  def create
    user = User.create!(users_params)
    user.create_profile

    render status: :created, json: login_response_with_cookie(user)
  end

  def users_params
    params.require(:user).permit(:name, :email, :password)
  end
end
