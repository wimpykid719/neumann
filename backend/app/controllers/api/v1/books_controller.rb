class Api::V1::BooksController < ApplicationController
  rescue_from Pagy::OverflowError, with: :status_not_found_pages
  rescue_from ActiveRecord::RecordNotFound, with: :status_not_found_book

  def index
    pagy, books = pagy(Book.all)
    metadata = pagy_metadata(pagy)

    render json: {
      books: books.as_json(only: books_params),
      pages: {
        prev: metadata[:prev],
        next: metadata[:next],
        last: metadata[:last]
      }
    }
  end

  def show
    book = Book.find(params[:id])
    render json: book.as_json(only: book_params)
  end

  private

  def books_params
    [:id, :title, :img_url]
  end

  def book_params
    [*books_params, :description, :score, :page, :launched, :author, :publisher, :associate_url]
  end
end
