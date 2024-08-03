require 'rails_helper'

RSpec.describe UserAnalytic do
  let(:user_analytic) { FactoryBot.build(:user_analytic) }
  let(:user) { FactoryBot.create(:user) }

  it '有効なファクトリを持つこと' do
    expect(user_analytic).to be_valid
  end

  describe 'validation' do
    context 'name' do
      it '登録可能' do
        expect(user_analytic.name).to eq('08/02')
      end

      it 'nilの場合エラー' do
        u = FactoryBot.build(:user_analytic, name: nil)
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:name).first).to eq('日付が不正な形式です')
      end

      it '存在しない月の場合エラー' do
        u = FactoryBot.build(:user_analytic, name: '13/02')
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:name).first).to eq('日付が不正な形式です')
      end

      it '存在しない日の場合エラー' do
        u = FactoryBot.build(:user_analytic, name: '12/32')
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:name).first).to eq('日付が不正な形式です')
      end

      it '1桁の場合エラー' do
        u = FactoryBot.build(:user_analytic, name: '0/0')
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:name).first).to eq('日付が不正な形式です')
      end

      it '存在しない日付の場合エラー' do
        u = FactoryBot.build(:user_analytic, name: '00/00')
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:name).first).to eq('日付が不正な形式です')
      end
    end

    context 'count' do
      it 'nilの場合エラー' do
        expect do
          user_analytic.update!(count: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end
    end
  end

  describe 'methods' do
    before do
      user
    end

    context 'user_total' do
      it '全ユーザ数が返る' do
        expect(described_class.user_total).to eq(1)
      end
    end
  end
end
