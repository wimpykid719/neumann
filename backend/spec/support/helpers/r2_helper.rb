module R2Helper
  RSpec.shared_context 'r2_helper', shared_context: :metadata do
    let(:s3_resource) { instance_double(Aws::S3::Resource) }
    let(:r2_bucket) { instance_double(Aws::S3::Bucket) }
    let(:objects) { [instance_double(Aws::S3::Object, key: 'test_user/profile/avatar/test.jpg')] }
    let(:file) do
      instance_double(
        ActionDispatch::Http::UploadedFile,
        path: '/path/to/file',
        original_filename: 'avatar.jpg',
        content_type: 'image/jpeg',
        size: 1024
      )
    end
    let(:object) { instance_double(Aws::S3::Object, public_url: "https://#{ENV.fetch('BIZRANK_BUCKET_DOMAIN')}/#{user.name}/profile/avatar/avatar.jpg") }

    def bucket_mock
      allow(ENV).to receive(:fetch).with('CLOUDFLARE_R2_BUCKET').and_return('fake-bucket')
      allow(ENV).to receive(:fetch).with('BIZRANK_BUCKET_DOMAIN').and_return('pub-fake123.r2.dev')
      allow(Aws::S3::Resource).to receive(:new).and_return(s3_resource)
      allow(s3_resource).to receive(:bucket).with(ENV.fetch('CLOUDFLARE_R2_BUCKET')).and_return(r2_bucket)
      allow(Rails.logger).to receive(:info)
    end

    def objects_mock(user_name)
      allow(r2_bucket).to receive(:objects).with(prefix: "#{user_name}/profile/avatar/").and_return(objects)
      allow(objects.first).to receive(:delete)
    end

    # ファイル名を動的に変更しないと@bucket.object(key)がテストで呼び出された際、期待しない値となりエラーになるためfile_nameを引数で受け取る形に変更
    def object_mock(user_name, file_name)
      allow(r2_bucket).to receive(:object).with("#{user_name}/profile/avatar/#{file_name}").and_return(object)
      allow(object).to receive(:upload_file).with(kind_of(String), acl: 'public-read')
    end
  end
end
