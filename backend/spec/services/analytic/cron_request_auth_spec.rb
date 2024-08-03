require 'rails_helper'

RSpec.describe Analytic::CronRequestAuth, type: :service do
  describe 'CronRequestAuth' do
    let!(:jwt) { described_class.new.token }

    context 'token' do
      it 'jwtトークンが発行される' do
        expect(jwt).to be_present
      end
    end

    context 'valid_cron_request_jwt?' do
      it '検証が有効になる' do
        expect(described_class.valid_cron_request_jwt?(jwt)).to be(true)
      end

      it '有効期限なし' do
        travel_to(30.years.from_now) do
          expect(described_class.valid_cron_request_jwt?(jwt)).to be(true)
        end
      end

      context '異常系' do
        it '検証が無効になる' do
          expect(described_class.valid_cron_request_jwt?("#{jwt}_dummy_sub")).to be(false)
        end
      end
    end
  end
end
