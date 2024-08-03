class Api::V1::UserAnalyticsController < ApplicationController
  # before_action :authenticate_request, only: [:create]

  def index
    user_analytics = UserAnalytic.order(created_at: :desc).limit(10)

    render json: {
      user_analytics: user_analytics.as_json(only: [:name, :count]),
      user_total: UserAnalytic.user_total
    }
  end

  def create
    user_analytic = UserAnalytic.create!(
      name: Time.zone.now.strftime('%m/%d'),
      count: UserAnalytic.user_total
    )
    render status: :created, json: { user_analytic: user_analytic.as_json(only: [:name, :count]) }
  end
end
