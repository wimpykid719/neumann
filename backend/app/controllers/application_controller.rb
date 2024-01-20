class ApplicationController < ActionController::API
  include ActionController::Cookies
  include UserAuth::AuthenticateService
end
