module Constants
  module Exceptions
    class TokenVersion < StandardError; end
    class OldPassword < StandardError; end
    class SignUp < StandardError; end
  end
end
