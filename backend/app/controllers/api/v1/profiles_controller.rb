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
    params_removed_avator = profiles_params.except(:avatar)
    avatar_url_hash = {}

    if profiles_params[:avatar].instance_of?(ActionDispatch::Http::UploadedFile)
      status_not_image_file and return unless profiles_params[:avatar].content_type.start_with?('image/')

      bucket = R2::Bucket.new(@current_user.name)
      bucket.delete_objects
      avatar_url_hash = { avatar: bucket.upload_file_r2(profiles_params[:avatar]) }
    end

    profile.update!(params_removed_avator.merge(avatar_url_hash))
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
