class Profile < ApplicationRecord
  belongs_to :user

  validates :name, length: { maximum: 30 }
  validates :bio, length: { maximum: 180 }
  validates :x_twitter, length: { maximum: 50 }
  validates :instagram, length: { maximum: 50 }
  validates :facebook, length: { maximum: 50 }
  validates :linkedin, length: { maximum: 50 }
  validates :tiktok, length: { maximum: 50 },
                     format: { with: Constants::Regexps::TIKTOK }
  validates :youtube, length: { maximum: 50 },
                      format: { with: Constants::Regexps::YOUTUBE }
  validates :website, length: { maximum: 255 },
                      format: { with: Constants::Regexps::URL }
  validates :avatar, length: { maximum: 4096 },
                     format: { with: Constants::Regexps::URL }
  validate :validate_avatar_extension

  private

  def validate_avatar_extension
    return if avatar.blank?

    img_types = %w[jpg jpeg png gif webp]
    extension = File.extname(avatar).delete('.')
    return if extension.blank?
    return if img_types.include?(extension)

    errors.add(:avatar, I18n.t('errors.messages.wrong_img_extension'))
  end
end
