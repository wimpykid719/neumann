require 'rails_helper'

RSpec.describe NoteReference do
  let(:book) { FactoryBot.build(:book) }
  let(:note_reference) { FactoryBot.build(:note_reference, book:) }

  it '有効なファクトリを持つこと' do
    expect(note_reference).to be_valid
  end

  describe 'validation' do
    context 'hashtags' do
      it '登録可能' do
        expect(note_reference.hashtags).to be_present
      end

      it 'nilの場合デフォルト値が空配列になる' do
        note_reference.update(hashtags: nil, book:)
        expect(note_reference.hashtags).to eq([])
      end

      it '配列以外の型（文字列）登録不可' do
        expect { note_reference.update!(hashtags: 'not an array', book:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('ハッシュタグは文字列の配列にしてください')
        end)
      end

      it '配列に文字列以外の値（数値）登録不可' do
        expect { note_reference.update!(hashtags: ['valid', 123], book:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('ハッシュタグは文字列の配列にしてください')
        end)
      end
    end

    context 'reference_objs' do
      it '登録可能' do
        expect(note_reference.reference_objs).to be_present
      end

      it 'nilの場合デフォルト値が空配列になる' do
        note_reference.update(reference_objs: nil, book:)
        expect(note_reference.reference_objs).to eq([])
      end

      it '配列以外の型（文字列）登録不可' do
        expect { note_reference.update!(reference_objs: 'not an array', book:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('参照先は{ likes:number, title:string, url:string, user_profile_img:string }の配列にしてください')
        end)
      end

      it '配列にハッシュ以外の値（文字列）登録不可' do
        expect { note_reference.update!(reference_objs: ['not a hash'], book:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('参照先は{ likes:number, title:string, url:string, user_profile_img:string }の配列にしてください')
        end)
      end

      it 'ハッシュのキーlikes, title, url, user_profile_imgが揃ってないと登録不可' do
        expect { note_reference.update!(reference_objs: [{ 'likes' => 10 }], book:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('参照先は{ likes:number, title:string, url:string, user_profile_img:string }の配列にしてください')
        end)
      end

      it 'ハッシュの値が型と異なる値登録不可' do
        invalid_obj = {
          'likes' => 'not an integer',
          'title' => 'example title',
          'url' => 'http://example.com',
          'user_profile_img' => 'http://example.com/image.jpg'
        }
        expect { note_reference.update!(reference_objs: invalid_obj, book:) }.to(raise_error do |error|
          expect(error).to be_a(ActiveRecord::RecordInvalid)
          expect(error.message).to eq('参照先は{ likes:number, title:string, url:string, user_profile_img:string }の配列にしてください')
        end)
      end
    end
  end
end
