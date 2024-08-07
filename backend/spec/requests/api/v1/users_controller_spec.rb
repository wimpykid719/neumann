require 'rails_helper'

RSpec.describe Api::V1::UsersController do
  include_context 'user_authorities'
  include_context 'r2_helper'

  let(:user_duplicated_email) { FactoryBot.create(:user, name: 'duplicate-1', email: 'duplicate@dup.com', current_token_version: new_token_version) }
  let!(:user_params) { { user: { name: 'test', email: 'test@test.com', password: '1111111q' } } }
  let!(:user_params_duplicated_email) { { user: { name: 'duplicate-2', email: 'duplicate@dup.com', password: '1111111q' } } }
  let!(:user_params_lost_name) { { user: { email: 'lost@lost.com', password: '1111111q' } } }
  let!(:update_params) { { user: { new_email: 'new@new.com', new_password: '2222222q', old_password: '1111111q' } } }
  let!(:update_params_email) { { user: { new_email: 'new@new.com', new_password: '', old_password: '' } } }
  let!(:update_params_password) { { user: { new_email: '', new_password: '2222222q', old_password: '1111111q' } } }
  let!(:update_params_wrong_password) { { user: { new_email: 'new@new.com', new_password: '2222222q', old_password: 'wrong_password' } } }
  let!(:update_params_empty) { { user: { new_email: '', new_password: '', old_password: '' } } }
  let!(:update_params_space_password) { { user: { new_email: 'space@space.com', new_password: ' ', old_password: '1111111q' } } }
  let(:book) { FactoryBot.create(:book) }
  let(:like) { FactoryBot.create(:like, user:, likeable: book) }
  let(:provider_default) { FactoryBot.create(:provider, uid: '', user:) }

  describe 'GET #show' do
    context '正常系' do
      before do
        user
        profile
        provider_default
      end

      it '認証成功、ステータスコード/200が返る' do
        get api_v1_users_path, **headers_with_access_token

        expect(response).to have_http_status(:ok)
      end

      it 'ログインユーザ自身がユーザ詳細を取得する場合、ユーザ名、メールアドレス、表示各が返る' do
        get api_v1_users_path, **headers_with_access_token

        json = response.parsed_body

        expect(json.size).to eq(4)
        expect(json['profile'].size).to eq(10)
        expect(json['provider'].size).to eq(1)

        expect(json['name']).to eq('neumann')
        expect(json['email']).to be_present
        expect(json['profile']['name']).to eq('ノイマン')
        expect(json['profile']['bio']).to eq('あらゆる学問に精通しています。コンピュータの開発に貢献しました。')
        expect(json['profile']['x_twitter']).to eq('neumann-1903')
        expect(json['profile']['instagram']).to eq('neumann_1903')
        expect(json['profile']['facebook']).to eq('neumann-1903')
        expect(json['profile']['linkedin']).to eq('neumann-1903')
        expect(json['profile']['tiktok']).to eq('neumann-1903')
        expect(json['profile']['youtube']).to eq('neumann-1903')
        expect(json['profile']['website']).to eq('https://neuman.com')
        expect(json['profile']['avatar']).to eq('https://lh4.googleusercontent.com/photo.jpg')
        expect(json['provider']['kind']).to eq('default')
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

      it 'ユーザを続けて登録できる' do
        provider_default
        post api_v1_users_path, **headers, params: user_params

        expect(response).to have_http_status(:created)
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

      it '特定のparamsが存在しない場合' do
        post api_v1_users_path, **headers, params: user_params_lost_name

        expect(response).to have_http_status(:unprocessable_entity)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('ユーザ名を入力してください, ユーザ名は半角英数字、ハイフン、アンダーバーで入力してください')
      end
    end
  end

  describe 'PATCH #update' do
    before do
      user
      profile
      provider_default
      user_google
      profile_google
      provider_google
    end

    context '正常系' do
      it 'メールアドレス、パスワード変更でトークンのバージョンが更新される' do
        current_token_version = user.current_token_version
        patch api_v1_users_path, **headers_with_access_token, params: update_params

        expect(response).to have_http_status(:ok)

        user.reload
        expect(user.current_token_version).not_to eq(current_token_version)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['email']).to eq(update_params[:user][:new_email])
      end

      it 'メールアドレスのみ変更でトークンのバージョンは更新されない' do
        current_token_version = user.current_token_version
        patch api_v1_users_path, **headers_with_access_token, params: update_params_email

        expect(response).to have_http_status(:ok)

        user.reload
        expect(user.current_token_version).to eq(current_token_version)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['email']).to eq(update_params[:user][:new_email])
      end

      it 'パスワード変更のみでトークンのバージョンが更新される' do
        current_token_version = user.current_token_version
        patch api_v1_users_path, **headers_with_access_token, params: update_params_password

        expect(response).to have_http_status(:no_content)

        user.reload
        expect(user.current_token_version).not_to eq(current_token_version)

        json = response.parsed_body

        expect(json.size).to eq(0)
      end

      it '以前のパスワードが間違えている' do
        patch api_v1_users_path, **headers_with_access_token, params: update_params_wrong_password

        expect(response).to have_http_status(:unauthorized)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('以前のパスワードが間違っています。')
      end

      it '以前のパスワードが間違えても、Cookieが削除されない' do
        cookies[:refresh_token] = 'fake_refresh_token'
        patch api_v1_users_path, **headers_with_access_token, params: update_params_wrong_password

        expect(response).to have_http_status(:unauthorized)
        expect(response.cookies).not_to have_key('refresh_token')
      end

      it 'Google認証ユーザはメールアドレスのみ変更可' do
        patch api_v1_users_path, **headers_with_access_token_google, params: update_params_email

        expect(response).to have_http_status(:ok)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['email']).to eq(update_params[:user][:new_email])
      end

      it 'Google認証ユーザはパスワード変更不可' do
        patch api_v1_users_path, **headers_with_access_token_google, params: update_params

        expect(response).to have_http_status(:unprocessable_entity)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('Google認証ユーザはパスワード変更不可です。')
      end
    end

    context '異常系' do
      it '全ての項目が空、ユーザ情報が変更されない' do
        patch api_v1_users_path, **headers_with_access_token, params: update_params_empty

        expect(response).to have_http_status(:no_content)
        expect(user).to eq(User.find(user.id))
      end

      it '更新するパスワードがスペースのみ' do
        current_token_version = user.current_token_version
        patch api_v1_users_path, **headers_with_access_token, params: update_params_space_password

        expect(response).to have_http_status(:unprocessable_entity)

        user.reload
        expect(user.current_token_version).to eq(current_token_version)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('パスワードを入力してください, パスワードは8文字以上で入力してください, パスワードは半角英数字、ハイフン、アンダーバーで入力してください')
      end

      it 'アクセストークンなし' do
        patch api_v1_users_path, **headers, params: update_params

        expect(response).to have_http_status(:unauthorized)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('認証に失敗しました。再度ログインをして下さい。')
      end
    end
  end

  describe 'DELETE #destroy' do
    before do
      profile
      like
      bucket_mock
      objects_mock(user.name)
      object_mock(user.name, file.original_filename)
    end

    context '正常系' do
      it 'ユーザ削除、ステータスコード/204が返る、リフレッシュトークン削除、ユーザ情報、登録したいいね、プロフィールデータ削除、R2アップロードした画像' do
        expect(User.find(user.id)).to be_present
        expect(Like.find_by(user:, likeable: book)).to be_present
        expect(Profile.find_by(user_id: user.id)).to be_present

        delete api_v1_users_path, **headers_with_access_token

        expect(response).to have_http_status(:no_content)
        expect(response.cookies['refresh_token']).to be_nil
        expect(Rails.logger).to have_received(:info).with('test_user/profile/avatar/test.jpgを削除します')
        expect(objects.first).to have_received(:delete)
        expect(User.find_by(id: user.id)).to be_nil
        expect(Like.find_by(user:, likeable: book)).to be_nil
        expect(Profile.find_by(user_id: user.id)).to be_nil
      end
    end

    context '異常系' do
      it 'アクセストークンなしで削除出来ない' do
        delete api_v1_users_path, **headers

        expect(response).to have_http_status(:unauthorized)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('認証に失敗しました。再度ログインをして下さい。')
      end

      it '存在しないユーザ削除' do
        user.destroy
        delete api_v1_users_path, **headers_with_access_token

        expect(response).to have_http_status(:unauthorized)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('認証に失敗しました。再度ログインをして下さい。')
      end
    end
  end
end
