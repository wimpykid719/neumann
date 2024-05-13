class RemoveProviderFromUser < ActiveRecord::Migration[7.1]
  def change
    remove_column :users, :provider, :integer
  end
end
