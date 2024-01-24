require 'rails_helper'

RSpec.describe Api::V1::AuthTokenController do
  include TokenConcern
  include_context 'requests'

  let(:user) { FactoryBot.create(:user) }

  describe 'POST #create' do
    context '正常系' do
      it 'ログイン成功事、ステータスコード/201が返る' do
        post api_v1_auth_token_index_path, **headers, params: { auth: { email: user.email, password: '1111111q' } }

        expect(response).to have_http_status(:created)
      end

      it '新しいアクセストークンが返る' do
        post api_v1_auth_token_index_path, **headers, params: { auth: { email: user.email, password: '1111111q' } }
        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['token']).to be_present
      end

      it '新しいリフレッシュトークンがcookieにセットされる' do
        post api_v1_auth_token_index_path, **headers, params: { auth: { email: user.email, password: '1111111q' } }

        expect(response.cookies['refresh_token']).to be_present
      end
    end

    context '異常系' do
      it 'パスワードが異なる場合、ステータスコード404が返る' do
        post api_v1_auth_token_index_path, **headers, params: { auth: { email: user.email, password: 'wrong_password' } }

        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST #refresh' do
    let!(:refresh_token) { user.generate_refresh_token }
    let!(:access_token) { user.generate_access_token }

    let!(:refresh_token_another) { user.generate_refresh_token }
    let!(:access_token_another) { user.generate_access_token }

    context '正常系' do
      it '再認証、ステータスコード/201が返る' do
        cookies[:refresh_token] = refresh_token.token

        post refresh_api_v1_auth_token_index_path, **headers

        expect(response).to have_http_status(:created)
      end

      it '新しいアクセストークンが返る' do
        cookies[:refresh_token] = refresh_token.token

        post refresh_api_v1_auth_token_index_path, **headers
        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['token']).not_to eq(access_token.token)
      end

      it '新しいリフレッシュトークンがcookieにセットされる' do
        cookies[:refresh_token] = refresh_token.token

        post refresh_api_v1_auth_token_index_path, **headers

        expect(response.cookies['refresh_token']).not_to eq(refresh_token.token)
      end

      it '複数の端末でログイン状態を維持できる' do
        cookies[:refresh_token] = refresh_token_another.token

        post refresh_api_v1_auth_token_index_path, **headers

        expect(response).to have_http_status(:created)

        json = response.parsed_body
        expect(json.size).to eq(1)
        expect(json['token']).not_to eq(access_token_another.token)
        expect(response.cookies['refresh_token']).not_to eq(refresh_token_another.token)
      end
    end

    context '異常系' do
      it 'refresh_tokenのバージョンに変更があり認証に失敗、ステータスコード/401が返る' do
        user.update!(current_token_version: 'changed_version')
        cookies[:refresh_token] = refresh_token.token

        post refresh_api_v1_auth_token_index_path, **headers

        expect(response).to have_http_status(:unauthorized)
        json = response.parsed_body
        error = json['errors'].first

        expect(error['message']).to eq('パスワードに変更がありました。再度ログインして下さい。')
      end

      it 'cookieにリフレッシュトークンがない場合、ステータスコード/401が返る' do
        post refresh_api_v1_auth_token_index_path, **headers

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:refresh_token) { user.generate_refresh_token }

    context '正常系' do
      it 'ログアウト、ステータスコード/200が返る' do
        cookies[:refresh_token] = refresh_token.token

        delete api_v1_auth_token_index_path, **headers

        expect(response).to have_http_status(:ok)
      end

      it 'cookieリフレッシュトークンが削除される' do
        cookies[:refresh_token] = refresh_token.token

        delete api_v1_auth_token_index_path, **headers

        expect(response.cookies['refresh_token']).to be_nil
      end
    end

    context '異常系' do
      it 'cookieにリフレッシュトークンがない場合、ステータスコード/401が返る' do
        delete api_v1_auth_token_index_path, **headers

        expect(response).to have_http_status(:unauthorized)
      end

      it '有効期限切れのリフレッシュトークンでアクセス ステータスコード/401が返る' do
        travel_to(14.days.from_now) do
          cookies[:refresh_token] = refresh_token.token
          delete api_v1_auth_token_index_path, **headers

          expect(response).to have_http_status(:unauthorized)
        end
      end
    end
  end
end
