class Api::V1::BooksController < ApplicationController
  rescue_from Pagy::OverflowError, with: :status_not_found_pages
  rescue_from ActiveRecord::RecordNotFound, with: :status_not_found_book

  def index
    pagy, books = pagy(Book.order('score DESC, id DESC'))
    rankings_array = rankings(params['page'], books)
    metadata = pagy_metadata(pagy)

    render json: {
      books: books.as_json(only: books_params_render, methods: :likes_count),
      rankings: rankings_array,
      pages: {
        prev: metadata[:prev],
        next: metadata[:next],
        last: metadata[:last]
      }
    }
  end

  def show
    book = Book.find(params[:id])
    render json: book.as_json(
      only: book_params_render,
      methods: [:ranking, :price_delimited, :likes_count],
      include: {
        note_reference: {
          only: note_reference_params_render
        }
      }
    )
  end

  private

  def rankings(page, books)
    books_size = books.size
    return 0 if books_size < 0

    initial_page_ranking = page ? (page.to_i - 1) * Pagy::DEFAULT[:items] : 0
    (initial_page_ranking + 1..initial_page_ranking + books_size).to_a
  end

  def books_params_render
    [:id, :title, :img_url]
  end

  def book_params_render
    [*books_params_render, :scraped_at, :score, :page, :launched, :author, :publisher, :associate_url]
  end

  def note_reference_params_render
    [:hashtags, :reference_objs]
  end
end
