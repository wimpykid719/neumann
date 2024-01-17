FactoryBot.define do
  factory :user do
    name { 'neumann' }
    email { FFaker::Internet.email }
    password { '1111111q' }
  end
end
