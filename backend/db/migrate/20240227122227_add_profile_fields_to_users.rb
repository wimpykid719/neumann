class AddProfileFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :profile_name, :string, null: false, default: ''
    add_column :users, :bio, :text
    add_column :users, :x, :string, null: false, default: ''
    add_column :users, :instagram, :string, null: false, default: ''
    add_column :users, :facebook, :string, null: false, default: ''
    add_column :users, :linkedin, :string, null: false, default: ''
    add_column :users, :tiktok, :string, null: false, default: ''
    add_column :users, :youtube, :string, null: false, default: ''
    add_column :users, :website, :string,  null: false, default: ''
  end
end
