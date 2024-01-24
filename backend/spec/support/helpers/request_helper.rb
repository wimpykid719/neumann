module RequestHelper
  RSpec.shared_context 'requests', shared_context: :metadata do
    let(:headers) { { headers: { 'X-Requested-With' => 'XMLHttpRequest' } } }
  end
end
