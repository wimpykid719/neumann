require 'rails_helper'

RSpec.describe Api::V1::UserAnalyticsController do
  include_context 'user_authorities'
  let(:user_analytic) { FactoryBot.create(:user_analytic) }
  let!(:jwt) { Analytic::CronRequestAuth.new.token }
  let(:headers_with_cron_request_token) { { headers: { 'X-Requested-With' => 'XMLHttpRequest', Authorization: "Bearer #{jwt}" } } }

  describe 'GET #index' do
    context '正常系' do
      before do
        11.times do |n|
          time = Time.zone.now.ago(n.days)

          FactoryBot.create(
            :user_analytic,
            name: Time.zone.now.ago(n.days).strftime('%m/%d'),
            count: n,
            created_at: time,
            updated_at: time
          )
        end
      end

      it 'リクエスト成功、ステータスコード/200が返る' do
        get api_v1_user_analytics_path, **headers

        expect(response).to have_http_status(:ok)
      end

      it '直近の10日分のユーザ数合計数と現在のユーザ数が取得される' do
        get api_v1_user_analytics_path, **headers

        json = response.parsed_body

        expect(json.size).to eq(2)
        expect(json['user_analytics'].size).to eq(10)
        json['user_analytics'].each_with_index do |user_analytic, index|
          expect(user_analytic['name']).to eq(Time.zone.now.ago(index.days).strftime('%m/%d'))
        end
        expect(json['user_total']).to eq(2)
      end
    end

    context '異常系' do
      it '登録が0場合でもデータ返る' do
        get api_v1_user_analytics_path, **headers

        json = response.parsed_body

        expect(json.size).to eq(2)
        expect(json['user_analytics'].size).to eq(0)
        expect(json['user_total']).to eq(2)
      end

      it '登録が1件の場合でもデータ返る' do
        user_analytic
        get api_v1_user_analytics_path, **headers

        json = response.parsed_body

        expect(json.size).to eq(2)
        expect(json['user_analytics'].size).to eq(1)
        expect(json['user_total']).to eq(2)
      end
    end
  end

  describe 'POST #create' do
    context '正常系' do
      it 'リクエストを受け取ると現在のユーザ数が集計される' do
        post api_v1_user_analytics_path, **headers_with_cron_request_token

        expect(UserAnalytic.all.size).to eq 1
        expect(response).to have_http_status(:created)
        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['user_analytic']['name']).to eq(Time.zone.now.strftime('%m/%d'))
        expect(json['user_analytic']['count']).to eq(2)
      end
    end

    context '異常系' do
      it 'トークンなしの場合エラーになる' do
        post api_v1_user_analytics_path, **headers

        expect(UserAnalytic.all.size).to eq 0
        expect(response).to have_http_status(:unauthorized)
        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('不正なリクエストです。')
      end
    end
  end
end
