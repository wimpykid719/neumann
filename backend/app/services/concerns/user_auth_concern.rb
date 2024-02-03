module UserAuthConcern
  private

  def delete_session
    cookies.delete(UserAuthConfig.session_key)
  end

  def unauthorized_user(message = I18n.t('errors.request.unauthorized'))
    delete_session
    render status: :unauthorized, json: { error: { message: } }
  end
end
