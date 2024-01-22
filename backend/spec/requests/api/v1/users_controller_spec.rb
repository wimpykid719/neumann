require 'rails_helper'

RSpec.describe Api::V1::UsersController do
  include TokenConcern

  let(:user) { FactoryBot.create(:user, current_token_version: new_token_version) }
  let!(:access_token) { user.generate_access_token }
  let!(:headers) { { headers: { 'X-Requested-With' => 'XMLHttpRequest', Authorization: "Bearer #{access_token.token}" } } }

  describe 'GET #index' do
    context '成功 ステータス200' do
      it '認証成功' do
        get api_v1_users_path, **headers
        expect(response).to have_http_status(:ok)
      end

      it '認証ユーザが返る' do
        get api_v1_users_path, **headers
        json = response.parsed_body
        expect(json['name']).to eq('neumann')
      end
    end
  end
end
