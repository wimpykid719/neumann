class Api::V1::UsersController < ApplicationController
  SECRET_KEY = Rails.application.credentials.secret_key_base

  def create
    logger.debug(users_params)
    @user = User.create!(users_params)
    payload = {
      sub: @user.id,
      exp: (DateTime.current + 14.days).to_i
    }
    render json: { jwt: JWT.encode(payload, SECRET_KEY, "HS256") }, status: 201
  end

  def users_params
    params.require(:user).permit(:name, :email, :password)
  end
end
