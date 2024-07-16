class NoteReference < ApplicationRecord
  belongs_to :book

  before_validation :set_defaults

  validate :validate_hashtags
  validate :validate_reference_objs

  private

  def set_defaults
    self.hashtags ||= []
    self.reference_objs ||= []
  end

  def validate_hashtags
    return if hashtags.is_a?(Array) && hashtags.all?(String)

    errors.add(:hashtags, I18n.t('errors.messages.wrong_type_hashtags'))
  end

  def validate_reference_objs
    return if reference_objs.is_a?(Array) && reference_objs.all? { |reference_obj| valid_reference_obj?(reference_obj) }

    errors.add(:reference_objs, I18n.t('errors.messages.wrong_type_reference_objs'))
  end

  def valid_reference_obj?(obj)
    return false unless obj.is_a?(Hash)

    required_keys.keys.all? { |key| valid_key_type?(obj, key) }
  end

  def required_keys
    {
      'likes' => Integer,
      'title' => String,
      'url' => String,
      'userProfileImg' => String
    }
  end

  def valid_key_type?(obj, key)
    obj.key?(key) && obj[key].is_a?(required_keys[key])
  end
end
