FactoryBot.define do
  factory :book do
    asin { SecureRandom.alphanumeric(10) }
    sequence(:title) { |n| "フォン・ノイマンの哲学 人間のフリをした悪魔 (講談社現代新書) - #{n}" }
    img_url { 'https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg' }
    price { Random.rand(0..9_999_999) }
    score { Random.rand(0..1.0).round(3) }
    page { Random.rand(1..5000) }
    launched { '2021-02-17' }
    scraped_at { '2024-07-09' }
    author { '高橋 昌一郎' }
    publisher { '講談社' }
    associate_url { 'https://amzn.to/4c9f3R8' }

    created_at { Time.zone.now }
    updated_at { Time.zone.now }
  end
end
