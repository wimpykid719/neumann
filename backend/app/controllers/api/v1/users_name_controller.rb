class Api::V1::UsersNameController < ApplicationController
  rescue_from Pagy::OverflowError, with: :status_not_found_pages

  def index
    pagy, users = pagy(User)
    metadata = pagy_metadata(pagy)

    render json: {
      user_names: users.as_json(only: :name),
      pages: {
        prev: metadata[:prev],
        next: metadata[:next],
        last: metadata[:last]
      }
    }
  end
end
