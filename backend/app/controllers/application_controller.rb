class ApplicationController < ActionController::API
  # CSRF対策
  before_action :verify_xhr_request

  include ActionController::Cookies
  include UserAuth::AuthenticateService

  private

  def verify_xhr_request
    return if request.xhr?

    render status: :forbidden, json: { status: :forbidden, error: 'Forbidden' }
  end

  # Internal Server Error
  def response_internal_server_error(msg = 'Internal Server Error')
    render status: :internal_server_error, json: { status: :internal_server_error, error: msg }
  end
end
