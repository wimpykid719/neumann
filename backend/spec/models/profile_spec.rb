require 'rails_helper'

RSpec.describe Profile do
  let(:user) { FactoryBot.build(:user) }
  let(:profile) { FactoryBot.build(:profile, user:) }

  it '有効なファクトリを持つこと' do
    expect(profile).to be_valid
  end

  describe 'validation' do
    context 'name' do
      it '登録可能' do
        expect(profile.name).to be_present
      end

      it '別のユーザと重複可能' do
        new_profile = FactoryBot.build(:profile, name: 'ノイマン', user:)

        expect(new_profile).to be_valid
        expect(new_profile.name).to eq('ノイマン')
      end

      it 'nilの場合エラー' do
        expect do
          profile.update!(name: nil, user:)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        profile.update(name: '', user:)
        expect(profile.name).to eq('')
      end

      it 'nameが31文字以上の場合エラー' do
        profile.update(name: 'あ' * 31, user:)
        expect(profile).not_to be_valid
        expect(profile.errors.full_messages.first).to eq('表示名は30文字以内で入力してください')
      end
    end

    context 'bio' do
      it '登録可能' do
        expect(profile.bio).to be_present
      end

      it 'nil使用可能' do
        profile.update(bio: nil, user:)
        expect(profile).to be_valid
      end

      it '空文字入力可能' do
        profile.update(name: '', user:)
        expect(profile.name).to eq('')
      end

      it 'nameが181文字以上の場合エラー' do
        profile.update(bio: 'あ' * 181, user:)
        expect(profile).not_to be_valid
        expect(profile.errors.full_messages_for(:bio).first).to eq('自己紹介は180文字以内で入力してください')
      end
    end

    context 'x_twitter' do
      it '登録可能' do
        expect(profile.x_twitter).to eq('neumann-1903')
      end

      it 'nilの場合エラー' do
        expect do
          profile.update!(x_twitter: nil, user:)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        profile.update(x_twitter: '', user:)
        expect(profile.x_twitter).to eq('')
      end

      it 'xのユーザ名が51文字以上の場合エラー' do
        profile.update(x_twitter: 'a' * 51, user:)
        expect(profile).not_to be_valid
        expect(profile.errors.full_messages.first).to eq('Xのユーザ名は50文字以内で入力してください')
      end
    end

    context 'instagram' do
      it '登録可能' do
        expect(profile.instagram).to eq('neumann_1903')
      end

      it 'nilの場合エラー' do
        expect do
          profile.update!(instagram: nil, user:)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        profile.update(instagram: '', user:)
        expect(profile.instagram).to eq('')
      end

      it 'instagramのユーザ名が51文字以上の場合エラー' do
        profile.update(instagram: 'a' * 51, user:)
        expect(profile).not_to be_valid
        expect(profile.errors.full_messages.first).to eq('Instagramのユーザ名は50文字以内で入力してください')
      end
    end

    context 'facebook' do
      it '登録可能' do
        expect(profile.facebook).to eq('neumann-1903')
      end

      it 'nilの場合エラー' do
        expect do
          profile.update!(facebook: nil, user:)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        profile.update(facebook: '', user:)
        expect(profile.facebook).to eq('')
      end

      it 'facebookのユーザ名が51文字以上の場合エラー' do
        profile.update(facebook: 'a' * 51, user:)

        expect(profile).not_to be_valid
        expect(profile.errors.full_messages.first).to eq('Facebookのユーザ名は50文字以内で入力してください')
      end
    end

    context 'linkedin' do
      it '登録可能' do
        expect(profile.linkedin).to eq('neumann-1903')
      end

      it 'nilの場合エラー' do
        expect do
          profile.update!(linkedin: nil, user:)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        profile.update(linkedin: '', user:)
        expect(profile.linkedin).to eq('')
      end

      it 'linkedinのユーザ名が51文字以上の場合エラー' do
        profile.update(linkedin: 'a' * 51, user:)
        expect(profile).not_to be_valid
        expect(profile.errors.full_messages.first).to eq('LinkedInのユーザ名は50文字以内で入力してください')
      end
    end

    context 'tiktok' do
      it '登録可能' do
        expect(profile.tiktok).to eq('neumann-1903')
      end

      it '先頭の@含まれる場合エラー' do
        expect { profile.update!(tiktok: '@neumann-1903', user:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('TikTokのユーザ名は先頭の@不要です')
        end)
      end

      it 'nilの場合エラー' do
        expect do
          profile.update!(tiktok: nil, user:)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        profile.update(tiktok: '', user:)
        expect(profile.tiktok).to eq('')
      end

      it 'tiktokのユーザ名が51文字以上の場合エラー' do
        profile.update(tiktok: 'a' * 51, user:)
        expect(profile).not_to be_valid
        expect(profile.errors.full_messages.first).to eq('TikTokのユーザ名は50文字以内で入力してください')
      end
    end

    context 'youtube' do
      it '登録可能' do
        expect(profile.youtube).to eq('neumann-1903')
      end

      it '先頭の@含まれる場合エラー' do
        expect { profile.update!(youtube: '@neumann-1903', user:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('YouTubeのユーザ名は先頭の@不要です')
        end)
      end

      it 'nilの場合エラー' do
        expect do
          profile.update(youtube: nil, user:)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        profile.update(youtube: '', user:)
        expect(profile.youtube).to eq('')
      end

      it 'youtubeのユーザ名が51文字以上の場合エラー' do
        profile.update(youtube: 'a' * 51, user:)
        expect(profile).not_to be_valid
        expect(profile.errors.full_messages.first).to eq('YouTubeのユーザ名は50文字以内で入力してください')
      end
    end

    context 'website' do
      it '登録可能' do
        expect(profile.website).to eq('https://neuman.com')
      end

      it '暗号化されていないURLは登録不可' do
        expect { profile.update!(website: 'http://test.com', user:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('ウェブサイトのURLが不正な形式です')
        end)
      end

      it '不正な形式は登録不可' do
        expect { profile.update!(website: 'https://-@{}$$%%&&[]#', user:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('ウェブサイトのURLが不正な形式です')
        end)
      end

      it 'nilの場合エラー' do
        expect do
          profile.update(website: nil, user:)
        end.to raise_error(ActiveRecord::NotNullViolation)
      end

      it '空文字入力可能' do
        profile.update(website: '', user:)
        expect(profile.website).to eq('')
      end

      it 'websiteのURLが256文字以上の場合エラー' do
        profile.update(website: 'a' * 256, user:)
        expect(profile).not_to be_valid
        expect(profile.errors.full_messages.first).to eq('ウェブサイトのURLは255文字以内で入力してください')
      end
    end
  end
end
