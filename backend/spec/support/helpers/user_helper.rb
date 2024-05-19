module UserHelper
  RSpec.shared_context 'user_authorities', shared_context: :metadata do
    include TokenConcern

    let(:user) { FactoryBot.create(:user, current_token_version: new_token_version) }
    let(:profile) { FactoryBot.create(:profile, user:) }
    let!(:access_token) { user.generate_access_token }
    let(:headers) { { headers: { 'X-Requested-With' => 'XMLHttpRequest' } } }
    let(:headers_with_access_token) { { headers: { 'X-Requested-With' => 'XMLHttpRequest', Authorization: "Bearer #{access_token.token}" } } }
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
