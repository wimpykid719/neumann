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

  def status_not_found_pages
    render status: :not_found, json: { error: { message: I18n.t('errors.request.not_found_pages') } }
  end

  def status_not_found_book
    render status: :not_found, json: { error: { message: I18n.t('errors.request.not_found_book') } }
  end

  def status_not_found_like
    render status: :not_found, json: { error: { message: I18n.t('errors.request.not_found_like') } }
  end

  def status_not_image_file
    render status: :unprocessable_entity, json: { error: { message: I18n.t('errors.request.not_image_file') } }
  end

  def status_image_over_512kb
    render status: :unprocessable_entity, json: { error: { message: I18n.t('errors.request.less_512kb') } }
  end

  def verify_xhr_request
    return if request.xhr?

    render status: :forbidden, json: { error: { message: I18n.t('errors.request.forbidden') } }
  end

  def status_unprocessable_entity(message)
    render status: :unprocessable_entity, json: { error: { message: } }
  end

  def unauthorized_request
    render status: :unauthorized, json: { error: { message: I18n.t('errors.request.unauthorized_request') } }
  end
end
