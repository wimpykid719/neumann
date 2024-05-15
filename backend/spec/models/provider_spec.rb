require 'rails_helper'

RSpec.describe Provider do
  let(:user) { FactoryBot.build(:user) }
  let(:provider_default) { FactoryBot.build(:provider, user:) }
  let(:provider_google) { FactoryBot.build(:provider, kind: described_class.kinds['google'], user:) }

  describe 'validation' do
    context 'kind' do
      it '登録可能' do
        expect(provider_default).to be_valid
        expect(provider_default.kind).to eq('default')
      end

      it 'google認証で登録可能' do
        expect(provider_google).to be_valid
        expect(provider_google.kind).to eq('google')
      end

      it 'nilの場合エラー' do
        expect { FactoryBot.create(:provider, kind: nil, user:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq '認証サービス名が範囲外の値です, 認証サービス名を入力してください'
        end)
      end

      it '範囲外の値の場合エラー' do
        default_user_provider = FactoryBot.build(:provider, kind: 99, user:)

        expect(default_user_provider).not_to be_valid
        expect(default_user_provider.errors.full_messages_for(:kind).first).to eq('認証サービス名が範囲外の値です')
      end
    end

    context 'uid' do
      it '登録可能' do
        expect(provider_default).to be_valid
        expect(provider_default.uid).to eq('12345678')
      end

      it '重複したは登録不可' do
        FactoryBot.create(:provider, user:)
        default_user_provider = FactoryBot.build(:provider, user:)
        expect(default_user_provider).not_to be_valid
        expect(default_user_provider.errors.full_messages_for(:uid).first).to eq('ユーザIDはすでに存在します')
      end

      it 'nilの場合エラー' do
        expect do
          FactoryBot.create(:provider, uid: nil, user:)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        default_user_provider = FactoryBot.build(:provider, uid: '', user:)
        expect(default_user_provider).to be_valid
        expect(default_user_provider.uid).to eq('')
      end

      it 'uidが151文字以上の場合エラー' do
        default_user_provider = FactoryBot.build(:provider, uid: 'a' * 151, user:)

        expect(default_user_provider).not_to be_valid
        expect(default_user_provider.errors.full_messages_for(:uid).first).to eq('ユーザIDは150文字以内で入力してください')
      end
    end
  end
end
