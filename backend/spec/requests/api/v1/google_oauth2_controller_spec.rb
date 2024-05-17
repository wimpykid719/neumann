require 'rails_helper'

RSpec.describe Api::V1::GoogleOauth2Controller do
  include_context 'user_authorities'
  include_context 'oauth2_helper'

  let(:duplicate_email) do
    FactoryBot.create(
      :user,
      name: 'default_signup_email',
      email: 'neumann@gmail.com'
    )
  end
  let(:changed_email) do
    FactoryBot.create(
      :user,
      name: 'google_signup_email',
      email: 'changed@gmail.com'
    )
  end
  let(:duplicate_uid) do
    FactoryBot.create(
      :user,
      name: 'default_signup_uid',
      email: 'neumann@neumann.com'
    )
  end
  let(:user_default_email) do
    FactoryBot.create(:provider, kind: Provider.kinds['default'], uid: '987654321', user: duplicate_email)
  end
  let(:user_google_email_changed) do
    FactoryBot.create(:provider, kind: Provider.kinds['google'], user: changed_email)
  end
  let(:user_default_uid) do
    FactoryBot.create(:provider, kind: Provider.kinds['default'], user: duplicate_uid)
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
    end

    context '異常系' do
      it 'Google認証ユーザがメールアドレスを変更してもログイン出来る' do
        user_google_email_changed
        post api_v1_google_oauth2_index_path, **headers, params: oauth_params

        expect(response).to have_http_status(:created)
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

      context '通常のログインユーザと重複項目がある場合' do
        it 'メールアドレス重複、失敗' do
          user_default_email
          post api_v1_google_oauth2_index_path, **headers, params: oauth_params

          expect(response).to have_http_status(:unprocessable_entity)
          json = response.parsed_body

          expect(json.size).to eq(1)
          expect(json['error']['message']).to eq('Google認証以外の方法でアカウント作成済みです。')
        end

        it 'ユーザID重複、失敗' do
          user_default_uid
          post api_v1_google_oauth2_index_path, **headers, params: oauth_params

          expect(response).to have_http_status(:unprocessable_entity)
          json = response.parsed_body

          expect(json.size).to eq(1)
          expect(json['error']['message']).to eq('Google認証以外の方法でアカウント作成済みです。')
        end
      end
    end
  end
end
