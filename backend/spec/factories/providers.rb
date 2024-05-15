FactoryBot.define do
  factory :provider do
    kind { Provider.kinds['default'] }
    uid { '12345678' }
  end
end
