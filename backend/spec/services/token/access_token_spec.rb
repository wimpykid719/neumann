require 'rails_helper'

RSpec.describe Token::AccessToken, type: :service do
  describe 'AccessToken' do
    include TokenConcern

    let(:user) { FactoryBot.create(:user, current_token_version: new_token_version) }
    let!(:access_token) { described_class.new(user.id, user.name) }
    let(:access_token_decoded) { described_class.decode(access_token.token) }
    let!(:lifetime) { UserAuthConfig.access_token_lifetime }

    context 'encode' do
      it 'ユーザ名が含まれている' do
        expect(access_token.payload[:username]).to eq(user.name)
      end

      it 'payload[:exp]の値は想定通り(1秒許容)' do
        expect(access_token.payload[:exp]).to be_within(1.second).of(lifetime.from_now.to_i)
      end

      it 'payload[:sub]の値は同じユーザIDでも暗号化のたびに異なる値になる' do
        expect(access_token.payload[:sub]).not_to eq(encrypt_for(user.id))
      end

      it 'payload[:version]の値が想定通り' do
        expect(access_token.payload[:version]).to be_present
      end

      it 'リフレッシュトークン作成時に保存されたtoken_versionと同じ値が使用される' do
        expect(user.current_token_version).to eq(access_token.payload[:version])
      end

      it '有効時間が30分とテキストで返る' do
        expect(access_token.lifetime_text).to eq('30分')
      end

      it 'optionsで値を設定できる' do
        options = { test: 'test' }
        access_token_opsions = described_class.new(user.id, user.name, options:)
        decoded_access_token = described_class.decode(access_token_opsions.token)
        expect(decoded_access_token['test']).to eq('test')
      end

      context '異常系' do
        let(:user_current_token_version_nil) { FactoryBot.create(:user, name: 'hiroki') }
        let(:access_token_current_token_version_nil) { described_class.new(user_current_token_version_nil.id, user_current_token_version_nil.name) }

        it 'token_versionがない場合は例外処理が発生する' do
          expect { access_token_current_token_version_nil }.to raise_error(RuntimeError)
        end
      end
    end

    context 'decode' do
      it 'payload[:sub]の値を複合化出来る' do
        expect(decrypt_for(access_token_decoded['sub']).to_i).to eq(user.id)
      end

      context '異常系' do
        it 'payload[:sub]の値が検証失敗した際nilが返る' do
          expect(decrypt_for("#{access_token_decoded['sub']}_dummy_sub")).to be_nil
        end

        it '30分後有効期限が切れる' do
          travel_to(30.minutes.from_now) do
            expect { described_class.decode(access_token.token) }.to raise_error(JWT::ExpiredSignature)
          end
        end

        it 'トークンが改竄出来ない' do
          invalid_token = "#{access_token.token}_change_token"
          expect { described_class.decode(invalid_token) }.to raise_error(JWT::VerificationError)
        end
      end
    end
  end
end
