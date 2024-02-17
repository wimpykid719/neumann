class Api::V1::UsersController < ApplicationController
  # before_action :authenticate_user, only: [:update]
  include LoginResponseConcern

  rescue_from ActiveRecord::RecordInvalid do |error|
    status_unprocessable_entity(error.message)
  end
  rescue_from ActiveRecord::RecordNotFound, with: :status_not_found_user

  def show
    if current_user.name == params[:id]
      render json: @current_user.as_json(only: [:name, :email])
    else
      # params[:id]には一意性で登録されたユーザ名が入る
      user = User.find_by!(name: params[:id])
      render json: user.as_json(only: [:name])
    end
  end

  def create
    user = User.create!(users_params)

    render status: :created, json: login_response_with_cookie(user)
  end

  def users_params
    params.require(:user).permit(:id, :name, :email, :password)
  end
end
