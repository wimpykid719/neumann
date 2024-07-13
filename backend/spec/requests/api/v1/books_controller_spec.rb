require 'rails_helper'

RSpec.describe Api::V1::BooksController do
  include_context 'user_authorities'
  let(:book) { FactoryBot.create(:book) }
  let(:note_reference) { FactoryBot.create(:note_reference, book:) }
  let(:books) { FactoryBot.build_list(:book, 27) }

  describe 'GET #index' do
    context '正常系' do
      it 'リクエスト成功、ステータスコード/200が返る' do
        get api_v1_books_path, **headers

        expect(response).to have_http_status(:ok)
      end

      it '評価ポイントが高い順に並んでいる' do
        book1 = FactoryBot.create(:book, score: 0.5)
        book2 = FactoryBot.create(:book, score: 0.8)
        book3 = FactoryBot.create(:book, score: 0.3)

        get api_v1_books_path, **headers

        json = response.parsed_body

        expect(json.size).to eq(3)
        expect(json['books'].size).to eq(3)

        expect(json['books'][0]['id']).to eq(book2.id)
        expect(json['books'][1]['id']).to eq(book1.id)
        expect(json['books'][2]['id']).to eq(book3.id)
      end

      context '大量の書籍が存在する場合' do
        before do
          # rubocop:disable Rails/SkipsModelValidations:
          Book.insert_all books.map(&:attributes)
          # rubocop:enable Rails/SkipsModelValidations:
        end

        it '書籍一覧が返る' do
          get api_v1_books_path, **headers

          json = response.parsed_body

          expect(json.size).to eq(3)
          expect(json['books'].size).to eq(12)
          expect(json['books'][0].size).to eq(4)
          expect(json['books'][0]['id']).to be_present
          expect(json['books'][0]['title']).to eq('フォン・ノイマンの哲学 人間のフリをした悪魔 (講談社現代新書)')
          expect(json['books'][0]['img_url']).to eq('https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg')
          expect(json['books'][0]['likes_count']).to be_present

          expect(json['rankings'].size).to eq(12)
          expect(json['rankings'][0]).to eq(1)
          expect(json['rankings'][11]).to eq(12)

          expect(json['pages'].size).to eq(3)
          expect(json['pages']['prev']).to be_nil
          expect(json['pages']['next']).to eq(2)
          expect(json['pages']['last']).to eq(3)
        end

        it '書籍一覧が返る（2ページ目）' do
          get api_v1_books_path, **headers, params: { page: 2 }

          json = response.parsed_body

          expect(json.size).to eq(3)
          expect(json['books'].size).to eq(12)
          expect(json['books'][0].size).to eq(4)
          expect(json['books'][0]['id']).to be_present
          expect(json['books'][0]['title']).to eq('フォン・ノイマンの哲学 人間のフリをした悪魔 (講談社現代新書)')
          expect(json['books'][0]['img_url']).to eq('https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg')

          expect(json['rankings'].size).to eq(12)
          expect(json['rankings'][0]).to eq(13)
          expect(json['rankings'][11]).to eq(24)

          expect(json['pages'].size).to eq(3)
          expect(json['pages']['prev']).to eq(1)
          expect(json['pages']['next']).to eq(3)
          expect(json['pages']['last']).to eq(3)
        end

        it '書籍一覧が返る（3ページ目 - 中途半端な数になる）' do
          get api_v1_books_path, **headers, params: { page: 3 }

          json = response.parsed_body

          expect(json.size).to eq(3)
          expect(json['books'].size).to eq(3)
          expect(json['books'][0].size).to eq(4)
          expect(json['books'][0]['id']).to be_present
          expect(json['books'][0]['title']).to eq('フォン・ノイマンの哲学 人間のフリをした悪魔 (講談社現代新書)')
          expect(json['books'][0]['img_url']).to eq('https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg')

          expect(json['rankings'].size).to eq(3)
          expect(json['rankings'][0]).to eq(25)
          expect(json['rankings'][2]).to eq(27)

          expect(json['pages'].size).to eq(3)
          expect(json['pages']['prev']).to eq(2)
          expect(json['pages']['next']).to be_nil
          expect(json['pages']['last']).to eq(3)
        end

        it 'リクエスト失敗、ステータスコード/404が返る' do
          get api_v1_books_path, **headers, params: { page: 4 }

          expect(response).to have_http_status(:not_found)
        end

        it '書籍一覧が返る（存在しないページ）' do
          get api_v1_books_path, **headers, params: { page: 4 }

          json = response.parsed_body

          expect(json.size).to eq(1)
          expect(json['error']['message']).to eq('存在しないページです。')
        end
      end
    end

    context '異常系' do
      it '書籍が1件も登録されていない' do
        get api_v1_books_path, **headers

        expect(response).to have_http_status(:ok)

        json = response.parsed_body

        expect(json.size).to eq(3)
        expect(json['books'].size).to eq(0)

        expect(json['rankings'].size).to eq(0)

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
        book
        note_reference
      end

      it 'リクエスト成功、ステータスコード/200が返る' do
        get api_v1_book_path(book.id), **headers

        expect(response).to have_http_status(:ok)
      end

      it '書籍詳細が返る' do
        get api_v1_book_path(book.id), **headers

        json = response.parsed_body

        expect(json.size).to eq(14)
        expect(json['note_reference'].size).to eq(2)

        expect(json['id']).to be_present
        expect(json['title']).to eq('フォン・ノイマンの哲学 人間のフリをした悪魔 (講談社現代新書)')
        expect(json['img_url']).to eq('https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg')
        expect(json['scraped_at']).to eq('2024-07-09')
        expect(json['price_delimited']).to be_present
        expect(json['score']).to be_present
        expect(json['page']).to be_present
        expect(json['launched']).to eq('2021-02-17')
        expect(json['author']).to eq('高橋 昌一郎')
        expect(json['publisher']).to eq('講談社')
        expect(json['associate_url']).to eq('https://amzn.to/4c9f3R8')
        expect(json['ranking']).to eq(1)
        expect(json['likes_count']).to be_present
        expect(json['note_reference']['hashtags']).to eq(['#tag1', '#tag2'])
        expect(json['note_reference']['reference_objs']).to eq(
          [
            { 'url' => 'http://example.com/1', 'likes' => 10, 'title' => 'example title', 'userProfileImg' => 'http://example.com/image1.jpg' },
            { 'url' => 'http://example.com/2', 'likes' => 16, 'title' => 'example title2', 'userProfileImg' => 'http://example.com/image2.jpg' }
          ]
        )
      end
    end

    context '異常系' do
      it 'リクエスト失敗、ステータスコード/404が返る' do
        get api_v1_book_path(1), **headers

        expect(response).to have_http_status(:not_found)
      end

      it '存在しない書籍を' do
        get api_v1_book_path(1), **headers

        expect(response).to have_http_status(:not_found)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('登録されていない書籍です。')
      end
    end
  end
end
