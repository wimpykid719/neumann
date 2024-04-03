require 'rails_helper'

RSpec.describe Like do
  let(:user) { FactoryBot.create(:user) }
  let(:book) { FactoryBot.create(:book) }
  let(:like) { FactoryBot.create(:like, user:, likeable: book) }

  it '有効なファクトリを持つこと' do
    expect(like).to be_valid
  end

  describe 'validation' do
    context 'like' do
      before do
        like
      end

      it '同じユーザが重複して書籍いいねは不可' do
        u = FactoryBot.build(:like, user:, likeable: book)

        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:user_id).first).to eq('ユーザーはこの書籍をいいね済みです')
      end
    end
  end
end
