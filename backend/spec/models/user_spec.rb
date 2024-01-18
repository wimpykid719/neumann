require 'rails_helper'

RSpec.describe User do
  let(:user) { FactoryBot.build(:user) }

  it '有効なファクトリを持つこと' do
    expect(user).to be_valid
  end

  describe 'validation' do
    context 'name' do
      it '登録可能' do
        expect(user).to be_valid
        expect(user.name).to be_present
      end

      it 'nilの場合エラー' do
        u = FactoryBot.build(:user, name: nil)
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:name).first).to eq('ユーザ名を入力してください')
      end

      it '空の場合エラー' do
        u = FactoryBot.build(:user, name: '')
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:name).first).to eq('ユーザ名を入力してください')
      end

      it 'nameが51文字以上の場合エラー' do
        u = FactoryBot.build(:user, name: 'あ'*51)
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:name).first).to eq('ユーザ名は50文字以内で入力してください')
      end
    end

    context 'email' do
      it '登録可能' do
        expect(user).to be_valid
        expect(user.email).to be_present
      end

      it '重複したメールアドレスは登録不可' do
        FactoryBot.create(:user, email: 'neumann@neumann.com')
        u = FactoryBot.build(:user, email: 'neumann@neumann.com')
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:email).first).to eq('メールアドレスは登録済みです')
      end

      it '不正な形式は登録不可' do
        u = FactoryBot.build(:user, email: 'neumannneumann.com')
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:email).first).to eq('メールアドレスは不正な値です')
      end

      it 'nilの場合エラー' do
        u = FactoryBot.build(:user, email: nil)
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:email).first).to eq('メールアドレスを入力してください')
      end

      it '空の場合エラー' do
        u = FactoryBot.build(:user, email: '')
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:email).first).to eq('メールアドレスを入力してください')
      end

      it 'emailが256文字以上の場合エラー' do
        u = FactoryBot.build(:user, email: 'あ'*256)
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:email).first).to eq('メールアドレスは255文字以内で入力してください')
      end
    end

    context 'password' do
      it '登録可能' do
        user_created = FactoryBot.create(:user)
        expect(user_created).to be_valid
        expect(user_created.password).to be_present
      end

      it '8文字の場合エラー' do
        expect { FactoryBot.create(:user, password: '1234567') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq 'バリデーションに失敗しました: パスワードは8文字以上で入力してください'
        end)
      end

      it '確認用パスワードが異なる場合エラー' do
        expect { FactoryBot.create(:user, password: '12345678', password_confirmation: '12345679') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq 'バリデーションに失敗しました: 確認用パスワードとパスワードの入力が一致しません'
        end)
      end

      it '73文字以上の場合エラー' do
        expect { FactoryBot.create(:user, password: 'a'*73) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq 'バリデーションに失敗しました: パスワードは72文字以内で入力してください'
        end)
      end

      it '不正な形式は登録不可' do
        expect { FactoryBot.create(:user, password: '@{}$$%%&&[]') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq 'バリデーションに失敗しました: パスワードは半角英数字、ハイフン、アンダーバーで入力してください'
        end)
      end

      it 'nilの場合エラー' do
        expect { FactoryBot.create(:user, password: nil) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message.split(',').first).to eq 'バリデーションに失敗しました: パスワードを入力してください'
        end)
      end

      it '空の場合エラー' do
        expect { FactoryBot.create(:user, password: '') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message.split(',').first).to eq 'バリデーションに失敗しました: パスワードを入力してください'
        end)
      end
    end
  end

  describe 'methods' do
    context '' do
      it ''
    end
  end
end