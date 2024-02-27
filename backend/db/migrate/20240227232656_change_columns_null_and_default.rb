class ChangeColumnsNullAndDefault < ActiveRecord::Migration[7.1]
  def change
    change_column :users, :name, :string, null: false, default: ''
    change_column :users, :email, :string, null: false, default: ''
  end
end
