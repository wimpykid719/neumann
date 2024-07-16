BOOKS_COUNT = 24

# rubocop:disable Metrics/BlockLength, Metrics/MethodLength
def create_books(num)
  num.times do |n|
    book = Book.create({
                         asin: SecureRandom.alphanumeric(10),
                         title: "テスト - #{n} フォン・ノイマンの哲学 人間のフリをした悪魔 (講談社現代新書)",
                         img_url: 'https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg',
                         score: Random.rand(0..1.0).round(3),
                         page: Random.rand(1..5000),
                         launched: '2021-02-17',
                         scraped_at: '2024/07/08 23:20:46.385',
                         author: '高橋 昌一郎',
                         publisher: '講談社',
                         associate_url: 'https://amzn.to/4c9f3R8'
                       })
    book.create_note_reference({
                                 hashtags: ['#ビジネス書評', '#おすすめのビジネス書', '#ビジネス書レビュー', '#ビジネス書'],
                                 reference_objs: [
                                   {
                                     'url' => 'http://example.com/1',
                                     'likes' => 10,
                                     'title' => 'example title',
                                     'userProfileImg' => 'https://assets.st-note.com/production/uploads/images/41931547/profile_de48659dc5cd1c96d71e1ceca1a7b6af.jpg?fit=bounds&format=jpeg&quality=85&width=330'
                                   },
                                   {
                                     'url' => 'http://example.com/2',
                                     'likes' => 16,
                                     'title' => 'example title2',
                                     'userProfileImg' => 'https://assets.st-note.com/production/uploads/images/41931547/profile_de48659dc5cd1c96d71e1ceca1a7b6af.jpg?fit=bounds&format=jpeg&quality=85&width=330'
                                   }
                                 ]
                               })
  end
end
# rubocop:enable Metrics/BlockLength, Metrics/MethodLength

create_books(BOOKS_COUNT)
puts "書籍を#{BOOKS_COUNT}冊追加しました！！"
