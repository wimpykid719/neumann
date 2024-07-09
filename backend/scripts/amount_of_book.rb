BOOKS_COUNT = 1

# rubocop:disable Metrics/BlockLength
def create_books(num)
  num.times do |n|
    book = Book.create({
                         title: "テスト - #{n} フォン・ノイマンの哲学 人間のフリをした悪魔 (講談社現代新書)",
                         img_url: 'https://m.media-amazon.com/images/I/71uPA1fAPrL._SY522_.jpg',
                         # rubocop:disable Layout/LineLength
                         description: '21世紀の現代の善と悪の原点こそ、フォン・ノイマンである。彼の破天荒な生涯と哲学を知れば、今の便利な生活やAIの源流がよくわかる!\n\n「科学的に可能だとわかっていることは、やり遂げなければならない。それがどんなに恐ろしいことにしてもだ」\n\n彼は、理想に邁進するためには、いかなる犠牲もやむを得ないと「人間性」を切り捨てた。\n\n<本書の主な内容>\n\n第1章 数学の天才\n――ママ、何を計算しているの?\n第2章 ヒルベルト学派の旗手\n――君も僕もワインが好きだ。さて、結婚しようか!\n第3章 プリンストン高等研究所\n――朝食前にバスローブを着たまま、五ページの論文で証明したのです!\n第4章 私生活\n――そのうち将軍になるかもしれない!\n第5章 第二次大戦と原子爆弾\n――我々が今生きている世界に責任を持つ必要はない!\n第6章 コンピュータの父\n――ようやく私の次に計算の早い機械ができた!\n第7章 フォン・ノイマン委員会\n――彼は、人間よりも進化した生物ではないか?\n\n********\n\nノイマンがいかに世界を認識し、どのような価値を重視し、いかなる道徳基準にしたがって行動していたのかについては、必ずしも明らかにされているわけではない。さまざまな専門分野の枠組みの内部において断片的に議論されることはあっても、総合的な「フォン・ノイマンの哲学」については、先行研究もほとんど皆無に等しい状況である。\n\nそこで、ノイマンの生涯と思想を改めて振り返り、「フォン・ノイマンの哲学」に迫るのが、本書の目的である。それも、単に「生涯」を紹介するだけではなく、彼の追究した「学問」と、彼と関係の深かった「人物」に触れながら、時代背景も浮かび上がるように工夫して書き進めていくつもりである。\n――「はじめに」より\n\n********\n\nノイマンの思想の根底にあるのは、科学で可能なことは徹底的に突き詰めるべきだという「科学優先主義」、目的のためならどんな非人道的兵器でも許されるという「非人道主義」、そして、この世界には普遍的な責任や道徳など存在しないという一種の「虚無主義」である。\n\nノイマンは、表面的には柔和で人当たりのよい天才科学者でありながら、内面の彼を貫いているのは「人間のフリをした悪魔」そのものの哲学といえる。とはいえ、そのノイマンが、その夜に限っては、ひどく狼狽(うろた)えていたというのである。クララは、彼に睡眠薬とアルコールを勧めた。\n――第5章「第二次大戦と原子爆弾」より\n\n********\n\n人類史上 最恐の頭脳!',
                         # rubocop:enable Layout/LineLength
                         score: Random.rand(0..1.0).round(3),
                         page: Random.rand(1..5000),
                         launched: '2021-02-17',
                         author: '高橋 昌一郎',
                         publisher: '講談社',
                         associate_url: 'https://amzn.to/4c9f3R8'
                       })
    book.create_note_reference({
                                 hashtags: ['#ビジネス書評', '#おすすめのビジネス書', '#ビジネス書レビュー', '#ビジネス書'],
                                 reference_objs: [
                                   {
                                     'url' => 'http://example.com/1',
                                     'likes' => 10,
                                     'title' => 'example title',
                                     'user_profile_img' => 'https://assets.st-note.com/production/uploads/images/41931547/profile_de48659dc5cd1c96d71e1ceca1a7b6af.jpg?fit=bounds&format=jpeg&quality=85&width=330'
                                   },
                                   {
                                     'url' => 'http://example.com/2',
                                     'likes' => 16,
                                     'title' => 'example title2',
                                     'user_profile_img' => 'https://assets.st-note.com/production/uploads/images/41931547/profile_de48659dc5cd1c96d71e1ceca1a7b6af.jpg?fit=bounds&format=jpeg&quality=85&width=330'
                                   }
                                 ]
                               })
  end
end
# rubocop:enable Metrics/BlockLength

create_books(BOOKS_COUNT)
puts "書籍を#{BOOKS_COUNT}冊追加しました！！"
