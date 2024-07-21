class AddCountToBooks < ActiveRecord::Migration[7.1]
  def change
    add_column :books, :count, :integer, null: false, default: 0
  end
end
