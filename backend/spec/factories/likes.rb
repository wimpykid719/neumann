FactoryBot.define do
  factory :like do
    user
    likeable factory: :book
  end
end
