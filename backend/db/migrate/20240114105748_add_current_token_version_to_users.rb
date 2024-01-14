class AddCurrentTokenVersionToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :current_token_version, :string
  end
end
