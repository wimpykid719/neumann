require 'rails_helper'

RSpec.describe Api::V1::LikesController do
  include_context 'user_authorities'

  let(:book) { FactoryBot.create(:book) }
  let(:book_not_liked) { FactoryBot.create(:book) }
  let(:like) { FactoryBot.create(:like, user:, likeable: book) }
  let!(:liked_book_params) do
    {
      book: {
        id: book.id
      }
    }
  end
  let!(:liked_book_params_not_found) do
    {
      book: {
        id: book.id + 1
      }
    }
  end

  describe 'GET #show' do
    context '正常系' do
      before do
        like
      end

      it 'いいね状態、ステータスコード/200が返る' do
        get api_v1_like_path(book.id), **headers_with_access_token

        expect(response).to have_http_status(:ok)
      end

      it 'いいね済みと返る' do
        get api_v1_like_path(book.id), **headers_with_access_token

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['liked']).to be_truthy
      end

      it 'いいねされていないと返る' do
        get api_v1_like_path(book_not_liked.id), **headers_with_access_token

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['liked']).to be_falsy
      end
    end

    context '異常系' do
      it '存在しない書籍いいね確認' do
        get api_v1_like_path(book_not_liked.id + 1), **headers_with_access_token

        expect(response).to have_http_status(:not_found)

        json = response.parsed_body

        expect(json['error']['message']).to eq('登録されていない書籍です。')
      end
    end
  end

  describe 'POST #create' do
    before do
      user
      book
    end

    context '正常系' do
      it 'いいね登録、ステータスコード/201が返る' do
        post api_v1_likes_path, **headers_with_access_token, params: liked_book_params

        expect(response).to have_http_status(:created)
      end

      it 'いいね出来たと返る' do
        post api_v1_likes_path, **headers_with_access_token, params: liked_book_params

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['liked']).to be_truthy
      end
    end

    context '異常系' do
      before do
        like
      end

      it '重複いいね登録' do
        post api_v1_likes_path, **headers_with_access_token, params: liked_book_params

        expect(response).to have_http_status(:unprocessable_entity)

        json = response.parsed_body

        expect(json['error']['message']).to eq('ユーザーはこの書籍をいいね済みです')
      end

      it '存在しない書籍いいね登録' do
        post api_v1_likes_path, **headers_with_access_token, params: liked_book_params_not_found

        expect(response).to have_http_status(:not_found)

        json = response.parsed_body

        expect(json['error']['message']).to eq('登録されていない書籍です。')
      end
    end
  end

  describe 'DELETE #destroy' do
    before do
      user
      book
    end

    context '正常系' do
      before do
        like
      end

      it 'いいね解除、ステータスコード/200が返る' do
        delete api_v1_like_path(book.id), **headers_with_access_token

        expect(response).to have_http_status(:ok)
      end

      it 'いいね解除出来たと返る' do
        delete api_v1_like_path(book.id), **headers_with_access_token

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['liked']).to be_falsy
      end
    end

    context '異常系' do
      it '存在しないいいねを解除した時' do
        delete api_v1_like_path(book_not_liked.id), **headers_with_access_token

        json = response.parsed_body
        expect(json['error']['message']).to eq('すでにいいね解除済みです。')
      end
    end
  end
end
