class Constants::Regexps
  NAME = /\A[\w\-]+\z/
  EMAIL = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  VALID_PASSWORD_REGEX = /\A[\w\-]+\z/
  URL = %r{\A(https://[\w\-.]+(:\d+)?(/[\w\-.]*)*(\?\S*)?)?\z}
  TIKTOK = /\A([^@].*|)\z/
  YOUTUBE = /\A([^@].*|)\z/
  DATE = /\A\z|\A[1-9]\d{3}-\d{2}-\d{2}\z/
end
