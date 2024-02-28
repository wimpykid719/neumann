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

      it '重複したユーザ名は登録不可' do
        FactoryBot.create(:user, name: 'same_name')
        u = FactoryBot.build(:user, name: 'same_name')
        expect(u).not_to be_valid
        expect(u.errors.full_messages_for(:name).first).to eq('ユーザ名はすでに使用されています')
      end

      it '不正な形式は登録不可' do
        expect { FactoryBot.create(:user, name: 'こんどう ひろき') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq 'ユーザ名は半角英数字、ハイフン、アンダーバーで入力してください'
        end)
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
        u = FactoryBot.build(:user, name: 'あ' * 51)
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
        u = FactoryBot.build(:user, email: 'あ' * 256)
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
          expect(error.message).to eq 'パスワードは8文字以上で入力してください'
        end)
      end

      it '確認用パスワードが異なる場合エラー' do
        expect { FactoryBot.create(:user, password: '12345678', password_confirmation: '12345679') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq '確認用パスワードとパスワードの入力が一致しません'
        end)
      end

      it '73文字以上の場合エラー' do
        expect { FactoryBot.create(:user, password: 'a' * 73) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq 'パスワードは72文字以内で入力してください'
        end)
      end

      it '不正な形式は登録不可' do
        expect { FactoryBot.create(:user, password: '@{}$$%%&&[]') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq 'パスワードは半角英数字、ハイフン、アンダーバーで入力してください'
        end)
      end

      it 'nilの場合エラー' do
        expect { FactoryBot.create(:user, password: nil) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message.split(',').first).to eq 'パスワードを入力してください'
        end)
      end

      it '空の場合エラー' do
        expect { FactoryBot.create(:user, password: '') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message.split(',').first).to eq 'パスワードを入力してください'
        end)
      end

      it '取り出したユーザのパスワードが空でも他のカラム値を更新可能' do
        user = FactoryBot.create(:user)
        # has_secure_passwordの仕様
        # create時のインスタンスはpassword空でもカラム値の更新が可能
        user_searched = described_class.find(user.id)

        user_searched.update!(name: 'hiroki')
        expect(user_searched.name).to eq('hiroki')
      end
    end

    context 'profile_name' do
      before do
        user.update(profile_name: 'こんどう ひろき')
      end

      it '登録可能' do
        expect(user.profile_name).to eq 'こんどう ひろき'
      end

      it '別のユーザと重複可能' do
        u = FactoryBot.create(:user, name: 'same_profile_name')
        u.update(profile_name: 'こんどう ひろき')

        expect(user.profile_name).to eq('こんどう ひろき')
        expect(u.profile_name).to eq('こんどう ひろき')
      end

      it 'nilの場合エラー' do
        expect do
          user.update(profile_name: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        user.update(profile_name: '')
        expect(user.profile_name).to eq('')
      end

      it 'nameが31文字以上の場合エラー' do
        user.update(profile_name: 'あ' * 31)
        expect(user).not_to be_valid
        expect(user.errors.full_messages.first).to eq('表示名は30文字以内で入力してください')
      end
    end

    context 'bio' do
      before do
        user.update(bio: '自己紹介文')
      end

      it '登録可能' do
        expect(user.bio).to eq('自己紹介文')
      end

      it 'nilの場合エラー' do
        expect do
          user.update(bio: nil)
        end.not_to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        user.update(bio: '')
        expect(user.bio).to eq('')
      end

      it 'nameが181文字以上の場合エラー' do
        user.update(bio: 'あ' * 181)
        expect(user).not_to be_valid
        expect(user.errors.full_messages_for(:bio).first).to eq('自己紹介は180文字以内で入力してください')
      end
    end

    context 'x' do
      before do
        user.update(x: 'hiroki1879')
      end

      it '登録可能' do
        expect(user.x).to eq('hiroki1879')
      end

      it 'nilの場合エラー' do
        expect do
          user.update(x: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        user.update(x: '')
        expect(user.x).to eq('')
      end

      it 'xのユーザ名が51文字以上の場合エラー' do
        user.update(x: 'a' * 51)
        expect(user).not_to be_valid
        expect(user.errors.full_messages.first).to eq('Xのユーザ名は50文字以内で入力してください')
      end
    end

    context 'instagram' do
      before do
        user.update(instagram: 'hiroki1879')
      end

      it '登録可能' do
        expect(user.instagram).to eq('hiroki1879')
      end

      it 'nilの場合エラー' do
        expect do
          user.update(instagram: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        user.update(instagram: '')
        expect(user.instagram).to eq('')
      end

      it 'instagramのユーザ名が51文字以上の場合エラー' do
        user.update(instagram: 'a' * 51)
        expect(user).not_to be_valid
        expect(user.errors.full_messages.first).to eq('Instagramのユーザ名は50文字以内で入力してください')
      end
    end

    context 'facebook' do
      before do
        user.update(facebook: 'hiroki1879')
      end

      it '登録可能' do
        expect(user.facebook).to eq('hiroki1879')
      end

      it 'nilの場合エラー' do
        expect do
          user.update(facebook: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        user.update(facebook: '')
        expect(user.facebook).to eq('')
      end

      it 'facebookのユーザ名が51文字以上の場合エラー' do
        user.update(facebook: 'a' * 51)

        expect(user).not_to be_valid
        expect(user.errors.full_messages.first).to eq('Facebookのユーザ名は50文字以内で入力してください')
      end
    end

    context 'linkedin' do
      before do
        user.update(linkedin: 'hiroki1879')
      end

      it '登録可能' do
        expect(user.linkedin).to eq('hiroki1879')
      end

      it 'nilの場合エラー' do
        expect do
          user.update(linkedin: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        user.update(linkedin: '')
        expect(user.linkedin).to eq('')
      end

      it 'linkedinのユーザ名が51文字以上の場合エラー' do
        user.update(linkedin: 'a' * 51)
        expect(user).not_to be_valid
        expect(user.errors.full_messages.first).to eq('LinkedInのユーザ名は50文字以内で入力してください')
      end
    end

    context 'tiktok' do
      before do
        user.update(tiktok: 'hiroki1879')
      end

      it '登録可能' do
        expect(user.tiktok).to eq('hiroki1879')
      end

      it '先頭の@含まれる場合エラー' do
        expect { user.update!(tiktok: '@hiroki-9_87') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('TikTokのユーザ名は先頭の@不要です')
        end)
      end

      it 'nilの場合エラー' do
        expect do
          user.update(tiktok: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        user.update(tiktok: '')
        expect(user.tiktok).to eq('')
      end

      it 'tiktokのユーザ名が51文字以上の場合エラー' do
        user.update(tiktok: 'a' * 51)
        expect(user).not_to be_valid
        expect(user.errors.full_messages.first).to eq('TikTokのユーザ名は50文字以内で入力してください')
      end
    end

    context 'youtube' do
      before do
        user.update(youtube: 'hiroki1879')
      end

      it '登録可能' do
        expect(user.youtube).to eq('hiroki1879')
      end

      it '先頭の@含まれる場合エラー' do
        expect { user.update!(youtube: '@hiroki-9_87') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('YouTubeのユーザ名は先頭の@不要です')
        end)
      end

      it 'nilの場合エラー' do
        expect do
          user.update(youtube: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        user.update(youtube: '')
        expect(user.youtube).to eq('')
      end

      it 'youtubeのユーザ名が51文字以上の場合エラー' do
        user.update(youtube: 'a' * 51)
        expect(user).not_to be_valid
        expect(user.errors.full_messages.first).to eq('YouTubeのユーザ名は50文字以内で入力してください')
      end
    end

    context 'website' do
      before do
        user.update(website: 'https://test.com')
      end

      it '登録可能' do
        expect(user.website).to eq('https://test.com')
      end

      it '暗号化されていないURLは登録不可' do
        expect { user.update!(website: 'http://test.com') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('ウェブサイトのURLが不正な形式です')
        end)
      end

      it '不正な形式は登録不可' do
        expect { user.update!(website: 'https://-@{}$$%%&&[]#') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('ウェブサイトのURLが不正な形式です')
        end)
      end

      it 'nilの場合エラー' do
        expect do
          user.update(website: nil)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        user.update(website: '')
        expect(user.website).to eq('')
      end

      it 'websiteのURLが256文字以上の場合エラー' do
        user.update(website: 'a' * 256)
        expect(user).not_to be_valid
        expect(user.errors.full_messages.first).to eq('ウェブサイトのURLは255文字以内で入力してください')
      end
    end
  end

  describe 'methods' do
    let(:user_created) { FactoryBot.create(:user) }

    context 'generate_refresh_token' do
      it 'JWTリフレッシュトークンの発行' do
        refresh_token = user_created.generate_refresh_token
        expect(refresh_token.token).to be_present
      end

      it 'current_token_versionが保存される' do
        expect(user_created.current_token_version).to be_nil
        refresh_token = user_created.generate_refresh_token
        expect(user_created.reload.current_token_version).to eq(refresh_token.payload[:version])
      end
    end

    context 'decode_refresh_token' do
      it '復号化されたリフレッシュトークンが返る' do
        refresh_token = user_created.generate_refresh_token
        token = refresh_token.token
        decoded_refresh_token = described_class.decode_refresh_token(token)
        expect(decoded_refresh_token['sub']).to be_present
      end
    end

    context 'from_refresh_token' do
      it 'リフレッシュトークンから持ち主のユーザを取り出す' do
        refresh_token = user_created.generate_refresh_token
        token = refresh_token.token
        user_searched = described_class.from_refresh_token(token)

        expect(user_searched.id).to eq(user_created.id)
      end

      context '異常系' do
        it 'token_versionがDBと異なる場合、例外処理発生' do
          refresh_token = user_created.generate_refresh_token
          token = refresh_token.token

          user_created.update!(current_token_version: 'changed_version')

          expect { described_class.from_refresh_token(token) }.to(raise_error do |error|
            expect(error).to be_a(Constants::Exceptions::TokenVersion)
            expect(error.message).to eq 'パスワードに変更がありました。再度ログインして下さい。'
          end)
        end
      end
    end

    context 'generate_access_token' do
      it 'JWTアクセストークンの発行' do
        user_created.generate_refresh_token
        access_token = user_created.generate_access_token
        expect(access_token.token).to be_present
      end

      it 'オプションで指定した値がアクセストークンに含まれる' do
        user_created.generate_refresh_token
        access_token_opsions = user_created.generate_access_token({ test: 'test' })
        token = access_token_opsions.token
        decoded_access_token = described_class.decode_access_token(token)
        expect(decoded_access_token['test']).to eq('test')
      end
    end

    context 'decode_access_token' do
      it '復号化されたアクセストークンが返る' do
        user_created.generate_refresh_token
        access_token = user_created.generate_access_token
        token = access_token.token
        decoded_access_token = described_class.decode_access_token(token)
        expect(decoded_access_token['sub']).to be_present
      end
    end

    context 'from_access_token' do
      it 'アクセストークンから持ち主のユーザを取り出す' do
        user_created.generate_refresh_token
        access_token = user_created.generate_access_token
        token = access_token.token
        user_searched = described_class.from_access_token(token)

        expect(user_searched.id).to eq(user_created.id)
      end

      context '異常系' do
        it 'token_versionがDBと異なる場合、例外処理発生' do
          user_created.generate_refresh_token
          access_token = user_created.generate_access_token
          token = access_token.token

          user_created.update!(current_token_version: 'changed_version')

          expect { described_class.from_access_token(token) }.to(raise_error do |error|
            expect(error).to be_a(Constants::Exceptions::TokenVersion)
            expect(error.message).to eq 'パスワードに変更がありました。再度ログインして下さい。'
          end)
        end
      end
    end

    context 'enforce_password_validation' do
      it 'パスワードのバリデーションを強制する' do
        user_searched = described_class.find(user_created.id)
        user_searched.enforce_password_validation

        expect { user_searched.update!(name: 'hiroki') }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message.split(',').first).to eq 'パスワードを入力してください'
        end)
      end

      it '有効後パスワードのupdateで入力があれば、以降はパスワード不要となる' do
        user_searched = described_class.find(user_created.id)
        user_searched.enforce_password_validation

        expect(user_searched.update!(password: '1111111q')).to be(true)
        expect(user_searched.update!(name: 'hiroki')).to be(true)
        expect(user_searched.name).to eq 'hiroki'
      end
    end

    context 'logged_in_user' do
      it 'メール・パスワードが一致するユーザを返す' do
        login_user = described_class.logged_in_user(email: user_created.email, password: '1111111q')
        expect(login_user.email).to eq(user_created.email)
      end

      context '異常系' do
        it 'メールが一致しない' do
          expect { described_class.logged_in_user(email: 'no_exist_email', password: '1111111q') }
            .to raise_error(ActiveRecord::RecordNotFound)
        end

        it 'パスワードが一致しない' do
          expect { described_class.logged_in_user(email: user_created.email, password: 'no_match_password') }
            .to raise_error(ActiveRecord::RecordNotFound)
        end

        it 'メールがnil' do
          expect { described_class.logged_in_user(email: nil, password: '1111111q') }
            .to raise_error(ActiveRecord::RecordNotFound)
        end

        it 'パスワードがnil' do
          expect { described_class.logged_in_user(email: user_created.email, password: nil) }
            .to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end
  end
end
