FactoryBot.define do
  factory :user do
    name { 'neumann' }
    email { FFaker::Internet.email }
    password { '1111111q' }

    created_at { Time.zone.now }
    updated_at { Time.zone.now }
  end
end
