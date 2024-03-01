require 'rails_helper'

RSpec.describe Api::V1::UsersController do
  include_context 'user_authorities'

  let(:user_duplicated_email) { FactoryBot.create(:user, name: 'duplicate-1', email: 'duplicate@dup.com', current_token_version: new_token_version) }
  let!(:user_params) { { user: { name: 'test', email: 'test@test.com', password: '1111111q' } } }
  let!(:user_params_duplicated_email) { { user: { name: 'duplicate-2', email: 'duplicate@dup.com', password: '1111111q' } } }

  describe 'GET #show' do
    context '正常系' do
      before do
        user
        profile
      end

      it '認証成功、ステータスコード/200が返る' do
        get api_v1_users_path, **headers_with_access_token

        expect(response).to have_http_status(:ok)
      end

      it 'ログインユーザ自身がユーザ詳細を取得する場合、ユーザ名、メールアドレス、表示各が返る' do
        get api_v1_users_path, **headers_with_access_token

        json = response.parsed_body

        expect(json.size).to eq(3)
        expect(json['name']).to eq('neumann')
        expect(json['email']).to be_present
        expect(json['profile']['name']).to eq('ノイマン')
      end

      it 'ログインユーザ自身が別のユーザ詳細を取得しようとしても自身が返る' do
        get api_v1_users_path, **headers_with_access_token
        expect(response).to have_http_status(:ok)

        json = response.parsed_body

        expect(json.size).to eq(3)
        expect(json['name']).to eq('neumann')
        expect(json['email']).to be_present
        expect(json['profile']['name']).to eq('ノイマン')
      end

      it '未ログインユーザがユーザ詳細を取得する場合、認証エラーとなる' do
        get api_v1_users_path, **headers

        expect(response).to have_http_status(:unauthorized)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('認証に失敗しました。再度ログインをして下さい。')
      end
    end

    context '異常系' do
      it 'ユーザ存在しない場合、認証エラーとなる' do
        user.destroy
        get api_v1_users_path, **headers_with_access_token

        expect(response).to have_http_status(:unauthorized)
        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('認証に失敗しました。再度ログインをして下さい。')
      end

      it 'tokenのバージョンに変更があった場合' do
        user.update_token_version('version_new')
        get api_v1_users_path, **headers_with_access_token

        expect(response).to have_http_status(:unauthorized)
        json = response.parsed_body
        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('パスワードに変更がありました。再度ログインして下さい。')
      end
    end
  end

  describe 'POST #create' do
    context '正常系' do
      it 'ユーザ作成、ステータスコード/201が返る、アクセストークン、リフレッシュトークンが返る' do
        post api_v1_users_path, **headers, params: user_params

        expect(response).to have_http_status(:created)

        users = User.where(name: user_params[:user][:name])
        expect(users.size).to eq 1

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['token']).to be_present
        decoded_token = JWT.decode(json['token'], nil, false).first

        expect(User.find_by(id: decrypt_for(decoded_token['sub']))).to be_present
        expect(response.cookies['refresh_token']).to be_present
      end
    end

    context '異常系' do
      before do
        user_duplicated_email
      end

      it '既に存在するメールアドレスでユーザ作成' do
        post api_v1_users_path, **headers, params: user_params_duplicated_email

        expect(response).to have_http_status(:unprocessable_entity)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('メールアドレスは登録済みです')
      end
    end
  end
end
