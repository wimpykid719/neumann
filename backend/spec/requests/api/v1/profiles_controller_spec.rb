require 'rails_helper'

RSpec.describe Api::V1::ProfilesController do
  include_context 'user_authorities'

  describe 'GET #show' do
    context '正常系' do
      before do
        user
        profile
      end

      it '認証成功、ステータスコード/200が返る' do
        get api_v1_profile_path(user.name), **headers

        expect(response).to have_http_status(:ok)
      end

      it 'プロフィール詳細が返る' do
        get api_v1_profile_path(user.name), **headers

        json = response.parsed_body

        expect(json.size).to eq(9)
        expect(json['profile_name']).to eq('ノイマン')
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
end
