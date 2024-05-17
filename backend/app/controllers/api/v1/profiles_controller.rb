class Api::V1::ProfilesController < ApplicationController
  before_action :authenticate_user, only: [:update]

  rescue_from ActiveRecord::RecordInvalid do |error|
    status_unprocessable_entity(error.message)
  end
  rescue_from ActiveRecord::RecordNotFound, with: :status_not_found_user

  def show
    # params[:id]には一意性で登録されたユーザ名が入る
    user = User.find_by!(name: params[:id])
    render json: user.profile.as_json(only: default_params)
  end

  def update
    profile = @current_user.profile

    profile.update!(profiles_params)
    render json: profile.as_json(only: default_params)
  end

  def profiles_params
    params.require(:profile).permit(*default_params)
  end

  private

  def default_params
    [:name, :bio, :x_twitter, :instagram, :facebook, :linkedin, :tiktok, :youtube, :website, :avatar]
  end
end
