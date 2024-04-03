class Book < ApplicationRecord
  has_many :likes, as: :likeable, dependent: :destroy

  validates :title, length: { maximum: 500 }
  validates :img_url, length: { maximum: 255 },
                      format: { with: Constants::Regexps::URL }
  validates :description, length: { maximum: 10_000 }
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
end
