require '/backend/scripts/prd/firestore'

class AmazonBooks < Firestore
  def initialize
    super

    @page_count = 0
    @pull_500_books = 500 / @page_limit
  end

  def continue_register_books?(amazon_books_size)
    @page_limit <= amazon_books_size && @page_count < @pull_500_books
  end

  def amazon_book_scraped(id)
    doc_ref = @firestore.col(@collection_amazon_books).doc(id)
    doc_ref.set({ scraping: true }, merge: true)

    Rails.logger.info 'scrapingステータスを登録済みに変更'
  end

  def generate_book_columns(amazon_book)
    asin = amazon_book.document_id
    book = amazon_book[:book]
    count = amazon_book[:count]

    score = amazon_book[:score] / count
    scraped_at = amazon_book[:timeStamp]
    title, price, img_url, page, launched, publisher, associate_url, author = book.values_at(
      :title,
      :price,
      :imgUrl,
      :page,
      :launched,
      :publisher,
      :associateUrl,
      :author
    )

    { asin:, title:, price:, img_url:, score:, page:, launched:, scraped_at:, author:, publisher:, associate_url:, count: }
  end

  def generate_note_reference_columns(amazon_book)
    hashtags = amazon_book[:hashtags]
    reference_objs = amazon_book[:referenceObj]

    { hashtags:, reference_objs: }
  end

  def register_book(amazon_book)
    book_columns = generate_book_columns(amazon_book)
    asin = book_columns[:asin]
    note_reference_columns = generate_note_reference_columns(amazon_book)

    registered_book = Book.find_by(asin:)
    ActiveRecord::Base.transaction do
      if registered_book
        Rails.logger.info "#{registered_book[:title]} - #{book_columns[:asin]} を更新します"
        registered_book.update!(book_columns.except(:asin))
        registered_book.note_reference.update!(note_reference_columns)
        Rails.logger.info '更新しました'
      else
        Rails.logger.info "#{amazon_book[:book][:title]} - #{book_columns[:asin]} を新規登録します"
        book = Book.create!(book_columns)
        book.create_note_reference!(note_reference_columns)
        Rails.logger.info '新規登録しました'
      end
    end

    amazon_book_scraped(asin)
  end

  def register_books(page = nil)
    @page_count += 1
    amazon_books = get_amazon_books(ranking_query(@collection_amazon_books, page, @page_limit))
    return unless amazon_books

    amazon_books.each do |amazon_book|
      register_book(amazon_book) unless amazon_book[:scraping]
    end

    amazon_books_size, next_page = extract_amazon_books_data(amazon_books).values_at(
      :amazon_books_size,
      :next_page
    )
    if continue_register_books?(amazon_books_size)
      register_books(next_page)
    else
      Rails.logger.info '書籍登録が完了しました'
    end
  end
end

# 実行部分
amazon_books = AmazonBooks.new
amazon_books.register_books
