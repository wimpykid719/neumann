class Api::V1::LikesController < ApplicationController
  before_action :authenticate_user, only: [:create, :destroy]

  rescue_from ActiveRecord::RecordInvalid do |error|
    status_unprocessable_entity(error.message)
  end
  rescue_from ActiveRecord::RecordNotFound, with: :status_not_found_book

  def create
    book_liked = Book.find(liked_book_params[:id])

    user = @current_user
    user.likes.create!(likeable: book_liked)

    render status: :created, json: { liked: true }
  end

  def destroy
    book_liked = Book.find(params[:id])

    user = @current_user
    user_liked = user.likes.find_by(likeable: book_liked)

    if user_liked
      user_liked.destroy!
      render status: :ok, json: { liked: false }
    else
      status_not_found_like
    end
  end

  private

  def liked_book_params
    params.require(:book).permit(:id)
  end
end
