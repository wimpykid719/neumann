class AddAvatarUrlToProfiles < ActiveRecord::Migration[7.1]
  def change
    add_column :profiles, :avatar_url, :string, null: false, default: ''
  end
end
