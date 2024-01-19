require 'rails_helper'

RSpec.describe Token::RefreshToken, type: :service do
  describe 'RefreshToken' do
    include TokenConcern

    let(:user) { FactoryBot.create(:user) }
    let!(:refresh_token) { described_class.new(user.id) }
    let(:refresh_token_decoded) { described_class.decode(refresh_token.token) }
    let!(:lifetime) { UserAuthConfig.refresh_token_lifetime }

    context 'encode' do
      it 'payload[:exp]の値は想定通り(1秒許容)' do
        expect(refresh_token.payload[:exp]).to be_within(1.second).of(lifetime.from_now.to_i)
      end

      it 'payload[:sub]の値は同じユーザIDでも暗号化のたびに異なる値になる' do
        expect(refresh_token.payload[:sub]).not_to eq(encrypt_for(user.id))
      end

      it 'payload[:version]の値が想定通り' do
        expect(refresh_token.payload[:version]).to be_present
      end

      it 'userモデルのcurrent_token_versionにtokenバージョンが保存されている' do
        expect(user.reload.current_token_version).to eq(refresh_token.payload[:version])
      end
    end

    context 'decode' do
      it 'payload[:sub]の値を複合化出来る' do
        expect(decrypt_for(refresh_token_decoded['sub']).to_i).to eq(user.id)
      end

      it 'payload[:sub]の値が検証失敗した際nilが返る' do
        expect(decrypt_for("#{refresh_token_decoded['sub']}_dummy_sub")).to be_nil
      end

      it '14日後有効期限が切れる' do
        travel_to(14.days.from_now) do
          expect { described_class.decode(refresh_token.token) }.to raise_error(JWT::ExpiredSignature)
        end
      end

      it 'トークンが改竄出来ない' do
        invalid_token = "#{refresh_token.token}_change_token"
        expect { described_class.decode(invalid_token) }.to raise_error(JWT::VerificationError)
      end
    end
  end
end
