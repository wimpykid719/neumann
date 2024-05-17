class Provider < ApplicationRecord
  belongs_to :user

  enum :kind, {
    default: 0,
    google: 1
  }, validate: true

  validates :kind, presence: true
  validates :uid, length: { maximum: 150 }, uniqueness: true
end
