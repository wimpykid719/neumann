module UserHelper
  RSpec.shared_context 'user_authorities', shared_context: :metadata do
    include TokenConcern

    let(:user) { FactoryBot.create(:user, current_token_version: new_token_version) }
    let(:profile) { FactoryBot.create(:profile, user:) }
    let(:provider_default) { FactoryBot.create(:provider, user:) }
    let(:user_google) { FactoryBot.create(:user, name: 'neumann-google', current_token_version: new_token_version) }
    let(:profile_google) { FactoryBot.create(:profile, user: user_google) }
    let(:provider_google) { FactoryBot.create(:provider, kind: Provider.kinds['google'], user: user_google) }
    let!(:access_token) { user.generate_access_token }
    let!(:access_token_google) { user_google.generate_access_token }
    let(:headers) { { headers: { 'X-Requested-With' => 'XMLHttpRequest' } } }
    let(:headers_with_access_token) { { headers: { 'X-Requested-With' => 'XMLHttpRequest', Authorization: "Bearer #{access_token.token}" } } }
    let(:headers_with_access_token_google) do
      { headers: { 'X-Requested-With' => 'XMLHttpRequest', Authorization: "Bearer #{access_token_google.token}" } }
    end
    let(:headers_file_uploads) do
      {
        headers: {
          'X-Requested-With' => 'XMLHttpRequest',
          Authorization: "Bearer #{access_token.token}",
          'Content-Type' => 'multipart/form-data; boundary=xYzZY'
        }
      }
    end
  end
end
