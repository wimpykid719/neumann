require 'rails_helper'
require 'uri'

RSpec.describe Oauth2::Google::Account, type: :service do
  include_context 'oauth2_helper'

  describe 'Account' do
    include Oauth2Concern

    let!(:state_jwt) do
      authorization_url = described_class.new.authorization_url
      expect(authorization_url).to be_present

      uri = URI.parse(authorization_url)
      params = URI.decode_www_form(uri.query || '').to_h
      params['state']
    end
    let!(:verifier_params) do
      {
        state: state_jwt,
        code: 'fake_code'
      }
    end

    before do
      allow(ENV).to receive(:fetch).with('GOOGLE_CLIENT_ID').and_return('fake-google-client-id.apps.googleusercontent.com')
      allow(ENV).to receive(:fetch).with('GOOGLE_CLIENT_SECRET').and_return('fake-google-client-secret')
      allow(ENV).to receive(:fetch).with('FRONT_REDIRECT_URI').and_return('http://localhost:3000')
    end

    context 'authorization_url' do
      it '認証用のURLが返る' do
        authorization_url = described_class.new.authorization_url
        expect(authorization_url).to be_present

        uri = URI.parse(authorization_url)
        params = URI.decode_www_form(uri.query || '').to_h

        expect(params['client_id']).to eq('fake-google-client-id.apps.googleusercontent.com')
        expect(params['redirect_uri']).to eq('http://localhost:3000')
        expect(params['response_type']).to eq('code')
        expect(params['scope']).to eq('email profile')
        expect(params['state']).to be_present
      end
    end

    context 'info' do
      before do
        setup_google_oauth2_mock
      end

      it 'ユーザプロフィールが返る' do
        google_account_mocked = described_class.new
        user_info = google_account_mocked.info(verifier_params)

        expect(user_info.size).to eq(7)
        expect(user_info['sub']).to eq('12345678')
        expect(user_info['name']).to eq('neumann')
        expect(user_info['given_name']).to eq('neumann')
        expect(user_info['picture']).to eq('https://lh3.googleusercontent.com/a/test')
        expect(user_info['email']).to eq('neumann@gmail.com')
        expect(user_info['email_verified']).to be_truthy
        expect(user_info['locale']).to eq('ja')
      end

      context '異常系' do
        it '検証に失敗した場合nilが返る' do
          verifier_params[:state] = "#{state_jwt}_dummy_sub"

          expect(described_class.new.info(verifier_params)).to be_nil
        end

        it '5分後有効期限が切れる' do
          verifier_params_5minutes_later = verifier_params

          travel_to(5.minutes.from_now) do
            expect { described_class.new.info(verifier_params_5minutes_later) }.to(raise_error do |error|
              expect(error).to be_a(Constants::Exceptions::TokenLifetime)
              expect(error.message).to eq('長時間の操作のため、最初から認証操作を行なってください。')
            end)
          end
        end
      end
    end
  end
end
