class Api::V1::ProfilesController < ApplicationController
  def show
    # params[:id]には一意性で登録されたユーザ名が入る
    user = User.find_by!(name: params[:id])
    render json: user.profile.as_json(only: default_params)
  end

  def profiles_params
    params.require(:profile).permit(:name, *default_params)
  end

  private

  def default_params
    [:profile_name, :bio, :x_twitter, :instagram, :facebook, :linkedin, :tiktok, :youtube, :website]
  end
end
