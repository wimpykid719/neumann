module UserAuthConcern
  private

  def delete_session
    cookies.delete(UserAuthConfig.session_key)
  end

  def unauthorized_user(message = nil)
    delete_session
    if message.present?
      render(status: :unauthorized, json: { errors: [{ message: }] })
    else
      head(:unauthorized)
    end
  end
end
