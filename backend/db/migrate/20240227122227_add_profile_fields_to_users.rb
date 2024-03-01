class AddProfileFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :profiles do |t|
      t.belongs_to :user, foreign_key: true
      t.string :profile_name, null: false, default: ''
      t.text :bio
      t.string :x_twitter, null: false, default: ''
      t.string :instagram, null: false, default: ''
      t.string :facebook, null: false, default: ''
      t.string :linkedin, null: false, default: ''
      t.string :tiktok, null: false, default: ''
      t.string :youtube, null: false, default: ''
      t.string :website, null: false, default: ''

      t.timestamps
    end
  end
end
