require 'google/cloud/firestore'

class Firestore
  attr_accessor :firestore, :collection_amazon_books, :page_limit

  def initialize
    @firestore = Google::Cloud::Firestore.new
    @collection_amazon_books = 'amazonBooks'
    @page_limit = 100
  end

  def ranking_query(collection_name, page, page_limit)
    mentioned = 2

    # インデックスを貼らないと実行出来ないクエリー
    query = @firestore.col(collection_name).where(:count, '>=', mentioned).order(:score, :desc).limit(page_limit)
    return query.start_after(page) if page

    query
  end

  def scraping_true_query(collection_name, page, page_limit)
    query = @firestore.col(collection_name).where(:scraping, '=', true).limit(page_limit)
    return query.start_after(page) if page

    query
  end

  def get_amazon_books(query)
    amazon_books = query.get.to_a
    return amazon_books unless amazon_books.empty?

    Rails.logger.info '未取得のAmazonBooksがありません'
    nil
  end

  def extract_amazon_books_data(amazon_books)
    amazon_books_size = amazon_books.size
    last_document_index = amazon_books_size - 1
    next_page = amazon_books[last_document_index]

    { amazon_books_size:, next_page: }
  end
end
