module R2
  class Bucket
    def initialize(user_name)
      @user_name = user_name
      @bucket = Aws::S3::Resource.new.bucket(ENV.fetch('CLOUDFLARE_R2_BUCKET'))
    end

    def delete_objects
      prefix = "#{@user_name}/profile/avatar/"
      @bucket.objects(prefix:).each do |obj|
        Rails.logger.info "#{obj.key}を削除します"
        obj.delete
      end
    end

    def upload_file_r2(file)
      key = "#{@user_name}/profile/avatar/#{file.original_filename}"
      obj = @bucket.object(key)

      obj.upload_file(file.path, acl: 'public-read')
      Rails.logger.info "#{file.original_filename}をアップロードしました"
      path = URI.parse(obj.public_url).path

      "https://#{ENV.fetch('BIZRANK_BUCKET_DOMAIN')}#{path}"
    end
  end
end
