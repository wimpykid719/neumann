# Doc: https://gist.github.com/mlanett/a31c340b132ddefa9cca
module HttpResponseConcern
  extend ActiveSupport::Concern

  private

  def status_failed_login
    render status: :not_found, json: { error: { message: I18n.t('errors.request.failed_login') } }
  end

  def status_not_found_user
    render status: :not_found, json: { error: { message: I18n.t('errors.request.not_found_user') } }
  end

  def status_not_found_book
    render status: :not_found, json: { error: { message: I18n.t('errors.request.not_found_book') } }
  end

  def verify_xhr_request
    return if request.xhr?

    render status: :forbidden, json: { error: { message: I18n.t('errors.request.forbidden') } }
  end

  def status_unprocessable_entity(message)
    render status: :unprocessable_entity, json: { error: { message: } }
  end
end
