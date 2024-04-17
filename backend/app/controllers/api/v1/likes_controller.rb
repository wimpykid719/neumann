class Api::V1::LikesController < ApplicationController
  before_action :authenticate_user, only: [:show, :create, :destroy]

  rescue_from ActiveRecord::RecordInvalid do |error|
    status_unprocessable_entity(error.message)
  end
  rescue_from ActiveRecord::RecordNotFound, with: :status_not_found_book
  rescue_from Pagy::OverflowError, with: :status_not_found_pages

  def index
    user = User.find_by(name: params[:user_name])
    if user
      pagy, user_book_likes = pagy(user.books)
      metadata = pagy_metadata(pagy)

      render json: {
        books: user_book_likes.as_json(only: books_params_render, methods: :likes_count),
        pages: {
          prev: metadata[:prev],
          next: metadata[:next],
          last: metadata[:last]
        }
      }
    else
      status_not_found_user
    end
  end

  def show
    book_liked = Book.find(params[:id])
    user = @current_user

    render status: :ok, json: { liked: book_liked.liked_by_user?(user.id) }
  end

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

  def books_params_render
    [:id, :title, :img_url]
  end
end
