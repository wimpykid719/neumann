require 'rails_helper'

RSpec.describe Api::V1::LikesController do
  include_context 'user_authorities'

  let(:book) { FactoryBot.create(:book) }
  let(:books) { FactoryBot.build_list(:book, 27) }
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

  describe 'GET #index' do
    context '正常系' do
      it 'リクエスト成功、ステータスコード/200が返る' do
        get api_v1_likes_path, **headers, params: { user_name: user.name }

        expect(response).to have_http_status(:ok)
      end

      it 'いいね一覧がいいねされた順に並んでいる' do
        book1 = FactoryBot.create(:book, title: 'いいね - 1')
        book2 = FactoryBot.create(:book, title: 'いいね - 2')
        book3 = FactoryBot.create(:book, title: 'いいね - 3')
        FactoryBot.create(:like, user:, likeable: book1, created_at: Time.zone.now)
        FactoryBot.create(:like, user:, likeable: book2, created_at: Time.zone.now.ago(1))
        FactoryBot.create(:like, user:, likeable: book3, created_at: Time.zone.now.ago(2))

        get api_v1_likes_path, **headers, params: { user_name: user.name }

        json = response.parsed_body

        expect(json.size).to eq(2)
        expect(json['books'].size).to eq(3)
        expect(json['books'][0].size).to eq(4)
        expect(json['books'][0]['id']).to eq(book1.id)
        expect(json['books'][1]['id']).to eq(book2.id)
        expect(json['books'][2]['id']).to eq(book3.id)
      end

      context '大量のいいねが存在する場合' do
        before do
          # rubocop:disable Rails/SkipsModelValidations:
          Book.destroy_all
          Book.insert_all books.map(&:attributes)
          Like.insert_all(Book.all.map { |book| FactoryBot.build(:like, user:, likeable: book).attributes })
          # rubocop:enable Rails/SkipsModelValidations:
        end

        it 'ユーザがいいね登録した書籍一覧が返る' do
          get api_v1_likes_path, **headers, params: { user_name: user.name }

          json = response.parsed_body

          expect(json.size).to eq(2)
          expect(json['books'].size).to eq(12)
          expect(json['books'][0].size).to eq(4)
          expect(json['books'][0]['id']).to be_present
          expect(json['books'][0]['title']).to start_with('フォン・ノイマンの哲学 人間のフリをした悪魔 (講談社現代新書) - ')
          expect(json['books'][0]['img_url']).to eq('https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg')
          expect(json['books'][0]['likes_count']).to eq(1)

          expect(json['pages'].size).to eq(3)
          expect(json['pages']['prev']).to be_nil
          expect(json['pages']['next']).to eq(2)
          expect(json['pages']['last']).to eq(3)
        end

        it 'ユーザがいいね登録した書籍一覧が返る（2ページ目）' do
          get api_v1_likes_path, **headers, params: { user_name: user.name, page: 2 }

          json = response.parsed_body

          expect(json.size).to eq(2)
          expect(json['books'].size).to eq(12)
          expect(json['books'][0].size).to eq(4)
          expect(json['books'][0]['id']).to be_present
          expect(json['books'][0]['title']).to start_with('フォン・ノイマンの哲学 人間のフリをした悪魔 (講談社現代新書) - ')
          expect(json['books'][0]['img_url']).to eq('https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg')
          expect(json['books'][0]['likes_count']).to eq(1)

          expect(json['pages'].size).to eq(3)
          expect(json['pages']['prev']).to eq(1)
          expect(json['pages']['next']).to eq(3)
          expect(json['pages']['last']).to eq(3)
        end

        it 'ユーザがいいね登録した書籍一覧が返る（3ページ目 - 中途半端な数になる）' do
          get api_v1_likes_path, **headers, params: { user_name: user.name, page: 3 }

          json = response.parsed_body

          expect(json.size).to eq(2)
          expect(json['books'].size).to eq(3)
          expect(json['books'][0].size).to eq(4)
          expect(json['books'][0]['id']).to be_present
          expect(json['books'][0]['title']).to start_with('フォン・ノイマンの哲学 人間のフリをした悪魔 (講談社現代新書) - ')
          expect(json['books'][0]['img_url']).to eq('https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg')
          expect(json['books'][0]['likes_count']).to eq(1)

          expect(json['pages'].size).to eq(3)
          expect(json['pages']['prev']).to eq(2)
          expect(json['pages']['next']).to be_nil
          expect(json['pages']['last']).to eq(3)
        end

        it '存在しないユーザ、ステータスコード/401が返る' do
          get api_v1_likes_path, **headers, params: { user_name: 'user-not-fond', page: 3 }

          expect(response).to have_http_status(:not_found)

          json = response.parsed_body
          expect(json['error']['message']).to eq('存在しないユーザです。')
        end

        it 'ユーザがいいね登録した書籍一覧が返る（存在しないページ）' do
          get api_v1_likes_path, **headers, params: { user_name: user.name, page: 4 }

          json = response.parsed_body

          expect(json.size).to eq(1)
          expect(json['error']['message']).to eq('存在しないページです。')
        end
      end
    end

    context '異常系' do
      before do
        Like.destroy_all
      end

      it 'いいねが1件も登録されていない' do
        get api_v1_likes_path, **headers, params: { user_name: user.name }

        expect(response).to have_http_status(:ok)

        json = response.parsed_body

        expect(json.size).to eq(2)
        expect(json['books'].size).to eq(0)

        expect(json['pages'].size).to eq(3)
        expect(json['pages']['prev']).to be_nil
        expect(json['pages']['next']).to be_nil
        expect(json['pages']['last']).to eq(1)
      end
    end
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
