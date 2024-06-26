require 'rails_helper'

RSpec.describe Book do
  let(:book) { FactoryBot.create(:book) }
  let(:book_low_score) { FactoryBot.create(:book, score: 0.3) }
  let(:book_middle_score) { FactoryBot.create(:book, score: 0.5) }
  let(:book_high_score) { FactoryBot.create(:book, score: 0.9) }
  let(:book_super_high_score) { FactoryBot.create(:book, score: 1) }
  let(:like) { FactoryBot.create(:like, user:, likeable: book) }

  it '有効なファクトリを持つこと' do
    expect(book).to be_valid
  end

  describe 'validation' do
    context 'title' do
      it '登録可能' do
        expect(book.title).to be_present
      end

      it 'nilの場合エラー' do
        expect do
          book.update!(title: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        b = FactoryBot.build(:book, title: '')
        expect(b).to be_valid
        expect(b.title).to eq('')
      end

      it 'titleが501文字以上の場合エラー' do
        b = FactoryBot.build(:book, title: 'あ' * 501)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:title).first).to eq('タイトルは500文字以内で入力してください')
      end
    end

    context 'img_url' do
      it '登録可能' do
        expect(book.img_url).to eq('https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg')
      end

      it '暗号化されていないURLは登録不可' do
        b = FactoryBot.build(:book, img_url: 'http://m.media-amazon.com/images/I/81xGnuwne0L._SY522_.jpg')
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:img_url).first).to eq('画像のURLが不正な形式です')
      end

      it '不正な形式は登録不可' do
        b = FactoryBot.build(:book, img_url: 'https://-@{}$$%%&&[]#')
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:img_url).first).to eq('画像のURLが不正な形式です')
      end

      it 'nilの場合エラー' do
        expect do
          book.update(img_url: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        b = FactoryBot.build(:book, img_url: '')
        expect(b).to be_valid
        expect(b.img_url).to eq('')
      end

      it 'img_urlのURLが256文字以上の場合エラー' do
        b = FactoryBot.build(:book, img_url: 'a' * 256)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:img_url).first).to eq('画像のURLは255文字以内で入力してください')
      end
    end

    context 'description' do
      it '登録可能' do
        expect(book.description).to be_present
      end

      it 'nil使用可能' do
        book.update(description: nil)
        expect(book).to be_valid
      end

      it '空文字入力可能' do
        b = FactoryBot.build(:book, description: '')
        expect(b).to be_valid
        expect(b.description).to eq('')
      end

      it 'descriptionが10000文字以上の場合エラー' do
        b = FactoryBot.build(:book, description: 'あ' * 10_001)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:description).first).to eq('説明文は10000文字以内で入力してください')
      end
    end

    context 'price' do
      it '登録可能' do
        expect(book.price).to be_present
      end

      it 'nilの場合エラー' do
        b = FactoryBot.build(:book, price: nil)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:price).first).to eq('価格は数値で入力してください')
      end

      it '0入力可' do
        b = FactoryBot.build(:book, price: 0)
        expect(b).to be_valid
        expect(b.price).to eq(0)
      end

      it 'ページ数が1~5000範囲外の場合エラー' do
        b = FactoryBot.build(:book, price: 99_999_999)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:price).first).to eq('価格は0..9999999の範囲に含めてください')
      end
    end

    context 'score' do
      it '登録可能' do
        expect(book.score).to be_present
      end

      it 'nilの場合エラー' do
        b = FactoryBot.build(:book, score: nil)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:score).first).to eq('評価ポイントは数値で入力してください')
      end

      it '0入力可能' do
        b = FactoryBot.build(:book, score: 0)
        expect(b).to be_valid
        expect(b.score).to eq(0)
      end

      it '評価ポイントが0~1範囲外の場合エラー' do
        b = FactoryBot.build(:book, score: 2.5)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:score).first).to eq('評価ポイントは0..1の範囲に含めてください')
      end
    end

    context 'page' do
      it '登録可能' do
        expect(book.page).to be_present
      end

      it 'nilの場合エラー' do
        b = FactoryBot.build(:book, page: nil)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:page).first).to eq('ページ数は数値で入力してください')
      end

      it '0入力不可' do
        b = FactoryBot.build(:book, page: 0)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:page).first).to eq('ページ数は1..5000の範囲に含めてください')
      end

      it 'ページ数が1~5000範囲外の場合エラー' do
        b = FactoryBot.build(:book, page: 5001)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:page).first).to eq('ページ数は1..5000の範囲に含めてください')
      end
    end

    context 'launched' do
      it '登録可能' do
        expect(book.launched).to eq('2021-02-17'.to_date)
      end

      it 'nilの入力可能' do
        b = FactoryBot.build(:book, launched: nil)
        expect(b).to be_valid
      end

      it '空文字の入力した場合、戻り値がnilになる' do
        b = FactoryBot.build(:book, launched: '')
        expect(b).to be_valid
        # RubyのDate型は「存在しない日付」を持つことが出来ないため、タイプキャストによりnil値となる
        expect(b.launched).to be_nil
      end

      it '年の先頭が0場合エラー' do
        b = FactoryBot.build(:book, launched: '0195-02-24')
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:launched).first).to eq('発売日が不正な形式です')
      end

      it '存在しない月の場合、戻り値がnilになる' do
        b = FactoryBot.build(:book, launched: '2024-13-24')
        expect(b).to be_valid
        expect(b.launched).to be_nil
      end

      it '存在しない日の場合、戻り値がnilになる' do
        b = FactoryBot.build(:book, launched: '2024-02-00')
        expect(b).to be_valid
        expect(b.launched).to be_nil
      end

      it '月の先頭に0が含まれる入力可能' do
        b = FactoryBot.build(:book, launched: '2024-02-12')
        expect(b).to be_valid
        expect(b.launched).to eq('2024-02-12'.to_date)
      end
    end

    context 'author' do
      it '登録可能' do
        expect(book.author).to eq('高橋 昌一郎')
      end

      it 'nilの場合エラー' do
        expect do
          book.update!(author: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        b = FactoryBot.build(:book, author: '')
        expect(b).to be_valid
        expect(b.author).to eq('')
      end

      it 'authorが51文字以上の場合エラー' do
        b = FactoryBot.build(:book, author: 'あ' * 51)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:author).first).to eq('著者は50文字以内で入力してください')
      end
    end

    context 'publisher' do
      it '登録可能' do
        expect(book.publisher).to eq('講談社')
      end

      it 'nilの場合エラー' do
        expect do
          book.update!(publisher: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        b = FactoryBot.build(:book, publisher: '')
        expect(b).to be_valid
        expect(b.publisher).to eq('')
      end

      it 'publisherのユーザ名が51文字以上の場合エラー' do
        b = FactoryBot.build(:book, publisher: 'あ' * 51)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:publisher).first).to eq('出版社は50文字以内で入力してください')
      end
    end

    context 'associate_url' do
      it '登録可能' do
        expect(book.associate_url).to eq('https://amzn.to/4c9f3R8')
      end

      it '暗号化されていないURLは登録不可' do
        b = FactoryBot.build(:book, associate_url: 'http://amzn.to/4c9f3R8')
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:associate_url).first).to eq('アソシエイトリンクが不正な形式です')
      end

      it '不正な形式は登録不可' do
        b = FactoryBot.build(:book, associate_url: 'https://-@{}$$%%&&[]#')
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:associate_url).first).to eq('アソシエイトリンクが不正な形式です')
      end

      it 'nilの場合エラー' do
        expect do
          book.update(associate_url: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        b = FactoryBot.build(:book, associate_url: '')
        expect(b).to be_valid
        expect(b.associate_url).to eq('')
      end

      it 'associate_urlのURLが256文字以上の場合エラー' do
        b = FactoryBot.build(:book, associate_url: 'a' * 256)
        expect(b).not_to be_valid
        expect(b.errors.full_messages_for(:associate_url).first).to eq('アソシエイトリンクは255文字以内で入力してください')
      end
    end
  end

  describe 'methods' do
    let(:user) { FactoryBot.create(:user) }
    let(:user_not_liked) { FactoryBot.create(:user, name: 'not-liked') }
    let(:like) { FactoryBot.create(:like, user:, likeable: book) }

    context 'liked_by_user?' do
      before do
        like
      end

      it 'いいね済みの場合はtrueが返る' do
        expect(book).to be_liked_by_user(user.id)
      end

      it 'いいね済みでない場合はfalseが返る' do
        expect(book).not_to be_liked_by_user(user_not_liked.id)
      end
    end

    context 'ranking' do
      before do
        book_low_score
        book_middle_score
        book_high_score
        book_super_high_score
      end

      it '書籍の順位を返す（最上位）' do
        expect(book_super_high_score.ranking).to eq(1)
      end

      it '書籍の順位を返す（中間）' do
        expect(book_middle_score.ranking).to eq(3)
      end

      it '書籍の順位を返す（最下位）' do
        expect(book_low_score.ranking).to eq(4)
      end
    end

    context 'price_delimited' do
      it '3桁ごとにカンマが入る' do
        b = FactoryBot.build(:book, price: 1_234_567)
        expect(b).to be_valid
        expect(b.price_delimited).to eq('1,234,567')
      end

      it '3桁以下の場合カンマは入らない' do
        b = FactoryBot.build(:book, price: 123)
        expect(b).to be_valid
        expect(b.price_delimited).to eq('123')
      end
    end

    context 'likes_count' do
      before do
        like
      end

      it 'いいね数が返る' do
        expect(book.likes_count).to eq(1)
      end

      it 'いいね削除後はいいね数が減る' do
        user.likes.find_by(likeable: book).destroy

        expect(book.likes_count).to eq(0)
      end
    end
  end
end
