require 'rails_helper'

RSpec.describe Api::V1::GoogleOauth2Controller do
  include_context 'user_authorities'
  include_context 'oauth2_helper'

  let(:user_default_signup) do
    FactoryBot.create(
      :user,
      name: 'default_signup',
      email: 'neumann@gmail.com'
    )
  end
  let!(:oauth_params) { { oauth2: { state: state_jwt, code: 'fake_code' } } }

  describe 'POST #authorization_url' do
    context '正常系' do
      it 'リクエスト成功、ステータスコード/200が返る' do
        post authorization_url_api_v1_google_oauth2_index_path, **headers

        expect(response).to have_http_status(:ok)
      end

      it '認証用のURLが返る' do
        post authorization_url_api_v1_google_oauth2_index_path, **headers

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['authorization_url']).to be_present
      end
    end
  end

  describe 'POST #create' do
    before do
      setup_google_oauth2_mock
    end

    context '正常系' do
      it 'ログイン成功事、ステータスコード/201が返る' do
        post api_v1_google_oauth2_index_path, **headers, params: oauth_params

        expect(response).to have_http_status(:created)
      end

      it '新しいアクセストークンが返る' do
        post api_v1_google_oauth2_index_path, **headers, params: oauth_params
        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['token']).to be_present
      end

      it '新しいリフレッシュトークンがcookieにセットされる' do
        post api_v1_google_oauth2_index_path, **headers, params: oauth_params

        expect(response.cookies['refresh_token']).to be_present
      end

      context '通常ログインで同じメールアドレスが使用されている場合' do
        before do
          user_default_signup
        end

        it 'Google認証に失敗する' do
          post api_v1_google_oauth2_index_path, **headers, params: oauth_params

          expect(response).to have_http_status(:unprocessable_entity)
          json = response.parsed_body

          expect(json.size).to eq(1)
          expect(json['error']['message']).to eq('Google認証以外の方法でアカウント作成済みです。')
        end

        it '5分後のStateの認証に失敗する' do
          travel_to(5.minutes.from_now) do
            post api_v1_google_oauth2_index_path, **headers, params: oauth_params

            expect(response).to have_http_status(:unprocessable_entity)
            json = response.parsed_body

            expect(json.size).to eq(1)
            expect(json['error']['message']).to eq('長時間の操作のため、最初から認証操作を行なってください。')
          end
        end
      end
    end
  end
end
