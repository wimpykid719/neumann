class Book < ApplicationRecord
  has_many :likes, as: :likeable, dependent: :destroy
  has_one :note_reference, dependent: :destroy

  validates :title, length: { maximum: 500 }
  validates :img_url, length: { maximum: 255 },
                      format: { with: Constants::Regexps::URL }
  validates :description, length: { maximum: 10_000 }
  validates :price, numericality: { in: 0..9_999_999 }
  validates :score, numericality: { in: 0..1 }
  validates :page, numericality: { in: 1..5000 }
  validates :launched, format: { with: Constants::Regexps::DATE }
  validates :author, length: { maximum: 50 }
  validates :publisher, length: { maximum: 50 }
  validates :associate_url, length: { maximum: 255 },
                            format: { with: Constants::Regexps::URL }

  def liked_by_user?(user_id)
    likes.exists?(user_id:)
  end

  def ranking
    rank = Book.where('score >= ?', score).count
    rank > 0 ? rank : 1
  end

  def price_delimited
    price.to_fs(:delimited)
  end

  def likes_count
    likes.size
  end
end
