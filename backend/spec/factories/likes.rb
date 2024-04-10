FactoryBot.define do
  factory :like do
    user
    likeable factory: :book

    created_at { Time.zone.now }
    updated_at { Time.zone.now }
  end
end
