require 'rails_helper'

RSpec.describe R2::Bucket, type: :service do
  include_context 'r2_helper'

  let(:user) { FactoryBot.build(:user) }

  describe 'Bucket' do
    before do
      bucket_mock
    end

    context 'delete_objects' do
      before do
        objects_mock(user.name)
      end

      it 'deleteが呼ばれる' do
        bucket = described_class.new(user.name)
        bucket.delete_objects

        expect(Rails.logger).to have_received(:info).with('test_user/profile/avatar/test.jpgを削除します')
        expect(objects.first).to have_received(:delete)
      end
    end

    context 'upload_file_r2' do
      before do
        object_mock(user.name)
      end

      it '公開用のURLが返る' do
        bucket = described_class.new(user.name)
        result = bucket.upload_file_r2(file)

        expect(Rails.logger).to have_received(:info).with('avatar.jpgをアップロードしました')
        expect(object).to have_received(:upload_file).with(file.path, acl: 'public-read')
        expect(result).to eq("https://#{ENV.fetch('BIZRANK_BUCKET_DOMAIN')}/#{user.name}/profile/avatar/avatar.jpg")
      end
    end
  end
end
