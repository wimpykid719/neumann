require '/backend/scripts/prd/firestore'

class ResetAmazonBooks < Firestore
  def continue_reset_books?(amazon_books_size)
    @page_limit <= amazon_books_size
  end

  def amazon_book_not_scraped(id)
    doc_ref = @firestore.col(@collection_amazon_books).doc(id)
    doc_ref.set({ scraping: false }, merge: true)

    Rails.logger.info 'scrapingステータスを未登録に変更'
  end

  def reset_scraping_status(page = nil)
    amazon_books = get_amazon_books(scraping_true_query(@collection_amazon_books, page, @page_limit))
    return unless amazon_books

    amazon_books.each do |amazon_book|
      amazon_book_not_scraped(amazon_book.document_id)
    end

    amazon_books_size, next_page = extract_amazon_books_data(amazon_books).values_at(
      :amazon_books_size,
      :next_page
    )
    if continue_reset_books?(amazon_books_size)
      reset_scraping_status(next_page)
    else
      Rails.logger.info 'scrapingステータスリセット完了'
    end
  end
end

# 実行部分
reset_amazon_books = ResetAmazonBooks.new
reset_amazon_books.reset_scraping_status
