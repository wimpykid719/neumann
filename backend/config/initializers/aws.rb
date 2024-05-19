# config/initializers/aws.rb
Aws.config.update({
  region: 'auto',
  credentials: Aws::Credentials.new(
    ENV['CLOUDFLARE_R2_ACCESS_KEY_ID'],
    ENV['CLOUDFLARE_R2_SECRET_ACCESS_KEY']
  ),
  endpoint: ENV['CLOUDFLARE_R2_ENDPOINT']
})
