# Doc: https://gist.github.com/mlanett/a31c340b132ddefa9cca
module HttpResponseConcern
  extend ActiveSupport::Concern

  private

  def status_not_found
    head(:not_found)
  end

  def verify_xhr_request
    return if request.xhr?

    render status: :forbidden, json: { status: :forbidden, error: 'Forbidden' }
  end

  def response_internal_server_error(msg = 'Internal Server Error')
    render status: :internal_server_error, json: { status: :internal_server_error, error: msg }
  end
end
