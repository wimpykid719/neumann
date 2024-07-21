USER_COUNT = 100

def create_user_default_login(index)
  user = User.create({ name: "test-#{index}", email: FFaker::Internet.email, password: '1111111q' })
  user.create_provider!(kind: Provider.kinds['default'], uid: "bizrank-#{SecureRandom.uuid}")
  user.create_profile!
  user
end

def create_user_likes_top_100_books(user)
  books = Book.order('score DESC, id DESC').limit(100)

  books.each do |book|
    user.likes.create!(likeable: book)
  end
end

def create_users_with_likes(num)
  num.times do |n|
    user = create_user_default_login(n)
    create_user_likes_top_100_books(user)
  end
end

create_users_with_likes(USER_COUNT)
puts "ユーザを#{USER_COUNT}人、書籍100冊いいねした状態追加しました"
