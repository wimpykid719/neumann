class Api::V1::BooksController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :status_not_found_book

  def index
    books = Book.all
    render json: books.as_json(only: books_params)
  end

  def show
    book = Book.find(params[:id])
    render json: book.as_json(only: book_params)
  end

  private

  def books_params
    [:title, :img_url]
  end

  def book_params
    [:title, :img_url, :description, :score, :page, :launched, :author, :publisher, :associate_url]
  end
end
