class ApplicationController < ActionController::API
  # CSRF対策
  before_action :verify_xhr_request

  include ActionController::Cookies
  include UserAuth::AuthenticateService
  include HttpResponseConcern
end
