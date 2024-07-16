FactoryBot.define do
  factory :note_reference do
    hashtags { ['#tag1', '#tag2'] }
    reference_objs do
      [
        {
          'likes' => 10,
          'title' => 'example title',
          'url' => 'http://example.com/1',
          'userProfileImg' => 'http://example.com/image1.jpg'
        },
        {
          'likes' => 16,
          'title' => 'example title2',
          'url' => 'http://example.com/2',
          'userProfileImg' => 'http://example.com/image2.jpg'
        }
      ]
    end
  end
end
