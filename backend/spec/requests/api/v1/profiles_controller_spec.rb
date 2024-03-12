require 'rails_helper'

RSpec.describe Api::V1::ProfilesController do
  include_context 'user_authorities'

  let!(:update_params) do
    {
      profile: {
        name: 'こんどう ひろき',
        bio: 'Youtubeしてます',
        x_twitter: 'hiroki-1998',
        instagram: 'hiroki_1998',
        facebook: 'hiroki-1998',
        linkedin: 'hiroki_1998',
        tiktok: 'hiroki-1998',
        youtube: 'hiroki_1998',
        website: 'https://hiroki.com'
      }
    }
  end

  describe 'GET #show' do
    context '正常系' do
      before do
        user
        profile
      end

      it 'リクエスト成功、ステータスコード/200が返る' do
        get api_v1_profile_path(user.name), **headers

        expect(response).to have_http_status(:ok)
      end

      it 'プロフィール詳細が返る' do
        get api_v1_profile_path(user.name), **headers

        json = response.parsed_body

        expect(json.size).to eq(9)
        expect(json['name']).to eq('ノイマン')
        expect(json['bio']).to eq('あらゆる学問に精通しています。コンピュータの開発に貢献しました。')
        expect(json['x_twitter']).to eq('neumann-1903')
        expect(json['instagram']).to eq('neumann_1903')
        expect(json['facebook']).to eq('neumann-1903')
        expect(json['linkedin']).to eq('neumann-1903')
        expect(json['tiktok']).to eq('neumann-1903')
        expect(json['youtube']).to eq('neumann-1903')
        expect(json['website']).to eq('https://neuman.com')
      end
    end
  end

  describe 'PATCH #update' do
    context '正常系' do
      before do
        user
        profile
      end

      it '認証成功、ステータスコード/200が返る' do
        patch api_v1_profiles_path, **headers_with_access_token, params: update_params

        expect(response).to have_http_status(:ok)
      end

      it '編集したプロフィール詳細が返る' do
        patch api_v1_profiles_path, **headers_with_access_token, params: update_params

        json = response.parsed_body

        expect(json.size).to eq(9)
        expect(json['name']).to eq('こんどう ひろき')
        expect(json['bio']).to eq('Youtubeしてます')
        expect(json['x_twitter']).to eq('hiroki-1998')
        expect(json['instagram']).to eq('hiroki_1998')
        expect(json['facebook']).to eq('hiroki-1998')
        expect(json['linkedin']).to eq('hiroki_1998')
        expect(json['tiktok']).to eq('hiroki-1998')
        expect(json['youtube']).to eq('hiroki_1998')
        expect(json['website']).to eq('https://hiroki.com')
      end
    end

    context '異常系' do
      it 'アクセストークンなし' do
        patch api_v1_profiles_path, **headers, params: update_params

        expect(response).to have_http_status(:unauthorized)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('認証に失敗しました。再度ログインをして下さい。')
      end
    end
  end
end
