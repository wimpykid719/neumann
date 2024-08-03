class UserAnalytic < ApplicationRecord
  validates :name, format: { with: Constants::Regexps::MONTH_DAY }

  class << self
    def user_total
      User.all.size
    end
  end
end
