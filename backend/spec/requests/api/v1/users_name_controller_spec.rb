require 'rails_helper'

RSpec.describe Api::V1::UsersNameController do
  include_context 'user_authorities'
  # user_authoritiesでuserが1件追加されているので実際には1034になる
  let(:users) { FactoryBot.build_list(:user, 1033) }

  describe 'GET #index' do
    context '正常系' do
      it 'リクエスト成功、ステータスコード/200が返る' do
        get api_v1_users_name_index_path, **headers

        expect(response).to have_http_status(:ok)
      end

      context 'ユーザ名一覧が返る' do
        before do
          # rubocop:disable Rails/SkipsModelValidations:
          User.insert_all(users.map.with_index { |user, index| user.attributes.merge(name: "#{index}-#{user.name}") })
          # rubocop:enable Rails/SkipsModelValidations:
        end

        it 'ユーザ名一覧が返る' do
          get api_v1_users_name_index_path, **headers

          json = response.parsed_body

          expect(json.size).to eq(2)
          expect(json['user_names'].size).to eq(100)
          expect(json['user_names'][0].size).to eq(1)
          expect(json['user_names'][0]['name']).to be_present

          expect(json['pages'].size).to eq(3)
          expect(json['pages']['prev']).to be_nil
          expect(json['pages']['next']).to eq(2)
          expect(json['pages']['last']).to eq(11)
        end

        it 'ユーザ名一覧が返る（2ページ目）' do
          get api_v1_users_name_index_path, **headers, params: { page: 2 }

          json = response.parsed_body

          expect(json.size).to eq(2)
          expect(json['user_names'].size).to eq(100)
          expect(json['user_names'][0].size).to eq(1)
          expect(json['user_names'][0]['name']).to be_present

          expect(json['pages'].size).to eq(3)
          expect(json['pages']['prev']).to eq(1)
          expect(json['pages']['next']).to eq(3)
          expect(json['pages']['last']).to eq(11)
        end

        it 'ユーザ名一覧が返る（10ページ目）' do
          get api_v1_users_name_index_path, **headers, params: { page: 10 }

          json = response.parsed_body

          expect(json.size).to eq(2)
          expect(json['user_names'].size).to eq(100)
          expect(json['user_names'][0].size).to eq(1)
          expect(json['user_names'][0]['name']).to be_present

          expect(json['pages'].size).to eq(3)
          expect(json['pages']['prev']).to eq(9)
          expect(json['pages']['next']).to eq(11)
          expect(json['pages']['last']).to eq(11)
        end

        it 'ユーザ名一覧が返る（11ページ目 - 中途半端な数になる）' do
          get api_v1_users_name_index_path, **headers, params: { page: 11 }

          json = response.parsed_body

          expect(json.size).to eq(2)
          expect(json['user_names'].size).to eq(34)
          expect(json['user_names'][0].size).to eq(1)
          expect(json['user_names'][0]['name']).to be_present

          expect(json['pages'].size).to eq(3)
          expect(json['pages']['prev']).to eq(10)
          expect(json['pages']['next']).to be_nil
          expect(json['pages']['last']).to eq(11)
        end

        it 'リクエスト失敗、ステータスコード/404が返る' do
          get api_v1_users_name_index_path, **headers, params: { page: 12 }

          expect(response).to have_http_status(:not_found)
        end

        it 'ユーザ名一覧が返る（存在しないページ）' do
          get api_v1_books_path, **headers, params: { page: 12 }

          json = response.parsed_body

          expect(json.size).to eq(1)
          expect(json['error']['message']).to eq('存在しないページです。')
        end
      end
    end

    context '異常系' do
      before do
        User.destroy_all
      end

      it 'ユーザが1件も登録されていない' do
        get api_v1_users_name_index_path, **headers

        expect(response).to have_http_status(:ok)

        json = response.parsed_body

        expect(json.size).to eq(2)
        expect(json['user_names'].size).to eq(0)

        expect(json['pages'].size).to eq(3)
        expect(json['pages']['prev']).to be_nil
        expect(json['pages']['next']).to be_nil
        expect(json['pages']['last']).to eq(1)
      end
    end
  end
end
