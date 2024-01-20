class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user

  def index
    render json: current_user.as_json(only: [:id, :name, :email])
  end

  def create
  end

  def users_params
    params.require(:user).permit(:name, :email, :password)
  end
end
