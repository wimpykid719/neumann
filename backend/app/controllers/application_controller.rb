class ApplicationController < ActionController::API
  # CSRF対策
  before_action :verify_xhr_request

  # 受け取ったキャメルケースをスネークケースに変換
  before_action :underscore_params!

  include ActionController::Cookies
  include UserAuth::AuthenticateService
  include HttpResponseConcern
  include Pagy::Backend

  private

  def underscore_params!
    params.deep_transform_keys!(&:underscore)
  end
end
