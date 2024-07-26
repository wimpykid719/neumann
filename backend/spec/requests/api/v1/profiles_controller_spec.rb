require 'rails_helper'

RSpec.describe Api::V1::ProfilesController do
  include_context 'user_authorities'
  include_context 'r2_helper'

  let(:test_img_file) { Tempfile.new(['test_image', '.jpg']) }
  let(:update_params) do
    {
      profile: {
        name: 'こんどう ひろき',
        bio: 'Youtubeしてます',
        x_twitter: 'hiroki-1998',
        instagram: 'hiroki_1998',
        facebook: 'hiroki-1998',
        linkedin: 'hiroki_1998',
        tiktok: 'hiroki-1998',
        youtube: 'hiroki_1998',
        website: 'https://hiroki.com',
        avatar: file
      }
    }
  end

  describe 'GET #show' do
    context '正常系' do
      before do
        user
        profile
      end

      it 'リクエスト成功、ステータスコード/200が返る' do
        get api_v1_profile_path(user.name), **headers

        expect(response).to have_http_status(:ok)
      end

      it 'プロフィール詳細が返る' do
        get api_v1_profile_path(user.name), **headers

        json = response.parsed_body

        expect(json.size).to eq(10)
        expect(json['name']).to eq('ノイマン')
        expect(json['bio']).to eq('あらゆる学問に精通しています。コンピュータの開発に貢献しました。')
        expect(json['x_twitter']).to eq('neumann-1903')
        expect(json['instagram']).to eq('neumann_1903')
        expect(json['facebook']).to eq('neumann-1903')
        expect(json['linkedin']).to eq('neumann-1903')
        expect(json['tiktok']).to eq('neumann-1903')
        expect(json['youtube']).to eq('neumann-1903')
        expect(json['website']).to eq('https://neuman.com')
        expect(json['avatar']).to eq('https://lh4.googleusercontent.com/photo.jpg')
      end
    end

    context '異常系' do
      it '存在しないプロフィール、ステータスコード/404が返る' do
        get api_v1_profile_path('user-not-found'), **headers

        expect(response).to have_http_status(:not_found)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('存在しないユーザです。')
      end
    end
  end

  describe 'PATCH #update' do
    context '正常系' do
      before do
        user
        profile
        bucket_mock
        objects_mock(user.name)
        object_mock(user.name, file.original_filename)
      end

      it '認証成功、ステータスコード/200が返る' do
        patch api_v1_profiles_path, **headers_file_uploads, params: update_params

        expect(response).to have_http_status(:ok)
      end

      it '編集したプロフィール詳細が返る' do
        object_mock(user.name, File.basename(test_img_file.path))

        test_img_file.binmode
        size_in_kb = 512
        test_img_file.write('a' * size_in_kb * 1024) # 'a'を1MB書き込む
        test_img_file.rewind
        avatar_512kb = Rack::Test::UploadedFile.new(test_img_file.path, 'image/jpg')

        patch(
          api_v1_profiles_path,
          **headers_file_uploads,
          params: update_params.merge({ profile: update_params[:profile].merge({ avatar: avatar_512kb }) })
        )

        json = response.parsed_body

        expect(json.size).to eq(10)
        expect(json['name']).to eq('こんどう ひろき')
        expect(json['bio']).to eq('Youtubeしてます')
        expect(json['x_twitter']).to eq('hiroki-1998')
        expect(json['instagram']).to eq('hiroki_1998')
        expect(json['facebook']).to eq('hiroki-1998')
        expect(json['linkedin']).to eq('hiroki_1998')
        expect(json['tiktok']).to eq('hiroki-1998')
        expect(json['youtube']).to eq('hiroki_1998')
        expect(json['website']).to eq('https://hiroki.com')
        expect(json['avatar']).to eq("https://#{ENV.fetch('BIZRANK_BUCKET_DOMAIN')}/#{user.name}/profile/avatar/avatar.jpg")

        # テストファイルの削除
        test_img_file.close
        test_img_file.unlink
      end

      it '画像ファイルが空の場合、以前の画像が変更されない' do
        patch(
          api_v1_profiles_path,
          **headers_file_uploads,
          params: update_params.merge({ profile: update_params[:profile].merge({ avatar: 'undefined' }) })
        )

        json = response.parsed_body

        expect(json.size).to eq(10)
        expect(json['name']).to eq('こんどう ひろき')
        expect(json['bio']).to eq('Youtubeしてます')
        expect(json['x_twitter']).to eq('hiroki-1998')
        expect(json['instagram']).to eq('hiroki_1998')
        expect(json['facebook']).to eq('hiroki-1998')
        expect(json['linkedin']).to eq('hiroki_1998')
        expect(json['tiktok']).to eq('hiroki-1998')
        expect(json['youtube']).to eq('hiroki_1998')
        expect(json['website']).to eq('https://hiroki.com')
        expect(json['avatar']).to eq('https://lh4.googleusercontent.com/photo.jpg')
      end
    end

    context '異常系' do
      let(:pdf_file) do
        instance_double(
          ActionDispatch::Http::UploadedFile,
          path: '/path/to/file',
          original_filename: 'avatar.jpg',
          content_type: 'application/pdf',
          size: 1024
        )
      end

      it '画像ファイル以外がアップロードされた際エラー' do
        patch(
          api_v1_profiles_path,
          **headers_file_uploads,
          params: update_params.merge({ profile: update_params[:profile].merge({ avatar: pdf_file }) })
        )

        expect(response).to have_http_status(:unprocessable_entity)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('画像ファイル以外をアップロードしないでください。')
      end

      it 'ファイルサイズが500KBを超える、ステータスコード/422が返る' do
        test_img_file.binmode
        size_in_mb = 1
        test_img_file.write('a' * size_in_mb * 1024 * 1024) # 'a'を1MB書き込む
        test_img_file.rewind
        avatar_mb = Rack::Test::UploadedFile.new(test_img_file.path, 'image/jpg')

        patch(
          api_v1_profiles_path,
          **headers_file_uploads,
          params: update_params.merge({ profile: update_params[:profile].merge({ avatar: avatar_mb }) })
        )

        expect(response).to have_http_status(:unprocessable_entity)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('画像ファイルは512KB以下にしてください。')

        # テストファイルの削除
        test_img_file.close
        test_img_file.unlink
      end

      it 'アクセストークンなし' do
        patch api_v1_profiles_path, **headers, params: update_params

        expect(response).to have_http_status(:unauthorized)

        json = response.parsed_body

        expect(json.size).to eq(1)
        expect(json['error']['message']).to eq('認証に失敗しました。再度ログインをして下さい。')
      end
    end
  end
end
