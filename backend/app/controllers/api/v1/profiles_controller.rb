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
    file = profiles_params[:avatar]

    if file?(file)
      status_image_over_512kb and return unless less_512kb?(file)
      status_not_image_file and return unless img_file?(file)

      profile.update!(profiles_params.merge({ avatar: avatar_url }))
    else
      profile.update!(profiles_params.except(:avatar))
    end

    render json: profile.as_json(only: default_params)
  end

  def profiles_params
    params.require(:profile).permit(*default_params)
  end

  private

  def less_512kb?(file)
    file.size <= 0.5.megabyte
  end

  def file?(file)
    file.instance_of?(ActionDispatch::Http::UploadedFile)
  end

  def img_file?(file)
    file.content_type.start_with?('image/')
  end

  def avatar_url
    bucket = R2::Bucket.new(@current_user.name)
    bucket.delete_objects
    bucket.upload_file_r2(profiles_params[:avatar])
  end

  def default_params
    [:name, :bio, :x_twitter, :instagram, :facebook, :linkedin, :tiktok, :youtube, :website, :avatar]
  end
end
