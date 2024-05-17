class RenameAvatarUrlColumnToProfiles < ActiveRecord::Migration[7.1]
  def change
    rename_column :profiles, :avatar_url, :avatar
  end
end
