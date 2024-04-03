class CreateLikes < ActiveRecord::Migration[7.1]
  def change
    create_table :likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :likeable, polymorphic: true, null: false

      t.timestamps
    end

    add_index :likes, [:user_id, :likeable_id, :likeable_type], name: 'index_likes_on_user_id_and_likeable_type_and_likeable_id', unique: true
  end
end
