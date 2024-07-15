require '/backend/scripts/prd/firestore'

class AmazonBooks < Firestore
  def initialize
    super

    @page_count = 0
    @pull_500_books = 500 / @page_limit
  end

  def continue_register_books?(amazon_books_size)
    @page_limit <= amazon_books_size && i <= @pull_500_books
  end

  def amazon_book_scraped(id)
    doc_ref = @firestore.col(@collection_amazon_books).doc(id)
    doc_ref.set({ scraping: true }, merge: true)

    Rails.logger.info 'scrapingステータスを登録済みに変更'
  end

  def register_book(amazon_book)
    id = amazon_book.document_id

    book = amazon_book[:book]

    score = amazon_book[:score]
    scraped_at = amazon_book[:timeStamp]
    hashtags = amazon_book[:hashtags]
    reference_objs = amazon_book[:referenceObj]
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

    Rails.logger.info "#{amazon_book[:book][:title]} - #{id} を登録します"
    book = Book.create!({ title:, price:, img_url:, score:, page:, launched:, scraped_at:, author:, publisher:, associate_url: })
    book.create_note_reference!({ hashtags:, reference_objs: })
    Rails.logger.info '登録しました'

    amazon_book_scraped(id)
  end

  def register_books(page = nil)
    @page_count += 1
    amazon_books = get_amazon_books(ranking_query(@collection_amazon_books, page, @page_limit))
    return unless amazon_books

    amazon_books.each do |amazon_book|
      register_book(amazon_book)
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
