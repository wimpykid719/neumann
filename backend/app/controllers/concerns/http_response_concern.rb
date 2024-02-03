# Doc: https://gist.github.com/mlanett/a31c340b132ddefa9cca
module HttpResponseConcern
  extend ActiveSupport::Concern

  private

  def status_not_found
    render status: :not_found, json: { error: { message: I18n.t('errors.request.not_found') } }
  end

  def verify_xhr_request
    return if request.xhr?

    render status: :forbidden, json: { error: { message: I18n.t('errors.request.forbidden') } }
  end
end
